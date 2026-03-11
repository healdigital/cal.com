# Rapport de modifications
## Comparatif entre le projet Cal.com original et la version adaptée pour Thotis

Date: 11 mars 2026

## 1. Objet du document

Ce document décrit, de manière exploitable pour une agence de développement, ce qui a été modifié entre:

- le projet original: `/Users/leoturbetdelof/Downloads/cal.com-main-original`
- le projet actuel: `/Users/leoturbetdelof/Downloads/cal.com-main`

L'objectif est double:

1. identifier précisément les modifications déjà réalisées;
2. reconstituer un périmètre de chiffrage pour l'installation de Cal.com et l'adaptation au besoin métier Thotis.

## 2. Méthodologie et point d'attention

L'analyse a été faite:

- par comparaison d'arborescences entre la copie originale et la copie actuelle;
- par lecture des documents projet déjà présents dans le dépôt;
- par inspection ciblée des fichiers techniques structurants: schéma Prisma, services métier, routes API, écrans frontend, emails, cron jobs et packaging Docker.

Point important:

- le delta brut entre les deux répertoires est très large;
- il contient à la fois du développement métier Thotis, des adaptations d'infrastructure, des travaux de conformité AGPL, et aussi des écarts annexes qui ressemblent à de la dérive de version ou à des travaux parallèles;
- pour éviter un chiffrage trompeur, ce rapport sépare le périmètre "utile au besoin client" du bruit technique ou hors besoin.

## 3. Résumé exécutif

La version actuelle n'est plus un Cal.com standard. Elle a été transformée en une plateforme de mentorat étudiant Thotis, avec:

- un modèle de données dédié au mentorat étudiant;
- des APIs internes et externes pour intégrer le service dans un site Thotis;
- des interfaces publiques, mentor, étudiant et administrateur;
- un workflow complet de réservation, annulation, replanification, feedback, incidents et reporting;
- des emails transactionnels brandés Thotis;
- des tâches cron pour rappels, feedback, cycle de vie des sessions et synchronisation calendrier;
- des adaptations de déploiement self-hosted;
- un chantier spécifique de conformité AGPLv3 / suppression de références commerciales.

Volumétrie visible dans le dépôt actuel sur le périmètre Thotis:

- 14 pages Next.js sous `/apps/web/app/thotis`
- 22 routes REST Next.js sous `/apps/web/app/api/thotis`
- 10 routeurs tRPC sous `/packages/trpc/server/routers/thotis`
- 23 services sous `/packages/features/thotis/services`
- 8 repositories sous `/packages/features/thotis/repositories`
- 21 composants frontend Thotis sous `/apps/web/modules/thotis/components`
- 16 templates email Thotis
- 4 migrations Prisma spécifiques Thotis
- 4 cron jobs Thotis
- 55 fichiers de test/validation liés au périmètre Thotis ou à son durcissement

En complément, plusieurs fichiers non commités sont encore modifiés localement. Ils correspondent à des finitions, principalement accessibilité et robustesse.

## 4. Ce qui a été modifié

### 4.1. Transformation fonctionnelle de Cal.com en plateforme Thotis

Le dépôt original ne contenait pas de périmètre `thotis`. La version actuelle ajoute une verticale métier complète.

Cette verticale couvre:

- le profil public des mentors;
- la recherche et le filtrage par filière / université / disponibilité;
- la réservation de sessions de 15 minutes;
- la gestion des disponibilités mentor;
- les tableaux de bord mentor, étudiant et administrateur;
- les feedbacks post-session;
- la gestion des incidents qualité;
- l'accès invité via magic link;
- l'analytics et le reporting;
- l'intégration front avec un site externe type WordPress / Thotis.

### 4.2. Couche données et schéma métier

Le socle de données a été étendu avec un schéma Prisma spécifique au domaine Thotis.

#### Modèles métier ajoutés ou étendus

Le fichier `packages/prisma/thotis.prisma` introduit les objets métier suivants:

- `StudentProfile`
- `SessionRating`
- `ThotisOrientationIntent`
- `ThotisGuestIdentity`
- `ThotisMagicLinkToken`
- `ThotisGuestAccessLog`
- `ThotisSessionSummary`
- `ThotisSessionResource`
- `MentorQualityIncident`
- `MentorModerationAction`
- `ThotisAnalyticsEvent`

Enums métier ajoutés:

