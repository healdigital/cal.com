"use client";

import type React from "react";
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

const defaultContext: AppContext = {
  getAppData: () => ({}),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAppData: () => ({}),
};

// Use try/catch to safely create the React context.
// During Turbopack's "Collecting page data" build phase, this module may be evaluated
// in a server context where React.createContext is not available, causing a build failure.
// The try/catch ensures the module can be evaluated without throwing.
let EventTypeAppContext: React.Context<AppContext>;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactImpl: typeof React = require("react");
  if (typeof ReactImpl.createContext !== "function") {
    throw new Error("React.createContext not available");
  }
  EventTypeAppContext = ReactImpl.createContext<AppContext>(defaultContext);
} catch {
  // Server-side fallback: provide a stub context that won't be used at runtime
  EventTypeAppContext = {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Consumer: null,
    displayName: "EventTypeAppContext",
  } as unknown as React.Context<AppContext>;
}

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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactImpl = require("react");
  // TODO: Not able to do it without type assertion here
  const context = ReactImpl.useContext(EventTypeAppContext) as {
    getAppData: GetAppData;
    setAppData: SetAppData;
    LockedIcon: LockedIcon;
    disabled: Disabled;
  };
  return context;
};
export default EventTypeAppContext;
