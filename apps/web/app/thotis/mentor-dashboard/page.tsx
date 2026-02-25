import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma from "@calcom/prisma";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { MentorDashboardClient } from "./MentorDashboardClient";

export default async function MentorDashboardPage() {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/thotis/mentor-dashboard");
  }

  // Verify user has a mentor profile before granting access
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    redirect("/thotis/mentor/signup");
  }

  return <MentorDashboardClient userId={session.user.id} />;
}
