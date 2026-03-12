# Cal.com - Index des Wireframes

## Vue d'ensemble

Ce dossier contient l'ensemble des wireframes de l'application Cal.com, organisés par domaine fonctionnel.

---

## 1. Authentification (`01-auth/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 1.1 | Login | `/auth/login` | [login.md](01-auth/login.md) |
| 1.2 | Sign In | `/auth/signin` | [signin.md](01-auth/signin.md) |
| 1.3 | Signup | `/signup` | [signup.md](01-auth/signup.md) |
| 1.4 | Forgot Password | `/auth/forgot-password` | [forgot-password.md](01-auth/forgot-password.md) |
| 1.5 | Reset Password | `/auth/forgot-password/[id]` | [reset-password.md](01-auth/reset-password.md) |
| 1.6 | Verify Email | `/auth/verify-email` | [verify-email.md](01-auth/verify-email.md) |
| 1.7 | Verify Email Change | `/auth/verify-email-change` | [verify-email-change.md](01-auth/verify-email-change.md) |
| 1.8 | SSO Login | `/auth/sso/[provider]` | [sso.md](01-auth/sso.md) |
| 1.9 | OAuth Authorize | `/auth/oauth2/authorize` | [oauth-authorize.md](01-auth/oauth-authorize.md) |
| 1.10 | Logout | `/auth/logout` | [logout.md](01-auth/logout.md) |
| 1.11 | Auth Error | `/auth/error` | [error.md](01-auth/error.md) |

## 2. Onboarding (`02-onboarding/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 2.1 | Getting Started | `/getting-started/[[...step]]` | [getting-started.md](02-onboarding/getting-started.md) |
| 2.2 | Profile Setup | `/onboarding/personal/profile` | [profile-setup.md](02-onboarding/profile-setup.md) |
| 2.3 | Calendar Connection | `/onboarding/personal/calendar` | [calendar-connect.md](02-onboarding/calendar-connect.md) |
| 2.4 | Personal Settings | `/onboarding/personal/settings` | [personal-settings.md](02-onboarding/personal-settings.md) |
| 2.5 | Team Details | `/onboarding/teams/details` | [team-details.md](02-onboarding/team-details.md) |
| 2.6 | Team Invite | `/onboarding/teams/invite` | [team-invite.md](02-onboarding/team-invite.md) |
| 2.7 | Auth Setup | `/auth/setup` | [auth-setup.md](02-onboarding/auth-setup.md) |

## 3. Pages Publiques de Reservation (`03-booking-public/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 3.1 | Profil Utilisateur Public | `/[user]` | [user-profile.md](03-booking-public/user-profile.md) |
| 3.2 | Page de Reservation | `/[user]/[type]` | [booking-page.md](03-booking-public/booking-page.md) |
| 3.3 | Profil Equipe | `/team/[slug]` | [team-profile.md](03-booking-public/team-profile.md) |
| 3.4 | Reservation Equipe | `/team/[slug]/[type]` | [team-booking.md](03-booking-public/team-booking.md) |
| 3.5 | Profil Organisation | `/org/[orgSlug]` | [org-profile.md](03-booking-public/org-profile.md) |
| 3.6 | Confirmation Reservation | `/booking/[uid]` | [booking-confirmation.md](03-booking-public/booking-confirmation.md) |
| 3.7 | Reservation Reussie | `/booking-successful/[uid]` | [booking-success.md](03-booking-public/booking-success.md) |
| 3.8 | Replanification | `/reschedule/[uid]` | [reschedule.md](03-booking-public/reschedule.md) |
| 3.9 | Lien Dynamique | `/d/[link]/[slug]` | [dynamic-link.md](03-booking-public/dynamic-link.md) |
| 3.10 | Feedback | `/feedback/[uid]` | [feedback.md](03-booking-public/feedback.md) |

## 4. Gestion des Reservations (`04-bookings-management/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 4.1 | Liste des Reservations | `/bookings/[status]` | [bookings-list.md](04-bookings-management/bookings-list.md) |
| 4.2 | Logs Reservation | `/booking/[uid]/logs` | [booking-logs.md](04-bookings-management/booking-logs.md) |

## 5. Types d'Evenements (`05-event-types/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 5.1 | Liste des Event Types | `/event-types` | [event-types-list.md](05-event-types/event-types-list.md) |
| 5.2 | Configuration Event Type | `/event-types/[type]` | [event-type-edit.md](05-event-types/event-type-edit.md) |

