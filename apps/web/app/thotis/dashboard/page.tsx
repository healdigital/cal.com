import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { ThotisDashboardRouter } from "~/thotis/components/ThotisDashboardRouter";

export default async function ThotisDashboardPage() {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <ThotisDashboardRouter
      userRole={session.user.role ?? "USER"}
      userId={session.user.id}
      userEmail={session.user.email ?? ""}
    />
  );
}
