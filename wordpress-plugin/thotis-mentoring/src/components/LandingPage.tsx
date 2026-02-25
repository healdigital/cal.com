import { useState } from "react";

import { useTopMentors } from "../hooks/useMentors";
import { MentorCard } from "./MentorCard";
import { OrientationForm } from "./OrientationForm";
import { LoadingSpinner } from "./common/LoadingSpinner";

export function LandingPage() {
  const [showOrientation, setShowOrientation] = useState(false);
  const { data, isPending } = useTopMentors();
  const topMentors = data?.profiles?.slice(0, 6);
  const wpUrl = window.thotisConfig?.wpUrl ?? "";

  return (
    <div className="th-space-y-16">
      {/* Hero */}
      <section className="th-text-center th-py-12">
        <h1 className="th-font-heading th-text-4xl th-font-bold th-text-thotis-gray-900 md:th-text-5xl">
          Échange avec un étudiant
          <span className="th-block th-text-thotis-blue">qui est passé par là</span>
        </h1>
        <p className="th-mx-auto th-mt-4 th-max-w-2xl th-text-lg th-text-thotis-gray-600">
          15 minutes en visio avec un mentor étudiant pour découvrir sa formation, poser tes questions et faire les bons
          choix d'orientation.
        </p>
        <div className="th-mt-8 th-flex th-flex-col th-items-center th-gap-3 sm:th-flex-row sm:th-justify-center">
          <a
            href={`${wpUrl}/mentorat/mentors/`}
            className="th-rounded-lg th-bg-thotis-orange th-px-8 th-py-3 th-font-heading th-font-semibold th-text-white th-transition-colors hover:th-bg-thotis-orange-dark"
          >
            Trouver un mentor
          </a>
          <button
            type="button"
            onClick={() => setShowOrientation(true)}
            className="th-rounded-lg th-border th-border-thotis-blue th-px-8 th-py-3 th-font-heading th-font-semibold th-text-thotis-blue th-transition-colors hover:th-bg-blue-50"
          >
            Je ne sais pas quoi choisir
          </button>
        </div>
      </section>

      {/* Orientation Form (conditional) */}
      {showOrientation && (
        <section className="th-mx-auto th-max-w-2xl">
          <OrientationForm
            onComplete={(mentors) => {
              if (mentors.length > 0) {
                window.location.href = `${wpUrl}/mentorat/mentors/?recommended=1`;
              }
            }}
          />
          <button
            type="button"
            onClick={() => setShowOrientation(false)}
            className="th-mt-3 th-text-sm th-text-thotis-gray-500 hover:th-text-thotis-gray-700"
          >
            Fermer
          </button>
        </section>
      )}

      {/* How it works */}
      <section>
        <h2 className="th-text-center th-font-heading th-text-2xl th-font-bold th-text-thotis-gray-900">
          Comment ça marche ?
        </h2>
        <div className="th-mt-8 th-grid th-gap-6 md:th-grid-cols-3">
          {[
            {
              step: "1",
              title: "Choisis ton mentor",
              description: "Parcours les profils et trouve un étudiant dans la formation qui t'intéresse.",
            },
            {
              step: "2",
              title: "Réserve un créneau",
              description: "Choisis une date et un horaire qui te conviennent. C'est gratuit !",
            },
            {
              step: "3",
              title: "Échange en visio",
              description: "15 minutes en visio pour poser toutes tes questions et découvrir la formation.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="th-rounded-xl th-border th-border-thotis-gray-200 th-bg-white th-p-6 th-text-center"
            >
              <div className="th-mx-auto th-flex th-h-12 th-w-12 th-items-center th-justify-center th-rounded-full th-bg-thotis-blue th-font-heading th-text-lg th-font-bold th-text-white">
                {item.step}
              </div>
              <h3 className="th-mt-4 th-font-heading th-font-semibold th-text-thotis-gray-900">{item.title}</h3>
              <p className="th-mt-2 th-text-sm th-text-thotis-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top mentors */}
      <section>
        <div className="th-flex th-items-center th-justify-between">
          <h2 className="th-font-heading th-text-2xl th-font-bold th-text-thotis-gray-900">Nos meilleurs mentors</h2>
          <a
            href={`${wpUrl}/mentorat/mentors/`}
            className="th-text-sm th-font-medium th-text-thotis-blue hover:th-underline"
          >
            Voir tous les mentors
          </a>
        </div>

        {isPending && (
          <div className="th-mt-6">
            <LoadingSpinner />
          </div>
        )}

        {topMentors && topMentors.length > 0 && (
          <div className="th-mt-6 th-grid th-gap-4 sm:th-grid-cols-2 lg:th-grid-cols-3">
            {topMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}

        {topMentors && topMentors.length === 0 && (
          <p className="th-mt-6 th-text-center th-text-thotis-gray-500">Aucun mentor disponible pour le moment.</p>
        )}
      </section>

      {/* CTA */}
      <section className="th-rounded-2xl th-bg-thotis-blue th-px-8 th-py-12 th-text-center th-text-white">
        <h2 className="th-font-heading th-text-2xl th-font-bold">Prêt à échanger avec un mentor ?</h2>
        <p className="th-mx-auto th-mt-3 th-max-w-lg th-text-blue-100">
          Rejoins les milliers de lycéens qui ont trouvé leur orientation grâce aux mentors Thotis.
        </p>
        <a
          href={`${wpUrl}/mentorat/mentors/`}
          className="th-mt-6 th-inline-block th-rounded-lg th-bg-white th-px-8 th-py-3 th-font-heading th-font-semibold th-text-thotis-blue th-transition-colors hover:th-bg-blue-50"
        >
          C'est parti !
        </a>
      </section>
    </div>
  );
}