- `AcademicField`
- `MentorStatus`
- `MentorIncidentType`
- `MentorModerationActionType`
- `ThotisAnalyticsEventType`

#### Migrations spécifiques identifiées

- `packages/prisma/migrations/20260204203907_add_thotis_student_mentoring_models/migration.sql`
- `packages/prisma/migrations/20260225120000_add_thotis_missing_indexes/migration.sql`
- `packages/prisma/migrations/20260311101500_add_missing_thotis_student_profile_columns/migration.sql`
- `packages/prisma/migrations/20260311120000_uuid_migration_thotis_tables/migration.sql`

#### Impact de ces changements

- création d'un vrai domaine métier autour du mentorat étudiant;
- persistance de profils, notes, incidents, logs d'accès invité et analytics;
- ajout d'indexes pour la performance;
- évolution incrémentale du schéma: colonnes métier, statuts, UUID, ressources post-session.

### 4.3. Services métier et logique applicative

Le coeur du besoin Thotis est implémenté dans `packages/features/thotis`.

#### Services principaux

Les principaux services identifiés sont:

- `ProfileService`
- `ThotisBookingService`
- `ThotisSessionOperationsService`
- `ThotisAdminService`
- `ThotisGuestService`
- `SessionRatingService`
- `StatisticsService`
- `ThotisAnalyticsService`
- `ThotisEmailService`
- `WebhookService`
- `ThotisWebhookClient`
- `MentorMatchingService`

#### Ce que ces services font concrètement

`ThotisBookingService`

- crée des sessions mentorat de 15 minutes;
- impose un préavis minimum;
- contrôle les conflits de réservation;
- génère et met à jour les liens Google Meet;
- gère annulation, replanification, marquage de fin de session et no-show;
- invalide des caches Redis liés au profil / disponibilité;
- émet des événements analytics.

`ThotisSessionOperationsService`

- factorise les opérations post-session;
- gère la soumission des notes;
- sécurise la lecture de notes et de résumés;
- gère la déclaration d'incidents;
- gère les données post-session: résumé, next steps, ressources;
- centralise une partie de la logique de contrôle d'accès mentor / étudiant.

`ThotisAdminService`

- permet de provisionner des ambassadeurs / mentors;
- crée ou met à jour les profils;
- configure les schedules par défaut;
- orchestre les dépendances entre user, profile, schedule et booking;
- s'appuie sur des repositories existants de Cal.com pour s'intégrer proprement au socle.

`ThotisGuestService`

- crée des magic links temporaires;
- applique un anti-abus par fenêtre de temps;
- invalide les tokens après actions sensibles;
- journalise les accès invités.

#### Repositories étendus hors Thotis

Le développement a également nécessité des extensions dans des repositories existants du coeur Cal.com:

- `packages/features/bookings/repositories/BookingRepository.ts`
- `packages/features/schedules/repositories/SchedulesRepository.ts`

Exemples de besoins couverts:

- listing admin des bookings Thotis;
- détail d'une réservation pour l'administration;
- annulation administrative enrichie avec métadonnées;
- support de la configuration automatique des schedules.

### 4.4. API internes et API d'intégration

Le projet actuel expose trois couches d'API autour du besoin Thotis.

#### A. tRPC interne Cal.com

Sous `packages/trpc/server/routers/thotis`, le dépôt contient:

- `profile.router.ts`
- `booking.router.ts`
- `rating.router.ts`
- `statistics.router.ts`
- `admin.router.ts`
- `guest.router.ts`
- `incident.router.ts`
- `analytics.router.ts`
- `intent.router.ts`
- `_shared.ts`

Ces routeurs pilotent les écrans internes et les composants frontend Thotis.

#### B. API REST Next.js pour intégration front externe

Sous `apps/web/app/api/thotis`, la version actuelle expose 22 endpoints:

- `/api/thotis/analytics`
- `/api/thotis/availability`
- `/api/thotis/bookings`
- `/api/thotis/bookings/cancel`
- `/api/thotis/bookings/reschedule`
- `/api/thotis/guest/cancel`
- `/api/thotis/guest/magic-link`
- `/api/thotis/guest/post-session`
- `/api/thotis/guest/rate`
- `/api/thotis/guest/report`
- `/api/thotis/guest/sessions`
- `/api/thotis/intent`
- `/api/thotis/mentors`
- `/api/thotis/mentors/[username]`
- `/api/thotis/mentors/recommended`
- `/api/thotis/mentors/top`
- `/api/thotis/ratings`
- `/api/thotis/sessions`
- `/api/thotis/universities`
- plus la couche `_lib` pour validation, CORS et instanciation des services

