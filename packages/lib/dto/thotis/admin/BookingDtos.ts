import { z } from "zod";
import { BookingStatusDtoSchema, MentorUserDtoSchema } from "../ThotisApiSchemas";

// ============================================================================
// Booking List DTOs
// ============================================================================

export const ListBookingsInputDtoSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  mentorUserId: z.number().int().positive().optional(),
  status: BookingStatusDtoSchema.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

export const AdminBookingListItemDtoSchema = z.object({
  id: z.number().int().positive(),
  uid: z.string(),
  title: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: BookingStatusDtoSchema,
  user: MentorUserDtoSchema.nullable(),
  attendees: z.array(
    z.object({
      email: z.string().email(),
      name: z.string(),
    })
  ),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  responses: z.record(z.string(), z.unknown()).nullable(),
  cancellationReason: z.string().nullable(),
});

export const PaginatedAdminBookingsDtoSchema = z.object({
  bookings: z.array(AdminBookingListItemDtoSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

// ============================================================================
// Booking Details DTOs
// ============================================================================

export const GetBookingDetailsInputDtoSchema = z.object({
  bookingId: z.number().int().positive(),
});

export const BookingAttendeeDtoSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string(),
  timeZone: z.string(),
  locale: z.string().nullable(),
});

export const BookingEventTypeDtoSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  length: z.number().int().positive(),
});

export const BookingDetailsDtoSchema = z.object({
  id: z.number().int().positive(),
  uid: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: BookingStatusDtoSchema,
  user: MentorUserDtoSchema.nullable(),
  attendees: z.array(BookingAttendeeDtoSchema),
  eventType: BookingEventTypeDtoSchema.nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  responses: z.record(z.string(), z.unknown()).nullable(),
  cancellationReason: z.string().nullable(),
  rescheduledFromUid: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================================
// Booking Cancellation DTOs
// ============================================================================

export const CancelBookingInputDtoSchema = z.object({
  bookingId: z.number().int().positive(),
  reason: z.string().min(1),
});

export const CancelBookingOutputDtoSchema = z.object({
  success: z.literal(true),
  bookingId: z.number().int().positive(),
  cancelledAt: z.string().datetime(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ListBookingsInputDto = z.infer<typeof ListBookingsInputDtoSchema>;
export type AdminBookingListItemDto = z.infer<typeof AdminBookingListItemDtoSchema>;
export type PaginatedAdminBookingsDto = z.infer<typeof PaginatedAdminBookingsDtoSchema>;

export type GetBookingDetailsInputDto = z.infer<typeof GetBookingDetailsInputDtoSchema>;
export type BookingAttendeeDto = z.infer<typeof BookingAttendeeDtoSchema>;
export type BookingEventTypeDto = z.infer<typeof BookingEventTypeDtoSchema>;
export type BookingDetailsDto = z.infer<typeof BookingDetailsDtoSchema>;

export type CancelBookingInputDto = z.infer<typeof CancelBookingInputDtoSchema>;
export type CancelBookingOutputDto = z.infer<typeof CancelBookingOutputDtoSchema>;
