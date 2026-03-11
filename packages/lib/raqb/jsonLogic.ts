import jsonLogic from "json-logic-js";

// converts input to lowercase if string
function normalize<T extends string | string[]>(input: T): T {
  if (typeof input === "string") {
    return input.toLowerCase() as T;
  }
  if (input instanceof Array) {
    return input.map((item) => {
      if (typeof item === "string") {
        return item.toLowerCase();
      }
      // if array item is not a string, return it as is
      return item;
    }) as T;
  }
  return input;
}

function asStringOrArray(val: unknown): string | string[] {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val as string[];
  return String(val);
}

/**
 * Single Select equals and not equals uses it
 * Short Text equals and not equals uses it
 */
jsonLogic.add_operation("==", (a: unknown, b: unknown) => normalize(asStringOrArray(a)) == normalize(asStringOrArray(b)));

jsonLogic.add_operation("===", (a: unknown, b: unknown) => normalize(asStringOrArray(a)) === normalize(asStringOrArray(b)));

jsonLogic.add_operation("!==", (a: unknown, b: unknown) => normalize(asStringOrArray(a)) !== normalize(asStringOrArray(b)));

jsonLogic.add_operation("!=", (a: unknown, b: unknown) => normalize(asStringOrArray(a)) != normalize(asStringOrArray(b)));

/**
 * Multiselect "equals" and "not equals" uses it
 * Singleselect "any in" and "not in" uses it
 * Long Text/Short Text/Email/Phone "contains" also uses it.
 */
jsonLogic.add_operation("in", (a: string, b: string | string[]) => {
  const first = normalize(a);
  const second = normalize(b);
  if (!second) return false;
  return second.indexOf(first) !== -1;
});

/**
 * Short Text/Long Text "starts with" uses it
 */
jsonLogic.add_operation("starts_with", (a: unknown, b: unknown) => {
  if (typeof a !== "string" || typeof b !== "string") return false;

  const first = normalize(a);
  const second = normalize(b);

  if (!second) return false;

  return first.startsWith(second);
});

export default jsonLogic;