Cette couche sert clairement à une intégration headless / embarquée.

#### C. API v2 orientée plateforme / headless

Le dépôt actuel contient aussi un travail d'exposition via `apps/api/v2`:

- `apps/api/v2/src/modules/students/students.controller.ts`
- `apps/api/v2/src/modules/students/students.module.ts`
- `apps/api/v2/src/modules/bookings/controllers/bookings.controller.ts`
- `apps/api/v2/src/modules/bookings/services/bookings.service.ts`

Ce lot permet d'exposer la brique Thotis dans l'API v2 NestJS, ce qui est typiquement utile pour un site tiers ou des consommateurs API.

#### DTOs et contrats d'échange

Deux fichiers structurants ont été ajoutés pour stabiliser les contrats:

- `packages/lib/dto/thotis/ThotisApiSchemas.ts`
- `packages/lib/dto/thotis/ThotisDtoMappers.ts`

Ils servent à:

- typer les réponses métier;
- sérialiser proprement les données Prisma;
- sécuriser le parsing de la metadata des bookings Thotis.

### 4.5. Frontend, parcours utilisateur et back-office

#### Pages métier ajoutées

Sous `apps/web/app/thotis`, la version actuelle expose les parcours suivants:

- page d'entrée `/thotis`
- listing mentors `/thotis/mentors`
- onboarding mentor `/thotis/mentor/signup`
- fiche mentor `/thotis/mentor/[username]`
- réglages mentor `/thotis/mentor/settings`
- dashboard mentor `/thotis/dashboard`
- dashboard mentor détaillé `/thotis/mentor-dashboard`
- espace "mes sessions" `/thotis/my-sessions`
- notation `/thotis/rate/[uid]`
- administration `/thotis/admin`
- administration des ambassadeurs `/thotis/admin/ambassadors`
- administration des incidents `/thotis/admin/incidents`

#### Composants clés ajoutés ou fortement modifiés

Sous `apps/web/modules/thotis/components`, on retrouve notamment:

- `BookingWidget.tsx`
- `MentorSearchFilters.tsx`
- `MentorDashboard.tsx`
- `StudentDashboard.tsx`
- `StudentOnboarding.tsx`
- `StudentSettings.tsx`
- `SessionManagementUI.tsx`
- `PostSessionForm.tsx`
- `SessionSummaryView.tsx`
- `RatingForm.tsx`
- `GuestMagicLinkForm.tsx`
- `AdminDashboard.tsx`
- `AdminBookingList.tsx`
- `AmbassadorManagement.tsx`
- `IncidentsPageClient.tsx`
- `EditMentorProfileModal.tsx`
- `MentorScheduleModal.tsx`
- `BookingDetailDialog.tsx`

#### Nature des développements frontend

- création d'un tunnel de réservation dédié;
- création d'espaces mentor et étudiant distincts;
- création d'un back-office d'administration;
- création d'écrans de post-session et de feedback;
- personnalisation des libellés métier avec `apps/web/modules/thotis/lib/displayLabels.ts`;
- ajout de traductions métier dans `apps/web/public/static/locales/en/common.json` et `apps/web/public/static/locales/fr/common.json`.

#### Autres pages métiers liées

L'analyse met aussi en évidence des pages supplémentaires hors namespace `/thotis` mais liées au même besoin:

- `apps/web/app/feedback/[uid]/page.tsx`
- `apps/web/app/students/[field]/page.tsx`
- `apps/web/app/(use-page-wrapper)/onboarding/student-profile/page.tsx`
- `apps/web/modules/onboarding/student-profile/student-profile-view.tsx`

### 4.6. Emails, rappels, feedback et tâches planifiées

#### Templates email ajoutés

Le dépôt actuel contient 16 fichiers email spécifiques Thotis:

- confirmation de réservation;
- rappel J-1;
- annulation;
- replanification;
- demande de feedback;
- magic link;
- relance mentor;
- bases de layout email Thotis.

Fichiers:

- `packages/emails/templates/thotis/booking-confirmation.ts`
- `packages/emails/templates/thotis/booking-reminder.ts`
- `packages/emails/templates/thotis/booking-cancellation.ts`
- `packages/emails/templates/thotis/booking-rescheduled.ts`
- `packages/emails/templates/thotis/feedback-request.ts`
- `packages/emails/templates/thotis/magic-link.ts`
- `packages/emails/templates/thotis/mentor-nudge.ts`
- `packages/emails/src/templates/thotis/*`

