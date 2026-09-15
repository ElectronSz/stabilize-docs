import { CodeBlock } from "@/components/code-block";

export default function SoftDeletesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Soft Deletes</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Mark records as deleted without permanently removing them from the
          database
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Enabling Soft Deletes</h2>
            <p className="text-muted-foreground mb-4">
              Add a <code>deletedAt</code> column with{" "}
              <code>softDelete: true</code>:
            </p>
            <CodeBlock
              filename="models/Post.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 255, required: true },
    content: { type: DataTypes.TEXT },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Soft Deleting Records</h2>
            <p className="text-muted-foreground mb-4">
              The <code>delete()</code> method sets the <code>deletedAt</code>{" "}
              timestamp:
            </p>
            <CodeBlock
              language="typescript"
              code={`const repo = orm.getRepository(Post);

// Soft delete (sets deletedAt to current timestamp)
await repo.delete(post.id);

// The record still exists but won't appear in normal queries
const allPosts = await repo.find().execute(orm.client);
// Soft-deleted records are automatically excluded`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Finding Deleted Records</h2>
            <CodeBlock
              language="typescript"
              code={`// Find only soft-deleted records
const deletedPosts = await repo.findDeleted().execute(orm.client);

// Find all records including soft-deleted
const allPosts = await repo.withTrashed().execute(orm.client);

// Count them - there is no countDeleted(). Count the query instead:
const deletedCount = await repo.findDeleted().countExec(orm.client);`}
            />
            <p className="text-muted-foreground mt-4">
              There is no <code>countDeleted()</code>.{" "}
              <code>findDeleted()</code> returns a builder, so any of the
              builder&apos;s aggregate terminators will do —{" "}
              <code>countExec()</code> or <code>existsExec()</code>.
            </p>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                findDeleted() throws without a soft-delete column
              </p>
              <p className="text-sm text-muted-foreground">
                <code>findDeleted()</code> checks for a soft-delete column and
                raises <code>QUERY_ERROR</code> if the model has none.{" "}
                <code>withTrashed()</code> does not check — it returns a builder
                with no filter attached, which on such a model is the same result
                an ordinary query already gives. See{" "}
                <a href="/docs/helpers" className="text-accent underline">
                  Helper Methods
                </a>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Recovering Records</h2>
            <CodeBlock
              language="typescript"
              code={`// Recover a single record
const recovered = await repo.recover(post.id);

// Recover all soft-deleted records
const recoveredCount = await repo.recoverAll();
console.log("Recovered", recoveredCount, "records");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Bulk Soft Delete</h2>
            <CodeBlock
              language="typescript"
              code={`// Bulk soft delete multiple records. Returns void, and runs in one
// transaction; batchSize defaults to 1000.
await repo.bulkDelete([post1.id, post2.id, post3.id]);

// Conditional delete - returns the affected row count
const deletedCount = await repo.deleteBy({ status: "archived" });`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <code>find()</code> automatically adds{" "}
                <code>WHERE deletedAt IS NULL</code>, and every method built on
                it inherits that filter
              </li>
              <li>
                <code>delete()</code> runs{" "}
                <code>UPDATE SET deletedAt = ?</code> with the current time bound
                as a parameter, instead of <code>DELETE</code>. The timestamp is
                formatted for the dialect rather than written as{" "}
                <code>NOW()</code> — SQLite has no <code>NOW()</code> function
              </li>
              <li>
                <code>recover()</code> runs{" "}
                <code>UPDATE SET deletedAt = NULL</code>
              </li>
              <li>
                <code>count()</code> and <code>exists()</code> build their own
                query but still exclude soft-deleted rows, as does{" "}
                <code>paginate()</code>
              </li>
              <li>
                Lifecycle hooks (<code>beforeDelete</code>,{" "}
                <code>afterDelete</code>) still fire on soft delete, and{" "}
                <code>delete()</code> throws{" "}
                <code>DELETE_ERROR</code> if the row does not exist
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <code>delete()</code> runs inside a transaction: it reads the row
              first so the hooks receive the pre-delete entity, then deletes, then
              fires <code>afterDelete</code>. That read is also why a missing id
              is an error rather than a silent no-op.
            </p>
          </section>
        </div>
    </div>
  );
}
