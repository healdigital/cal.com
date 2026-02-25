import { MentorIncidentType, ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { analyticsService, bookingService, emailService, guestService, prisma, statisticsService } from "./_shared";

/**
 * Validates a booking for rating eligibility and returns the necessary data.
 * Extracted from duplicated logic in rateByToken and the rating router.
 */
async function validateBookingForRating(bookingId: number, email: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
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
  if (responses?.email !== email) {
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
    where: { bookingId },
    select: { id: true },
  });
  if (existingRating) {
    throw new TRPCError({ code: "CONFLICT", message: "Session has already been rated" });
  }

  const metadata = booking.metadata as { studentProfileId?: string } | null;
  const studentProfileId = metadata?.studentProfileId;
  if (!studentProfileId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Thotis booking" });
  }
  if (!booking.userId) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Booking has no mentor assigned" });
  }

  return { booking, studentProfileId };
}

/**
 * Validates a booking for incident reporting and returns the necessary data.
 * Extracted from duplicated logic in reportByToken and the incident router.
 */
async function validateBookingForIncident(bookingId: number, email: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      uid: true,
      metadata: true,
      responses: true,
    },
  });

  if (!booking) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
  }

  const responses = booking.responses as { email?: string } | null;
  if (responses?.email !== email) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Email does not match booking" });
  }

  const metadata = booking.metadata as { studentProfileId?: string } | null;
  if (!metadata?.studentProfileId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Not a valid mentor session" });
  }

  return { booking, studentProfileId: metadata.studentProfileId };
}

export const guestRouter = router({
  requestInboxLink: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const { token } = await guestService.requestInboxLink(input.email);
      const link = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/thotis/my-sessions?token=${token}`;
      await emailService.sendMagicLink(input.email, link, "LOGIN");
      return { success: true };
    }),

  getSessionsByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        status: z.enum(["upcoming", "past", "cancelled", "all"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await bookingService.studentSessions(input);
    }),

  cancelByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        bookingId: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token);
      if (magicLink.bookingId && magicLink.bookingId !== input.bookingId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Token not valid for this booking" });
      }
      const requester = { id: 0, email: magicLink.guest.email, name: "Guest Student" };

      const result = await bookingService.cancelSession(input.bookingId, input.reason, "student", requester);
      if (magicLink.bookingId) {
        await guestService.invalidateToken(magicLink.id);
      }
      await guestService.logAccess(
        magicLink.guestId,
        "cancelByToken",
        "CANCEL",
        String(input.bookingId),
        true
      );

      return result;
    }),

  rescheduleByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        bookingId: z.number(),
        newDateTime: z.date(),
      })
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token);
      if (magicLink.bookingId && magicLink.bookingId !== input.bookingId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Token not valid for this booking" });
      }
      const requester = { id: 0, email: magicLink.guest.email, name: "Guest Student" };

      const result = await bookingService.rescheduleSession(input.bookingId, input.newDateTime, requester);
      if (magicLink.bookingId) {
        await guestService.invalidateToken(magicLink.id);
      }
      await guestService.logAccess(
        magicLink.guestId,
        "rescheduleByToken",
        "RESCHEDULE",
        String(input.bookingId),
        true
      );

      return result;
    }),

  rateByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        bookingId: z.number(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token);
      if (magicLink.bookingId && magicLink.bookingId !== input.bookingId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Token not valid for this booking" });
      }
      const email = magicLink.guest.email;

      const { booking, studentProfileId } = await validateBookingForRating(input.bookingId, email);

      await statisticsService.addRating(
        input.bookingId,
        booking.userId!,
        input.rating,
        input.feedback || null,
        email
      );

      await analyticsService.track({
        eventType: ThotisAnalyticsEventType.rating_submitted,
        userId: booking.userId!,
        profileId: studentProfileId,
        bookingId: input.bookingId,
        metadata: {
          rating: input.rating,
          hasFeedback: !!input.feedback,
        },
      });

      await guestService.invalidateToken(magicLink.id);
      await guestService.logAccess(magicLink.guestId, "rateByToken", "RATE", String(input.bookingId), true);
      return { success: true };
    }),

  getRatingByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        bookingId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token);
      if (magicLink.bookingId && magicLink.bookingId !== input.bookingId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Token not valid for this booking" });
      }
      const email = magicLink.guest.email;

      const rating = await prisma.sessionRating.findUnique({
        where: { bookingId: input.bookingId },
        select: {
          id: true,
          rating: true,
          feedback: true,
          createdAt: true,
        },
      });

      if (rating) {
        const booking = await prisma.booking.findUnique({
          where: { id: input.bookingId },
          select: { responses: true },
        });
        const responses = booking?.responses as { email?: string } | null;
        if (responses?.email !== email) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
        }
      }

      return rating;
    }),

  reportByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        bookingId: z.number(),
        type: z.nativeEnum(MentorIncidentType),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token);
      if (magicLink.bookingId && magicLink.bookingId !== input.bookingId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Token not valid for this booking" });
      }
      const email = magicLink.guest.email;

      const { booking, studentProfileId } = await validateBookingForIncident(input.bookingId, email);

      await prisma.mentorQualityIncident.create({
        data: {
          studentProfileId,
          bookingUid: booking.uid,
          reportedByUserId: null,
          type: input.type,
          description: input.description || "",
        },
      });

      await analyticsService.track({
        eventType:
          input.type === MentorIncidentType.NO_SHOW
            ? ThotisAnalyticsEventType.no_show
            : ThotisAnalyticsEventType.profile_viewed,
        userId: undefined,
        profileId: studentProfileId,
        bookingId: input.bookingId,
        metadata: {
          incidentType: input.type,
          isGuestReport: true,
          description: input.description,
        },
      });

      await guestService.invalidateToken(magicLink.id);
      await guestService.logAccess(
        magicLink.guestId,
        "reportByToken",
        "REPORT",
        String(input.bookingId),
        true
      );

      return { success: true };
    }),

  getPostSessionDataByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        bookingId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);
      const email = magicLink.guest.email;

      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        select: { responses: true },
      });

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      const responses = booking.responses as { email?: string } | null;
      if (responses?.email !== email) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized: Email does not match booking" });
      }

      const summary = await prisma.thotisSessionSummary.findUnique({
        where: { bookingId: input.bookingId },
      });
      const resources = await prisma.thotisSessionResource.findMany({
        where: { bookingId: input.bookingId },
      });

      return { summary, resources };
    }),
});