#### Service email

`packages/features/thotis/services/ThotisEmailService.ts` encapsule:

- envoi de confirmation;
- envoi de reminder;
- envoi de feedback request;
- envoi de cancellation / reschedule;
- envoi de magic link.

#### Cron jobs dédiés

Quatre tâches planifiées existent sous `apps/web/app/api/cron`:

- `thotis-reminders`
- `thotis-feedback`
- `thotis-lifecycle`
- `thotis-calendar-sync`

Elles couvrent:

- rappels 24h avant;
- nudges mentor si le résumé n'est pas saisi;
- envoi de demande de feedback étudiant;
- passage automatique d'une session en "completed" ou "no-show";
- synchronisation des calendriers mentors.

### 4.7. Intégration WordPress / front tiers / CORS

Le besoin d'intégration au site Thotis est visible dans:

- `apps/web/app/api/thotis/_lib/cors.ts`
- `.env.example`

La variable suivante a été ajoutée:

- `THOTIS_WP_ORIGIN=https://thotismedia.com`

Concrètement:

- les endpoints `/api/thotis/*` peuvent être appelés depuis un site externe autorisé;
- les préflight `OPTIONS` sont gérés;
- certains appels passent avec un header invité dédié (`X-Thotis-Guest-Token`).

Cela confirme une architecture prévue pour être appelée par un site CMS ou un frontend non embarqué dans l'app Cal.com.

### 4.8. Déploiement self-hosted et packaging

Le dépôt actuel contient des adaptations d'installation non présentes dans le projet original.

#### Fichiers concernés

- `Dockerfile.coolify`
- `Dockerfile`
- `docker-compose.yml`
- `.env.example`

#### Ce qui a été modifié

`Dockerfile.coolify`

- ajout d'un Dockerfile dédié à Coolify;
- adaptation du build multi-stage;
- génération Prisma;
- build ciblé pour l'application web;
- nettoyage des caches;
- healthcheck;
- remplacement de placeholder d'URL au runtime.

`Dockerfile` et `docker-compose.yml`

- retrait de certaines variables liées à l'ancienne logique de licence commerciale;
- adaptation du build et des variables injectées;
- nettoyage de paramètres non nécessaires au périmètre self-host AGPL.

#### Interprétation agence

Ce lot correspond au périmètre "installation Cal.com self-hosted" et non seulement à la personnalisation métier.

### 4.9. Conformité AGPLv3 / suppression des références commerciales

Le dépôt contient un chantier explicite de nettoyage légal et technique.

Principaux éléments observés:

- suppression de variables de licence commerciale dans `.env.example`;
- retrait de références licence dans le packaging Docker;
- ajout de documents d'audit et de vérification:
  - `AUDIT_FINAL_LICENCE_COMMERCIALE.md`
  - `VERIFICATION_COMPLETE.md`
  - `VERIFICATION_FONCTIONNELLE_POST_SUPPRESSION.md`
  - `RESUME_VERIFICATION_FINALE.md`
- mise à jour de `README.md` et de la documentation pour repositionner le projet sur AGPLv3.

Ce lot doit être compté séparément s'il ne fait pas partie du besoin client final.

### 4.10. Qualité, tests et durcissement

Le dépôt actuel contient un vrai effort de QA sur le périmètre Thotis:

- tests de repositories;
- tests unitaires et property tests sur les services;
- tests tRPC;
- tests d'intégration sur la réservation;
- E2E Playwright côté invité.

Exemples identifiés:

- `packages/features/thotis/services/ThotisBookingService.test.ts`
- `packages/features/thotis/services/ThotisBookingService.property.test.ts`
- `packages/features/thotis/services/ThotisBookingService.integration.test.ts`
- `packages/features/thotis/services/ThotisAdminService.test.ts`
- `packages/features/thotis/services/ThotisGuestService.test.ts`
- `packages/trpc/server/routers/thotis.test.ts`
- `packages/trpc/server/routers/thotis.public.test.ts`
- `apps/web/playwright/thotis-guest.e2e.ts`

## 5. Finitions locales non commités au moment de l'analyse

Plusieurs fichiers sont encore modifiés localement. Ils relèvent de la finition et du durcissement, pas d'un nouveau lot métier.

### Ajustements identifiés

