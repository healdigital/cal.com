import process from "node:process";
import {
  sendThotisEmailWithRetry,
  ThotisEmailService,
} from "@calcom/features/thotis/services/ThotisEmailService";
import { getTranslation } from "@calcom/lib/server/i18n";
import prisma from "@calcom/prisma";
import { Prisma } from "@calcom/prisma/client";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CRON_SECRET: string | undefined = process.env.CRON_SECRET;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const apiKey = req.nextUrl.searchParams.get("apiKey");

  if (!CRON_SECRET) {
    return NextResponse.json({ error: "Misconfigured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${CRON_SECRET}` && apiKey !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Find bookings that:
  // 1. Are Thotis sessions
  // 2. Are ACCEPTED (completed) or marked complete in metadata
  // 3. Ended between 24h and 48h ago
  // 4. Have not had feedback email sent yet
  const bookings = await prisma.booking.findMany({
    where: {
      endTime: {
        lt: twentyFourHoursAgo,
        gt: fortyEightHoursAgo,
      },
      OR: [
        { status: "ACCEPTED" },
        {
          metadata: {
            path: ["completedAt"],
            not: Prisma.DbNull,
          },
        },
      ],
      metadata: {
        path: ["isThotisSession"],
        equals: true,
      },
    },
    select: {
      id: true,
      uid: true,
      title: true,
      startTime: true,
      endTime: true,
      status: true,
      responses: true,
      metadata: true,
      attendees: {
        select: {
          email: true,
          locale: true,
          name: true,
          timeZone: true,
        },
      },
      eventType: {
        select: {
          id: true,
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          timeZone: true,
          locale: true,
        },
      },
      thotisSessionSummary: {
        select: {
          id: true,
        },
      },
    },
    take: 50,
  });

  const results = {
    processed: 0,
    errors: 0,
    ids: [] as number[],
  };

  const webAppUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || "https://app.cal.com";
  const emailService = new ThotisEmailService();

  for (const booking of bookings) {
    try {
      const responses = booking.responses as { email?: string; name?: string } | null;
      const attendeeRecord = booking.attendees?.[0];
      const attendeeEmail = attendeeRecord?.email || responses?.email;
      const attendeeName = attendeeRecord?.name || responses?.name || "Student";

      if (!attendeeEmail) continue;

      const mentor = booking.user;
      if (!mentor) continue;

      const organizerLocale = mentor.locale || "en";
      const attendeeLocale = attendeeRecord?.locale || "en";

      const organizer: Person = {
        name: mentor.name || "Mentor",
        email: mentor.email,
        timeZone: mentor.timeZone || "Europe/Paris",
        language: {
          translate: await getTranslation(organizerLocale, "common"),
          locale: organizerLocale,
        },
      };

      const attendee: Person = {
        name: attendeeName,
        email: attendeeEmail,
        timeZone: attendeeRecord?.timeZone || "Europe/Paris",
        language: {
          translate: await getTranslation(attendeeLocale, "common"),
          locale: attendeeLocale,
        },
      };

      const calEvent: CalendarEvent = {
        type: "thotis-mentoring",
        title: booking.title,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        organizer,
        attendees: [attendee],
        uid: booking.uid,
      };

      const metadata = (booking.metadata as Record<string, unknown>) || {};

      // 1. Nudge Mentor if no summary exists
      if (!booking.thotisSessionSummary && !metadata.mentorNudgeSent) {
        // Dynamic import to avoid pulling React into the API route at build time
        const { default: MentorNudgeEmail } = await import("@calcom/emails/templates/thotis/mentor-nudge");
        const addSummaryLink = `${webAppUrl}/thotis/dashboard`;
        const email = new MentorNudgeEmail({ calEvent, attendee, addSummaryLink });
        await sendThotisEmailWithRetry(email);

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            metadata: {
              ...metadata,
              mentorNudgeSent: true,
              mentorNudgeSentAt: new Date().toISOString(),
            },
          },
        });
      }

      // 2. Send feedback email to student
      // Only send feedback request if mentor summary exists
      if (!metadata.feedbackEmailSent && booking.thotisSessionSummary) {
        const { ThotisGuestService } = await import("@calcom/features/thotis/services/ThotisGuestService");
        const guestService = new ThotisGuestService();
        // Token for dashboard access (1 day validity)
        const { token } = await guestService.requestInboxLink(attendeeEmail, undefined, 1440);
        const feedbackLink = `${webAppUrl}/thotis/my-sessions?token=${token}`;

        await emailService.sendFeedbackRequest(calEvent, attendee, feedbackLink);

        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            metadata: {
              ...metadata,
              feedbackEmailSent: true,
              feedbackEmailSentAt: new Date().toISOString(),
            },
          },
        });
      }

      results.processed++;
      results.ids.push(booking.id);
    } catch (error) {
      console.error(`Failed to process booking ${booking.id}`, error);
      results.errors++;
    }
  }

  return NextResponse.json({
    success: true,
    ...results,
  });
}
