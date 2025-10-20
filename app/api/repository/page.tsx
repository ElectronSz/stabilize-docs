"use client"

import { Card } from "@/components/ui/card"
import { CodeBlock } from "@/components/code-block"

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

            {/* find() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">find()</h2>
              <CodeBlock code={`find(): QueryBuilder<T>`} language="typescript" />
              <p className="text-muted-foreground mb-4">
                Creates a new QueryBuilder instance for the repository's table. Automatically excludes soft-deleted records.
              </p>
              <CodeBlock
                code={`const users = await userRepository
  .find()
  .where("isActive = ?", true)
  .orderBy("createdAt DESC")
  .limit(10)
  .execute(client);`}
                language="typescript"
              />
            </Card>

            {/* findOne() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">findOne()</h2>
              <CodeBlock
                code={`async findOne(
  id: number | string,
  options?: { relations?: string[] },
  _client?: DBClient
): Promise<T | null>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">Finds a single record by its primary key.</p>
              <CodeBlock
                code={`const user = await userRepository.findOne(1);

// With relations
const userWithPosts = await userRepository.findOne(1, {
  relations: ["posts"]
});`}
                language="typescript"
              />
            </Card>

            {/* create() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">create()</h2>
              <CodeBlock
                code={`async create(
  entity: Partial<T>,
  options?: { relations?: string[] }
): Promise<T>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Creates a new record. Runs beforeCreate, beforeSave, afterCreate, and afterSave hooks. Automatically manages timestamps.
              </p>
              <CodeBlock
                code={`const newUser = await userRepository.create({
  email: "john@example.com",
  name: "John Doe",
});`}
                language="typescript"
              />
            </Card>

            {/* bulkCreate() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">bulkCreate()</h2>
              <CodeBlock
                code={`async bulkCreate(
  entities: Partial<T>[],
  options?: { relations?: string[]; batchSize?: number }
): Promise<T[]>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">Creates multiple records in batches.</p>
              <CodeBlock
                code={`const users = await userRepository.bulkCreate([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
], { batchSize: 1000 });`}
                language="typescript"
              />
            </Card>

            {/* update() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">update()</h2>
              <CodeBlock
                code={`async update(
  id: number | string,
  entity: Partial<T>
): Promise<T>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Updates a record by ID. Runs beforeUpdate, beforeSave, afterUpdate, and afterSave hooks.
              </p>
              <CodeBlock
                code={`const updated = await userRepository.update(1, {
  name: "John Smith",
});`}
                language="typescript"
              />
            </Card>

            {/* bulkUpdate() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">bulkUpdate()</h2>
              <CodeBlock
                code={`async bulkUpdate(
  updates: {
    where: { condition: string; params: any[] };
    set: Partial<T>;
  }[],
  options?: { batchSize?: number }
): Promise<void>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">Updates multiple records based on different conditions.</p>
              <CodeBlock
                code={`await userRepository.bulkUpdate([
  {
    where: { condition: "id = ?", params: [1] },
    set: { status: "inactive" }
  },
  {
    where: { condition: "id = ?", params: [2] },
    set: { status: "inactive" }
  },
]);`}
                language="typescript"
              />
            </Card>

            {/* upsert() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">upsert()</h2>
              <CodeBlock
                code={`async upsert(
  entity: Partial<T>,
  keys: string[]
): Promise<T>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Performs an "update or insert" operation based on unique keys.
              </p>
              <CodeBlock
                code={`const user = await userRepository.upsert(
  { email: "john@example.com", name: "John" },
  ["email"]
);`}
                language="typescript"
              />
            </Card>

            {/* delete() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">delete()</h2>
              <CodeBlock code={`async delete(id: number | string): Promise<void>`} language="typescript" />
              <p className="text-muted-foreground mb-4">
                Deletes a record by ID. Performs soft delete if enabled. Runs beforeDelete and afterDelete hooks.
              </p>
              <CodeBlock code={`await userRepository.delete(1);`} language="typescript" />
            </Card>

            {/* bulkDelete() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">bulkDelete()</h2>
              <CodeBlock
                code={`async bulkDelete(
  ids: (number | string)[],
  options?: { batchSize?: number }
): Promise<void>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">Deletes multiple records by their IDs in batches.</p>
              <CodeBlock
                code={`await userRepository.bulkDelete([1, 2, 3], { batchSize: 1000 });`}
                language="typescript"
              />
            </Card>

            {/* recover() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">recover()</h2>
              <CodeBlock code={`async recover(id: number | string): Promise<T>`} language="typescript" />
              <p className="text-muted-foreground mb-4">
                Recovers a soft-deleted record. Only works if soft delete is enabled.
              </p>
              <CodeBlock code={`const recovered = await userRepository.recover(1);`} language="typescript" />
            </Card>

            {/* asOf() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">asOf()</h2>
              <CodeBlock
                code={`async asOf(
  id: number | string,
  asOfDate: Date
): Promise<T | null>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Time-travel query: get record as it was at a specific point in time. Only works if versioning is enabled.
              </p>
              <CodeBlock
                code={`const pastUser = await userRepository.asOf(
  1,
  new Date("2025-01-01")
);`}
                language="typescript"
              />
            </Card>

            {/* history() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">history()</h2>
              <CodeBlock code={`async history(id: number | string): Promise<T[]>`} language="typescript" />
              <p className="text-muted-foreground mb-4">
                Get all historical versions of a record. Only works if versioning is enabled.
              </p>
              <CodeBlock
                code={`const versions = await userRepository.history(1);
console.log(\`Found \${versions.length} versions\`);`}
                language="typescript"
              />
            </Card>

            {/* rollback() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">rollback()</h2>
              <CodeBlock
                code={`async rollback(
  id: number | string,
  version: number
): Promise<T>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Rollback a record to a previous version. Only works if versioning is enabled.
              </p>
              <CodeBlock code={`const restored = await userRepository.rollback(1, 2);`} language="typescript" />
            </Card>

            {/* scope() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">scope()</h2>
              <CodeBlock code={`scope(name: string, ...args: any[]): QueryBuilder<T>`} language="typescript" />
              <p className="text-muted-foreground mb-4">Applies a custom scope to the query.</p>
              <CodeBlock
                code={`const activeUsers = await userRepository
  .scope("active")
  .execute(client);`}
                language="typescript"
              />
            </Card>

            {/* rawQuery() */}
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">rawQuery()</h2>
              <CodeBlock
                code={`async rawQuery<T>(
  query: string,
  params?: any[]
): Promise<T[]>`}
                language="typescript"
              />
              <p className="text-muted-foreground mb-4">
                Executes a raw SQL query. Use with caution as it bypasses ORM abstractions.
              </p>
              <CodeBlock
                code={`const results = await userRepository.rawQuery(
  "SELECT * FROM users WHERE status = ?",
  ["active"]
);`}
                language="typescript"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}