- amélioration accessibilité du `BookingWidget`:
  - `aria-live`
  - `aria-label` sur les boutons retour
- passage du champ expertise en saisie par tags dans `EditMentorProfileModal`
- accessibilité du sélecteur de jours dans `MentorScheduleModal`
- libellés ARIA pour les étoiles dans `RatingForm`
- rôles d'onglets et états `aria-selected` dans `StudentDashboard`
- durcissement de `ThotisBookingService` avec `parseBookingMetadata(...)` au lieu de cast brut
- null safety sur `guest.lastRequestAt` dans `ThotisGuestService`

Interprétation:

- ce sont des corrections de robustesse et d'accessibilité;
- elles peuvent être présentées comme "recette / polishing" dans un chiffrage.

## 6. Découpage recommandé pour le chiffrage

### 6.1. Installation Cal.com self-hosted

Inclure:

- préparation environnement;
- Docker / Docker Compose / Coolify;
- variables d'environnement;
- Prisma / migrations;
- healthchecks;
- configuration des secrets;
- recette de démarrage.

Charge indicative:

- `3 à 5 JH`

### 6.2. Socle métier Thotis

Inclure:

- schéma Prisma métier;
- services profil / booking / rating / statistics / analytics;
- logique magic link invité;
- orchestration post-session;
- intégration avec Google Calendar / Meet;
- webhooks et événements métier.

Charge indicative:

- `8 à 12 JH`

### 6.3. Frontend Thotis

Inclure:

- pages publiques;
- widget de réservation;
- espace étudiant;
- espace mentor;
- administration ambassadeurs / incidents;
- modales et composants métier;
- i18n et labels métiers.

Charge indicative:

- `8 à 12 JH`

### 6.4. Notifications, cron jobs et expérience post-session

Inclure:

- templates email brandés;
- rappels;
- demandes de feedback;
- relance mentor;
- cycle de vie automatique des sessions;
- sync calendrier.

Charge indicative:

- `4 à 6 JH`

### 6.5. QA, tests, durcissement, accessibilité

Inclure:

- tests unitaires;
- property tests;
- tests d'intégration;
- E2E critiques;
- corrections de robustesse;
- accessibilité de base.

Charge indicative:

- `3 à 5 JH`

### 6.6. Conformité AGPL / nettoyage licence commerciale

À compter seulement si vous repartez d'une base contenant encore les références commerciales.

Inclure:

- audit des variables;
- nettoyage docs / README / packaging;
- vérification fonctionnelle après suppression;
- éventuels ajustements de stubs ou services.

Charge indicative:

- `2 à 4 JH`

### 6.7. Fourchette globale reconstituée

Pour reproduire l'équivalent observé dans la version actuelle, la fourchette raisonnable est:

- installation seule: `3 à 5 JH`
- customisation métier + UX + notifications: `23 à 35 JH`
- conformité AGPL si nécessaire: `2 à 4 JH`

Soit un total reconstitué de:

- `26 à 40 JH` tout compris

Lecture commerciale recommandée:

- chiffrage "installation Cal.com": `3 à 5 JH`
- chiffrage "adaptation au besoin Thotis": `20 à 31 JH`
- réserve de recette / durcissement: `3 à 4 JH`

## 7. Ce qui semble hors besoin Thotis et ne doit pas polluer le devis

Le diff global entre les deux dossiers montre aussi des écarts annexes, par exemple:

- ajout d'un répertoire `companion/`
- nombreux écarts dans `packages/app-store`
- nombreux écarts dans `packages/platform`
- modifications CI / workflows / outillage développeur
- artefacts et configuration d'agents IA

Ces changements ne sont pas directement nécessaires pour "installer Cal.com et l'adapter au besoin Thotis".

Recommandation agence:

- les exclure du devis client sauf demande explicite;
- les traiter comme dérive de version, travaux internes ou chantiers parallèles;
- isoler clairement le périmètre métier Thotis pour éviter un budget artificiellement gonflé.

## 8. Inventaire détaillé des fichiers structurants

### Base de données

- `packages/prisma/thotis.prisma`
- `packages/prisma/migrations/20260204203907_add_thotis_student_mentoring_models/migration.sql`
- `packages/prisma/migrations/20260225120000_add_thotis_missing_indexes/migration.sql`
- `packages/prisma/migrations/20260311101500_add_missing_thotis_student_profile_columns/migration.sql`
- `packages/prisma/migrations/20260311120000_uuid_migration_thotis_tables/migration.sql`

