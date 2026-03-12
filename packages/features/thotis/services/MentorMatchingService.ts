import {
  THOTIS_MATCHING_REASON_MESSAGES,
  THOTIS_MENTOR_MATCHING_THRESHOLDS,
  THOTIS_MENTOR_MATCHING_WEIGHTS,
} from "../lib/constants";
import type { StudentProfileWithUser } from "../repositories/ProfileRepository";

interface NormalizedMatchingValue {
  normalized: string;
  value: string;
}

interface MatchingIntentContext {
  hasPreferredTimes: boolean;
  normalizedGoals: NormalizedMatchingValue[];
  targetFields: Set<string>;
}

// Define the intent interface locally until the Prisma client is generated
export interface ThotisOrientationIntent {
  targetFields: string[];
  academicLevel: string;
  scheduleConstraints?: Record<string, unknown> | null;
  zone?: string | null;
  goals?: string[];
}

export interface ScoredMentor extends StudentProfileWithUser {
  matchScore: number;
  matchReasons: string[];
}

export class MentorMatchingService {
  private createIntentContext(intent: ThotisOrientationIntent): MatchingIntentContext {
    return {
      hasPreferredTimes: this.hasPreferredTimes(intent.scheduleConstraints),
      normalizedGoals: this.getNormalizedValues(intent.goals),
      targetFields: new Set(
        this.getNormalizedValues(intent.targetFields).map((targetField) => targetField.normalized)
      ),
    };
  }

  private getNormalizedValues(values?: string[]): NormalizedMatchingValue[] {
    if (!values?.length) return [];

    const uniqueValues = new Map<string, string>();

    for (const value of values) {
      const trimmedValue = value.trim();
      if (!trimmedValue) continue;

      const normalizedValue = trimmedValue.toLowerCase();
      if (!uniqueValues.has(normalizedValue)) {
        uniqueValues.set(normalizedValue, trimmedValue);
      }
    }

    return Array.from(uniqueValues, ([normalized, value]) => ({
      normalized,
      value,
    }));
  }

  private hasPreferredTimes(scheduleConstraints?: Record<string, unknown> | null): boolean {
    if (!scheduleConstraints) return false;

    const constraints = scheduleConstraints as { preferredTimes?: string[] };
    return Array.isArray(constraints.preferredTimes) && constraints.preferredTimes.length > 0;
  }

  private getMatchingGoals(
    mentor: StudentProfileWithUser,
    normalizedGoals: NormalizedMatchingValue[]
  ): string[] {
    if (!normalizedGoals.length) return [];

    const expertise = mentor.expertise || [];
    if (!expertise.length) return [];

    const normalizedExpertise = expertise.map((entry) => entry.toLowerCase());
    const matchingGoals: string[] = [];

    for (const goal of normalizedGoals) {
      if (normalizedExpertise.some((expertiseEntry) => expertiseEntry.includes(goal.normalized))) {
        matchingGoals.push(goal.value);
      }
    }

    return matchingGoals;
  }

  private compareScoredMentors(a: ScoredMentor, b: ScoredMentor): number {
    const scoreDelta = b.matchScore - a.matchScore;
    if (scoreDelta !== 0) return scoreDelta;

    const ratingDelta = Number(b.averageRating || 0) - Number(a.averageRating || 0);
    if (ratingDelta !== 0) return ratingDelta;

    const completionDelta = (b.completedSessions || 0) - (a.completedSessions || 0);
    if (completionDelta !== 0) return completionDelta;

    const totalSessionsDelta = (b.totalSessions || 0) - (a.totalSessions || 0);
    if (totalSessionsDelta !== 0) return totalSessionsDelta;

    return (b.currentYear || 0) - (a.currentYear || 0);
  }

