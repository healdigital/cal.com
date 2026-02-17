import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import type { SessionRatingRepository } from "../repositories/SessionRatingRepository";
import { AnalyticsService } from "./AnalyticsService";

/** Shared shape for rating data returned by service methods */
export interface SessionRatingDto {
  id: string;
  bookingId: number;
  studentProfileId: string;
  rating: number;
  feedback: string | null;
  createdAt: Date;
}

/**
 * Service for managing session ratings
 * Implements business logic and validation for rating operations
 */
export class SessionRatingService {
  private analytics: AnalyticsService;

  constructor(
    private readonly repository: SessionRatingRepository,
    analytics?: AnalyticsService
  ) {
    this.analytics = analytics || new AnalyticsService();
  }

  /**
   * Creates a new session rating with validation
   * Validates: Rating (1-5), Feedback length (10-500 chars if provided)
   */
  async createRating(data: {
    bookingId: number;
    studentProfileId: string;
    rating: number;
    feedback?: string | null;
  }): Promise<SessionRatingDto> {
    // Validate rating (Property 21)
    if (data.rating < 1 || data.rating > 5) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Rating must be between 1 and 5");
    }

    // Validate feedback if provided (Property 22)
    if (data.feedback !== null && data.feedback !== undefined) {
      const feedbackLength = data.feedback.trim().length;
      if (feedbackLength < 10 || feedbackLength > 500) {
        throw new ErrorWithCode(ErrorCode.BadRequest, "Feedback must be between 10 and 500 characters");
      }
    }

    const rating = await this.repository.createRating({
      bookingId: data.bookingId,
      studentProfileId: data.studentProfileId,
      rating: data.rating,
      feedback: data.feedback ?? null,
    });

    // The analytics service expects id as number, but SessionRating uses string cuid.
    // We pass bookingId as a numeric identifier for analytics tracking.
    const bookingMetadata = rating.booking?.metadata as Record<string, unknown> | undefined;
    this.analytics.trackRatingSubmitted(
      {
        id: rating.bookingId,
        bookingId: rating.bookingId,
        studentProfileId: rating.bookingId,
        rating: rating.rating,
        feedback: rating.feedback,
      },
      { metadata: bookingMetadata }
    );

    return {
      id: rating.id,
      bookingId: rating.bookingId,
      studentProfileId: rating.studentProfileId,
      rating: rating.rating,
      feedback: rating.feedback,
      createdAt: rating.createdAt,
    };
  }

  /**
   * Retrieves a rating by booking ID
   */
  async getRatingByBookingId(bookingId: number): Promise<SessionRatingDto | null> {
    const rating = await this.repository.findByBookingId(bookingId);
    if (!rating) return null;

    return {
      id: rating.id,
      bookingId: rating.bookingId,
      studentProfileId: rating.studentProfileId,
      rating: rating.rating,
      feedback: rating.feedback,
      createdAt: rating.createdAt,
    };
  }

  /**
   * Retrieves all ratings for a student profile
   */
  async getRatingsByStudentProfileId(studentProfileId: string): Promise<SessionRatingDto[]> {
    const ratings = await this.repository.findByStudentProfileId(studentProfileId);
    return ratings.map((r) => ({
      id: r.id,
      bookingId: r.bookingId,
      studentProfileId: r.studentProfileId,
      rating: r.rating,
      feedback: r.feedback,
      createdAt: r.createdAt,
    }));
  }

  /**
   * Calculates the average rating for a student profile (Property 23)
   * Returns null if no ratings exist
   */
  async getAverageRating(studentProfileId: string): Promise<number | null> {
    return this.repository.getAverageRating(studentProfileId);
  }

  /**
   * Gets comprehensive rating statistics for a student profile
   */
  async getRatingStats(studentProfileId: string): Promise<{
    average: number | null;
    count: number;
    distribution: { rating: number; count: number }[];
  }> {
    return this.repository.getRatingStats(studentProfileId);
  }

  /**
   * Updates an existing rating with validation
   */
  async updateRating(
    id: string,
    data: {
      rating?: number;
      feedback?: string | null;
    }
  ): Promise<SessionRatingDto> {
    // Validate rating if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new ErrorWithCode(ErrorCode.BadRequest, "Rating must be between 1 and 5");
    }

    // Validate feedback if provided
    if (data.feedback !== null && data.feedback !== undefined) {
      const feedbackLength = data.feedback.trim().length;
      if (feedbackLength < 10 || feedbackLength > 500) {
        throw new ErrorWithCode(ErrorCode.BadRequest, "Feedback must be between 10 and 500 characters");
      }
    }

    const result = await this.repository.updateRating(id, data);
    return {
      id: result.id,
      bookingId: result.bookingId,
      studentProfileId: result.studentProfileId,
      rating: result.rating,
      feedback: result.feedback,
      createdAt: result.createdAt,
    };
  }

  /**
   * Deletes a rating
   */
  async deleteRating(id: string): Promise<void> {
    await this.repository.deleteRating(id);
  }
}
