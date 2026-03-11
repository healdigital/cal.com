import { MentorIncidentType } from "@calcom/prisma/enums";
import { z } from "zod";
import authedProcedure from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { sessionOperationsService } from "./_shared";

export const incidentRouter = router({
  report: authedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        type: z.nativeEnum(MentorIncidentType),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await sessionOperationsService.reportIncident({
        bookingId: input.bookingId,
        type: input.type,
        description: input.description,
        reporterUserId: ctx.user.id,
      });
    }),
});
