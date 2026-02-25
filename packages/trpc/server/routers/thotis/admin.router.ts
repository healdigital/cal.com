import { AcademicField, MentorIncidentType, MentorModerationActionType, MentorStatus } from "@calcom/prisma/enums";
import { z } from "zod";

import { authedAdminProcedure } from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { adminService } from "./_shared";

export const adminRouter = router({
  listAmbassadors: authedAdminProcedure
    .input(
      z.object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        fieldOfStudy: z.nativeEnum(AcademicField).optional(),
        isActive: z.boolean().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await adminService.listAllAmbassadors(input);
    }),

  createAmbassador: authedAdminProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        fieldOfStudy: z.nativeEnum(AcademicField),
        university: z.string(),
        degree: z.string(),
        yearOfStudy: z.number(),
        bio: z.string(),
        expertise: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await adminService.provisionAmbassador(input);
    }),

  updateStatus: authedAdminProcedure
    .input(
      z.object({
        profileId: z.string(),
        status: z.nativeEnum(MentorStatus),
      })
    )
    .mutation(async ({ input }) => {
      return await adminService.setAmbassadorStatus(input.profileId, input.status);
    }),

  sendPasswordReset: authedAdminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      return await adminService.sendInitialPasswordSetup(input.userId);
    }),

  listIncidents: authedAdminProcedure
    .input(
      z.object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        studentProfileId: z.string().optional(),
        type: z.nativeEnum(MentorIncidentType).optional(),
        resolved: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      return await adminService.listIncidents(input);
    }),

  resolveIncident: authedAdminProcedure
    .input(z.object({ incidentId: z.string() }))
    .mutation(async ({ input }) => {
      return await adminService.resolveIncident(input.incidentId);
    }),

  takeModerationAction: authedAdminProcedure
    .input(
      z.object({
        studentProfileId: z.string(),
        actionType: z.nativeEnum(MentorModerationActionType),
        reason: z.string().optional(),
        updateStatusTo: z.nativeEnum(MentorStatus).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await adminService.takeModerationAction({
        ...input,
        actionByUserId: ctx.user.id,
      });
    }),

  listBookings: authedAdminProcedure
    .input(
      z.object({
        page: z.number().optional(),
        pageSize: z.number().optional(),
        mentorUserId: z.number().optional(),
        status: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
      })
    )
    .query(async ({ input }) => {
      return await adminService.listBookings(input);
    }),

  getBookingDetails: authedAdminProcedure
    .input(z.object({ bookingId: z.number() }))
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
      return await adminService.adminCancelBooking(input.bookingId, input.reason, ctx.user.id);
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
    .mutation(async ({ input }) => {
      const { profileId, ...data } = input;
      return await adminService.updateMentorProfile(profileId, data);
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
        availability: z.array(
          z.object({
            days: z.array(z.number().min(0).max(6)),
            startTime: z.string().regex(/^\d{2}:\d{2}$/),
            endTime: z.string().regex(/^\d{2}:\d{2}$/),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { mentorUserId, ...scheduleData } = input;
      return await adminService.updateMentorSchedule(mentorUserId, scheduleData);
    }),
});
