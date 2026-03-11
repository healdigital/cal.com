import path from "node:path";
import process from "node:process";
import type { PrismaClient } from "@calcom/prisma/client";
import { loadPrismaSchema } from "@calcom/prisma/loadSchema";
import { getDMMF } from "@prisma/internals";
import { createPrismock } from "prismock/build/main/lib/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RedisService } from "../../redis/RedisService";
import type { AnalyticsService } from "./AnalyticsService";
import { ThotisBookingService } from "./ThotisBookingService";
import type { ThotisEmailService } from "./ThotisEmailService";
import type { ThotisGuestService } from "./ThotisGuestService";

const mockAvailableSlotsService = {
  getAvailableSlots: vi.fn(),
};

const thotisWebhooksMock = {
  onBookingCancelled: vi.fn(),
  onBookingCompleted: vi.fn(),
  onBookingCreated: vi.fn(),
  onBookingRescheduled: vi.fn(),
};

vi.mock("@calcom/features/di/containers/AvailableSlots", () => ({
  getAvailableSlotsService: () => mockAvailableSlotsService,
}));

vi.mock("./ThotisWebhookClient", () => ({
  thotisWebhooks: thotisWebhooksMock,
}));

type PrismockClient = PrismaClient & { reset: () => void };

let prismock: PrismockClient;

async function getPrismock() {
  const dmmf = await getDMMF({
    datamodel: loadPrismaSchema(path.resolve(process.cwd(), "packages/prisma")),
  });
  const PrismockClient = createPrismock({ dmmf } as never);
  return new PrismockClient() as PrismockClient;
}

const uniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const cleanupFunctions: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanupFunctions) {
    await cleanup();
  }
  cleanupFunctions.length = 0;
});

async function setup() {
  const id = uniqueId();

  if (!prismock) {
    prismock = await getPrismock();
  } else {
    prismock.reset();
  }

  const mentorUser = await prismock.user.create({
    data: {
      email: `mentor-${id}@example.com`,
      name: `Test Mentor ${id}`,
      username: `mentor-${id}`,
    },
  });

  const studentProfile = await prismock.studentProfile.create({
    data: {
      bio: "Test Bio",
      currentYear: 3,
      degree: "Test Degree",
      field: "COMPUTER_SCIENCE",
      isActive: true,
      status: "VERIFIED",
      university: "Test University",
      userId: mentorUser.id,
    },
  });

  const analyticsMock = {
    trackBookingCancelled: vi.fn(),
    trackBookingCompleted: vi.fn(),
    trackBookingCreated: vi.fn(),
    trackBookingRescheduled: vi.fn(),
  } as unknown as AnalyticsService;

  const redisMock = {
    del: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  } as unknown as RedisService;

  const guestServiceMock = {
    requestInboxLink: vi.fn().mockResolvedValue({ token: "mock-token" }),
    verifyToken: vi.fn(),
  } as unknown as ThotisGuestService;

  const emailServiceMock = {
    sendCancellation: vi.fn(),
    sendConfirmation: vi.fn(),
    sendRescheduled: vi.fn(),
  } as unknown as ThotisEmailService;

  const service = new ThotisBookingService(
    prismock,
    analyticsMock,
    redisMock,
    undefined,
    guestServiceMock,
    emailServiceMock
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];
  const startStr = `${dateStr}T10:00:00.000Z`;
  const nextStartStr = `${dateStr}T10:15:00.000Z`;

  mockAvailableSlotsService.getAvailableSlots.mockResolvedValue({
    slots: {
      [dateStr]: [{ time: startStr }, { time: nextStartStr }],
    },
  });

  cleanupFunctions.push(async () => undefined);

  return {
    analyticsMock,
    dateStr,
    emailServiceMock,
    guestServiceMock,
    mentorUser,
    redisMock,
    service,
    startStr,
    studentProfile,
  };
}

