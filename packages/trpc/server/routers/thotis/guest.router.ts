import process from "node:process";
import { thotisEmailSchema } from "@calcom/lib/dto/thotis/ThotisValidationSchemas";
import { MentorIncidentType } from "@calcom/prisma/enums";
import { z } from "zod";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { bookingService, emailService, guestService, sessionOperationsService } from "./_shared";

export const guestRouter = router({
  requestInboxLink: publicProcedure
    .input(
      z
        .object({
          email: thotisEmailSchema,
          locale: z.string().optional(),
        })
        .strict()
    )
    .mutation(async ({ input }) => {
      const { token } = await guestService.requestInboxLink(input.email);
      const link = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/thotis/my-sessions?token=${token}`;
      await emailService.sendMagicLink(input.email, link, "LOGIN", input.locale);
      return { success: true };
    }),

  getSessionsByToken: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          status: z.enum(["upcoming", "past", "cancelled", "all"]).optional(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      return await bookingService.studentSessions(input);
    }),

  cancelByToken: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          bookingId: z.number(),
          reason: z.string(),
        })
        .strict()
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);

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
      z
        .object({
          token: z.string(),
          bookingId: z.number(),
          newDateTime: z.date(),
        })
        .strict()
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);

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
      z
        .object({
          token: z.string(),
          bookingId: z.number(),
          rating: z.number().min(1).max(5),
          feedback: z.string().optional(),
        })
        .strict()
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);

      const rating = await sessionOperationsService.submitRating({
        bookingId: input.bookingId,
        rating: input.rating,
        feedback: input.feedback,
        email: magicLink.guest.email,
        guestId: magicLink.guestId,
      });

      await guestService.invalidateToken(magicLink.id);
      await guestService.logAccess(magicLink.guestId, "rateByToken", "RATE", String(input.bookingId), true);

      return rating;
    }),

  getRatingByToken: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          bookingId: z.number(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);

      return await sessionOperationsService.getRating({
        bookingId: input.bookingId,
        email: magicLink.guest.email,
      });
    }),

  reportByToken: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          bookingId: z.number(),
          type: z.nativeEnum(MentorIncidentType),
          description: z.string().optional(),
        })
        .strict()
    )
    .mutation(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);

      const result = await sessionOperationsService.reportIncident({
        bookingId: input.bookingId,
        type: input.type,
        description: input.description,
        reporterEmail: magicLink.guest.email,
      });

      await guestService.invalidateToken(magicLink.id);
      await guestService.logAccess(
        magicLink.guestId,
        "reportByToken",
        "REPORT",
        String(input.bookingId),
        true
      );

      return result;
    }),

  getPostSessionDataByToken: publicProcedure
    .input(
      z
        .object({
          token: z.string(),
          bookingId: z.number(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      const magicLink = await guestService.verifyToken(input.token, input.bookingId);

      return await sessionOperationsService.getPostSessionData({
        bookingId: input.bookingId,
        email: magicLink.guest.email,
      });
    }),
});
