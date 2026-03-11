import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { UserPermissionRole } from "@calcom/prisma/enums";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { IncidentsPageClient } from "~/thotis/components/IncidentsPageClient";

export default async function IncidentsPage() {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (session?.user?.role !== UserPermissionRole.ADMIN) {
    redirect("/");
  }

  return <IncidentsPageClient />;
}
