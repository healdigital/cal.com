import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { AcademicField } from "@calcom/prisma/enums";

import { withCors } from "../_lib/cors";
import { profileService } from "../_lib/services";
import { parseQuery } from "../_lib/validate";

const SearchSchema = z.object({
  q: z.string().optional(),
  field: z.nativeEnum(AcademicField).optional(),
  university: z.string().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(20),
  expertise: z.string().optional(),
  sort: z.enum(["rating", "popularity", "newest"]).optional(),
});

async function handler(request: NextRequest) {
  const params = parseQuery(request, SearchSchema);

  const result = await profileService.searchProfiles({
    query: params.q,
    fieldOfStudy: params.field,
    university: params.university,
    minRating: params.minRating,
    page: params.page,
    pageSize: params.pageSize,
    expertise: params.expertise ? params.expertise.split(",") : undefined,
    sort: params.sort,
  });

  return NextResponse.json(result);
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
