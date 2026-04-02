import { CodeBlock } from "@/components/code-block";

export default function SoftDeletesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
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

// Count deleted records
const deletedCount = await repo.countDeleted();`}
            />
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
              code={`// Bulk soft delete multiple records
await repo.bulkDelete([post1.id, post2.id, post3.id);

// Conditional delete
const deletedCount = await repo.deleteBy({ status: "archived" });`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <code>find()</code> automatically adds{" "}
                <code>WHERE deletedAt IS NULL</code>
              </li>
              <li>
                <code>delete()</code> runs{" "}
                <code>UPDATE SET deletedAt = NOW()</code> instead of{" "}
                <code>DELETE</code>
              </li>
              <li>
                <code>recover()</code> runs{" "}
                <code>UPDATE SET deletedAt = NULL</code>
              </li>
              <li>
                <code>count()</code>, <code>exists()</code>,{" "}
                <code>paginate()</code> all exclude soft-deleted records
              </li>
              <li>
                Lifecycle hooks (<code>beforeDelete</code>,{" "}
                <code>afterDelete</code>) still fire on soft delete
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
