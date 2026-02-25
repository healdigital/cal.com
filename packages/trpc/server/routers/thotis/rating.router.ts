import { ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import authedProcedure from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { analyticsService, prisma, statisticsService } from "./_shared";

export const ratingRouter = router({
  submit: authedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.email !== input.email) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only submit ratings for yourself" });
      }

      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        select: {
          id: true,
          status: true,
          startTime: true,
          endTime: true,
          metadata: true,
          responses: true,
          userId: true,
        },
      });

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      const responses = booking.responses as { email?: string } | null;
      if (responses?.email !== input.email) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Email does not match booking" });
      }

      const now = new Date();
      if (booking.endTime > now) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot rate a session that hasn't ended yet" });
      }

      if (booking.status !== "ACCEPTED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Only completed sessions can be rated" });
      }

      const existingRating = await prisma.sessionRating.findUnique({
        where: { bookingId: input.bookingId },
        select: { id: true },
      });

      if (existingRating) {
        throw new TRPCError({ code: "CONFLICT", message: "Session has already been rated" });
      }

      const metadata = booking.metadata as { studentProfileId?: string; completedAt?: string } | null;
      const studentProfileId = metadata?.studentProfileId;

      if (!studentProfileId || !metadata?.completedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only completed Thotis sessions can be rated",
        });
      }

      if (!booking.userId) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Booking has no mentor assigned" });
      }

      await statisticsService.addRating(
        input.bookingId,
        booking.userId,
        input.rating,
        input.feedback || null,
        input.email
      );

      await analyticsService.track({
        eventType: ThotisAnalyticsEventType.rating_submitted,
        userId: booking.userId,
        profileId: studentProfileId,
        bookingId: input.bookingId,
        metadata: {
          rating: input.rating,
          hasFeedback: !!input.feedback,
        },
      });

      return { success: true };
    }),

  getByBooking: authedProcedure.input(z.object({ bookingId: z.number() })).query(async ({ ctx, input }) => {
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      select: { userId: true, responses: true },
    });

    if (!booking) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
    }

    const isMentor = booking.userId === ctx.user.id;
    const responses = booking.responses as { email?: string } | null;
    const isStudent = responses?.email === ctx.user.email;

    if (!isMentor && !isStudent) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to view this rating" });
    }

    return await prisma.sessionRating.findUnique({
      where: { bookingId: input.bookingId },
      select: {
        id: true,
        rating: true,
        feedback: true,
        createdAt: true,
      },
    });
  }),
});
