import {
  thotisAdminPageSizeSchema,
  thotisEmailSchema,
  thotisPublicPageSchema,
} from "@calcom/lib/dto/thotis/ThotisValidationSchemas";
import {
  AcademicField,
  BookingStatus,
  MentorIncidentType,
  MentorModerationActionType,
  MentorStatus,
  ThotisAdminAuditAction,
} from "@calcom/prisma/enums";
import { z } from "zod";
import { authedAdminProcedure } from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { adminService } from "./_shared";

function hasValidTimeRange(startTime: string, endTime: string): boolean {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  return endHours * 60 + endMinutes > startHours * 60 + startMinutes;
}

const scheduleConfigSchema = z
  .object({
    days: z.array(z.number().min(0).max(6)).optional(),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")
      .optional(),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")
      .optional(),
    timeZone: z.string().optional(),
  })
  .refine(
    (value) => (value.startTime && value.endTime ? hasValidTimeRange(value.startTime, value.endTime) : true),
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

const availabilitySlotSchema = z
  .object({
    days: z.array(z.number().min(0).max(6)),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })
  .refine((value) => hasValidTimeRange(value.startTime, value.endTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const adminRouter = router({
  listAmbassadors: authedAdminProcedure
    .input(
      z
        .object({
          page: thotisPublicPageSchema.optional(),
          pageSize: thotisAdminPageSizeSchema.optional(),
          fieldOfStudy: z.nativeEnum(AcademicField).optional(),
          isActive: z.boolean().optional(),
          search: z.string().optional(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      return await adminService.listAllAmbassadors(input);
    }),

  createAmbassador: authedAdminProcedure
    .input(
      z
        .object({
          name: z.string(),
          email: thotisEmailSchema,
          fieldOfStudy: z.nativeEnum(AcademicField),
          university: z.string(),
          degree: z.string(),
          yearOfStudy: z.number(),
          bio: z.string(),
          expertise: z.array(z.string()).optional(),
          schedule: scheduleConfigSchema.optional(),
        })
        .strict()
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.provisionAmbassador(input, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  updateStatus: authedAdminProcedure
    .input(
      z
        .object({
          profileId: z.string(),
          status: z.nativeEnum(MentorStatus),
        })
        .strict()
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.setAmbassadorStatus(input.profileId, input.status, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  bulkUpdateStatus: authedAdminProcedure
    .input(
      z
        .object({
          profileIds: z.array(z.string()).min(1),
          status: z.nativeEnum(MentorStatus),
        })
        .strict()
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.bulkSetAmbassadorStatus(input.profileIds, input.status, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  sendPasswordReset: authedAdminProcedure
    .input(z.object({ userId: z.number() }).strict())
    .mutation(async ({ ctx, input }) => {
      return await adminService.sendInitialPasswordSetup(input.userId, {
        actor: {
          email: ctx.user.email,
          id: ctx.user.id,
          name: ctx.user.name,
        },
      });
    }),

  bulkSendPasswordReset: authedAdminProcedure
    .input(
      z
        .object({
          userIds: z.array(z.number()).min(1),
        })
        .strict()
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.bulkSendPasswordReset(input.userIds, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  listIncidents: authedAdminProcedure
    .input(
      z
        .object({
          page: thotisPublicPageSchema.optional(),
          pageSize: thotisAdminPageSizeSchema.optional(),
          studentProfileId: z.string().optional(),
          type: z.nativeEnum(MentorIncidentType).optional(),
          resolved: z.boolean().optional(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      return await adminService.listIncidents(input);
    }),

  resolveIncident: authedAdminProcedure
    .input(z.object({ incidentId: z.string() }).strict())
    .mutation(async ({ ctx, input }) => {
      return await adminService.resolveIncident(input.incidentId, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  takeModerationAction: authedAdminProcedure
    .input(
      z
        .object({
          studentProfileId: z.string(),
          actionType: z.nativeEnum(MentorModerationActionType),
          reason: z.string().optional(),
          updateStatusTo: z.nativeEnum(MentorStatus).optional(),
        })
        .strict()
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.takeModerationAction({
        actor: {
          email: ctx.user.email,
          id: ctx.user.id,
          name: ctx.user.name,
        },
        ...input,
      });
    }),

  listAuditLogs: authedAdminProcedure
    .input(
      z
        .object({
          action: z.nativeEnum(ThotisAdminAuditAction).optional(),
          page: thotisPublicPageSchema.optional(),
          pageSize: thotisAdminPageSizeSchema.optional(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      return await adminService.listAuditLogs(input);
    }),

  listBookings: authedAdminProcedure
    .input(
      z
        .object({
          page: thotisPublicPageSchema.optional(),
          pageSize: thotisAdminPageSizeSchema.optional(),
          mentorUserId: z.number().optional(),
          status: z.nativeEnum(BookingStatus).optional(),
          dateFrom: z.date().optional(),
          dateTo: z.date().optional(),
        })
        .strict()
    )
    .query(async ({ input }) => {
      return await adminService.listBookings(input);
    }),

  getBookingDetails: authedAdminProcedure
    .input(z.object({ bookingId: z.number() }).strict())
    .query(async ({ input }) => {
      return await adminService.getBookingDetails(input.bookingId);
    }),

  cancelBooking: authedAdminProcedure
    .input(
      z.object({
        bookingId: z.number(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.adminCancelBooking(input.bookingId, input.reason, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  updateMentorProfile: authedAdminProcedure
    .input(
      z.object({
        profileId: z.string(),
        bio: z.string().min(1).optional(),
        university: z.string().min(1).optional(),
        degree: z.string().min(1).optional(),
        field: z.nativeEnum(AcademicField).optional(),
        expertise: z.array(z.string()).optional(),
        currentYear: z.number().min(1).max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { profileId, ...data } = input;
      return await adminService.updateMentorProfile(profileId, data, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),

  getMentorSchedule: authedAdminProcedure
    .input(z.object({ mentorUserId: z.number() }))
    .query(async ({ input }) => {
      return await adminService.getMentorSchedule(input.mentorUserId);
    }),

  updateMentorSchedule: authedAdminProcedure
    .input(
      z.object({
        mentorUserId: z.number(),
        timeZone: z.string().optional(),
        availability: z.array(availabilitySlotSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { mentorUserId, ...scheduleData } = input;
      return await adminService.updateMentorSchedule(mentorUserId, scheduleData, {
        email: ctx.user.email,
        id: ctx.user.id,
        name: ctx.user.name,
      });
    }),
});