describe("ThotisBookingService Integration Tests", () => {
  it("completes the booking lifecycle from availability to completion", async () => {
    const { analyticsMock, mentorUser, service, startStr, studentProfile } = await setup();

    const start = new Date(`${startStr.split("T")[0]}T00:00:00.000Z`);
    const end = new Date(`${startStr.split("T")[0]}T23:59:59.000Z`);

    const slots = await service.getStudentAvailability(studentProfile.id, { end, start });
    expect(slots).toHaveLength(2);
    expect(slots[0]?.available).toBe(true);

    const bookingResult = await service.createStudentSession({
      dateTime: new Date(startStr),
      prospectiveStudent: {
        email: "prospective@example.com",
        name: "Prospective Student",
        question: "How to learn integration testing?",
      },
      studentProfileId: studentProfile.id,
    });

    expect(bookingResult.bookingId).toBeDefined();
    expect(bookingResult.googleMeetLink).toContain("https://meet.jit.si/");
    expect(analyticsMock.trackBookingCreated).toHaveBeenCalled();

    const bookingInDb = await prismock.booking.findUnique({
      where: { id: bookingResult.bookingId },
    });
    expect(bookingInDb?.status).toBe("PENDING");

    const pastTime = new Date(Date.now() - 60 * 60 * 1000);
    const pastBooking = await prismock.booking.create({
      data: {
        endTime: new Date(pastTime.getTime() + 15 * 60 * 1000),
        metadata: {
          isThotisSession: true,
          studentProfileId: studentProfile.id,
        },
        startTime: new Date(pastTime),
        status: "PENDING",
        title: "Past Session",
        userId: mentorUser.id,
      },
    });

    await service.markSessionComplete(pastBooking.id, { id: mentorUser.id, isSystem: true });

    const completedBooking = await prismock.booking.findUnique({
      where: { id: pastBooking.id },
    });
    expect(completedBooking?.status).toBe("ACCEPTED");

    const updatedProfile = await prismock.studentProfile.findUnique({
      where: { id: studentProfile.id },
    });
    expect(updatedProfile?.completedSessions).toBe(1);
  });

  it("handles a booking followed by a cancellation", async () => {
    const { analyticsMock, service, startStr, studentProfile } = await setup();

    const bookingResult = await service.createStudentSession({
      dateTime: new Date(startStr),
      prospectiveStudent: {
        email: "prospective@example.com",
        name: "Prospective Student",
      },
      studentProfileId: studentProfile.id,
    });

    await service.cancelSession(bookingResult.bookingId, "Change of plans", "student", {
      email: "prospective@example.com",
    });

    const cancelledBooking = await prismock.booking.findUnique({
      where: { id: bookingResult.bookingId },
    });
    expect(cancelledBooking?.status).toBe("CANCELLED");
    expect(cancelledBooking?.cancellationReason).toBe("Change of plans");
    expect(analyticsMock.trackBookingCancelled).toHaveBeenCalled();

    const updatedProfile = await prismock.studentProfile.findUnique({
      where: { id: studentProfile.id },
    });
    expect(updatedProfile?.cancelledSessions).toBe(1);
  });

  it("prevents double booking on the same slot", async () => {
    const { service, startStr, studentProfile } = await setup();

    const bookingTime = new Date(startStr);

    await service.createStudentSession({
      dateTime: bookingTime,
      prospectiveStudent: { email: "s1@example.com", name: "S1" },
      studentProfileId: studentProfile.id,
    });

    await expect(
      service.createStudentSession({
        dateTime: bookingTime,
        prospectiveStudent: { email: "s2@example.com", name: "S2" },
        studentProfileId: studentProfile.id,
      })
    ).rejects.toThrow();
  });

  it("retrieves sessions for a guest student using a magic-link token", async () => {
    const { guestServiceMock, service, startStr, studentProfile } = await setup();

    const bookingRes = await service.createStudentSession({
      dateTime: new Date(startStr),
      prospectiveStudent: {
        email: "guest@example.com",
        name: "Guest Student",
        question: "Guest Question",
      },
      studentProfileId: studentProfile.id,
    });

    vi.mocked(guestServiceMock.verifyToken).mockResolvedValue({
      bookingId: bookingRes.bookingId,
      guest: { email: "guest@example.com" },
      guestId: "guest-id",
      id: "link-id",
    });
    vi.spyOn(prismock.booking, "findMany").mockResolvedValue([
      {
        endTime: new Date(new Date(startStr).getTime() + 15 * 60 * 1000),
        id: bookingRes.bookingId,
        metadata: { studentProfileId: studentProfile.id },
        responses: { email: "guest@example.com" },
        startTime: new Date(startStr),
        status: "PENDING",
        thotisSessionSummary: null,
        title: "Thotis Student Mentoring Session",
        uid: "booking-uid",
        user: {
          avatarUrl: null,
          name: "Mentor",
          username: "mentor",
        },
      },
    ]);

    const sessions = await service.studentSessions({
      token: "valid-token",
    });

    expect(guestServiceMock.verifyToken).toHaveBeenCalledWith("valid-token");
    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.responses).toMatchObject({ email: "guest@example.com" });
  });
});
