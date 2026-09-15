"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function PaginationApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Pagination API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Offset and cursor pagination across the repository and the query
            builder
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">paginate()</h2>
              <CodeBlock
                language="typescript"
                code={`async paginate(
  page: number,
  pageSize: number,
  options: any = {}
): Promise<{ data: T[]; total: number; page: number; pageSize: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Pages are 1-based. The <code>options</code> parameter is typed{" "}
                <code>any</code> and is currently unused. The result echoes{" "}
                <code>page</code> and <code>pageSize</code> back alongside the
                rows and the total count.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    page
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    1-based page number
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    pageSize
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Rows per page
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    options
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Typed any, currently unused
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/paginate.ts"
                language="typescript"
                code={`const result = await userRepo.paginate(2, 20);
// { data: [...], total: 137, page: 2, pageSize: 20 }`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">findAndCount()</h2>
              <CodeBlock
                language="typescript"
                code={`async findAndCount(
  options: { relations?: string[] } = {}
): Promise<{ data: T[]; total: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Returns every matching row plus the total count. No offset or
                limit is applied.
              </p>
              <CodeBlock
                filename="example/find-and-count.ts"
                language="typescript"
                code={`const { data, total } = await userRepo.findAndCount({
  relations: ["posts"],
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">findAndCountAll()</h2>
              <CodeBlock
                language="typescript"
                code={`async findAndCountAll(options?: {
  page?: number;
  pageSize?: number;
  conditions?: Partial<T>;
}): Promise<{ data: T[]; total: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Defaults to <code>page=1</code> and <code>pageSize=20</code>. It
                does NOT echo <code>page</code> and <code>pageSize</code> back —
                it returns only <code>{"{ data, total }"}</code>.
              </p>
              <CodeBlock
                filename="example/find-and-count-all.ts"
                language="typescript"
                code={`const { data, total } = await userRepo.findAndCountAll({
  page: 3,
  pageSize: 10,
  conditions: { active: true },
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">findMany()</h2>
              <CodeBlock
                language="typescript"
                code={`async findMany(options?: {
  where?: Partial<T>;
  cursor?: {
    field: string;
    value: any;
    direction?: "forward" | "backward";
  };
  take?: number;
  skip?: number;
  orderBy?: { field: string; direction: "ASC" | "DESC" };
  relations?: string[];
}): Promise<T[]>`}
              />
              <p className="text-muted-foreground mb-4">
                Returns a plain array, NOT a{" "}
                <code>{"{ data, total }"}</code> wrapper. The cursor emits a{" "}
                <code>WHERE col &gt; ?</code> or <code>WHERE col &lt; ?</code>{" "}
                predicate based on <code>direction</code> and{" "}
                <code>orderBy.direction</code>. <code>take</code> becomes LIMIT
                and <code>skip</code> becomes OFFSET.
              </p>
              <CodeBlock
                filename="example/find-many.ts"
                language="typescript"
                code={`const page = await userRepo.findMany({
  where: { active: true },
  orderBy: { field: "id", direction: "ASC" },
  take: 20,
  skip: 40,
});

const next = await userRepo.findMany({
  cursor: { field: "id", value: lastId, direction: "forward" },
  orderBy: { field: "id", direction: "ASC" },
  take: 20,
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                QueryBuilder: limits
              </h2>
              <CodeBlock
                language="typescript"
                code={`limit(limit: number): QueryBuilder<T>
offset(offset: number): QueryBuilder<T>
take(count: number): QueryBuilder<T>      // alias for limit
skip(count: number): QueryBuilder<T>      // alias for offset
first(): QueryBuilder<T>                  // limit 1
paginate(page: number, pageSize: number): QueryBuilder<T>
orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): QueryBuilder<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Every method is chainable and returns the builder.{" "}
                <code>paginate()</code> sets limit and offset, but does NOT
                count — run <code>countExec()</code> separately if you need a
                total.
              </p>
              <CodeBlock
                filename="example/query-builder-pagination.ts"
                language="typescript"
                code={`const rows = await userRepo
  .find()
  .where("active = ?", true)
  .orderBy("id", "ASC")
  .paginate(2, 20)
  .execute(orm.client);

const total = await userRepo
  .find()
  .where("active = ?", true)
  .countExec(orm.client);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                QueryBuilder: execution
              </h2>
              <CodeBlock
                language="typescript"
                code={`async countExec(client: DBClient): Promise<number>
async existsExec(client: DBClient): Promise<boolean>
async execute(client: DBClient, cache?, cacheKey?): Promise<T[]>
toSQL(): { query: string; params: any[] }`}
              />
              <p className="text-muted-foreground mb-4">
                <code>toSQL()</code> renders the built statement and its bound
                parameters without running it — useful for verifying the LIMIT
                and OFFSET a paginate call produced.
              </p>
              <CodeBlock
                filename="example/to-sql.ts"
                language="typescript"
                code={`const { query, params } = userRepo
  .find()
  .where("active = ?", true)
  .limit(20)
  .offset(40)
  .toSQL();`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
