"use client";

import React from "react";
import type { ZodType, z } from "zod";

export type GetAppData = (key: string) => unknown;
export type SetAppData = (key: string, value: unknown) => void;
type LockedIcon = JSX.Element | false | undefined;
type Disabled = boolean | undefined;

type AppContext = {
  getAppData: GetAppData;
  setAppData: SetAppData;
  LockedIcon?: LockedIcon;
  disabled?: Disabled;
};

// Guard against server-side evaluation where React.createContext may not exist
// (Turbopack can evaluate this module server-side during build page data collection)
const defaultContext: AppContext = {
  getAppData: () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAppData: () => ({}),
};

const EventTypeAppContext =
  typeof React.createContext === "function"
    ? React.createContext<AppContext>(defaultContext)
    : (({ Provider: ({ children }: { children: React.ReactNode }) => children, Consumer: null } as unknown) as React.Context<AppContext>);

type SetAppDataGeneric<TAppData extends ZodType> = <
  TKey extends keyof z.infer<TAppData>,
  TValue extends z.infer<TAppData>[TKey],
>(
  key: TKey,
  value: TValue
) => void;

type GetAppDataGeneric<TAppData extends ZodType> = <TKey extends keyof z.infer<TAppData>>(
  key: TKey
) => z.infer<TAppData>[TKey];

export const useAppContextWithSchema = <TAppData extends ZodType>() => {
  type GetAppData = GetAppDataGeneric<TAppData>;
  type SetAppData = SetAppDataGeneric<TAppData>;
  // TODO: Not able to do it without type assertion here
  const context = React.useContext(EventTypeAppContext) as {
    getAppData: GetAppData;
    setAppData: SetAppData;
    LockedIcon: LockedIcon;
    disabled: Disabled;
  };
  return context;
};
export default EventTypeAppContext;
