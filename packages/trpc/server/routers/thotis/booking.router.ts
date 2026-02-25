import { TRPCError } from "@trpc/server";
import { z } from "zod";

import authedProcedure from "../../procedures/authedProcedure";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { bookingService, prisma } from "./_shared";

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
      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        select: { userId: true, status: true, endTime: true, metadata: true },
      });

      if (!booking || booking.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to edit this session" });
      }

      const now = new Date();
      if (booking.endTime > now) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot submit post-session data for a session that hasn't ended yet",
        });
      }

      if (booking.status !== "ACCEPTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only completed sessions can have post-session data",
        });
      }

      const metadata = booking.metadata as { completedAt?: string } | null;
      if (!metadata?.completedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session must be marked as complete before adding a summary",
        });
      }

      await prisma.thotisSessionSummary.upsert({
        where: { bookingId: input.bookingId },
        create: {
          bookingId: input.bookingId,
          content: input.content,
          nextSteps: input.nextSteps,
        },
        update: {
          content: input.content,
          nextSteps: input.nextSteps,
        },
      });

      await prisma.$transaction([
        prisma.thotisSessionResource.deleteMany({
          where: { bookingId: input.bookingId },
        }),
        prisma.thotisSessionResource.createMany({
          data: input.resources.map((r) => ({
            bookingId: input.bookingId,
            type: r.type,
            title: r.title,
            url: r.url,
          })),
        }),
      ]);

      return { success: true };
    }),

  getPostSessionData: authedProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(async ({ ctx, input }) => {
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
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to view this session" });
      }

      const summary = await prisma.thotisSessionSummary.findUnique({
        where: { bookingId: input.bookingId },
      });
      const resources = await prisma.thotisSessionResource.findMany({
        where: { bookingId: input.bookingId },
      });

      return { summary, resources };
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
      const page = input.page ?? 1;
      const pageSize = input.pageSize ?? 20;
      const skip = (page - 1) * pageSize;
      const now = new Date();

      const baseWhere = {
        userId: ctx.user.id,
        eventType: {
          metadata: {
            path: ["isThotisSession"],
            equals: true,
          },
        },
      };

      let statusFilter = {};
      if (input.status === "upcoming") {
        statusFilter = {
          startTime: { gte: now },
          status: { in: ["ACCEPTED", "PENDING"] },
        };
      } else if (input.status === "past") {
        statusFilter = {
          endTime: { lt: now },
          status: { in: ["ACCEPTED", "PENDING"] },
        };
      } else if (input.status === "cancelled") {
        statusFilter = { status: "CANCELLED" };
      }

      const where = { ...baseWhere, ...statusFilter };

      const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
          where,
          select: {
            id: true,
            uid: true,
            title: true,
            startTime: true,
            endTime: true,
            status: true,
            metadata: true,
            responses: true,
            cancellationReason: true,
            thotisSessionSummary: {
              select: { id: true },
            },
          },
          orderBy: { startTime: input.status === "upcoming" ? "asc" : "desc" },
          skip,
          take: pageSize,
        }),
        prisma.booking.count({ where }),
      ]);

      return { bookings, total, page, pageSize };
    }),

  studentSessions: publicProcedure
    .input(
      z.object({
        status: z.enum(["upcoming", "past", "cancelled", "all"]).optional(),
        token: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await bookingService.studentSessions({ ...input, userId: ctx.user?.id, email: ctx.user?.email });
    }),
});
