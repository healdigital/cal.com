import process from "node:process";
import AxeBuilder from "@axe-core/playwright";
import prisma from "@calcom/prisma";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { test } from "./lib/fixtures";

const E2E_BASE_URL: string = process.env.NEXT_PUBLIC_WEBAPP_URL || "http://localhost:3000";
let hasDatabaseConnectionPromise: Promise<boolean> | null = null;

async function hasDatabaseConnection(): Promise<boolean> {
  if (!hasDatabaseConnectionPromise) {
    hasDatabaseConnectionPromise = prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
  }

  return hasDatabaseConnectionPromise;
}

async function expectNoBlockingViolations(pathname: string, page: Page): Promise<void> {
  await page.goto(new URL(pathname, E2E_BASE_URL).toString());
  await page.waitForLoadState("domcontentloaded");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const blockingViolations = results.violations.filter((violation) =>
    ["critical", "serious"].includes(violation.impact || "")
  );

  expect(
    blockingViolations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
    }))
  ).toEqual([]);
}

test.describe("Thotis accessibility", () => {
  test("landing page has no critical or serious axe violations", async ({ page }) => {
    await expectNoBlockingViolations("/thotis", page);
  });

  test("mentor search page has no critical or serious axe violations", async ({ page }) => {
    await expectNoBlockingViolations("/thotis/mentors", page);
  });

  test("guest magic-link page has no critical or serious axe violations", async ({ page }) => {
    await expectNoBlockingViolations("/thotis/my-sessions", page);
  });

  test("admin dashboard has no critical or serious axe violations", async ({ page, users }) => {
    test.skip(!(await hasDatabaseConnection()), "Requires a reachable e2e database");

    const admin = await users.create({
      role: "ADMIN",
      username: "thotis-admin-accessibility",
    });

    await admin.apiLogin("/thotis/admin");
    await expectNoBlockingViolations("/thotis/admin", page);
  });
});
