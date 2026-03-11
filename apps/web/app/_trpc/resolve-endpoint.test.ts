import { describe, expect, it } from "vitest";
import { getEndpointPath } from "./resolve-endpoint";

describe("getEndpointPath", () => {
  it("routes root thotis procedures to the thotis endpoint", () => {
    expect(getEndpointPath("thotis.profile.search")).toEqual({
      endpoint: "thotis",
      path: "profile.search",
    });

    expect(getEndpointPath("thotis.intent.getRecommended")).toEqual({
      endpoint: "thotis",
      path: "intent.getRecommended",
    });
  });

  it("keeps nested viewer procedures on their existing endpoint mapping", () => {
    expect(getEndpointPath("viewer.public.i18n.get")).toEqual({
      endpoint: "public",
      path: "i18n.get",
    });
  });

  it("keeps two-segment procedures on their direct endpoint", () => {
    expect(getEndpointPath("viewer.me")).toEqual({
      endpoint: "viewer",
      path: "me",
    });
  });
});
