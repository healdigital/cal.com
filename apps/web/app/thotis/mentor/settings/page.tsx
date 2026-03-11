import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma from "@calcom/prisma";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { MentorSettingsClient } from "./MentorSettingsClient";

export default async function MentorSettingsPage() {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/thotis/mentor/settings");
  }

  // Settings page still works without a profile (shows "create profile" CTA in client component)
  // but we verify auth is valid

  return <MentorSettingsClient />;
}