## 6. Disponibilite (`06-availability/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 6.1 | Vue Disponibilite | `/availability` | [availability.md](06-availability/availability.md) |
| 6.2 | Edition Planning | `/availability/[schedule]` | [schedule-edit.md](06-availability/schedule-edit.md) |
| 6.3 | Troubleshoot | `/availability/troubleshoot` | [troubleshoot.md](06-availability/troubleshoot.md) |

## 7. Equipes (`07-teams/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 7.1 | Liste Equipes | `/teams` | [teams-list.md](07-teams/teams-list.md) |
| 7.2 | Membres | `/members` | [members.md](07-teams/members.md) |

## 8. Apps & Integrations (`08-apps-integrations/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 8.1 | App Store | `/apps` | [app-store.md](08-apps-integrations/app-store.md) |
| 8.2 | Detail App | `/apps/[slug]` | [app-detail.md](08-apps-integrations/app-detail.md) |
| 8.3 | Setup App | `/apps/[slug]/setup` | [app-setup.md](08-apps-integrations/app-setup.md) |
| 8.4 | Categories | `/apps/categories` | [categories.md](08-apps-integrations/categories.md) |
| 8.5 | Apps par Categorie | `/apps/categories/[category]` | [category-apps.md](08-apps-integrations/category-apps.md) |
| 8.6 | Apps Installees | `/apps/installed/[category]` | [installed-apps.md](08-apps-integrations/installed-apps.md) |
| 8.7 | Installation Wizard | `/apps/installation/[[...step]]` | [installation-wizard.md](08-apps-integrations/installation-wizard.md) |
| 8.8 | Routing Forms | `/apps/routing-forms/forms` | [routing-forms.md](08-apps-integrations/routing-forms.md) |

## 9. Workflows (`09-workflows/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 9.1 | Liste Workflows | `/workflows` | [workflows-list.md](09-workflows/workflows-list.md) |
| 9.2 | Detail Workflow | `/workflows/[workflow]` | [workflow-detail.md](09-workflows/workflow-detail.md) |
| 9.3 | Nouveau Workflow | `/workflow/new` | [workflow-new.md](09-workflows/workflow-new.md) |

## 10. Insights & Analytics (`10-insights/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 10.1 | Dashboard Insights | `/insights` | [insights-dashboard.md](10-insights/insights-dashboard.md) |
| 10.2 | Routing Analytics | `/insights/routing` | [routing-analytics.md](10-insights/routing-analytics.md) |
| 10.3 | Historique Appels | `/insights/call-history` | [call-history.md](10-insights/call-history.md) |
| 10.4 | Router Position | `/insights/router-position` | [router-position.md](10-insights/router-position.md) |

## 11. Parametres Compte (`11-settings-account/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 11.1 | General | `/settings/my-account/general` | [general.md](11-settings-account/general.md) |
| 11.2 | Profil | `/settings/my-account/profile` | [profile.md](11-settings-account/profile.md) |
| 11.3 | Apparence | `/settings/my-account/appearance` | [appearance.md](11-settings-account/appearance.md) |
| 11.4 | Calendriers | `/settings/my-account/calendars` | [calendars.md](11-settings-account/calendars.md) |
| 11.5 | Conferencing | `/settings/my-account/conferencing` | [conferencing.md](11-settings-account/conferencing.md) |
| 11.6 | Features | `/settings/my-account/features` | [features.md](11-settings-account/features.md) |
| 11.7 | Out of Office | `/settings/my-account/out-of-office` | [out-of-office.md](11-settings-account/out-of-office.md) |
| 11.8 | Notifications Push | `/settings/my-account/push-notifications` | [push-notifications.md](11-settings-account/push-notifications.md) |

## 12. Parametres Securite (`12-settings-security/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 12.1 | Mot de Passe | `/settings/security/password` | [password.md](12-settings-security/password.md) |
| 12.2 | 2FA | `/settings/security/two-factor-auth` | [two-factor.md](12-settings-security/two-factor.md) |
| 12.3 | SSO Config | `/settings/security/sso` | [sso-config.md](12-settings-security/sso-config.md) |
| 12.4 | Compliance | `/settings/security/compliance` | [compliance.md](12-settings-security/compliance.md) |
| 12.5 | Impersonation | `/settings/security/impersonation` | [impersonation.md](12-settings-security/impersonation.md) |