### Services métier

- `packages/features/thotis/services/AnalyticsService.ts`
- `packages/features/thotis/services/MentorMatchingService.ts`
- `packages/features/thotis/services/ProfileService.ts`
- `packages/features/thotis/services/SessionRatingService.ts`
- `packages/features/thotis/services/StatisticsService.ts`
- `packages/features/thotis/services/ThotisAdminService.ts`
- `packages/features/thotis/services/ThotisAnalyticsService.ts`
- `packages/features/thotis/services/ThotisBookingService.ts`
- `packages/features/thotis/services/ThotisEmailService.ts`
- `packages/features/thotis/services/ThotisGuestService.ts`
- `packages/features/thotis/services/ThotisSessionOperationsService.ts`
- `packages/features/thotis/services/ThotisWebhookClient.ts`
- `packages/features/thotis/services/WebhookService.ts`

### Repositories métier

- `packages/features/thotis/repositories/AnalyticsRepository.ts`
- `packages/features/thotis/repositories/MentorQualityRepository.ts`
- `packages/features/thotis/repositories/ProfileRepository.ts`
- `packages/features/thotis/repositories/SessionRatingRepository.ts`

### Routeurs tRPC

- `packages/trpc/server/routers/thotis/_shared.ts`
- `packages/trpc/server/routers/thotis/admin.router.ts`
- `packages/trpc/server/routers/thotis/analytics.router.ts`
- `packages/trpc/server/routers/thotis/booking.router.ts`
- `packages/trpc/server/routers/thotis/guest.router.ts`
- `packages/trpc/server/routers/thotis/incident.router.ts`
- `packages/trpc/server/routers/thotis/intent.router.ts`
- `packages/trpc/server/routers/thotis/profile.router.ts`
- `packages/trpc/server/routers/thotis/rating.router.ts`
- `packages/trpc/server/routers/thotis/statistics.router.ts`

### REST Next.js

- `apps/web/app/api/thotis/_lib/cors.ts`
- `apps/web/app/api/thotis/_lib/services.ts`
- `apps/web/app/api/thotis/_lib/validate.ts`
- `apps/web/app/api/thotis/analytics/route.ts`
- `apps/web/app/api/thotis/availability/route.ts`
- `apps/web/app/api/thotis/bookings/route.ts`
- `apps/web/app/api/thotis/bookings/cancel/route.ts`
- `apps/web/app/api/thotis/bookings/reschedule/route.ts`
- `apps/web/app/api/thotis/guest/cancel/route.ts`
- `apps/web/app/api/thotis/guest/magic-link/route.ts`
- `apps/web/app/api/thotis/guest/post-session/route.ts`
- `apps/web/app/api/thotis/guest/rate/route.ts`
- `apps/web/app/api/thotis/guest/report/route.ts`
- `apps/web/app/api/thotis/guest/sessions/route.ts`
- `apps/web/app/api/thotis/intent/route.ts`
- `apps/web/app/api/thotis/mentors/route.ts`
- `apps/web/app/api/thotis/mentors/[username]/route.ts`
- `apps/web/app/api/thotis/mentors/recommended/route.ts`
- `apps/web/app/api/thotis/mentors/top/route.ts`
- `apps/web/app/api/thotis/ratings/route.ts`
- `apps/web/app/api/thotis/sessions/route.ts`
- `apps/web/app/api/thotis/universities/route.ts`

### API v2

- `apps/api/v2/src/modules/students/students.controller.ts`
- `apps/api/v2/src/modules/students/students.module.ts`
- `apps/api/v2/src/modules/bookings/controllers/bookings.controller.ts`
- `apps/api/v2/src/modules/bookings/services/bookings.service.ts`
- `packages/platform/libraries/index.ts`

### Pages frontend

- `apps/web/app/thotis/page.tsx`
- `apps/web/app/thotis/mentors/page.tsx`
- `apps/web/app/thotis/mentor/signup/page.tsx`
- `apps/web/app/thotis/mentor/settings/page.tsx`
- `apps/web/app/thotis/mentor/settings/MentorSettingsClient.tsx`
- `apps/web/app/thotis/mentor/[username]/page.tsx`
- `apps/web/app/thotis/dashboard/page.tsx`
- `apps/web/app/thotis/mentor-dashboard/page.tsx`
- `apps/web/app/thotis/mentor-dashboard/MentorDashboardClient.tsx`
- `apps/web/app/thotis/my-sessions/page.tsx`
- `apps/web/app/thotis/rate/[uid]/page.tsx`
- `apps/web/app/thotis/admin/page.tsx`
- `apps/web/app/thotis/admin/ambassadors/page.tsx`
- `apps/web/app/thotis/admin/incidents/page.tsx`

