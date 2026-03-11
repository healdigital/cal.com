import { ThotisAnalyticsEventType } from "@calcom/prisma/enums";
import { z } from "zod";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { analyticsService } from "./_shared";

export const analyticsRouter = router({
  track: publicProcedure
    .input(
      z.object({
        eventType: z.nativeEnum(ThotisAnalyticsEventType),
        profileId: z.string().optional(),
        bookingId: z.number().optional(),
        field: z.string().optional(),
        source: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await analyticsService.track({
        ...input,
        userId: ctx.user?.id,
      });
    }),
});
