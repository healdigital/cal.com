import { analyticsApi } from "../api/client";
import type { MentorProfile, ScoredMentor } from "../types";
import { StarRating } from "./common/StarRating";

interface MentorCardProps {
  mentor: MentorProfile | ScoredMentor;
}

const wpUrl = () => window.thotisConfig?.wpUrl ?? "";

export function MentorCard({ mentor }: MentorCardProps) {
  const profileUrl = `${wpUrl()}/mentorat/mentor/${mentor.user.username ?? mentor.id}/`;
  const matchScore = "matchScore" in mentor ? mentor.matchScore : undefined;

  const handleClick = () => {
    analyticsApi.track({
      eventType: "profile_viewed",
      profileId: mentor.id,
      field: mentor.field,
    });
  };

  return (
    <a
      href={profileUrl}
      onClick={handleClick}
      className="th-group th-block th-rounded-xl th-border th-border-thotis-gray-200 th-bg-white th-p-5 th-shadow-sm th-transition-all hover:th-border-thotis-blue hover:th-shadow-md"
    >
      <div className="th-flex th-items-start th-gap-4">
        {/* Avatar */}
        <div className="th-flex-shrink-0">
          {mentor.profilePhotoUrl ? (
            <img
              src={mentor.profilePhotoUrl}
              alt={mentor.user.name ?? "Mentor"}
              className="th-h-14 th-w-14 th-rounded-full th-object-cover"
            />
          ) : (
            <div className="th-flex th-h-14 th-w-14 th-items-center th-justify-center th-rounded-full th-bg-thotis-blue th-text-lg th-font-semibold th-text-white">
              {(mentor.user.name ?? "M").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="th-min-w-0 th-flex-1">
          <h3 className="th-font-heading th-text-base th-font-semibold th-text-thotis-gray-900 group-hover:th-text-thotis-blue">
            {mentor.user.name ?? "Mentor"}
          </h3>
          <p className="th-text-sm th-text-thotis-gray-600">
            {mentor.university} &middot; {mentor.degree}
          </p>

          {/* Rating */}
          <div className="th-mt-1 th-flex th-items-center th-gap-2">
            <StarRating value={mentor.averageRating ?? 0} readonly size="sm" />
            <span className="th-text-xs th-text-thotis-gray-500">
              ({mentor.totalRatings} avis)
            </span>
          </div>

          {/* Match score badge */}
          {matchScore !== undefined && matchScore > 0 && (
            <span className="th-mt-2 th-inline-block th-rounded-full th-bg-green-100 th-px-2.5 th-py-0.5 th-text-xs th-font-medium th-text-green-800">
              {Math.round(matchScore * 100)}% compatible
            </span>
          )}
        </div>
      </div>

      {/* Bio excerpt */}
      <p className="th-mt-3 th-line-clamp-2 th-text-sm th-text-thotis-gray-600">{mentor.bio}</p>

      {/* Expertise tags */}
      {mentor.expertise.length > 0 && (
        <div className="th-mt-3 th-flex th-flex-wrap th-gap-1">
          {mentor.expertise.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="th-rounded-full th-bg-thotis-gray-100 th-px-2 th-py-0.5 th-text-xs th-text-thotis-gray-700"
            >
              {tag}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className="th-text-xs th-text-thotis-gray-400">
              +{mentor.expertise.length - 3}
            </span>
          )}
        </div>
      )}
    </a>
  );
}