### Composants frontend métier

- `apps/web/modules/thotis/components/BookingWidget.tsx`
- `apps/web/modules/thotis/components/BookingDetailDialog.tsx`
- `apps/web/modules/thotis/components/MentorDashboard.tsx`
- `apps/web/modules/thotis/components/MentorOnboarding.tsx`
- `apps/web/modules/thotis/components/MentorScheduleModal.tsx`
- `apps/web/modules/thotis/components/MentorSearchFilters.tsx`
- `apps/web/modules/thotis/components/StudentDashboard.tsx`
- `apps/web/modules/thotis/components/StudentOnboarding.tsx`
- `apps/web/modules/thotis/components/StudentSettings.tsx`
- `apps/web/modules/thotis/components/SessionManagementUI.tsx`
- `apps/web/modules/thotis/components/PostSessionForm.tsx`
- `apps/web/modules/thotis/components/SessionSummaryView.tsx`
- `apps/web/modules/thotis/components/GuestMagicLinkForm.tsx`
- `apps/web/modules/thotis/components/RatingForm.tsx`
- `apps/web/modules/thotis/components/AdminDashboard.tsx`
- `apps/web/modules/thotis/components/AdminBookingList.tsx`
- `apps/web/modules/thotis/components/AmbassadorManagement.tsx`
- `apps/web/modules/thotis/components/IncidentsPageClient.tsx`
- `apps/web/modules/thotis/components/EditMentorProfileModal.tsx`
- `apps/web/modules/thotis/components/ThotisDashboardRouter.tsx`
- `apps/web/modules/thotis/lib/displayLabels.ts`

### Emails et tâches planifiées

- `packages/emails/templates/thotis/booking-confirmation.ts`
- `packages/emails/templates/thotis/booking-reminder.ts`
- `packages/emails/templates/thotis/booking-cancellation.ts`
- `packages/emails/templates/thotis/booking-rescheduled.ts`
- `packages/emails/templates/thotis/feedback-request.ts`
- `packages/emails/templates/thotis/magic-link.ts`
- `packages/emails/templates/thotis/mentor-nudge.ts`
- `packages/emails/src/templates/thotis/*`
- `apps/web/app/api/cron/thotis-reminders/route.ts`
- `apps/web/app/api/cron/thotis-feedback/route.ts`
- `apps/web/app/api/cron/thotis-lifecycle/route.ts`
- `apps/web/app/api/cron/thotis-calendar-sync/route.ts`

### Déploiement, conformité et documentation

- `.env.example`
- `Dockerfile`
- `Dockerfile.coolify`
- `docker-compose.yml`
- `README.md`
- `CALCOM_ETUDE_IMPLEMENTATION_THOTIS.md`
- `THOTIS_DEPLOYMENT.md`
- `THOTIS_FRONTEND_SUMMARY.md`
- `README_THOTIS.md`
- `THOTIS_PROJET_02_CALENDRIER_ETUDIANTS.md`
- `AUDIT_FINAL_LICENCE_COMMERCIALE.md`
- `VERIFICATION_COMPLETE.md`
- `VERIFICATION_FONCTIONNELLE_POST_SUPPRESSION.md`
- `RESUME_VERIFICATION_FINALE.md`

## 9. Conclusion

Par rapport au projet original, la version actuelle correspond à une customisation profonde de Cal.com, pas à une simple configuration.

Les modifications observées relèvent de trois blocs distincts:

- installation et packaging self-hosted;
- développement métier complet pour le mentorat étudiant Thotis;
- conformité AGPL et nettoyage de la couche "commercial license".

Pour un chiffrage agence, la bonne lecture n'est donc pas "quelques ajustements sur Cal.com", mais:

- un socle d'installation technique;
- un produit métier spécifique construit sur Cal.com;
- une couche de recette, conformité et durcissement.

La fourchette réaliste reconstituée à partir du dépôt est de `26 à 40 JH` pour reproduire l'équivalent observé, dont `3 à 5 JH` pour l'installation et `20 à 31 JH` pour l'adaptation fonctionnelle Thotis.
