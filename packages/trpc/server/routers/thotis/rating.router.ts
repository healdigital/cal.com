import { ErrorCode } from "@calcom/lib/errorCodes";
import { ErrorWithCode } from "@calcom/lib/errors";
import { z } from "zod";
import authedProcedure from "../../procedures/authedProcedure";
import { router } from "../../trpc";
import { sessionOperationsService } from "./_shared";

export const ratingRouter = router({
  submit: authedProcedure
    .input(
      z.object({
        bookingId: z.number(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.email !== input.email) {
        throw new ErrorWithCode(ErrorCode.Forbidden, "You can only submit ratings for yourself");
      }

      return await sessionOperationsService.submitRating({
        bookingId: input.bookingId,
        rating: input.rating,
        feedback: input.feedback,
        email: input.email,
        requireCompletedAt: true,
      });
    }),

  getByBooking: authedProcedure.input(z.object({ bookingId: z.number() })).query(async ({ ctx, input }) => {
    return await sessionOperationsService.getRating({
      bookingId: input.bookingId,
      userId: ctx.user.id,
      email: ctx.user.email,
    });
  }),
});
