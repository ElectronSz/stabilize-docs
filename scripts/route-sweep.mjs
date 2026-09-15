/**
 * Requests every route the site serves and checks what comes back.
 *
 * The route list is read from the filesystem (`app/**\/page.tsx`) rather than
 * from a written-down list, for the same reason the navigation is: a checklist
 * that has to be maintained by hand drifts, and a route sweep that is missing a
 * route is worse than no sweep, because it reports success.
 *
 * A status code alone is not enough, so each response is also checked for:
 *   - the stale-chunk signature a `next start` serving a clobbered build
 *     produces (`Cannot find module './NNNN.js'`), which can arrive wrapped in
 *     a 200 shell rather than as a 500;
 *   - the navigation chrome (breadcrumb, prev/next pager, section index) being
 *     present in the server-rendered HTML. Client components are still SSR'd for
 *     the initial response, so their absence means the navigation silently
 *     stopped rendering — the failure mode a status-code-only sweep cannot see.
 *
 * Usage:
 *   bun run verify:routes                        # http://localhost:3000
 *   BASE_URL=http://localhost:3100 bun run verify:routes
 */

import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const TIMEOUT_MS = Number(process.env.SWEEP_TIMEOUT_MS ?? 30_000);

const ERROR_SIGNATURES = [
  [/Cannot find module '\.\/\d+\.js'/, "stale chunk error"],
  [/ChunkLoadError/, "chunk load error"],
  [/__NEXT_ERROR__/, "next error payload"],
  [/Application error: a client-side exception/, "client-side exception"],
  [/Hydration failed/, "hydration failure"],
  [/Unhandled Runtime Error/, "unhandled runtime error"],
];

function collectRoutes() {
  const appDir = path.join(process.cwd(), "app");
  const routes = [];

  const walk = (dir, segments) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      // Route groups and private folders do not appear in the URL.
      if (entry.isDirectory()) {
        const isTransparent =
          (entry.name.startsWith("(") && entry.name.endsWith(")")) ||
          entry.name.startsWith("_");
        walk(
          path.join(dir, entry.name),
          isTransparent ? segments : [...segments, entry.name],
        );
        continue;
      }

      if (/^page\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        routes.push(`/${segments.join("/")}`.replace(/\/$/, "") || "/");
      }
    }
  };

  walk(appDir, []);

  return [...new Set(routes)].sort();
}

/** What the server-rendered HTML must contain for a given route. */
function expectationsFor(route) {
  if (route === "/") return [];

  const isSectionRoot = route.split("/").filter(Boolean).length === 1;

  const expectations = [
    ['aria-label="breadcrumb"', "breadcrumb"],
    ['aria-label="Page navigation"', "prev/next pager"],
  ];

  if (isSectionRoot) {
    expectations.push(["In this section", "section index"]);
  }

  return expectations;
}

async function check(route) {
  const url = `${BASE_URL}${route}`;

  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await response.text().catch(() => "");

    const problems = [];

    if (response.status < 200 || response.status >= 400) {
      problems.push(`status ${response.status}`);
    }

    for (const [pattern, label] of ERROR_SIGNATURES) {
      if (pattern.test(body)) problems.push(label);
    }

    for (const [needle, label] of expectationsFor(route)) {
      if (!body.includes(needle)) problems.push(`missing ${label}`);
    }

    return { route, status: response.status, ok: problems.length === 0, problems };
  } catch (error) {
    return {
      route,
      status: "ERR",
      ok: false,
      problems: [
        error?.name === "TimeoutError" ? "timed out" : String(error?.message ?? error),
      ],
    };
  }
}

const routes = collectRoutes();

console.log(`Sweeping ${routes.length} routes against ${BASE_URL}\n`);

const results = [];
for (const route of routes) {
  const result = await check(route);
  results.push(result);

  const marker = result.ok ? "ok  " : "FAIL";
  const note = result.problems.length ? `  <- ${result.problems.join(", ")}` : "";
  console.log(`${marker}  ${String(result.status).padEnd(5)} ${route}${note}`);
}

const failures = results.filter((result) => !result.ok);

console.log(
  `\n${results.length - failures.length}/${results.length} routes served successfully` +
    ` (status + no error signatures + navigation chrome rendered).`,
);

if (failures.length > 0) {
  console.error(
    `\nFailures:\n${failures
      .map((f) => `  ${f.route} -> ${f.status} ${f.problems.join(", ")}`)
      .join("\n")}`,
  );
  process.exit(1);
}
