"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
                records.
              </p>
              <CodeBlock
                language="typescript"
                code={`const users = await userRepo.find().execute(orm.client);`}
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
                code={`async findOneBy(conditions: Partial<T>, options?, client?): Promise<T | null>
async findBy(conditions: Partial<T>, options?): Promise<T[]>`}
              />
              <p className="text-muted-foreground mb-4">
                TypeORM-style conditional finders.
              </p>
              <CodeBlock
                language="typescript"
                code={`const user = await userRepo.findOneBy({ email: "alice@example.com" });
const admins = await userRepo.findBy({ role: "admin" }, { limit: 10 });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">create()</h2>
              <CodeBlock
                language="typescript"
                code={`async create(entity: Partial<T>, options?: { relations?: string[] }): Promise<T>`}
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
                code={`async bulkCreate(entities: Partial<T>[], options?: { batchSize?: number }): Promise<T[]>`}
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
                code={`async update(id: number | string, entity: Partial<T>): Promise<T>`}
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
                code={`async upsert(entity: Partial<T>, keys: string[]): Promise<T>
async bulkUpsert(entities: Partial<T>[], keys: string[]): Promise<T[]>`}
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
                code={`async delete(id: number | string): Promise<void>`}
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
                code={`async recover(id: number | string): Promise<T>
async recoverAll(): Promise<number>`}
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
                code={`// Get all versions
const history = await userRepo.history(user.id);

// Time-travel query
const pastUser = await userRepo.asOf(user.id, new Date("2025-01-01"));

// Rollback to a version
await userRepo.rollback(user.id, 2);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Utility Methods</h2>
              <CodeBlock
                language="typescript"
                code={`// Pluck single column
const emails = await userRepo.pluck("email");

// Select specific columns
const partial = await userRepo.selectColumns("id", "email");

// Increment/decrement
await userRepo.increment(user.id, "loginCount", 1);
await userRepo.decrement(user.id, "credits", 5);

// Toggle boolean
await userRepo.toggle(user.id, "isActive");

// Conditional update/delete
await userRepo.updateBy({ isActive: false }, { role: "inactive" });
await userRepo.deleteBy({ role: "spam" });

// Paginate
const page = await userRepo.paginate(1, 20);
// { data: [...], total: 100, page: 1, pageSize: 20 }

// Health check
const health = await userRepo.healthCheck();
// { status: "healthy", table: "users", rows: 42, latencyMs: 0.5 }

// Raw query
const results = await userRepo.rawQuery("SELECT * FROM users WHERE age > ?", [18]);

// Truncate
await userRepo.truncate();

// Seed
await userRepo.seed([{ id: generateUUID(), name: "Admin" }], { ignoreDuplicates: true });`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
