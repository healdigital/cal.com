import { Prisma } from "../client";
import { safeCredentialSelect } from "../selects/credential";

const SENSITIVE_CREDENTIAL_FIELDS = ["key", "encryptedKey"] as const;

/**
 * Recursively strips `key` and `encryptedKey` from credential-shaped objects.
 * A credential-shaped object is one that has both `type` (string) and `key` fields,
 * which distinguishes Credential records from other models that may have a `key` field.
 */
function stripCredentialKeysImpl<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => stripCredentialKeysImpl(item)) as T;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // Detect credential-shaped objects: must have `type` as string and `key` present
    if ("type" in obj && typeof obj.type === "string" && "key" in obj) {
      const stripped = { ...obj };
      for (const field of SENSITIVE_CREDENTIAL_FIELDS) {
        delete stripped[field];
      }
      return stripped as T;
    }

    // Recurse into nested objects to catch credential relations (e.g., user.credentials)
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (Array.isArray(v) || (typeof v === "object" && v !== null)) {
        result[k] = stripCredentialKeysImpl(v);
      } else {
        result[k] = v;
      }
    }
    return result as T;
  }

  return data;
}

/**
 * Handles a direct credential model query by either:
 * 1. Passing through if `select` is explicitly set (developer chose fields)
 * 2. Stripping sensitive fields from results if `include` is set
 * 3. Injecting `safeCredentialSelect` when neither select nor include is set
 */
async function handleCredentialQuery<T>(
  args: { select?: unknown; include?: unknown },
  query: (args: T) => Promise<unknown>
): Promise<unknown> {
  // Developer explicitly selected fields — trust their choice
  if (args.select) {
    return query(args as T);
  }

  // Has include but no select — run query then strip sensitive fields from result
  if (args.include) {
    const result = await query(args as T);
    return stripCredentialKeysImpl(result);
  }

  // No select or include — inject safe select to avoid fetching key/encryptedKey
  const argsWithSelect = { ...args, select: safeCredentialSelect };
  return query(argsWithSelect as T);
}

/**
 * Handles stripping credential keys from $allModels query results
 * when the query includes relations that might contain credentials.
 */
async function handleAllModelsQuery<T>(
  args: { select?: unknown; include?: unknown },
  query: (args: T) => Promise<unknown>
): Promise<unknown> {
  const result = await query(args as T);
  if (args.include || !args.select) {
    return stripCredentialKeysImpl(result);
  }
  return result;
}

export { stripCredentialKeysImpl as stripCredentialKeys };

export function stripCredentialKeysExtension() {
  return Prisma.defineExtension({
    query: {
      credential: {
        async findUnique({ args, query }) {
          return handleCredentialQuery(args, query);
        },
        async findFirst({ args, query }) {
          return handleCredentialQuery(args, query);
        },
        async findMany({ args, query }) {
          return handleCredentialQuery(args, query);
        },
        async findUniqueOrThrow({ args, query }) {
          return handleCredentialQuery(args, query);
        },
        async findFirstOrThrow({ args, query }) {
          return handleCredentialQuery(args, query);
        },
      },
      $allModels: {
        // Strip credential keys from nested includes on any model
        // e.g., user.findFirst({ include: { credentials: true } })
        async findFirst({ args, query }) {
          return handleAllModelsQuery(args, query);
        },
        async findMany({ args, query }) {
          return handleAllModelsQuery(args, query);
        },
        async findUnique({ args, query }) {
          return handleAllModelsQuery(args, query);
        },
        async findFirstOrThrow({ args, query }) {
          return handleAllModelsQuery(args, query);
        },
        async findUniqueOrThrow({ args, query }) {
          return handleAllModelsQuery(args, query);
        },
      },
    },
  });
}
