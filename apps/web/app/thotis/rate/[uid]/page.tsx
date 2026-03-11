import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { getTranslation } from "@calcom/lib/server/i18n";
import prisma from "@calcom/prisma";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { RatingForm } from "~/thotis/components/RatingForm";

export default async function ThotisFeedbackPage({
  params,
  searchParams,
}: {
  params: { uid: string };
  searchParams: { token?: string };
}) {
  const { uid } = params;
  const { token } = searchParams;

  const booking = await prisma.booking.findUnique({
    where: { uid },
    select: {
      id: true,
      status: true,
      startTime: true,
      endTime: true,
      metadata: true,
      responses: true,
      eventType: {
        select: {
          title: true,
          userId: true, // Mentor userId
        },
      },
    },
  });

  // Verify it's a Thotis session and it has ended
  const metadata = booking?.metadata as { isThotisSession?: boolean } | null;
  const isThotisSession = metadata?.isThotisSession === true;
  const hasEnded = booking?.endTime && booking.endTime < new Date();

  if (!booking || !isThotisSession || !hasEnded) {
    return notFound();
  }

  const locale = await getLocale(buildLegacyRequest(await headers(), await cookies()));
  const t = await getTranslation(locale ?? "en", "common");

  // No longer checking sessionRating here, RatingForm handles it

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-xl font-bold">{t("thotis_feedback_page_title")}</h1>
        <p className="mb-6 text-center text-sm text-gray-600">{t("thotis_feedback_page_description")}</p>
        <RatingForm
          bookingId={booking.id}
          email={(booking.responses as { email?: string })?.email || ""}
          token={token}
        />
      </div>
    </div>
  );
}
