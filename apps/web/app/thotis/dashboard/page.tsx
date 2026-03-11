import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import prisma from "@calcom/prisma";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { ThotisDashboardRouter } from "~/thotis/components/ThotisDashboardRouter";

export default async function ThotisDashboardPage(): Promise<ReactElement> {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  const mentorProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  return (
    <ThotisDashboardRouter
      hasMentorProfile={!!mentorProfile}
      userRole={session.user.role ?? "USER"}
      userId={session.user.id}
      userEmail={session.user.email ?? ""}
    />
  );
}
