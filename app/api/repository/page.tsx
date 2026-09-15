"use client";

import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

export default function RepositoryApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Repository API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Complete reference for the Repository class methods
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">find()</h2>
              <CodeBlock
                language="typescript"
                code={`find(): QueryBuilder<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Creates a QueryBuilder. Automatically excludes soft-deleted
                records when the model has a soft-delete column.
              </p>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 mb-4">
                <p className="text-sm text-muted-foreground">
                  <code>find()</code> takes <strong>no arguments</strong>. It is
                  not a finder — it returns the builder, and the builder is
                  executed by <code>.execute(client)</code>. Passing an options
                  object does nothing: a call like{" "}
                  <code>{`userRepo.find({ where: { isActive: true } })`}</code>{" "}
                  compiles to a plain builder and the filter is{" "}
                  <strong>silently ignored</strong>, returning every row. Use{" "}
                  <code>findBy()</code> for filtering.
                </p>
              </div>
              <CodeBlock
                language="typescript"
                code={`const users = await userRepo.find().execute(orm.client);

// Filtering — NOT find({ where })
const active = await userRepo.findBy({ isActive: true });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">findOne()</h2>
              <CodeBlock
                language="typescript"
                code={`async findOne(id: number | string, options?: { relations?: string[] }, client?: DBClient): Promise<T | null>`}
              />
              <p className="text-muted-foreground mb-4">
                Finds a single record by primary key.
              </p>
              <CodeBlock
                language="typescript"
                code={`const user = await userRepo.findOne(user.id);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                findOneBy() / findBy()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async findOneBy(
  conditions: Partial<T>,
  options: { relations?: string[] } = {},
  _client?: DBClient,
): Promise<T | null>

async findBy(
  conditions: Partial<T>,
  options: { relations?: string[]; limit?: number; orderBy?: string } = {},
  _client?: DBClient,
): Promise<T[]>`}
              />
              <p className="text-muted-foreground mb-4">
                TypeORM-style conditional finders. A condition whose value is{" "}
                <code>null</code> compiles to <code>IS NULL</code>. Both return
                the model&apos;s rows with <code>options.relations</code>{" "}
                eager-loaded.
              </p>
              <CodeBlock
                language="typescript"
                code={`const user = await userRepo.findOneBy({ email: "alice@example.com" });
const admins = await userRepo.findBy({ role: "admin" }, { limit: 10 });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                findOrFail() / firstOrFail()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async findOrFail(
  id: number | string,
  options: { relations?: string[] } = {},
  _client?: DBClient,
): Promise<T>

async firstOrFail(
  conditions: Partial<T> = {},
  options: { relations?: string[] } = {},
  _client?: DBClient,
): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                As findOne() and first(), but throws a StabilizeError with code{" "}
                <code>NOT_FOUND_ERROR</code> instead of returning{" "}
                <code>null</code>.
              </p>
              <CodeBlock
                language="typescript"
                code={`const user = await userRepo.findOrFail(id); // never null
const admin = await userRepo.firstOrFail({ role: "admin" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">validateAll()</h2>
              <CodeBlock
                language="typescript"
                code={`validateAll(entity: Partial<T>, skipRequired = false): string[]`}
              />
              <p className="text-muted-foreground mb-4">
                Returns every validation failure rather than throwing on the
                first, which is what a write path does. Empty when valid.
              </p>
              <CodeBlock
                language="typescript"
                code={`const errors = userRepo.validateAll({ email: "nope", name: "ab" });
// ["Field email does not match pattern", "Field name too short"]`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                attach() / detach() / sync()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async attach(
  id: number | string,
  relation: string,
  targetIds: number | string | (number | string)[],
  _client?: DBClient,
): Promise<number>

async detach(
  id: number | string,
  relation: string,
  targetIds?: number | string | (number | string)[],
  _client?: DBClient,
): Promise<number>

async sync(
  id: number | string,
  relation: string,
  targetIds: (number | string)[],
  _client?: DBClient,
): Promise<{ attached: number; detached: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Edits a ManyToMany relation&apos;s join table directly.
                Idempotent, and accept a single id or an array. Omitting the
                ids from <code>detach()</code> unlinks everything.{" "}
                <code>sync()</code> makes the link set exactly the given ids
                and runs in a transaction.
              </p>
              <CodeBlock
                language="typescript"
                code={`await userRepo.attach(userId, "roles", [1, 2]);
await userRepo.detach(userId, "roles", [2]);
await userRepo.sync(userId, "roles", [3, 4]);
// { attached: 2, detached: 1 }`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">create()</h2>
              <CodeBlock
                language="typescript"
                code={`async create(
  entity: Partial<T>,
  options: { relations?: string[] } = {},
  _client?: DBClient,
): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Creates a new record. Runs
                beforeCreate/afterCreate/beforeSave/afterSave hooks.
              </p>
              <CodeBlock
                language="typescript"
                code={`const user = await userRepo.create({ id: generateUUID(), email: "alice@example.com", name: "Alice" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">bulkCreate()</h2>
              <CodeBlock
                language="typescript"
                code={`async bulkCreate(
  entities: Partial<T>[],
  options: { relations?: string[]; batchSize?: number } = {},
  _client?: DBClient,
): Promise<T[]>`}
              />
              <p className="text-muted-foreground mb-4">
                Creates multiple records in batches.
              </p>
              <CodeBlock
                language="typescript"
                code={`await userRepo.bulkCreate([
  { id: generateUUID(), name: "Alice", email: "alice@example.com" },
  { id: generateUUID(), name: "Bob", email: "bob@example.com" },
], { batchSize: 1000 });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">update()</h2>
              <CodeBlock
                language="typescript"
                code={`async update(
  id: number | string,
  entity: Partial<T>,
  _client?: DBClient,
): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Updates a record by ID. Supports optimistic locking if
                configured.
              </p>
              <CodeBlock
                language="typescript"
                code={`const updated = await userRepo.update(user.id, { name: "Alice Smith" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                upsert() / bulkUpsert()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async upsert(
  entity: Partial<T>,
  keys: string[],
  _client?: DBClient,
): Promise<T>

async bulkUpsert(
  entities: Partial<T>[],
  keys: string[],
  _client?: DBClient,
): Promise<T[]>`}
              />
              <p className="text-muted-foreground mb-4">
                Insert or update based on unique keys.
              </p>
              <CodeBlock
                language="typescript"
                code={`await userRepo.upsert({ email: "alice@example.com", name: "Alice" }, ["email"]);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">delete()</h2>
              <CodeBlock
                language="typescript"
                code={`async delete(id: number | string, _client?: DBClient): Promise<void>`}
              />
              <p className="text-muted-foreground mb-4">
                Deletes a record. Soft delete if <code>deletedAt</code> column
                exists.
              </p>
              <CodeBlock
                language="typescript"
                code={`await userRepo.delete(user.id);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                recover() / recoverAll()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async recover(id: number | string, _client?: DBClient): Promise<T>
async recoverAll(_client?: DBClient): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                Restores soft-deleted records.
              </p>
              <CodeBlock
                language="typescript"
                code={`await userRepo.recover(user.id);
const count = await userRepo.recoverAll();`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                count() / exists()
              </h2>
              <CodeBlock
                language="typescript"
                code={`async count(conditions?: Partial<T>): Promise<number>
async exists(conditions?: Partial<T>): Promise<boolean>`}
              />
              <CodeBlock
                language="typescript"
                code={`const total = await userRepo.count();
const activeCount = await userRepo.count({ isActive: true });
const exists = await userRepo.exists({ email: "alice@example.com" });`}
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
              <CodeBlock
                language="typescript"
                code={`// Fetch page 1 with 20 items and total count
const { data, total } = await userRepo.findAndCountAll({
  page: 1,
  pageSize: 20,
  conditions: { isActive: true },
});
console.log(\`Showing \${data.length} of \${total} users\`);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">toJSON()</h2>
              <CodeBlock
                language="typescript"
                code={`toJSON(entity: T): Record<string, any>`}
              />
              <CodeBlock
                language="typescript"
                code={`const user = await userRepo.findOne(id);
const clean = userRepo.toJSON(user);
// Excludes soft delete field, returns plain object`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">aggregate()</h2>
              <CodeBlock
                language="typescript"
                code={`async aggregate(options: { count?: string | string[]; sum?: string[]; avg?: string[]; min?: string[]; max?: string[] }): Promise<Record<string, any>>`}
              />
              <CodeBlock
                language="typescript"
                code={`const stats = await userRepo.aggregate({ count: "*", avg: ["age"], min: ["age"], max: ["age"] });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Versioning Methods
              </h2>
              <CodeBlock
                language="typescript"
                code={`async asOf(id: number | string, asOfDate: Date, _client?: DBClient): Promise<T | null>
async history(id: number | string, _client?: DBClient): Promise<T[]>
async rollback(id: number | string, version: number, _client?: DBClient): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                All three require <code>versioned: true</code> on the model and
                throw a <code>StabilizeError</code> with code{" "}
                <code>VERSIONING_ERROR</code> otherwise.{" "}
                <code>rollback()</code> throws <code>ROLLBACK_ERROR</code> when
                the version does not exist.
              </p>
              <CodeBlock
                language="typescript"
                code={`// Get all versions
const history = await userRepo.history(user.id);

// Time-travel query
const pastUser = await userRepo.asOf(user.id, new Date("2025-01-01"));

// Rollback to a version
await userRepo.rollback(user.id, 2);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Single-Row Helpers
              </h2>
              <CodeBlock
                language="typescript"
                code={`async first(conditions?: Partial<T>): Promise<T | null>
async last(field: string = "id"): Promise<T | null>
async random(): Promise<T | null>
async firstOrCreate(conditions: Partial<T>, defaults: Partial<T> = {}, _client?: DBClient): Promise<T>
async updateOrCreate(conditions: Partial<T>, updates: Partial<T>, _client?: DBClient): Promise<T>
async lockForUpdate(id: number | string, _client?: DBClient): Promise<T | null>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>random()</code> orders by the dialect&apos;s random
                function (<code>RAND()</code> on MySQL,{" "}
                <code>NEWID()</code> on SQL Server, <code>RANDOM()</code>{" "}
                elsewhere). <code>lockForUpdate()</code> emits{" "}
                <code>FOR UPDATE</code> on Postgres and MySQL only — SQLite and
                SQL Server have no equivalent clause, so it degrades to an
                ordinary read there.
              </p>
              <CodeBlock
                language="typescript"
                code={`const first = await userRepo.first({ role: "admin" });
const latest = await userRepo.last("createdAt");
const lucky = await userRepo.random();

const user = await userRepo.firstOrCreate({ email }, { name: "New" });
const updated = await userRepo.updateOrCreate({ email }, { name: "Renamed" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Conditional Writes
              </h2>
              <CodeBlock
                language="typescript"
                code={`async bulkUpdate(
  updates: { where: { condition: string; params: any[] }; set: Partial<T> }[],
  options: { batchSize?: number } = {},
  _client?: DBClient,
): Promise<void>

async updateBy(conditions: Partial<T>, updates: Partial<T>, _client?: DBClient): Promise<number>
async deleteBy(conditions: Partial<T>, _client?: DBClient): Promise<number>
async restoreBy(conditions: Partial<T>, _client?: DBClient): Promise<number>
async truncate(_client?: DBClient): Promise<void>`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 mb-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  <code>updateBy()</code> and <code>deleteBy()</code> throw a{" "}
                  <code>StabilizeError</code> with code{" "}
                  <code>UNSAFE_QUERY</code> when given an empty condition
                  object, rather than affecting every row.{" "}
                  <code>truncate()</code> is the explicit way to clear a table.
                  <br />
                  <code>deleteBy()</code> soft-deletes instead of deleting when
                  the model has a soft-delete column.
                </p>
              </div>
              <CodeBlock
                language="typescript"
                code={`await userRepo.updateBy({ isActive: false }, { role: "inactive" });
await userRepo.deleteBy({ role: "spam" });
await userRepo.restoreBy({ role: "spam" });
await userRepo.truncate();`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Column &amp; Aggregate Helpers
              </h2>
              <CodeBlock
                language="typescript"
                code={`async pluck<K extends keyof T>(column: K): Promise<any[]>
async selectColumns(...columns: (keyof T)[]): Promise<Partial<T>[]>
async countDistinct(column: string): Promise<number>
async increment(id: number | string, field: string, amount: number = 1, _client?: DBClient): Promise<T>
async decrement(id: number | string, field: string, amount: number = 1, _client?: DBClient): Promise<T>
async toggle(id: number | string, field: string, _client?: DBClient): Promise<T>
hasColumn(field: string): boolean
getTableName(): string
getSoftDeleteField(): string | null
getIsVersioned(): boolean`}
              />
              <p className="text-muted-foreground mb-4">
                <code>increment()</code>, <code>decrement()</code> and{" "}
                <code>toggle()</code> run a bare SQL UPDATE and then re-read the
                row, so they return the updated entity. <code>toggle()</code>{" "}
                flips a boolean, and on SQLite/SQL Server emits a{" "}
                <code>CASE WHEN</code> rather than <code>NOT</code>.
              </p>
              <CodeBlock
                language="typescript"
                code={`const emails = await userRepo.pluck("email");
const partial = await userRepo.selectColumns("id", "email");
const distinct = await userRepo.countDistinct("role");

await userRepo.increment(user.id, "loginCount", 1);
await userRepo.decrement(user.id, "credits", 5);
await userRepo.toggle(user.id, "isActive");`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Bulk &amp; Iteration
              </h2>
              <CodeBlock
                language="typescript"
                code={`async bulkDelete(ids: (number | string)[], options: { batchSize?: number } = {}, _client?: DBClient): Promise<void>
async upsertMany(entities: Partial<T>[], keys: string[], batchSize: number = 100, _client?: DBClient): Promise<T[]>
async map<R>(query: QueryBuilder<T>, transform: (item: T) => R): Promise<R[]>
async each(query: QueryBuilder<T>, callback: (item: T, index: number) => void | Promise<void>, pageSize: number = 100): Promise<void>
async eachBatch(query: QueryBuilder<T>, callback: (batch: T[]) => void | Promise<void>, batchSize: number = 100): Promise<void>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>bulkDelete()</code> runs the per-row hooks for each id it
                finds and skips ids that do not exist.{" "}
                <code>each()</code> and <code>eachBatch()</code> page through
                the query with <code>LIMIT</code>/<code>OFFSET</code> until a
                short page comes back — they do not run in a transaction, so a
                concurrent write can shift rows between pages.
              </p>
              <CodeBlock
                language="typescript"
                code={`await userRepo.bulkDelete([1, 2, 3], { batchSize: 500 });

const names = await userRepo.map(
  userRepo.find(),
  (user) => user.name,
);

await userRepo.each(userRepo.find(), async (user, index) => {
  console.log(index, user.email);
});

await userRepo.eachBatch(userRepo.find(), async (batch) => {
  await externalApi.send(batch);
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Soft-Delete Queries
              </h2>
              <CodeBlock
                language="typescript"
                code={`findDeleted(): QueryBuilder<T>   // only soft-deleted rows
withTrashed(): QueryBuilder<T>   // soft-deleted rows included`}
              />
              <p className="text-muted-foreground mb-4">
                Both return a builder, so they are executed with{" "}
                <code>.execute(client)</code>. <code>findDeleted()</code> throws
                a <code>StabilizeError</code> with code <code>QUERY_ERROR</code>{" "}
                when the model has no soft-delete column.
              </p>
              <CodeBlock
                language="typescript"
                code={`const trashed = await userRepo.findDeleted().execute(orm.client);
const all = await userRepo.withTrashed().execute(orm.client);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Pagination &amp; Rows</h2>
              <CodeBlock
                language="typescript"
                code={`async paginate(
  page: number,
  pageSize: number,
  options: any = {},
): Promise<{ data: T[]; total: number; page: number; pageSize: number }>

async findAndCount(options: { relations?: string[] } = {}): Promise<{ data: T[]; total: number }>
async findMany(options: {
  where?: Partial<T>;
  cursor?: { field: string; value: any; direction?: "forward" | "backward" };
  take?: number;
  skip?: number;
  orderBy?: { field: string; direction: "ASC" | "DESC" };
  relations?: string[];
} = {}): Promise<T[]>

async seed(data: Partial<T>[], options: { ignoreDuplicates?: boolean } = {}, _client?: DBClient): Promise<T[]>
async healthCheck(): Promise<{ status: string; table: string; rows: number; latencyMs: number }>
async rawQuery<R = T>(query: string, params?: any[]): Promise<R[]>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>paginate()</code> accepts an <code>options</code> argument
                but the current implementation does not read it — filtering is
                not applied to either the page or the total. Use{" "}
                <code>findAndCountAll()</code> when you need conditions.{" "}
                <code>findMany()</code> is the cursor-based reader; see the
                Pagination page.
              </p>
              <CodeBlock
                language="typescript"
                code={`const page = await userRepo.paginate(1, 20);
// { data: [...], total: 100, page: 1, pageSize: 20 }

const { data, total } = await userRepo.findAndCount({ relations: ["posts"] });

const health = await userRepo.healthCheck();
// { status: "healthy", table: "users", rows: 42, latencyMs: 0.5 }

await userRepo.seed([{ id: generateUUID(), name: "Admin" }], { ignoreDuplicates: true });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Reusable Scopes</h2>
              <CodeBlock
                language="typescript"
                code={`find(): QueryBuilder<T>
scope(name: string, ...args: any[]): QueryBuilder<T>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>scope()</code> is <code>find()</code> with a model scope
                applied. Both return a builder.
              </p>
              <CodeBlock
                language="typescript"
                code={`const admins = await userRepo.scope("byRole", "admin").execute(orm.client);`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
