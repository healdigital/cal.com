#!/bin/sh
set -e

# Replace the statically built BUILT_NEXT_PUBLIC_WEBAPP_URL with run-time NEXT_PUBLIC_WEBAPP_URL
# NOTE: if these values are the same, this will be skipped.
scripts/replace-placeholder.sh "$BUILT_NEXT_PUBLIC_WEBAPP_URL" "$NEXT_PUBLIC_WEBAPP_URL"

# Extract DATABASE_HOST from DATABASE_URL if not set explicitly
# DATABASE_URL format: postgresql://user:pass@host:port/dbname
if [ -z "$DATABASE_HOST" ] && [ -n "$DATABASE_URL" ]; then
  DATABASE_HOST=$(echo "$DATABASE_URL" | sed -E 's|^[^@]*@([^/\?]*).*|\1|')
  export DATABASE_HOST
  echo "Extracted DATABASE_HOST=$DATABASE_HOST from DATABASE_URL"
fi

if [ -n "$DATABASE_HOST" ]; then
  # wait-for-it is best-effort; some networks block raw TCP probes
  # but still allow PostgreSQL connections. Don't fail the startup if
  # the probe times out — prisma migrate will give a proper error if
  # the database is truly unreachable.
  scripts/wait-for-it.sh "${DATABASE_HOST}" -t 30 -- echo "database is up" || \
    echo "WARNING: wait-for-it timed out for ${DATABASE_HOST}. Continuing anyway..."
else
  echo "WARNING: DATABASE_HOST not set and could not be extracted. Skipping wait-for-it."
  sleep 5
fi

npx prisma migrate deploy --schema /calcom/packages/prisma/schema.prisma
npx ts-node --transpile-only /calcom/scripts/seed-app-store.ts
yarn start
