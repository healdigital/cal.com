"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Icon } from "@calcom/ui/components/icon";
import { useRouter } from "next/navigation";
import { MentorDashboard } from "~/thotis/components/MentorDashboard";

interface MentorDashboardClientProps {
  userId: number;
}

export const MentorDashboardClient = ({ userId }: MentorDashboardClientProps) => {
  const { t } = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/thotis")}
            className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
            <Icon name="arrow-left" className="mr-1 h-4 w-4" />
            {t("thotis_back_to_thotis")}
          </button>
        </div>

        <MentorDashboard userId={userId} />
      </div>
    </div>
  );
};
