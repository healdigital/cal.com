import process from "node:process";
import { getTranslation } from "@calcom/lib/server/i18n";
import { TimeFormat } from "@calcom/lib/timeFormat";
import type { Prisma, PrismaClient } from "@calcom/prisma/client";
import { bookingResponses } from "@calcom/prisma/zod-utils";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import {
  THOTIS_DEFAULT_LOCALE,
  THOTIS_DEFAULT_TIME_ZONE,
  THOTIS_MENTORING_EVENT_TITLE,
  THOTIS_MENTORING_EVENT_TYPE,
} from "../lib/constants";
import type { ThotisEmailService } from "./ThotisEmailService";
import type { ThotisGuestService } from "./ThotisGuestService";

type CommunicationPrismaClient = Pick<PrismaClient, "user">;

type ExistingBookingAttendee = {
  email?: string | null;
  locale?: string | null;
  name?: string | null;
  timeZone?: string | null;
};

type ExistingBookingForCalendarEvent = {
  attendees?: ExistingBookingAttendee[];
  endTime: Date;
  responses: Prisma.JsonValue;
  startTime: Date;
  uid: string;
};

export class ThotisBookingCommunicationService {
  constructor(
    private readonly prismaClient: CommunicationPrismaClient,
    private readonly guestService: ThotisGuestService,
    private readonly emailService: ThotisEmailService
  ) {}

  private getResolvedLocale(locale?: string | null): string {
    return locale || THOTIS_DEFAULT_LOCALE;
  }

  private getResolvedTimeZone(timeZone?: string | null): string {
    return timeZone || THOTIS_DEFAULT_TIME_ZONE;
  }

  private getResolvedTimeFormat(timeFormat?: number | null): TimeFormat {
    return timeFormat === 24 ? TimeFormat.TWENTY_FOUR_HOUR : TimeFormat.TWELVE_HOUR;
  }

  private async buildEmailPerson(input: {
    email: string;
    locale?: string | null;
    name: string;
    timeFormat?: number | null;
    timeZone?: string | null;
  }): Promise<Person> {
    const locale = this.getResolvedLocale(input.locale);

    return {
      email: input.email,
      name: input.name,
      timeFormat: this.getResolvedTimeFormat(input.timeFormat),
      timeZone: this.getResolvedTimeZone(input.timeZone),
      language: {
        translate: await getTranslation(locale, "common"),
        locale,
      },
    };
  }

  private async getOrganizer(organizerUserId: number): Promise<Person> {
    const organizerUser = await this.prismaClient.user.findUnique({
      where: { id: organizerUserId },
      select: { email: true, name: true, timeZone: true, locale: true, timeFormat: true },
    });

    return this.buildEmailPerson({
      email: organizerUser?.email || "",
      locale: organizerUser?.locale,
      name: organizerUser?.name || "Mentor",
      timeFormat: organizerUser?.timeFormat,
      timeZone: organizerUser?.timeZone,
    });
  }

  private async getAttendeeFromExistingBooking(booking: ExistingBookingForCalendarEvent): Promise<Person> {
    const attendeeRecord = booking.attendees?.[0];
    const responses = booking.responses ? bookingResponses.parse(booking.responses) : null;

    return this.buildEmailPerson({
      email: attendeeRecord?.email || responses?.email || "",
      locale: attendeeRecord?.locale,
      name:
        attendeeRecord?.name ||
        (typeof responses?.name === "string" ? responses.name : responses?.name?.firstName) ||
        "Student",
      timeFormat: 24,
      timeZone: attendeeRecord?.timeZone,
    });
  }

  async buildCreatedBookingCalendarEvent(input: {
    attendee: {
      email: string;
      locale?: string | null;
      name: string;
      timeZone?: string | null;
    };
    booking: {
      description: string | null;
      endTime: Date;
      startTime: Date;
      title: string;
      uid: string;
    };
    location?: string | null;
    organizerUserId: number;
  }): Promise<{ attendee: Person; calEvent: CalendarEvent }> {
    const organizer = await this.getOrganizer(input.organizerUserId);
    const attendee = await this.buildEmailPerson({
      email: input.attendee.email,
      locale: input.attendee.locale,
      name: input.attendee.name,
      timeFormat: 24,
      timeZone: input.attendee.timeZone,
    });

    return {
      attendee,
      calEvent: {
        type: THOTIS_MENTORING_EVENT_TYPE,
        title: input.booking.title,
        startTime: input.booking.startTime.toISOString(),
        endTime: input.booking.endTime.toISOString(),
        organizer,
        attendees: [attendee],
        location: input.location || undefined,
        description: input.booking.description || "",
        uid: input.booking.uid,
      },
    };
  }

  async buildExistingBookingCalendarEvent(input: {
    booking: ExistingBookingForCalendarEvent;
    location?: string | null;
    organizerUserId: number;
    title?: string;
  }): Promise<{ attendee: Person; calEvent: CalendarEvent }> {
    const organizer = await this.getOrganizer(input.organizerUserId);
    const attendee = await this.getAttendeeFromExistingBooking(input.booking);

    return {
      attendee,
      calEvent: {
        type: THOTIS_MENTORING_EVENT_TYPE,
        title: input.title || THOTIS_MENTORING_EVENT_TITLE,
        startTime: input.booking.startTime.toISOString(),
        endTime: input.booking.endTime.toISOString(),
        organizer,
        attendees: [attendee],
        uid: input.booking.uid,
        location: input.location || undefined,
      },
    };
  }

  async sendConfirmation(calEvent: CalendarEvent, attendee: Person, bookingId: number) {
    const { token } = await this.guestService.requestInboxLink(attendee.email, bookingId, 1440);
    const webAppUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || "https://app.cal.com";
    const dashboardLink = `${webAppUrl}/thotis/my-sessions?token=${token}`;

    await this.emailService.sendConfirmation(calEvent, attendee, dashboardLink);
  }

  async sendCancellation(calEvent: CalendarEvent, attendee: Person) {
    await this.emailService.sendCancellation(calEvent, attendee);
  }

  async sendRescheduled(calEvent: CalendarEvent, attendee: Person) {
    await this.emailService.sendRescheduled(calEvent, attendee);
  }
}
