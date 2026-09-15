"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function OptimisticLockingApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Optimistic Locking API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Version-based conflict detection on writes, and the pessimistic
            locking alternative
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                optimisticLock Column Option
              </h2>
              <CodeBlock
                language="typescript"
                code={`interface ColumnConfig {
  optimisticLock?: boolean;  // Enable optimistic locking
}`}
              />
              <p className="text-muted-foreground mb-4">
                The first column carrying the flag becomes the model&apos;s lock
                field. The lock column is advanced on every locked write path.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    optimisticLock
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Marks this column as the model&apos;s lock field
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="models/Document.ts"
                language="typescript"
                code={`const Document = defineModel({
  tableName: "documents",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 255, required: true },
    version: { type: DataTypes.INTEGER, optimisticLock: true },
  },
});`}
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
                Seeds the version to <code>1</code> if you don&apos;t supply
                one.
              </p>
              <CodeBlock
                filename="example/create.ts"
                language="typescript"
                code={`const doc = await documentRepo.create({
  id: generateUUID(),
  title: "Draft",
});
// doc.version === 1`}
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
                A version you pass in the entity wins over the one just read (
                <code>expected = callerVersion ?? lockValue</code>).
              </p>
              <h3 className="font-semibold mb-2">What the statement becomes:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    SET
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Advances the lock column to <code>expected + 1</code>, or to{" "}
                    <code>1</code> when the value is non-numeric
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    WHERE
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    <code>id = ? AND &lt;lockCol&gt; = ?</code>, or{" "}
                    <code>IS NULL</code> when the read value was null
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    conflict
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Zero rows affected throws
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/update.ts"
                language="typescript"
                code={`const doc = await documentRepo.findOne(id);

// Optimistic: the version read above travels with the write.
await documentRepo.update(id, {
  title: "Final",
  version: doc.version,
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">updateBy()</h2>
              <CodeBlock
                language="typescript"
                code={`async updateBy(
  conditions: Partial<T>,
  updates: Partial<T>,
  _client?: DBClient,
): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                Advances the lock column in SQL as{" "}
                <code>&lt;lockCol&gt; = &lt;lockCol&gt; + 1</code>, unless the
                lock field is itself among the write values.
              </p>
              <CodeBlock
                filename="example/update-by.ts"
                language="typescript"
                code={`await documentRepo.updateBy({ title: "Draft" }, { title: "Final" });
// SET title = ?, version = version + 1 WHERE title = ?`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">upsert()</h2>
              <CodeBlock
                language="typescript"
                code={`async upsert(
  entity: Partial<T>,
  keys: string[],
  _client?: DBClient,
): Promise<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Seeds the version to <code>1</code> if undefined.
              </p>
              <CodeBlock
                filename="example/upsert.ts"
                language="typescript"
                code={`await documentRepo.upsert(
  { id: generateUUID(), title: "Draft" },
  ["id"],
);
// version seeded to 1 when the entity does not carry one`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                CONCURRENT_MODIFICATION
              </h2>
              <CodeBlock
                language="typescript"
                code={`class StabilizeError extends Error {
  code: string;
  originalError?: unknown;
}`}
              />
              <p className="text-muted-foreground mb-4">
                A lost update throws a <code>StabilizeError</code> with the code{" "}
                <code>&quot;CONCURRENT_MODIFICATION&quot;</code>.
              </p>
              <h3 className="font-semibold mb-2">Message:</h3>
              <CodeBlock
                language="typescript"
                code={`Record was modified by another transaction (optimistic lock conflict on <field>)`}
              />
              <p className="text-muted-foreground mb-4">
                There is no built-in retry. The caller handles the conflict.
              </p>
              <CodeBlock
                filename="example/conflict.ts"
                language="typescript"
                code={`import { StabilizeError } from "stabilize-orm";

try {
  await documentRepo.update(id, { title: "Final", version: doc.version });
} catch (err) {
  if (err instanceof StabilizeError && err.code === "CONCURRENT_MODIFICATION") {
    // Re-read and retry at the application level.
  }
}`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">lockForUpdate()</h2>
              <CodeBlock
                language="typescript"
                code={`async lockForUpdate(id: number | string, _client?: DBClient): Promise<T | null>`}
              />
              <p className="text-muted-foreground mb-4">
                The pessimistic alternative on the repository. It builds{" "}
                <code>find().where(&quot;id = ?&quot;, id).limit(1)</code>,
                applies{" "}
                <code>FOR UPDATE</code> on PostgreSQL and MySQL, and returns the
                row or <code>null</code>. SQLite and SQL Server{" "}
                <strong>skip the lock clause entirely</strong> — SQLite has no{" "}
                <code>FOR UPDATE</code>, and T-SQL spells its equivalent as a
                table hint the builder cannot express — so on those two dialects
                this degrades to an ordinary read and takes no row lock.
              </p>
              <CodeBlock
                filename="example/lock-for-update.ts"
                language="typescript"
                code={`await orm.transaction(async (tx) => {
  const doc = await documentRepo.lockForUpdate(id, tx);
  if (!doc) return;

  await documentRepo.update(id, { title: "Final" }, tx);
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                QueryBuilder locking
              </h2>
              <CodeBlock
                language="typescript"
                code={`lock(mode: LockMode = "FOR UPDATE"): QueryBuilder<T>
forUpdate(): QueryBuilder<T>
forShare(): QueryBuilder<T>`}
              />
              <p className="text-muted-foreground mb-4">
                Chainable. Valid modes are{" "}
                <code>&quot;FOR UPDATE&quot;</code>,{" "}
                <code>&quot;FOR SHARE&quot;</code>,{" "}
                <code>&quot;FOR NO KEY UPDATE&quot;</code>, and{" "}
                <code>&quot;FOR KEY SHARE&quot;</code>.
              </p>
              <CodeBlock
                filename="example/qb-lock.ts"
                language="typescript"
                code={`const rows = await documentRepo
  .find()
  .where("id = ?", id)
  .forUpdate()
  .execute(orm.client);

const shared = await documentRepo
  .find()
  .where("status = ?", "open")
  .lock("FOR SHARE")
  .execute(orm.client);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Related: versioned</h2>
              <p className="text-muted-foreground mb-4">
                <code>versioned: true</code> (model-level history) is a SEPARATE
                feature from the <code>optimisticLock</code> column. They are
                not the same mechanism and should not be conflated:{" "}
                <code>versioned</code> keeps a history of row revisions, while{" "}
                <code>optimisticLock</code> detects a concurrent write to a
                single row.
              </p>
              <CodeBlock
                filename="models/Document.ts"
                language="typescript"
                code={`const Document = defineModel({
  tableName: "documents",
  versioned: true,                       // row history
  columns: {
    version: { type: DataTypes.INTEGER, optimisticLock: true },  // conflict detection
  },
});`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
