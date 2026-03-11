import { Timezone as PlatformTimezoneSelect } from "@calcom/atoms/timezone";
import { useBookerStoreContext } from "@calcom/features/bookings/Booker/BookerStoreProvider";
import { fadeInUp } from "@calcom/features/bookings/Booker/config";
import { useBookerTime } from "@calcom/features/bookings/Booker/hooks/useBookerTime";
import type { Timezone } from "@calcom/features/bookings/Booker/types";
import { FromToTime } from "@calcom/features/bookings/Booker/utils/dates";
import { useTimePreferences } from "@calcom/features/bookings/lib";
import type { BookerEvent } from "@calcom/features/bookings/types";
import type { TimezoneSelectComponentProps } from "@calcom/features/timezone/components/TimezoneSelectComponent";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { markdownToSafeHTMLClient } from "@calcom/lib/markdownToSafeHTMLClient";
import { CURRENT_TIMEZONE } from "@calcom/lib/timezoneConstants";
import { BookingConstraints } from "@calcom/web/modules/bookings/components/event-meta/BookingConstraints";
import { EventMetaBlock } from "@calcom/web/modules/bookings/components/event-meta/Details";
import { SeatsAvailabilityText } from "@calcom/web/modules/bookings/components/SeatsAvailabilityText";
import { m } from "framer-motion";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import i18nConfigration from "../../../../../i18n.json";
import { EventDetails } from "./event-meta/Details";
import { EventMembers } from "./event-meta/Members";
import { EventMetaSkeleton } from "./event-meta/Skeleton";
import { EventTitle } from "./event-meta/Title";
import { ScrollableWithGradients } from "./ScrollableWithGradients";

type TimezoneSelectProps = Omit<
  TimezoneSelectComponentProps,
  "data" | "isPending" | "isWebTimezoneSelect"
> & {
  timeZones?: Timezone[];
};

const WebTimezoneSelect: ComponentType<TimezoneSelectProps> = dynamic(
  () => import("@calcom/web/modules/timezone/components/TimezoneSelect").then((mod) => mod.TimezoneSelect),
  {
    ssr: false,
  }
);

type EventTranslationField = "DESCRIPTION" | "TITLE";
type EventTranslation = NonNullable<BookerEvent["fieldTranslations"]>[number];

const getTranslatedField = (
  translations: Array<Pick<EventTranslation, "field" | "targetLocale" | "translatedText">>,
  field: EventTranslationField,
  userLocale: string
): string | undefined => {
  const i18nLocales = i18nConfigration.locale.targets.concat([i18nConfigration.locale.source]);

  return translations?.find(
    (trans) =>
      trans.field === field &&
      i18nLocales.includes(trans.targetLocale) &&
      (userLocale === trans.targetLocale || userLocale.split("-")[0] === trans.targetLocale)
  )?.translatedText;
};

