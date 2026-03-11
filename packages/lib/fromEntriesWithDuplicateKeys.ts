export function fromEntriesWithDuplicateKeys(
  entries: IterableIterator<[string, string]> | null
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};

  if (entries === null) {
    return result;
  }

  let currentEntry = entries.next();

  while (!currentEntry.done) {
    const [key, value] = currentEntry.value;

    if (Object.hasOwn(result, key)) {
      let currentValue = result[key];
      if (!Array.isArray(currentValue)) {
        currentValue = [currentValue];
      }
      currentValue.push(value);
      result[key] = currentValue;
    } else {
      result[key] = value;
    }

    currentEntry = entries.next();
  }

  return result;
}