## 13. Parametres Developpeur (`13-settings-developer/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 13.1 | Cles API | `/settings/developer/api-keys` | [api-keys.md](13-settings-developer/api-keys.md) |
| 13.2 | OAuth Apps | `/settings/developer/oauth` | [oauth-apps.md](13-settings-developer/oauth-apps.md) |
| 13.3 | Webhooks | `/settings/developer/webhooks` | [webhooks.md](13-settings-developer/webhooks.md) |
| 13.4 | Nouveau Webhook | `/settings/developer/webhooks/new` | [webhook-new.md](13-settings-developer/webhook-new.md) |

## 14. Parametres Equipe (`14-settings-team/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 14.1 | General Equipe | `/settings/teams/[id]/settings` | [team-settings.md](14-settings-team/team-settings.md) |
| 14.2 | Profil Equipe | `/settings/teams/[id]/profile` | [team-profile.md](14-settings-team/team-profile.md) |
| 14.3 | Apparence Equipe | `/settings/teams/[id]/appearance` | [team-appearance.md](14-settings-team/team-appearance.md) |
| 14.4 | Membres Equipe | `/settings/teams/[id]/members` | [team-members.md](14-settings-team/team-members.md) |
| 14.5 | Roles | `/settings/teams/[id]/roles` | [team-roles.md](14-settings-team/team-roles.md) |
| 14.6 | Features Equipe | `/settings/teams/[id]/features` | [team-features.md](14-settings-team/team-features.md) |
| 14.7 | Facturation | `/settings/teams/[id]/billing` | [team-billing.md](14-settings-team/team-billing.md) |

## 15. Administration (`15-admin/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 15.1 | Dashboard Admin | `/settings/admin` | [admin-dashboard.md](15-admin/admin-dashboard.md) |
| 15.2 | Gestion Users | `/settings/admin/users` | [users.md](15-admin/users.md) |
| 15.3 | Ajout User | `/settings/admin/users/add` | [user-add.md](15-admin/user-add.md) |
| 15.4 | Edition User | `/settings/admin/users/[id]/edit` | [user-edit.md](15-admin/user-edit.md) |
| 15.5 | Admin Apps | `/settings/admin/apps/[category]` | [admin-apps.md](15-admin/admin-apps.md) |
| 15.6 | Blocklist | `/settings/admin/blocklist` | [blocklist.md](15-admin/blocklist.md) |
| 15.7 | Feature Flags | `/settings/admin/flags` | [feature-flags.md](15-admin/feature-flags.md) |
| 15.8 | Impersonation | `/settings/admin/impersonation` | [admin-impersonation.md](15-admin/admin-impersonation.md) |
| 15.9 | OAuth Admin | `/settings/admin/oauth` | [admin-oauth.md](15-admin/admin-oauth.md) |
| 15.10 | Locked SMS | `/settings/admin/lockedSMS` | [locked-sms.md](15-admin/locked-sms.md) |

## 16. Video (`16-video/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 16.1 | Rejoindre Meeting | `/video/[uid]` | [join-meeting.md](16-video/join-meeting.md) |
| 16.2 | Meeting Non Trouve | `/video/no-meeting-found` | [no-meeting.md](16-video/no-meeting.md) |
| 16.3 | Meeting Pas Commence | `/video/meeting-not-started/[uid]` | [meeting-waiting.md](16-video/meeting-waiting.md) |
| 16.4 | Meeting Termine | `/video/meeting-ended/[uid]` | [meeting-ended.md](16-video/meeting-ended.md) |

## 17. Paiement (`17-payment/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 17.1 | Page Paiement | `/payment/[uid]` | [payment.md](17-payment/payment.md) |

## 18. Divers (`18-misc/`)
| # | Ecran | Route | Fichier |
|---|-------|-------|---------|
| 18.1 | Maintenance | `/maintenance` | [maintenance.md](18-misc/maintenance.md) |
| 18.2 | Connect & Join | `/connect-and-join` | [connect-join.md](18-misc/connect-join.md) |
| 18.3 | More Menu | `/more` | [more.md](18-misc/more.md) |
| 18.4 | Referral | `/refer` | [referral.md](18-misc/referral.md) |

---

**Total : 90+ ecrans documentes**
