import { TRPCError } from "@trpc/server";
import { z } from "zod";

import authedProcedure, { authedAdminProcedure } from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { statisticsService } from "./_shared";

export const statisticsRouter = router({
  studentStats: authedProcedure
    .input(
      z.object({
        studentId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "ADMIN" && ctx.user.id !== input.studentId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view these statistics",
        });
      }
      return await statisticsService.getStudentStats(input.studentId);
    }),

  platformStats: authedAdminProcedure
    .input(
      z
        .object({
          period: z.enum(["daily", "weekly", "monthly"]).optional(),
          field: z.string().optional(),
          profileId: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await statisticsService.getPlatformStats(input?.period, input?.field, input?.profileId);
    }),
});
