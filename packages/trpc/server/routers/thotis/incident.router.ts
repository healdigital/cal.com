import { MentorIncidentType } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import authedProcedure from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { prisma } from "./_shared";

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
      const booking = await prisma.booking.findUnique({
        where: { id: input.bookingId },
        select: {
          uid: true,
          metadata: true,
        },
      });

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      const metadata = booking.metadata as { studentProfileId?: string } | null;
      if (!metadata?.studentProfileId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Not a valid mentor session" });
      }

      await prisma.mentorQualityIncident.create({
        data: {
          studentProfileId: metadata.studentProfileId,
          bookingUid: booking.uid,
          reportedByUserId: ctx.user.id,
          type: input.type,
          description: input.description || "",
        },
      });

      return { success: true };
    }),
});
