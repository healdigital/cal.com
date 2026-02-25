import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import prisma from "@calcom/prisma";

import { withCors } from "../_lib/cors";

async function handler(_request: NextRequest) {
  const results = await prisma.studentProfile.findMany({
    where: { isActive: true, status: "VERIFIED" },
    select: { university: true },
    distinct: ["university"],
    orderBy: { university: "asc" },
  });

  const universities = results.map((r) => r.university);
  return NextResponse.json({ universities });
}

export const GET = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
