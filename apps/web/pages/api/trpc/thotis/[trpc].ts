import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { thotisRouter } from "@calcom/trpc/server/routers/thotis";

export default createNextApiHandler(thotisRouter);
