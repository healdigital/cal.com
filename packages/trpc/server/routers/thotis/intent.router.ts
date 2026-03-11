import { z } from "zod";
import authedProcedure from "../../procedures/authedProcedure";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { prisma, profileService } from "./_shared";

export const intentRouter = router({
  upsert: authedProcedure
    .input(
      z.object({
        targetFields: z.array(z.string()),
        academicLevel: z.string(),
        zone: z.string().optional().nullable(),
        goals: z.array(z.string()).optional(),
        scheduleConstraints: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await profileService.upsertOrientationIntent(ctx.user.id, input);
    }),

  get: authedProcedure.query(async ({ ctx }) => {
    return await prisma.thotisOrientationIntent.findFirst({
      where: { userId: ctx.user.id },
    });
  }),

  getRecommended: publicProcedure
    .input(
      z.object({
        targetFields: z.array(z.string()),
        academicLevel: z.string(),
        zone: z.string().optional().nullable(),
        goals: z.array(z.string()).optional(),
        scheduleConstraints: z.record(z.string(), z.any()).optional(),
      })
    )
    .query(async ({ input }) => {
      return await profileService.getRecommendedProfilesByIntent(input);
    }),
});
