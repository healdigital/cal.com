"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import { Dialog, DialogContent } from "@calcom/ui/components/dialog";
import { Download, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThotisErrorState, ThotisLoadingState } from "./ThotisAsyncState";

interface SessionSummaryViewProps {
  bookingId: number;
  token?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionSummaryView({ bookingId, token, open, onOpenChange }: SessionSummaryViewProps) {
  const { t } = useLocale();
  const router = useRouter();

  // Conditional query: uses token endpoint if token exists, otherwise authenticated endpoint
  const guestQuery = trpc.thotis.guest.getPostSessionDataByToken.useQuery(
    { bookingId, token: token! },
    { enabled: open && !!token }
  );

  const authQuery = trpc.thotis.booking.getPostSessionData.useQuery(
    { bookingId },
    { enabled: open && !token }
  );

  const { data, error, isPending, refetch } = token ? guestQuery : authQuery;

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl"
        title={t("thotis_session_summary_title", "Résumé de la session")}
        description={t(
          "thotis_session_summary_desc",
          "Récapitulatif et ressources fournis par votre mentor."
        )}>
        {isPending ? (
          <ThotisLoadingState className="p-8" />
        ) : error ? (
          <ThotisErrorState className="px-4 py-8" message={error.message} onAction={() => void refetch()} />
        ) : !data || !data.summary ? (
          <div className="py-8 text-center text-gray-500">
            {t("thotis_no_summary_yet", "No summary available yet.")}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{t("thotis_key_takeaways", "Points clés")}</h3>
              <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-gray-700 text-sm">
                {data.summary.content}
              </div>
            </div>

            {/* Action Plan */}
            {data.summary.nextSteps && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">{t("thotis_next_steps", "Plan d'action")}</h3>
                <div className="whitespace-pre-wrap rounded-md border border-blue-100 bg-blue-50 p-4 text-blue-900 text-sm">
                  {data.summary.nextSteps}
                </div>
              </div>
            )}

            {/* Resources */}
            {data.resources && data.resources.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  {t("thotis_resources", "Ressources recommandées")}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.resources.map(
                    (resource: { id: string | number; url: string; type: string; title: string }) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                        <div className="rounded-md bg-gray-100 p-2 transition-colors group-hover:bg-white">
                          {resource.type === "LINK" ? (
                            <ExternalLink className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Download className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 text-sm">{resource.title}</p>
                          <p className="truncate text-gray-500 text-xs">{resource.url}</p>
                        </div>
                      </a>
                    )
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex justify-end border-t pt-6">
              <Button color="primary" onClick={() => router.push("/thotis")}>
                {t("thotis_ask_new_question", "Poser une nouvelle question")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
