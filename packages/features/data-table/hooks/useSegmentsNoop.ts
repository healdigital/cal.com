import type { UseSegments } from "../lib/types";

const noop = () => {};

export const useSegmentsNoop: UseSegments = ({}) => {
  return {
    segments: [],
    preferredSegmentId: null,
    isSuccess: false,
    setPreference: noop,
    isSegmentEnabled: false,
  };
};
