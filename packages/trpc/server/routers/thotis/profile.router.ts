import { AcademicField } from "@calcom/prisma/enums";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import authedProcedure from "../../procedures/authedProcedure";
import publicProcedure from "../../procedures/publicProcedure";
import { router } from "../../trpc";
import { prisma, profileService } from "./_shared";

export const profileRouter = router({
  create: authedProcedure
    .input(
      z.object({
        fieldOfStudy: z.nativeEnum(AcademicField),
        yearOfStudy: z.number(),
        bio: z.string(),
        university: z.string(),
        degree: z.string(),
        profilePhotoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await profileService.getProfile(ctx.user.id);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Profile already exists" });
      }

      return await profileService.createProfile({
        userId: ctx.user.id,
        ...input,
      });
    }),

  update: authedProcedure
    .input(
      z.object({
        fieldOfStudy: z.nativeEnum(AcademicField).optional(),
        yearOfStudy: z.number().optional(),
        bio: z.string().optional(),
        university: z.string().optional(),
        degree: z.string().optional(),
        profilePhotoUrl: z.string().optional(),
        expertise: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await profileService.updateProfile(ctx.user.id, input);
    }),

  get: authedProcedure.query(async ({ ctx }) => {
    return await profileService.getProfile(ctx.user.id);
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        fieldOfStudy: z.nativeEnum(AcademicField).optional(),
        university: z.string().optional(),
        minRating: z.number().optional(),
        isActive: z.boolean().optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
        expertise: z.array(z.string()).optional(),
        sort: z.enum(["rating", "popularity", "newest"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await profileService.searchProfiles(input);
    }),

  getTopMentors: publicProcedure.query(async () => {
    return await profileService.getTopRatedProfiles();
  }),

  getRecommended: authedProcedure.query(async ({ ctx }) => {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: ctx.user.id },
      select: { field: true },
    });
    return await profileService.getRecommendedProfiles(studentProfile?.field);
  }),

  getByUsername: publicProcedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    return await profileService.getProfileByUsername(input.username);
  }),

  updatePreferences: authedProcedure
    .input(
      z.object({
        marketingConsent: z.boolean().optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: ctx.user.id },
        select: { id: true },
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Student profile not found" });
      }

      return await prisma.studentProfile.update({
        where: { userId: ctx.user.id },
        data: {
          ...(input.marketingConsent !== undefined && { marketingConsent: input.marketingConsent }),
          ...(input.timezone !== undefined && { timezone: input.timezone }),
        },
        select: {
          id: true,
          marketingConsent: true,
          timezone: true,
        },
      });
    }),

  universities: publicProcedure.query(async () => {
    const results = await prisma.studentProfile.findMany({
      where: { isActive: true },
      select: { university: true },
      distinct: ["university"],
      orderBy: { university: "asc" },
    });
    return results.map((r) => r.university).filter(Boolean);
  }),
});
