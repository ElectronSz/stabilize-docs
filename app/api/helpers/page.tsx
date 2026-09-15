"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function HelpersApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Helper Methods</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Lookups, create-or-update, column helpers, bulk writes, soft delete,
            iteration, raw SQL and utilities
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Lookups</h2>
              <CodeBlock
                language="typescript"
                code={`async findOne(id: number | string, options?: { relations?: string[] }, _client?: DBClient): Promise<T | null>
async findOneBy(conditions: Partial<T>, options?: { relations?: string[] }, _client?: DBClient): Promise<T | null>
async findBy(conditions: Partial<T>, options?: { relations?: string[]; limit?: number; orderBy?: string }, _client?: DBClient): Promise<T[]>
async findOrFail(id: number | string, options?: { relations?: string[] }, _client?: DBClient): Promise<T>
async firstOrFail(conditions?: Partial<T>, options?: { relations?: string[] }, _client?: DBClient): Promise<T>
async first(conditions?: Partial<T>): Promise<T | null>
async last(field?: string): Promise<T | null>
async random(): Promise<T | null>
async exists(conditions?: Partial<T>): Promise<boolean>`}
              />
              <h3 className="font-semibold mb-2">Options:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    relations
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Names of relations to load with the row.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    limit
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    <code>findBy()</code> only. Maximum rows to return.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    orderBy
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    <code>findBy()</code> only. Column to order by.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    field
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    <code>last()</code> only. Column to order by, defaulting to{" "}
                    <code>&quot;id&quot;</code>.
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <code>findOrFail()</code> and <code>firstOrFail()</code> throw a{" "}
                <code>StabilizeError</code> with code{" "}
                <code>NOT_FOUND_ERROR</code> when nothing matches.
              </p>
              <CodeBlock
                filename="example/lookups.ts"
                language="typescript"
                code={`const user = await userRepo.findOne(1, { relations: ["posts"] });
const byEmail = await userRepo.findOneBy({ email: "alice@example.com" });
const admins = await userRepo.findBy({ role: "admin" }, { limit: 10, orderBy: "name" });
const newest = await userRepo.last("createdAt");
const lucky = await userRepo.random();
const hasAny = await userRepo.exists({ status: "active" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                firstOrCreate() / updateOrCreate()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async firstOrCreate(conditions: Partial<T>, defaults?: Partial<T>, _client?: DBClient): Promise<T>
async updateOrCreate(conditions: Partial<T>, updates: Partial<T>, _client?: DBClient): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>firstOrCreate()</code> returns the matching row, creating
                it from <code>defaults</code> when none exists.{" "}
                <code>updateOrCreate()</code> returns the matching row, creating
                or updating it from <code>updates</code>.
              </p>
              <CodeBlock
                filename="example/first-or-create.ts"
                language="typescript"
                code={`const tag = await tagRepo.firstOrCreate(
  { name: "orm" },
  { name: "orm", color: "blue" }
);

const setting = await settingRepo.updateOrCreate(
  { key: "theme" },
  { key: "theme", value: "dark" }
);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Column and value helpers
              </h2>
              <CodeBlock
                language="typescript"
                code={`async pluck<K extends keyof T>(column: K): Promise<any[]>
async selectColumns(...columns: (keyof T)[]): Promise<Partial<T>[]>
async toggle(id: number | string, field: string, _client?: DBClient): Promise<T>
async increment(id: number | string, field: string, amount?: number, _client?: DBClient): Promise<T>
async decrement(id: number | string, field: string, amount?: number, _client?: DBClient): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>pluck()</code> returns one column as a flat array.{" "}
                <code>selectColumns()</code> returns partial rows containing only
                the named columns.
              </p>
              <p className="text-muted-foreground mb-4">
                <code>toggle()</code>, <code>increment()</code> and{" "}
                <code>decrement()</code> apply the change in SQL and return the
                updated row. <code>amount</code> defaults to <code>1</code>.
              </p>
              <CodeBlock
                filename="example/column-helpers.ts"
                language="typescript"
                code={`const names = await userRepo.pluck("name");
const slim = await userRepo.selectColumns("id", "name");

const toggled = await userRepo.toggle(1, "active");
const bumped = await userRepo.increment(1, "logins", 1);
const lowered = await userRepo.decrement(1, "credits", 5);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Bulk writes</h2>
              <CodeBlock
                language="typescript"
                code={`async bulkUpsert(entities: Partial<T>[], keys: string[], _client?: DBClient): Promise<T[]>
async upsertMany(entities: Partial<T>[], keys: string[], batchSize?: number, _client?: DBClient): Promise<T[]>
async updateBy(conditions: Partial<T>, updates: Partial<T>, _client?: DBClient): Promise<number>
async deleteBy(conditions: Partial<T>, _client?: DBClient): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>bulkUpsert()</code> writes every entity in one
                transaction. <code>upsertMany()</code> does the same in batches;{" "}
                <code>batchSize</code> defaults to <code>100</code>. The{" "}
                <code>keys</code> argument names the columns that decide whether
                a row is matched and updated or inserted.
              </p>
              <p className="text-muted-foreground mb-4">
                <code>updateBy()</code> and <code>deleteBy()</code> return the
                number of affected rows. Both throw a{" "}
                <code>StabilizeError</code> with code{" "}
                <code>UNSAFE_QUERY</code> when <code>conditions</code> is empty.
                <code>updateBy()</code> auto-sets <code>updatedAt</code> when the
                model has timestamps, and auto-advances an optimistic-lock
                column. <code>deleteBy()</code> soft-deletes when the model has a
                soft-delete column, and hard deletes otherwise.
              </p>
              <CodeBlock
                filename="example/bulk-writes.ts"
                language="typescript"
                code={`const saved = await userRepo.bulkUpsert(
  [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
  ["id"]
);

const many = await userRepo.upsertMany(rows, ["email"], 250);

const updated = await userRepo.updateBy({ status: "new" }, { status: "active" });
const removed = await userRepo.deleteBy({ status: "archived" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Soft delete</h2>
              <CodeBlock
                language="typescript"
                code={`async recover(id: number | string, _client?: DBClient): Promise<T>
async recoverAll(_client?: DBClient): Promise<number>
async restoreBy(conditions: Partial<T>, _client?: DBClient): Promise<number>
async truncate(_client?: DBClient): Promise<void>
findDeleted(): QueryBuilder<T>
withTrashed(): QueryBuilder<T>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>recover()</code> restores one row by primary key.{" "}
                <code>recoverAll()</code> and <code>restoreBy()</code> return the
                number of rows restored.{" "}
                <code>truncate()</code> performs a hard <code>DELETE</code> of
                every row.
              </p>
              <p className="text-muted-foreground mb-4">
                <code>findDeleted()</code> returns only trashed rows and{" "}
                <code>withTrashed()</code> includes them. Both return a
                QueryBuilder. In a model without a soft-delete column,{" "}
                <code>restoreBy()</code> throws code{" "}
                <code>RECOVER_ERROR</code> and <code>findDeleted()</code> throws
                code <code>QUERY_ERROR</code>. <code>withTrashed()</code> never
                throws, because it builds a bare{" "}
                <code>QueryBuilder</code> with no soft-delete predicate. It also
                attaches no relation loader, so{" "}
                <code>.withRelations()</code> on a <code>withTrashed()</code>{" "}
                builder does not eager-load anything — use{" "}
                <code>find()</code> for that.
              </p>
              <CodeBlock
                filename="example/soft-delete.ts"
                language="typescript"
                code={`const restored = await userRepo.recover(1);
const count = await userRepo.restoreBy({ status: "archived" });

const trashed = await userRepo.findDeleted().execute(orm.client);
const everything = await userRepo.withTrashed().execute(orm.client);

await userRepo.truncate();`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Iteration</h2>
              <CodeBlock
                language="typescript"
                code={`async map<R>(query: QueryBuilder<T>, transform: (item: T) => R): Promise<R[]>
async each(query: QueryBuilder<T>, callback: (item: T, index: number) => void | Promise<void>, pageSize?: number): Promise<void>
async eachBatch(query: QueryBuilder<T>, callback: (batch: T[]) => void | Promise<void>, batchSize?: number): Promise<void>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>each()</code> and <code>eachBatch()</code> clone the
                builder — the passed builder is not mutated — and paginate by
                offset/limit. <code>pageSize</code> and <code>batchSize</code>{" "}
                both default to <code>100</code>.
              </p>
              <CodeBlock
                filename="example/iteration.ts"
                language="typescript"
                code={`const names = await userRepo.map(userRepo.find(), (u) => u.name);

await userRepo.each(userRepo.find(), async (user, index) => {
  await sync(user, index);
}, 50);

await userRepo.eachBatch(userRepo.find(), async (batch) => {
  await bulkIndex(batch);
}, 200);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Raw SQL</h2>
              <CodeBlock
                language="typescript"
                code={`// Repository
async rawQuery<R = T>(query: string, params?: any[]): Promise<R[]>

// Stabilize
async rawQuery<T = any>(query: string, params?: any[]): Promise<T[]>
async rawExec(query: string, params?: any[]): Promise<{ affectedRows: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>rawExec()</code> exists only on the <code>Stabilize</code>{" "}
                class, not on the Repository. Both <code>rawQuery()</code> forms
                return an array of rows.
              </p>
              <CodeBlock
                filename="example/raw-sql.ts"
                language="typescript"
                code={`const rows = await userRepo.rawQuery("SELECT * FROM users WHERE age > ?", [18]);

const all = await orm.rawQuery("SELECT * FROM users");
const { affectedRows } = await orm.rawExec(
  "UPDATE users SET active = 0 WHERE lastLogin < ?",
  [oneYearAgo]
);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Utilities</h2>
              <p className="text-muted-foreground mb-4">
                Module-level exports, not repository methods.
              </p>
              <CodeBlock
                language="typescript"
                code={`export function generateUUID(): string            // returns crypto.randomUUID()
export function sqlDefault(sql: string): DefaultExpression   // { sql: string }`}
              />
              <p className="text-muted-foreground mb-4">
                <code>sqlDefault()</code> is used as a column&apos;s{" "}
                <code>defaultExpression</code>, not <code>defaultValue</code>.
              </p>
              <CodeBlock
                filename="example/utilities.ts"
                language="typescript"
                code={`import { generateUUID, sqlDefault } from "stabilize-orm";

const id = generateUUID();

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.UUID, defaultExpression: sqlDefault("gen_random_uuid()") },
  },
});`}
              />
              <p className="text-muted-foreground">
                Note that <code>autoMigrate</code> emits only{" "}
                <code>defaultValue</code> when creating a table — a{" "}
                <code>defaultExpression</code> is not included.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
