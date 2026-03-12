import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SessionRatingRepository } from "../repositories/SessionRatingRepository";
import type { AnalyticsService } from "./AnalyticsService";
import { SessionRatingService } from "./SessionRatingService";

describe("SessionRatingService", () => {
  let repositoryMock: Pick<
    SessionRatingRepository,
    | "createRating"
    | "deleteRating"
    | "findByBookingId"
    | "findByStudentProfileId"
    | "getAverageRating"
    | "getRatingStats"
    | "updateRating"
  >;
  let analyticsMock: Pick<AnalyticsService, "trackRatingSubmitted">;
  let service: SessionRatingService;

  beforeEach(() => {
    repositoryMock = {
      createRating: vi.fn(),
      deleteRating: vi.fn(),
      findByBookingId: vi.fn(),
      findByStudentProfileId: vi.fn(),
      getAverageRating: vi.fn(),
      getRatingStats: vi.fn(),
      updateRating: vi.fn(),
    };

    analyticsMock = {
      trackRatingSubmitted: vi.fn(),
    };

    service = new SessionRatingService(
      repositoryMock as unknown as SessionRatingRepository,
      analyticsMock as AnalyticsService
    );
  });

  it("creates a valid rating and tracks analytics metadata", async () => {
    vi.mocked(repositoryMock.createRating).mockResolvedValue({
      id: "rating-1",
      bookingId: 42,
      studentProfileId: "student-profile-1",
      rating: 5,
      feedback: "This mentoring session was extremely helpful.",
      createdAt: new Date("2026-03-12T10:00:00.000Z"),
      booking: {
        id: 42,
        uid: "booking-uid",
        metadata: {
          prospectiveStudentEmail: "student@example.com",
        },
      },
    } as never);

    const result = await service.createRating({
      bookingId: 42,
      studentProfileId: "student-profile-1",
      rating: 5,
      feedback: "This mentoring session was extremely helpful.",
    });

    expect(result).toMatchObject({
      bookingId: 42,
      studentProfileId: "student-profile-1",
      rating: 5,
      feedback: "This mentoring session was extremely helpful.",
    });
    expect(analyticsMock.trackRatingSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingId: 42,
        rating: 5,
      }),
      {
        metadata: {
          prospectiveStudentEmail: "student@example.com",
        },
      }
    );
  });

  it("rejects ratings outside the allowed range", async () => {
    await expect(
      service.createRating({
        bookingId: 42,
        studentProfileId: "student-profile-1",
        rating: 0,
        feedback: "This mentoring session was extremely helpful.",
      })
    ).rejects.toThrow("Rating must be between 1 and 5");
  });

  it("rejects feedback that is too short after trimming", async () => {
    await expect(
      service.createRating({
        bookingId: 42,
        studentProfileId: "student-profile-1",
        rating: 4,
        feedback: "  too short ",
      })
    ).rejects.toThrow("Feedback must be between 10 and 500 characters");
  });

  it("validates updates before persisting a changed rating", async () => {
    vi.mocked(repositoryMock.updateRating).mockResolvedValue({
      id: "rating-1",
      bookingId: 42,
      studentProfileId: "student-profile-1",
      rating: 4,
      feedback: "Updated feedback for the mentoring session.",
      createdAt: new Date("2026-03-12T10:00:00.000Z"),
    } as never);

    const result = await service.updateRating("rating-1", {
      rating: 4,
      feedback: "Updated feedback for the mentoring session.",
    });

    expect(repositoryMock.updateRating).toHaveBeenCalledWith("rating-1", {
      rating: 4,
      feedback: "Updated feedback for the mentoring session.",
    });
    expect(result.rating).toBe(4);
  });
});
