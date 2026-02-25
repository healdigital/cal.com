"use client";

import { MentorListView } from "@calcom/features/thotis/components/MentorListView";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { AcademicField } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Icon } from "@calcom/ui/components/icon";
import { Button } from "@calcom/ui/components/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { MentorSearchFilters, type MentorSearchFiltersState } from "~/thotis/components/MentorSearchFilters";

const PAGE_SIZE = 12;

interface ThotisIntent {
  targetFields: string[];
  academicLevel: string;
  zone?: string | null;
  goals?: string[];
  scheduleConstraints?: unknown;
}

export default function MentorsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<MentorSearchFiltersState>({
    fieldOfStudy: searchParams?.get("field") || "",
    university: searchParams?.get("university") || "",
    minRating: searchParams?.get("minRating") ? Number(searchParams.get("minRating")) : 0,
  });

  const [localIntent, _setLocalIntent] = useState<ThotisIntent | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("thotis_orientation_intent");
      if (saved) {
        try {
          return JSON.parse(saved) as ThotisIntent;
        } catch (e) {
          console.error("Failed to parse local intent", e);
        }
      }
    }
    return null;
  });

  const { data: intentData } = trpc.thotis.intent.get.useQuery(undefined, {
    enabled: !!searchParams?.get("field") === false && typeof window !== "undefined", // Only fetch intent if not searching by field explicitly
  });

  // Effective intent (DB or localStorage fallback)
  const effectiveIntent = intentData || localIntent;

  const { data: recommendations, isLoading: isRefLoading } = trpc.thotis.intent.getRecommended.useQuery(
    {
      targetFields: effectiveIntent?.targetFields || [],
      academicLevel: effectiveIntent?.academicLevel || "",
      zone: effectiveIntent?.zone,
    },
    {
      enabled:
        !!effectiveIntent && (effectiveIntent.targetFields?.length > 0 || !!effectiveIntent.academicLevel),
    }
  );

  const { data, isLoading, error } = trpc.thotis.profile.search.useQuery({
    fieldOfStudy: (filters.fieldOfStudy || undefined) as AcademicField | undefined,
    university: filters.university || undefined,
    minRating: filters.minRating || undefined,
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const handleFiltersChange = useCallback(
    (newFilters: MentorSearchFiltersState) => {
      setFilters(newFilters);
      setCurrentPage(1);

      // Sync filters to URL params
      const params = new URLSearchParams();
      if (newFilters.fieldOfStudy) params.set("field", newFilters.fieldOfStudy);
      if (newFilters.university) params.set("university", newFilters.university);
      if (newFilters.minRating) params.set("minRating", String(newFilters.minRating));

      const qs = params.toString();
      router.push(`/thotis/mentors${qs ? `?${qs}` : ""}`);
    },
    [router]
  );

  const handleBookSession = useCallback(
    (username: string) => {
      router.push(`/thotis/mentor/${username}`);
    },
    [router]
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="font-semibold text-red-600 text-xl">{t("thotis_error_loading_mentors")}</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-3xl text-gray-900">{t("thotis_our_mentors")}</h1>
          <p className="text-gray-600">{t("thotis_find_right_mentor")}</p>
        </div>

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && !filters.fieldOfStudy && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="sparkles" className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 text-xl">{t("thotis_recommended_for_you")}</h2>
            </div>
            <MentorListView
              profiles={recommendations || []}
              isLoading={isRefLoading}
              total={recommendations.length}
              onBookSession={handleBookSession}
            />
            <hr className="my-10 border-subtle" />
          </div>
        )}

        {/* Search Filters */}
        <div className="mb-6">
          <MentorSearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        {/* All Mentors List */}
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-bold text-gray-900 text-xl">
            {filters.fieldOfStudy ? `${t("thotis_mentors_in")} ${filters.fieldOfStudy}` : t("thotis_all_mentors")}
          </h2>
        </div>
        <MentorListView
          profiles={data?.profiles || []}
          isLoading={isLoading && !data}
          total={data?.total || 0}
          onBookSession={handleBookSession}
        />

        {/* Pagination */}
        {(data?.total ?? 0) > PAGE_SIZE && (
          <nav aria-label={t("thotis_pagination")} className="mt-8 flex items-center justify-center gap-4">
            <Button
              color="secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              <Icon name="arrow-left" className="mr-1 h-4 w-4" />
              {t("previous")}
            </Button>
            <span className="text-sm text-subtle">
              {t("thotis_page_of", { current: currentPage, total: Math.ceil((data?.total ?? 0) / PAGE_SIZE) })}
            </span>
            <Button
              color="secondary"
              disabled={currentPage >= Math.ceil((data?.total ?? 0) / PAGE_SIZE)}
              onClick={() => setCurrentPage((p) => p + 1)}>
              {t("next")}
              <Icon name="arrow-right" className="ml-1 h-4 w-4" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
