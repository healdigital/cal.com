import { useState } from "react";

import { useMentorSearch, useUniversities } from "../hooks/useMentors";
import type { AcademicField } from "../types";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { MentorCard } from "./MentorCard";

interface MentorGridProps {
  initialField?: string;
  initialLimit?: number;
}

const FIELD_OPTIONS: { value: AcademicField | ""; label: string }[] = [
  { value: "", label: "Toutes les filières" },
  { value: "DROIT", label: "Droit" },
  { value: "ECONOMIE_GESTION", label: "Économie & Gestion" },
  { value: "SCIENCES_POLITIQUES", label: "Sciences Politiques" },
  { value: "INFORMATIQUE", label: "Informatique" },
  { value: "INGENIERIE", label: "Ingénierie" },
  { value: "SANTE", label: "Santé" },
  { value: "SCIENCES", label: "Sciences" },
  { value: "LETTRES_LANGUES", label: "Lettres & Langues" },
  { value: "ARTS", label: "Arts" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "SPORT", label: "Sport" },
];

export function MentorGrid({ initialField = "", initialLimit = 20 }: MentorGridProps) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState(initialField);
  const [university, setUniversity] = useState("");
  const [sort, setSort] = useState<"rating" | "popularity" | "newest">("rating");
  const [page, setPage] = useState(1);

  const { data: universities } = useUniversities();
  const { data, isPending, error, refetch } = useMentorSearch({
    q: query || undefined,
    field: field || undefined,
    university: university || undefined,
    sort,
    page,
    pageSize: initialLimit,
  });

  const totalPages = data ? Math.ceil(data.total / initialLimit) : 0;

  return (
    <div className="th-space-y-6">
      {/* Search & Filters */}
      <div className="th-flex th-flex-col th-gap-3 sm:th-flex-row" role="search" aria-label="Recherche de mentors">
        <label htmlFor="mentor-search" className="th-sr-only">Rechercher un mentor</label>
        <input
          id="mentor-search"
          type="search"
          placeholder="Rechercher un mentor..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          className="th-flex-1 th-rounded-lg th-border th-border-thotis-gray-200 th-px-4 th-py-2.5 th-text-sm th-outline-none focus:th-border-thotis-blue focus:th-ring-1 focus:th-ring-thotis-blue"
        />
        <label htmlFor="mentor-field" className="th-sr-only">Filière</label>
        <select
          id="mentor-field"
          value={field}
          onChange={(e) => { setField(e.target.value); setPage(1); }}
          className="th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm"
        >
          {FIELD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label htmlFor="mentor-university" className="th-sr-only">Université</label>
        <select
          id="mentor-university"
          value={university}
          onChange={(e) => { setUniversity(e.target.value); setPage(1); }}
          className="th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm"
        >
          <option value="">Toutes les universités</option>
          {universities?.universities.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <label htmlFor="mentor-sort" className="th-sr-only">Trier par</label>
        <select
          id="mentor-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="th-rounded-lg th-border th-border-thotis-gray-200 th-px-3 th-py-2.5 th-text-sm"
        >
          <option value="rating">Mieux notés</option>
          <option value="popularity">Populaires</option>
          <option value="newest">Récents</option>
        </select>
      </div>

      {/* Results count */}
      {data && (
        <p className="th-text-sm th-text-thotis-gray-500" aria-live="polite">
          {data.total} mentor{data.total > 1 ? "s" : ""} trouvé{data.total > 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {isPending && <LoadingSpinner />}

      {error && (
        <div className="th-rounded-lg th-bg-red-50 th-p-4 th-text-center">
          <p className="th-text-sm th-text-red-600">
            Erreur lors du chargement des mentors.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="th-mt-2 th-rounded th-bg-thotis-blue th-px-4 th-py-1.5 th-text-xs th-text-white hover:th-bg-thotis-blue-dark"
          >
            Réessayer
          </button>
        </div>
      )}

      {data && data.profiles.length === 0 && (
        <p className="th-py-12 th-text-center th-text-thotis-gray-500">
          Aucun mentor trouvé avec ces critères. Essayez d&apos;élargir votre recherche.
        </p>
      )}

      {data && data.profiles.length > 0 && (
        <div className="th-grid th-grid-cols-1 th-gap-4 sm:th-grid-cols-2 lg:th-grid-cols-3">
          {data.profiles.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="th-flex th-items-center th-justify-center th-gap-2" aria-label="Pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="th-rounded th-border th-border-thotis-gray-200 th-px-3 th-py-1.5 th-text-sm disabled:th-opacity-50"
          >
            Précédent
          </button>
          <span className="th-text-sm th-text-thotis-gray-600">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="th-rounded th-border th-border-thotis-gray-200 th-px-3 th-py-1.5 th-text-sm disabled:th-opacity-50"
          >
            Suivant
          </button>
        </nav>
      )}
    </div>
  );
}