  private scoreMentorWithContext(
    mentor: StudentProfileWithUser,
    context: MatchingIntentContext
  ): ScoredMentor {
    let score = 0;
    const reasons = new Set<string>();
    const mentorField = mentor.field.toLowerCase();

    if (context.targetFields.size > 0 && context.targetFields.has(mentorField)) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.FIELD_MATCH;
      reasons.add(THOTIS_MATCHING_REASON_MESSAGES.fieldMatch);
    }

    if (context.normalizedGoals.length > 0) {
      const matchingGoals = this.getMatchingGoals(mentor, context.normalizedGoals);

      if (matchingGoals.length > 0) {
        const bonus = Math.min(
          THOTIS_MENTOR_MATCHING_WEIGHTS.GOAL_MATCH,
          matchingGoals.length * THOTIS_MENTOR_MATCHING_THRESHOLDS.goalMatchIncrement
        );
        score += bonus;
        reasons.add(THOTIS_MATCHING_REASON_MESSAGES.goalExpertise(matchingGoals));
      }
    }

    if (context.hasPreferredTimes && mentor.isActive) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.SCHEDULE_MATCH;
      reasons.add(THOTIS_MATCHING_REASON_MESSAGES.preferredTimes);
    }

    if (mentor.currentYear >= THOTIS_MENTOR_MATCHING_THRESHOLDS.seniorYear) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.LEVEL_MATCH;
      reasons.add(THOTIS_MATCHING_REASON_MESSAGES.seniorStudentPerspective);
    } else if (mentor.currentYear >= THOTIS_MENTOR_MATCHING_THRESHOLDS.experiencedYear) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.LEVEL_MATCH * 0.6;
      reasons.add(THOTIS_MATCHING_REASON_MESSAGES.experiencedStudent);
    }

    const totalSessions = mentor.totalSessions || 0;
    const completedSessions = mentor.completedSessions || 0;

    if (mentor.isActive) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.AVAILABILITY * 0.5;
      if (totalSessions > THOTIS_MENTOR_MATCHING_THRESHOLDS.veryActiveMinimumSessions) {
        score += THOTIS_MENTOR_MATCHING_WEIGHTS.AVAILABILITY * 0.5;
        reasons.add(THOTIS_MATCHING_REASON_MESSAGES.veryActiveMentor);
      }
    }

    let rating = 0;
    if (mentor.averageRating) {
      rating = Number(mentor.averageRating);
    }

    if (rating >= THOTIS_MENTOR_MATCHING_THRESHOLDS.topRating) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.RATING;
      reasons.add(THOTIS_MATCHING_REASON_MESSAGES.exceptionallyHighRating);
    } else if (rating >= THOTIS_MENTOR_MATCHING_THRESHOLDS.strongRating) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.RATING * 0.7;
    }

    if (
      totalSessions > THOTIS_MENTOR_MATCHING_THRESHOLDS.highCompletionRateMinimumSessions &&
      completedSessions / totalSessions > THOTIS_MENTOR_MATCHING_THRESHOLDS.highCompletionRate
    ) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.COMPLETION_RATE;
    }

    if (totalSessions < THOTIS_MENTOR_MATCHING_THRESHOLDS.lowMentorLoadMaximumSessions) {
      score += THOTIS_MENTOR_MATCHING_WEIGHTS.MENTOR_LOAD;
    }

    return {
      ...mentor,
      matchScore: Math.round(score),
      matchReasons: Array.from(reasons),
    };
  }

  /**
   * Calculate a match score for a mentor based on student intent
   */
  scoreMentor(mentor: StudentProfileWithUser, intent: ThotisOrientationIntent): ScoredMentor {
    return this.scoreMentorWithContext(mentor, this.createIntentContext(intent));
  }

  /**
   * Sort mentors by score
   */
  sortMentors(mentors: StudentProfileWithUser[], intent: ThotisOrientationIntent): ScoredMentor[] {
    const context = this.createIntentContext(intent);
    const scored = mentors.map((mentor) => this.scoreMentorWithContext(mentor, context));

    return scored.sort((a, b) => this.compareScoredMentors(a, b));
  }
}
