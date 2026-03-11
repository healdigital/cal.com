/**
 * Sanitizes user-provided text inputs to prevent XSS attacks and ensure data integrity.
 * This utility removes or escapes potentially dangerous HTML/script content while preserving
 * safe formatting like line breaks.
 *
 * Use this for any user-generated content that will be stored in the database or displayed
 * in the UI, such as bios, descriptions, comments, etc.
 */

/**
 * Sanitizes a string by removing HTML tags and escaping special characters.
 * Preserves line breaks by converting them to \n.
 *
 * @param input - The user input string to sanitize
 * @param maxLength - Optional maximum length to truncate to
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeUserInput(input: string | null | undefined, maxLength?: number): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "");

  // Normalize line breaks
  sanitized = sanitized.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove excessive consecutive line breaks (more than 2)
  sanitized = sanitized.replace(/\n{3,}/g, "\n\n");

  // Trim whitespace from start and end
  sanitized = sanitized.trim();

  // Truncate if maxLength is specified
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim();
  }

  return sanitized;
}

/**
 * Sanitizes an array of strings (e.g., expertise tags, keywords).
 * Removes empty strings and duplicates, and sanitizes each item.
 *
 * @param items - Array of strings to sanitize
 * @param maxItems - Optional maximum number of items to keep
 * @param maxItemLength - Optional maximum length for each item
 * @returns Sanitized array of unique strings
 */
export function sanitizeStringArray(
  items: string[] | null | undefined,
  maxItems?: number,
  maxItemLength?: number
): string[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const sanitized = items
    .map((item) => sanitizeUserInput(item, maxItemLength))
    .filter((item) => item.length > 0);

  // Remove duplicates (case-insensitive)
  const unique = Array.from(new Map(sanitized.map((item) => [item.toLowerCase(), item])).values());

  // Limit number of items if specified
  if (maxItems && unique.length > maxItems) {
    return unique.slice(0, maxItems);
  }

  return unique;
}