export const EventMeta = ({
  event,
  isPending,
  isPlatform = true,
  isPrivateLink,
  classNames,
  locale,
  timeZones,
  children,
  selectedTimeslot,
  roundRobinHideOrgAndTeam,
  hideOrgTeamAvatar,
  hideEventTypeDetails = false,
}: {
  event?: Pick<
    BookerEvent,
    | "lockTimeZoneToggleOnBookingPage"
    | "lockedTimeZone"
    | "schedule"
    | "seatsPerTimeSlot"
    | "subsetOfUsers"
    | "length"
    | "schedulingType"
    | "profile"
    | "entity"
    | "description"
    | "title"
    | "metadata"
    | "locations"
    | "currency"
    | "requiresConfirmation"
    | "requiresBookerEmailVerification"
    | "recurringEvent"
    | "price"
    | "isDynamic"
    | "fieldTranslations"
    | "autoTranslateDescriptionEnabled"
    | "enablePerHostLocations"
    | "periodType"
    | "periodDays"
    | "periodEndDate"
    | "periodStartDate"
    | "periodCountCalendarDays"
    | "disableCancelling"
    | "disableRescheduling"
    | "minimumRescheduleNotice"
  > | null;
  isPending: boolean;
  isPrivateLink: boolean;
  isPlatform?: boolean;
  classNames?: {
    eventMetaContainer?: string;
    eventMetaTitle?: string;
    eventMetaTimezoneSelect?: string;
    eventMetaChildren?: string;
  };
  locale?: string | null;
  timeZones?: Timezone[];
  children?: React.ReactNode;
  selectedTimeslot: string | null;
  roundRobinHideOrgAndTeam?: boolean;
  hideOrgTeamAvatar?: boolean;
  hideEventTypeDetails?: boolean;
}): JSX.Element | null => {
  const { timeFormat, timezone } = useBookerTime();
  const [setTimezone] = useTimePreferences((state) => [state.setTimezone]);
  const [setBookerStoreTimezone] = useBookerStoreContext((state) => [state.setTimezone], shallow);
  const selectedDuration = useBookerStoreContext((state) => state.selectedDuration);
  const bookerState = useBookerStoreContext((state) => state.state);
  const bookingData = useBookerStoreContext((state) => state.bookingData);
  const rescheduleUid = useBookerStoreContext((state) => state.rescheduleUid);
  const seatedEventData = useBookerStoreContext((state) => state.seatedEventData);
  const { i18n, t } = useLocale();
  const [TimezoneSelect] = useMemo(() => {
    if (isPlatform) {
      return [PlatformTimezoneSelect];
    }

    return [WebTimezoneSelect];
  }, [isPlatform]);

  useEffect(() => {
    //In case the event has lockTimeZone enabled ,set the timezone to event's locked timezone
    if (event?.lockTimeZoneToggleOnBookingPage) {
      const timezone = event.lockedTimeZone || event.schedule?.timeZone;
      if (timezone) {
        setTimezone(timezone);
      }
    }
  }, [event, setTimezone]);

  if (hideEventTypeDetails) {
    return null;
  }
  // If we didn't pick a time slot yet, we load bookingData via SSR so bookingData should be set
  // Otherwise we load seatedEventData from useBookerStore
  const bookingSeatAttendeesQty = seatedEventData?.attendees || bookingData?.attendees.length;
  const eventTotalSeats = seatedEventData?.seatsPerTimeSlot || event?.seatsPerTimeSlot;

  const isHalfFull =
    bookingSeatAttendeesQty && eventTotalSeats && bookingSeatAttendeesQty / eventTotalSeats >= 0.5;
  const isNearlyFull =
    bookingSeatAttendeesQty && eventTotalSeats && bookingSeatAttendeesQty / eventTotalSeats >= 0.83;

  let colorClass = "text-bookinghighlight";

  if (isNearlyFull) {
    colorClass = "text-rose-600";
  } else if (isHalfFull) {
    colorClass = "text-yellow-500";
  }
  const userLocale = locale ?? navigator.language;
  const translatedDescription = getTranslatedField(event?.fieldTranslations ?? [], "DESCRIPTION", userLocale);
  const translatedTitle = getTranslatedField(event?.fieldTranslations ?? [], "TITLE", userLocale);
  let displayedTimezone = timezone || CURRENT_TIMEZONE;

  if (event?.lockTimeZoneToggleOnBookingPage && (event.lockedTimeZone || event.schedule?.timeZone)) {
    displayedTimezone = event.lockedTimeZone || event.schedule?.timeZone || CURRENT_TIMEZONE;
  }

  let timezoneSelectValue = timezone;

  if (event?.lockTimeZoneToggleOnBookingPage) {
    timezoneSelectValue = event.lockedTimeZone || event.schedule?.timeZone || CURRENT_TIMEZONE;
  }

  let timezoneSelectStateClassName = "";

  if (event?.lockTimeZoneToggleOnBookingPage) {
    timezoneSelectStateClassName = "cursor-not-allowed";
  }

  const timezoneSelectClassNames: TimezoneSelectProps["classNames"] = {
    control: (): string => "min-h-0! p-0 w-full border-0 bg-transparent focus-within:ring-0 shadow-none!",
    menu: (): string => "w-64! max-w-[90vw] mb-1 ",
    singleValue: (): string => "text-text py-1",
    indicatorsContainer: (): string => "ml-auto",
    container: (): string => "max-w-full",
  };

  const handleTimezoneChange = ({ value }: { value: string }): void => {
    setTimezone(value);
    setBookerStoreTimezone(value);
  };

  let timezoneControl: JSX.Element;

  if (bookerState === "booking") {
    timezoneControl = (
      <p data-testid="event-meta-current-timezone">
        {t("times_shown_in_timezone", { timezone: displayedTimezone })}
      </p>
    );
  } else {
    timezoneControl = (
      <span
        className={`current-timezone -mt-[2px] flex h-6 min-w-32 max-w-full items-center justify-start before:absolute before:inset-0 before:top-[-3px] before:bottom-[-3px] before:left-[-30px] before:w-[calc(100%+35px)] before:rounded-md before:bg-subtle before:py-3 before:opacity-0 before:transition-opacity ${timezoneSelectStateClassName}`}
        data-testid="event-meta-current-timezone">
        <TimezoneSelect
          timeZones={timeZones}
          menuPosition="absolute"
          timezoneSelectCustomClassname={classNames?.eventMetaTimezoneSelect}
          classNames={timezoneSelectClassNames}
          value={timezoneSelectValue}
          onChange={handleTimezoneChange}
          isDisabled={event?.lockTimeZoneToggleOnBookingPage ?? false}
        />
      </span>
    );
  }

  let seatsAvailabilityBlock: JSX.Element | null = null;

  if (bookerState === "booking" && eventTotalSeats && bookingSeatAttendeesQty) {
    seatsAvailabilityBlock = (
      <EventMetaBlock icon="user" className={`${colorClass}`}>
        <div className="flex items-start text-bookinghighlight text-sm">
          <p>
            <SeatsAvailabilityText
              showExact={!!seatedEventData.showAvailableSeatsCount}
              totalSeats={eventTotalSeats}
              bookedSeats={bookingSeatAttendeesQty || 0}
              variant="fraction"
            />
          </p>
        </div>
      </EventMetaBlock>
    );
  }

  return (
    <div className={`${classNames?.eventMetaContainer || ""} relative z-10 p-6`} data-testid="event-meta">
      {isPending && (
        <m.div {...fadeInUp} initial="visible" layout>
          <EventMetaSkeleton />
        </m.div>
      )}
      {!isPending && !!event && (
        <m.div {...fadeInUp} layout transition={{ ...fadeInUp.transition, delay: 0.3 }}>
          <EventMembers
            schedulingType={event.schedulingType}
            users={event.subsetOfUsers}
            profile={event.profile}
            entity={event.entity}
            isPrivateLink={isPrivateLink}
            roundRobinHideOrgAndTeam={roundRobinHideOrgAndTeam}
            hideOrgTeamAvatar={hideOrgTeamAvatar}
          />
          <EventTitle className={`${classNames?.eventMetaTitle} my-2`}>
            {translatedTitle ?? event?.title}
          </EventTitle>
          {(event.description || translatedDescription) && (
            <EventMetaBlock data-testid="event-meta-description" contentClassName="mb-8">
              <ScrollableWithGradients
                className="wrap-break-word scroll-bar max-h-[180px] max-w-full overflow-y-auto pr-4"
                ariaLabel={t("description")}>
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized via markdownToSafeHTMLClient
                  dangerouslySetInnerHTML={{
                    __html: markdownToSafeHTMLClient(translatedDescription ?? event.description),
                  }}
                />
              </ScrollableWithGradients>
            </EventMetaBlock>
          )}
          <div className="stack-y-4 font-medium rtl:-mr-2">
            {rescheduleUid && bookingData && (
              <EventMetaBlock icon="calendar">
                {t("former_time")}
                <br />
                <span className="line-through" data-testid="former_time_p">
                  <FromToTime
                    date={bookingData.startTime.toString()}
                    duration={null}
                    timeFormat={timeFormat}
                    timeZone={timezone}
                    language={i18n.language}
                  />
                </span>
              </EventMetaBlock>
            )}
            {selectedTimeslot && (
              <EventMetaBlock icon="calendar">
                <FromToTime
                  date={selectedTimeslot}
                  duration={selectedDuration || event.length}
                  timeFormat={timeFormat}
                  timeZone={timezone}
                  language={i18n.language}
                />
              </EventMetaBlock>
            )}
            <EventDetails event={event} />
            <EventMetaBlock
              className="cursor-pointer [&_.current-timezone:before]:focus-within:opacity-100 [&_.current-timezone:before]:hover:opacity-100"
              contentClassName="relative max-w-[90%] space-y-1"
              icon="globe">
              <p className="font-medium text-subtle text-xs uppercase tracking-[0.08em]">{t("timezone")}</p>
              {timezoneControl}
              {bookerState !== "booking" && (
                <p className="text-subtle text-xs" data-testid="event-meta-timezone-summary">
                  {t("times_shown_in_timezone", {
                    timezone: displayedTimezone,
                  })}
                </p>
              )}
              {event.lockTimeZoneToggleOnBookingPage && (
                <p className="text-subtle text-xs">{t("timezone_locked_for_booking")}</p>
              )}
            </EventMetaBlock>
            <BookingConstraints event={event} />
            {seatsAvailabilityBlock}
          </div>
          {children && <div className={classNames?.eventMetaChildren}>{children}</div>}
        </m.div>
      )}
    </div>
  );
};
