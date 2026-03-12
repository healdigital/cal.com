"use client";

import { MentorListView } from "@calcom/features/thotis/components/MentorListView";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { AcademicField } from "@calcom/prisma/enums";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import { SkeletonButton, SkeletonContainer, SkeletonText } from "@calcom/ui/components/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MentorSearchFilters, type MentorSearchFiltersState } from "~/thotis/components/MentorSearchFilters";
import { ThotisErrorState } from "~/thotis/components/ThotisAsyncState";

const PAGE_SIZE = 12;

interface ThotisIntent {
  targetFields: string[];
  academicLevel: string;
  zone?: string | null;
  goals?: string[];
  scheduleConstraints?: unknown;
}

function readMentorSearchState(searchParams: { get: (key: string) => string | null } | null): {
  filters: MentorSearchFiltersState;
  page: number;
} {
  const parsedPage = Number(searchParams?.get("page") || "1");

  return {
    filters: {
      fieldOfStudy: searchParams?.get("field") || "",
      university: searchParams?.get("university") || "",
      minRating: searchParams?.get("minRating") ? Number(searchParams.get("minRating")) : 0,
    },
    page: Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

function hasSameFilters(
  currentFilters: MentorSearchFiltersState,
  nextFilters: MentorSearchFiltersState
): boolean {
  return (
    currentFilters.fieldOfStudy === nextFilters.fieldOfStudy &&
    currentFilters.university === nextFilters.university &&
    currentFilters.minRating === nextFilters.minRating
  );
}

function MentorResultsSkeleton() {
  return (
    <SkeletonContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonText className="h-4 w-36" />
        <div className="flex items-center gap-3">
          <SkeletonText className="h-8 w-32 rounded-md" />
          <div className="flex gap-2">
            <SkeletonButton className="h-8 w-8 rounded-md" />
            <SkeletonButton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <div key={index} className="rounded-md border border-subtle bg-default p-5">
            <div className="mb-4 flex items-start justify-between">
              <SkeletonText className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <SkeletonText className="h-5 w-20 rounded-full" />
                <SkeletonText className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <SkeletonText className="mb-2 h-6 w-36" />
            <SkeletonText className="mb-2 h-4 w-48" />
            <SkeletonText className="mb-1 h-4 w-40" />
            <SkeletonText className="mb-4 h-4 w-32" />
            <SkeletonText className="mb-2 h-4 w-full" />
            <SkeletonText className="mb-2 h-4 w-5/6" />
            <SkeletonText className="mb-6 h-4 w-4/6" />
            <div className="flex items-center justify-between">
              <SkeletonText className="h-5 w-16" />
              <SkeletonButton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonContainer>
  );
}

export function MentorsPageClient() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchState = readMentorSearchState(searchParams);
  const searchParamsString = searchParams?.toString() ?? "";

  const [currentPage, setCurrentPage] = useState(initialSearchState.page);
  const [filters, setFilters] = useState<MentorSearchFiltersState>(initialSearchState.filters);

  const [localIntent] = useState<ThotisIntent | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const saved = localStorage.getItem("thotis_orientation_intent");
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as ThotisIntent;
    } catch (error) {
      console.error("Failed to parse local intent", error);
      return null;
    }
  });

  useEffect(() => {
    const nextSearchState = readMentorSearchState(searchParams);

    setFilters((currentFilters) =>
      hasSameFilters(currentFilters, nextSearchState.filters) ? currentFilters : nextSearchState.filters
    );
    setCurrentPage((page) => (page === nextSearchState.page ? page : nextSearchState.page));
  }, [searchParams, searchParamsString]);

  const syncSearchStateToUrl = useCallback(
    (nextFilters: MentorSearchFiltersState, nextPage: number) => {
      const params = new URLSearchParams();

      if (nextFilters.fieldOfStudy) params.set("field", nextFilters.fieldOfStudy);
      if (nextFilters.university) params.set("university", nextFilters.university);
      if (nextFilters.minRating) params.set("minRating", String(nextFilters.minRating));
      if (nextPage > 1) params.set("page", String(nextPage));

      const nextQueryString = params.toString();
      if (nextQueryString === searchParamsString) {
        return;
      }

      router.replace(`/thotis/mentors${nextQueryString ? `?${nextQueryString}` : ""}`);
    },
    [router, searchParamsString]
  );

  const { data: intentData } = trpc.thotis.intent.get.useQuery(undefined, {
    enabled: !filters.fieldOfStudy && typeof window !== "undefined",
  });

  const effectiveIntent = intentData || localIntent;

  const {
    data: recommendations,
    error: recommendationsError,
    isLoading: isRefLoading,
    refetch: refetchRecommendations,
  } = trpc.thotis.intent.getRecommended.useQuery(
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

  const { data, isLoading, error, refetch } = trpc.thotis.profile.search.useQuery({
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
      syncSearchStateToUrl(newFilters, 1);
    },
    [syncSearchStateToUrl]
  );

  const handleBookSession = useCallback(
    (username: string) => {
      router.push(`/thotis/mentor/${username}`);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
      syncSearchStateToUrl(filters, nextPage);
    },
    [filters, syncSearchStateToUrl]
  );

  const selectedFieldLabel = filters.fieldOfStudy
    ? t(`thotis_field_${filters.fieldOfStudy.toLowerCase()}`)
    : null;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <ThotisErrorState
          message={error.message}
          onAction={() => void refetch()}
          title={t("thotis_error_loading_mentors")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{t("thotis_our_mentors")}</h1>
          <p className="text-gray-600">{t("thotis_find_right_mentor")}</p>
        </div>

        {recommendationsError && !filters.fieldOfStudy ? (
          <div className="mb-10">
            <ThotisErrorState
              message={recommendationsError.message}
              onAction={() => void refetchRecommendations()}
              title={t("thotis_something_wrong")}
            />
          </div>
        ) : null}

        {recommendations && recommendations.length > 0 && !filters.fieldOfStudy && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="sparkles" className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">{t("thotis_recommended_for_you")}</h2>
            </div>
            <MentorListView
              profiles={recommendations}
              isLoading={isRefLoading}
              total={recommendations.length}
              onBookSession={handleBookSession}
            />
            <hr className="my-10 border-subtle" />
          </div>
        )}

        <div className="mb-6">
          <MentorSearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedFieldLabel
              ? t("thotis_mentors_in", { field: selectedFieldLabel })
              : t("thotis_all_mentors")}
          </h2>
        </div>
        {isLoading && !data ? (
          <MentorResultsSkeleton />
        ) : (
          <MentorListView
            profiles={data?.profiles || []}
            isLoading={false}
            total={data?.total || 0}
            onBookSession={handleBookSession}
          />
        )}

        {(data?.total ?? 0) > PAGE_SIZE && (
          <nav aria-label={t("thotis_pagination")} className="mt-8 flex items-center justify-center gap-4">
            <Button
              color="secondary"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>
              <Icon name="arrow-left" className="mr-1 h-4 w-4" />
              {t("previous")}
            </Button>
            <span className="text-sm text-subtle">
              {t("thotis_page_of", {
                current: currentPage,
                total: Math.ceil((data?.total ?? 0) / PAGE_SIZE),
              })}
            </span>
            <Button
              color="secondary"
              disabled={currentPage >= Math.ceil((data?.total ?? 0) / PAGE_SIZE)}
              onClick={() => handlePageChange(currentPage + 1)}>
              {t("next")}
              <Icon name="arrow-right" className="ml-1 h-4 w-4" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
