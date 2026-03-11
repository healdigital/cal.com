import { useMentorProfile } from "../hooks/useMentors";
import { BookingWidget } from "./BookingWidget";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { StarRating } from "./common/StarRating";

interface MentorProfileProps {
  username: string;
}

export function MentorProfile({ username }: MentorProfileProps) {
  const { data, isPending, error } = useMentorProfile(username);
  const profile = data?.profile;

  if (isPending) return <LoadingSpinner />;

  if (error || !profile) {
    return (
      <div className="th-rounded-lg th-bg-red-50 th-p-8 th-text-center">
        <p className="th-text-red-600">Mentor introuvable</p>
        <a
          href={`${window.thotisConfig?.wpUrl ?? ""}/mentorat/mentors/`}
          className="th-mt-4 th-inline-block th-text-sm th-text-thotis-blue th-underline">
          Voir tous les mentors
        </a>
      </div>
    );
  }

  return (
    <div className="th-grid th-gap-8 lg:th-grid-cols-3">
      {/* Left: Profile details */}
      <div className="lg:th-col-span-2 th-space-y-6">
        {/* Header */}
        <div className="th-flex th-items-start th-gap-5">
          {profile.profilePhotoUrl ? (
            <img
              src={profile.profilePhotoUrl}
              alt={profile.user.name ?? "Mentor"}
              className="th-h-20 th-w-20 th-rounded-full th-object-cover"
            />
          ) : (
            <div className="th-flex th-h-20 th-w-20 th-items-center th-justify-center th-rounded-full th-bg-thotis-blue th-text-2xl th-font-bold th-text-white">
              {(profile.user.name ?? "M").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="th-font-heading th-text-2xl th-font-bold th-text-thotis-gray-900">
              {profile.user.name}
            </h1>
            <p className="th-text-thotis-gray-600">
              {profile.university} &middot; {profile.degree}
            </p>
            <p className="th-text-sm th-text-thotis-gray-500">
              {profile.currentYear}e année &middot; {formatField(profile.field)}
            </p>
            <div className="th-mt-2 th-flex th-items-center th-gap-2">
              <StarRating value={profile.averageRating ?? 0} readonly size="md" />
              <span className="th-text-sm th-text-thotis-gray-500">
                {profile.averageRating?.toFixed(1) ?? "—"} ({profile.totalRatings} avis)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="th-font-heading th-text-lg th-font-semibold th-text-thotis-gray-900">À propos</h2>
          <p className="th-mt-2 th-whitespace-pre-line th-text-thotis-gray-700">{profile.bio}</p>
        </div>

        {/* Expertise */}
        {profile.expertise.length > 0 && (
          <div>
            <h2 className="th-font-heading th-text-lg th-font-semibold th-text-thotis-gray-900">
              Expertises
            </h2>
            <div className="th-mt-2 th-flex th-flex-wrap th-gap-2">
              {profile.expertise.map((tag) => (
                <span
                  key={tag}
                  className="th-rounded-full th-bg-thotis-blue/10 th-px-3 th-py-1 th-text-sm th-text-thotis-blue">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="th-grid th-grid-cols-3 th-gap-4">
          <StatBox label="Sessions" value={profile.totalSessions} />
          <StatBox label="Complétées" value={profile.completedSessions} />
          <StatBox label="Avis" value={profile.totalRatings} />
        </div>

        {/* LinkedIn */}
        {profile.linkedInUrl && (
          <a
            href={profile.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="th-inline-flex th-items-center th-gap-2 th-text-sm th-text-thotis-blue hover:th-underline">
            Profil LinkedIn &rarr;
          </a>
        )}
      </div>

      {/* Right: Booking widget */}
      <div className="lg:th-col-span-1">
        <div className="th-sticky th-top-4">
          <BookingWidget profileId={profile.id} mentorName={profile.user.name ?? "ce mentor"} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="th-rounded-lg th-border th-border-thotis-gray-200 th-p-4 th-text-center">
      <p className="th-text-2xl th-font-bold th-text-thotis-blue">{value}</p>
      <p className="th-text-xs th-text-thotis-gray-500">{label}</p>
    </div>
  );
}

function formatField(field: string): string {
  const map: Record<string, string> = {
    DROIT: "Droit",
    ECONOMIE_GESTION: "Économie & Gestion",
    SCIENCES_POLITIQUES: "Sciences Politiques",
    INFORMATIQUE: "Informatique",
    INGENIERIE: "Ingénierie",
    SANTE: "Santé",
    SCIENCES: "Sciences",
    LETTRES_LANGUES: "Lettres & Langues",
    ARTS: "Arts",
    COMMUNICATION: "Communication",
    SPORT: "Sport",
    AUTRE: "Autre",
  };
  return map[field] ?? field;
}
