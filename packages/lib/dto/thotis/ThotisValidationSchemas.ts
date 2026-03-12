import { z } from "zod";
import { emailSchema } from "../../emailSchema";

export const THOTIS_PUBLIC_PAGE_SIZE_MAX = 50;
export const THOTIS_ADMIN_PAGE_SIZE_MAX = 100;

type ThotisJsonValue =
  | string
  | number
  | boolean
  | null
  | ThotisJsonValue[]
  | { [key: string]: ThotisJsonValue };

const thotisJsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const thotisJsonValueSchema: z.ZodType<ThotisJsonValue> = z.lazy(() =>
  z.union([
    thotisJsonPrimitiveSchema,
    z.array(thotisJsonValueSchema),
    z.record(z.string(), thotisJsonValueSchema),
  ])
);

export const thotisJsonObjectSchema = z.record(z.string(), thotisJsonValueSchema);

export const thotisEmailSchema = z.string().trim().toLowerCase().pipe(emailSchema);

export const thotisPublicPageSchema = z.number().int().min(1);
export const thotisPublicPageSizeSchema = z.number().int().min(1).max(THOTIS_PUBLIC_PAGE_SIZE_MAX);
export const thotisAdminPageSizeSchema = z.number().int().min(1).max(THOTIS_ADMIN_PAGE_SIZE_MAX);

export const thotisScheduleConstraintsSchema = z
  .object({
    preferredTimes: z.array(z.enum(["weekdays", "weekends", "evenings"])).max(3).optional(),
  })
  .strict();

export function clampThotisPageSize(pageSize: number | undefined, options?: { fallback?: number; max?: number }) {
  const fallback = options?.fallback ?? 20;
  const max = options?.max ?? THOTIS_PUBLIC_PAGE_SIZE_MAX;

  if (pageSize === undefined) return fallback;

  return Math.min(Math.max(pageSize, 1), max);
}
