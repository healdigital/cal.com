import { describe, expect, it } from "vitest";
import { sanitizeStringArray, sanitizeUserInput } from "./sanitizeUserInput";

describe("sanitizeUserInput", () => {
  it("should remove HTML tags", () => {
    const input = '<script>alert("xss")</script>Hello World';
    const result = sanitizeUserInput(input);
    expect(result).toBe('alert("xss")Hello World');
  });

  it("should handle null and undefined", () => {
    expect(sanitizeUserInput(null)).toBe("");
    expect(sanitizeUserInput(undefined)).toBe("");
  });

  it("should normalize line breaks", () => {
    const input = "Line 1\r\nLine 2\rLine 3\nLine 4";
    const result = sanitizeUserInput(input);
    expect(result).toBe("Line 1\nLine 2\nLine 3\nLine 4");
  });

  it("should remove excessive line breaks", () => {
    const input = "Line 1\n\n\n\n\nLine 2";
    const result = sanitizeUserInput(input);
    expect(result).toBe("Line 1\n\nLine 2");
  });

  it("should trim whitespace", () => {
    const input = "  Hello World  ";
    const result = sanitizeUserInput(input);
    expect(result).toBe("Hello World");
  });

  it("should truncate to maxLength", () => {
    const input = "This is a very long string that should be truncated";
    const result = sanitizeUserInput(input, 20);
    expect(result).toBe("This is a very long");
    expect(result.length).toBeLessThanOrEqual(20);
  });

  it("should handle empty strings", () => {
    expect(sanitizeUserInput("")).toBe("");
    expect(sanitizeUserInput("   ")).toBe("");
  });
});

describe("sanitizeStringArray", () => {
  it("should sanitize each item in array", () => {
    const input = ["<b>Item 1</b>", "Item 2", "<script>alert()</script>"];
    const result = sanitizeStringArray(input);
    expect(result).toEqual(["Item 1", "Item 2", "alert()"]);
  });

  it("should remove empty strings", () => {
    const input = ["Item 1", "", "  ", "Item 2"];
    const result = sanitizeStringArray(input);
    expect(result).toEqual(["Item 1", "Item 2"]);
  });

  it("should remove duplicates (case-insensitive)", () => {
    const input = ["Item 1", "item 1", "ITEM 1", "Item 2"];
    const result = sanitizeStringArray(input);
    // Map preserves the last occurrence when keys collide
    expect(result).toEqual(["ITEM 1", "Item 2"]);
  });

  it("should limit number of items", () => {
    const input = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
    const result = sanitizeStringArray(input, 3);
    expect(result).toHaveLength(3);
    expect(result).toEqual(["Item 1", "Item 2", "Item 3"]);
  });

  it("should truncate each item to maxItemLength", () => {
    const input = ["This is a very long item", "Short"];
    const result = sanitizeStringArray(input, undefined, 10);
    expect(result[0]).toBe("This is a");
    expect(result[1]).toBe("Short");
  });

  it("should handle null and undefined", () => {
    expect(sanitizeStringArray(null)).toEqual([]);
    expect(sanitizeStringArray(undefined)).toEqual([]);
  });

  it("should handle non-array input", () => {
    expect(sanitizeStringArray("not an array" as any)).toEqual([]);
  });
});
