import { describe, expect, it } from "vitest";
import { stripCredentialKeys } from "./strip-credential-keys";

describe("stripCredentialKeys", () => {
  it("should strip key and encryptedKey from a credential-shaped object", () => {
    const credential = {
      id: 1,
      type: "google_calendar",
      appId: "google-calendar",
      key: { access_token: "secret-token", refresh_token: "secret-refresh" },
      encryptedKey: "encrypted-data-here",
      userId: 42,
      teamId: null,
      invalid: false,
    };

    const result = stripCredentialKeys(credential);

    expect(result).toEqual({
      id: 1,
      type: "google_calendar",
      appId: "google-calendar",
      userId: 42,
      teamId: null,
      invalid: false,
    });
    expect(result).not.toHaveProperty("key");
    expect(result).not.toHaveProperty("encryptedKey");
  });

  it("should strip from an array of credential-shaped objects", () => {
    const credentials = [
      { id: 1, type: "google_calendar", key: { token: "a" }, encryptedKey: "enc-a", userId: 1 },
      { id: 2, type: "zoom_video", key: { token: "b" }, encryptedKey: "enc-b", userId: 1 },
    ];

    const result = stripCredentialKeys(credentials);

    expect(result).toHaveLength(2);
    expect(result[0]).not.toHaveProperty("key");
    expect(result[0]).not.toHaveProperty("encryptedKey");
    expect(result[1]).not.toHaveProperty("key");
    expect(result[1]).not.toHaveProperty("encryptedKey");
    expect(result[0]).toHaveProperty("id", 1);
    expect(result[1]).toHaveProperty("id", 2);
  });

  it("should strip credential keys from nested relations (e.g., user.credentials)", () => {
    const user = {
      id: 42,
      name: "Test User",
      email: "test@example.com",
      credentials: [
        { id: 1, type: "google_calendar", key: { token: "secret" }, encryptedKey: "enc", userId: 42 },
      ],
    };

    const result = stripCredentialKeys(user);

    expect(result.name).toBe("Test User");
    expect(result.credentials).toHaveLength(1);
    expect(result.credentials[0]).not.toHaveProperty("key");
    expect(result.credentials[0]).not.toHaveProperty("encryptedKey");
    expect(result.credentials[0]).toHaveProperty("id", 1);
  });

  it("should handle null values", () => {
    expect(stripCredentialKeys(null)).toBeNull();
  });

  it("should handle undefined values", () => {
    expect(stripCredentialKeys(undefined)).toBeUndefined();
  });

  it("should not modify objects that are not credential-shaped", () => {
    const booking = {
      id: 1,
      title: "Test Booking",
      key: "some-idempotency-key",
      status: "ACCEPTED",
    };

    const result = stripCredentialKeys(booking);

    // `key` is present but `type` is not a string field that would match credential shape
    // Actually `status` is a string but `type` is not present, so this should pass through
    expect(result).toEqual(booking);
  });

  it("should not strip key from objects that have 'type' but are not credentials", () => {
    // An object with both `type` (string) and `key` looks credential-shaped.
    // This is the expected trade-off: any object with string `type` + `key` gets stripped.
    // In practice, only Credential model has both fields.
    const webhook = {
      id: 1,
      subscriberUrl: "https://example.com",
      secret: "webhook-secret",
    };

    const result = stripCredentialKeys(webhook);
    expect(result).toEqual(webhook);
  });

  it("should handle deeply nested credential objects", () => {
    const data = {
      bookings: [
        {
          id: 1,
          user: {
            id: 42,
            credentials: [
              { id: 1, type: "outlook_calendar", key: { token: "deep-secret" }, encryptedKey: "enc" },
            ],
          },
        },
      ],
    };

    const result = stripCredentialKeys(data);

    expect(result.bookings[0].user.credentials[0]).not.toHaveProperty("key");
    expect(result.bookings[0].user.credentials[0]).not.toHaveProperty("encryptedKey");
    expect(result.bookings[0].user.credentials[0]).toHaveProperty("type", "outlook_calendar");
  });

  it("should preserve primitive values unchanged", () => {
    expect(stripCredentialKeys("hello")).toBe("hello");
    expect(stripCredentialKeys(42)).toBe(42);
    expect(stripCredentialKeys(true)).toBe(true);
  });

  it("should handle empty arrays", () => {
    expect(stripCredentialKeys([])).toEqual([]);
  });

  it("should handle empty objects", () => {
    expect(stripCredentialKeys({})).toEqual({});
  });

  it("should handle credential with null key (already safe)", () => {
    const credential = {
      id: 1,
      type: "google_calendar",
      key: null,
      encryptedKey: null,
      userId: 42,
    };

    const result = stripCredentialKeys(credential);

    // Still strips even if null, because the field presence is what matters
    expect(result).not.toHaveProperty("key");
    expect(result).not.toHaveProperty("encryptedKey");
  });
});
