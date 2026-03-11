import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const SCHEMA_ROOT_FILENAME = "schema.prisma";

function sortSchemaFiles(a: string, b: string): number {
  if (a === SCHEMA_ROOT_FILENAME) return -1;
  if (b === SCHEMA_ROOT_FILENAME) return 1;
  return a.localeCompare(b);
}

export function loadPrismaSchema(schemaDirectory: string = __dirname): string {
  const schemaFiles = readdirSync(schemaDirectory)
    .filter((entry) => entry.endsWith(".prisma"))
    .sort(sortSchemaFiles);

  if (!schemaFiles.length) {
    throw new Error(`No Prisma schema files found in ${schemaDirectory}`);
  }

  return schemaFiles
    .map((schemaFile) => readFileSync(path.join(schemaDirectory, schemaFile), "utf8").trim())
    .join("\n\n");
}
