"use client"

import { CodeBlock } from "@/components/code-block"

export default function PaginationPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Pagination</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Three ways to page through results — offset, count-and-slice, and
            cursor. <br />
            Pick offset for admin tables, cursor for infinite feeds.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Offset Pagination
              </h2>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">paginate(page, pageSize)</code>{" "}
                runs the count and the page fetch for you and returns the page
                metadata alongside the rows. Pages are <strong>1-based</strong>.
              </p>
              <CodeBlock
                filename="paginate.ts"
                language="typescript"
                code={`const { data, total, page, pageSize } = await repo.paginate(2, 20);

// data      => the 20 rows on page 2
// total     => total row count across all pages (soft-deleted rows excluded)
// page      => 2
// pageSize  => 20

const totalPages = Math.ceil(total / pageSize);`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  paginate() takes no filter
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  The signature is{" "}
                  <code>paginate(page, pageSize, options)</code>, and{" "}
                  <code>options</code> is never read — it is accepted and
                  discarded. There is no way to hand this method a condition, and
                  passing one has no effect rather than raising:
                </p>
                <CodeBlock
                  language="typescript"
                  code={`// The where is silently dropped. \`data\` is page 2 of EVERY row,
// and \`total\` counts every row - not just the active ones.
await repo.paginate(2, 20, { where: { status: "active" } });`}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  To page a filtered set, build the query yourself and count it
                  separately — <code>findAndCountAll({`{ page, pageSize, conditions }`})</code>{" "}
                  below is the filtered equivalent, and it does honour its
                  conditions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Building the Query First</h2>
              <p className="text-muted-foreground mb-4">
                On the QueryBuilder,{" "}
                <code className="text-accent">paginate()</code> is chainable and
                only sets <code className="text-accent">LIMIT</code>/
                <code className="text-accent">OFFSET</code> — it does not run a
                count. Reach for this when the filter is complex and you would
                rather count separately, or skip the count entirely.
              </p>
              <CodeBlock
                filename="query-paginate.ts"
                language="typescript"
                code={`const rows = await repo
  .find()
  .where("status = ?", "active")
  .orderBy("createdAt", "DESC")
  .paginate(1, 10)
  .execute(db.client);`}
              />
              <p className="text-muted-foreground mt-4 mb-4">
                The underlying primitives are available directly:{" "}
                <code className="text-accent">limit()</code>/
                <code className="text-accent">take()</code> and{" "}
                <code className="text-accent">offset()</code>/
                <code className="text-accent">skip()</code> are two spellings of
                the same pair, and <code className="text-accent">first()</code>{" "}
                is <code className="text-accent">limit(1)</code>.
              </p>
              <CodeBlock
                filename="primitives.ts"
                language="typescript"
                code={`repo.find().take(10).skip(5)     // LIMIT 10 OFFSET 5
repo.find().limit(10).offset(5)  // identical
repo.find().first()              // LIMIT 1

// Inspect the SQL without running it
const { query, params } = repo.find().where("status = ?", "active").take(10).toSQL();`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Counting</h2>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">findAndCount()</code> returns every
                matching row plus the total — no slicing.{" "}
                <code className="text-accent">findAndCountAll()</code> adds the
                page window and defaults to page 1, size 20. Both return{" "}
                <code className="text-accent">{"{ data, total }"}</code>.
              </p>
              <CodeBlock
                filename="find-and-count.ts"
                language="typescript"
                code={`// All matching rows + count
const { data, total } = await repo.findAndCount({ relations: ["author"] });

// One page + count (note: does not echo page/pageSize back)
const page1 = await repo.findAndCountAll({ page: 2, pageSize: 10 });
const filtered = await repo.findAndCountAll({
  page: 1,
  pageSize: 25,
  conditions: { status: "active" },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cursor Pagination</h2>
              <p className="text-muted-foreground mb-4">
                Offset pagination degrades on large tables — the database still
                walks every skipped row, and rows inserted mid-scroll shift the
                page boundary, so a user can see the same record twice.{" "}
                <code className="text-accent">findMany()</code> takes a cursor
                instead and produces a{" "}
                <code className="text-accent">WHERE column &gt; ?</code>{" "}
                predicate, which stays fast at any depth and cannot skip or
                repeat a row.
              </p>
              <CodeBlock
                filename="cursor.ts"
                language="typescript"
                code={`const page = await repo.findMany({
  where: { status: "active" },
  cursor: { field: "id", value: lastSeenId, direction: "forward" },
  orderBy: { field: "id", direction: "ASC" },
  take: 20,
});

// Next page: feed the last row's id back in
const next = await repo.findMany({
  where: { status: "active" },
  cursor: { field: "id", value: page[page.length - 1].id, direction: "forward" },
  orderBy: { field: "id", direction: "ASC" },
  take: 20,
});`}
              />
              <p className="text-muted-foreground mt-4">
                <code className="text-accent">findMany()</code> returns a plain
                array — not a{" "}
                <code className="text-accent">{"{ data, total }"}</code> wrapper
                — because a cursor walk deliberately avoids counting. Set{" "}
                <code className="text-accent">direction: &quot;backward&quot;</code>{" "}
                with a <code className="text-accent">DESC</code> order to walk the
                other way. <code className="text-accent">take</code> becomes{" "}
                <code className="text-accent">LIMIT</code> and{" "}
                <code className="text-accent">skip</code> becomes{" "}
                <code className="text-accent">OFFSET</code>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Which to Use</h2>
              <CodeBlock
                filename="choosing.ts"
                language="typescript"
                code={`paginate(page, size)   // numbered pages, needs a total for the UI
findAndCountAll(...)   // numbered pages with a filter, total included
findAndCount()         // total only, no slicing
findMany({ cursor })   // infinite scroll / large tables, no total needed`}
              />
            </section>
          </div>
    </div>
  )
}
