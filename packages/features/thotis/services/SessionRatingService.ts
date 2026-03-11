import type { SessionRatingDto } from "@calcom/lib/dto/thotis/ThotisApiSchemas";
import { toSessionRatingDto } from "@calcom/lib/dto/thotis/ThotisDtoMappers";
import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import type { SessionRatingRepository } from "../repositories/SessionRatingRepository";
import { AnalyticsService } from "./AnalyticsService";

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

    const bookingMetadata = rating.booking?.metadata as Record<string, unknown> | undefined;
    this.analytics.trackRatingSubmitted(
      {
        id: rating.id,
        bookingId: rating.bookingId,
        studentProfileId: rating.studentProfileId,
        rating: rating.rating,
        feedback: rating.feedback,
      },
      { metadata: bookingMetadata }
    );

    return toSessionRatingDto(rating);
  }

  /**
   * Retrieves a rating by booking ID
   */
  async getRatingByBookingId(bookingId: number): Promise<SessionRatingDto | null> {
    const rating = await this.repository.findByBookingId(bookingId);
    if (!rating) return null;

    return toSessionRatingDto(rating);
  }

  /**
   * Retrieves all ratings for a student profile
   */
  async getRatingsByStudentProfileId(studentProfileId: string): Promise<SessionRatingDto[]> {
    const ratings = await this.repository.findByStudentProfileId(studentProfileId);
    return ratings.map((rating) => toSessionRatingDto(rating));
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
    return toSessionRatingDto(result);
  }

  /**
   * Deletes a rating
   */
  async deleteRating(id: string): Promise<void> {
    await this.repository.deleteRating(id);
  }
}
