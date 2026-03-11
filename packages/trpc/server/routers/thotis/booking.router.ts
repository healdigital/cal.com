import { TRPCError } from "@trpc/server";
import { z } from "zod";
import authedProcedure from "../../procedures/authedProcedure";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { bookingService, sessionOperationsService } from "./_shared";

export const bookingRouter = router({
  createSession: publicProcedure
    .input(
      z.object({
        studentProfileId: z.string(),
        dateTime: z.date(),
        prospectiveStudent: z.object({
          name: z.string(),
          email: z.string().email(),
          question: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return await bookingService.createStudentSession(input);
    }),

  getAvailability: publicProcedure
    .input(
      z.object({
        studentProfileId: z.string(),
        start: z.date(),
        end: z.date(),
      })
    )
    .query(async ({ input }) => {
      return await bookingService.getStudentAvailability(input.studentProfileId, {
        start: input.start,
        end: input.end,
      });
    }),

  cancelSession: authedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        reason: z.string(),
        cancelledBy: z.enum(["mentor", "student"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const requester = { id: ctx.user.id, email: ctx.user.email };
      return await bookingService.cancelSession(input.bookingId, input.reason, input.cancelledBy, requester);
    }),

  rescheduleSession: authedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        newDateTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const requester = { id: ctx.user.id, email: ctx.user.email };
      return await bookingService.rescheduleSession(input.bookingId, input.newDateTime, requester);
    }),

  markComplete: authedProcedure
    .input(z.object({ bookingId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await bookingService.markSessionComplete(input.bookingId, {
        id: ctx.user.id,
        email: ctx.user.email,
      });
    }),

  submitPostSessionData: authedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        content: z.string(),
        nextSteps: z.string().optional(),
        resources: z.array(
          z.object({
            type: z.string(),
            title: z.string(),
            url: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await sessionOperationsService.savePostSessionData({
        bookingId: input.bookingId,
        requesterUserId: ctx.user.id,
        content: input.content,
        nextSteps: input.nextSteps,
        resources: input.resources,
      });
    }),

  getPostSessionData: authedProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await sessionOperationsService.getPostSessionData({
        bookingId: input.bookingId,
        userId: ctx.user.id,
        email: ctx.user.email,
      });
    }),

  mentorSessions: authedProcedure
    .input(
      z.object({
        status: z.enum(["upcoming", "past", "cancelled"]).optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await sessionOperationsService.listMentorSessions({
        mentorUserId: ctx.user.id,
        status: input.status,
        page: input.page,
        pageSize: input.pageSize,
      });
    }),

  studentSessions: publicProcedure
    .input(
      z.object({
        status: z.enum(["upcoming", "past", "cancelled", "all"]).optional(),
        token: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Require either authentication or a guest token - reject fully anonymous requests early
      if (!ctx.user?.id && !input.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Authentication or valid guest token required",
        });
      }
      return await bookingService.studentSessions({ ...input, userId: ctx.user?.id, email: ctx.user?.email });
    }),
});
