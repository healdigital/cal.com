import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { UserPermissionRole } from "@calcom/prisma/enums";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "~/thotis/components/AdminDashboard";

export const generateMetadata = async (): Promise<Metadata> =>
  await _generateMetadata(
    (t) => t("thotis_admin_page_title"),
    (t) => t("thotis_admin_page_description"),
    undefined,
    undefined,
    "/thotis/admin"
  );

export default async function AdminPage(): Promise<ReactElement> {
  const session = await getServerSession({
    req: buildLegacyRequest(await headers(), await cookies()),
  });

  if (session?.user?.role !== UserPermissionRole.ADMIN) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-subtle">
      <div className="container mx-auto px-4 py-10">
        <AdminDashboard />
      </div>
    </div>
  );
}
