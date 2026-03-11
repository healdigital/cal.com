import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withCors } from "../_lib/cors";
import { bookingService } from "../_lib/services";
import { parseBody } from "../_lib/validate";

const CreateBookingSchema = z.object({
  studentProfileId: z.string().min(1),
  dateTime: z.coerce.date(),
  prospectiveStudent: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    question: z.string().optional(),
  }),
});

async function handler(request: NextRequest) {
  const input = await parseBody(request, CreateBookingSchema);

  const result = await bookingService.createStudentSession({
    studentProfileId: input.studentProfileId,
    dateTime: input.dateTime,
    prospectiveStudent: input.prospectiveStudent,
  });

  return NextResponse.json(result, { status: 201 });
}

export const POST = withCors(handler);
export const OPTIONS = withCors(async () => new NextResponse(null, { status: 204 }));
