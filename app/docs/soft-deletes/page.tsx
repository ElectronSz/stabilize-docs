import { CodeBlock } from "@/components/code-block"

export default function SoftDeletesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Soft Deletes</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Mark records as deleted without permanently removing them from the database
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">What are Soft Deletes?</h2>
            <p className="text-muted-foreground mb-4">
              Soft deletes allow you to mark records as deleted without actually removing them from the database. This
              is useful for maintaining data integrity, implementing undo functionality, or keeping records for audit
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Enabling Soft Deletes</h2>
            <p className="text-muted-foreground mb-4">
              Enable soft deletes on a model by setting the <code>softDelete</code> option:
            </p>
            <CodeBlock
              filename="models/post.ts"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Post = defineModel({
  tableName: "posts",
  softDelete: true, // Enable soft deletes
  columns: {
    id: {
      type: DataTypes.Integer,
    },
    title: {
      type: DataTypes.String,
      length: 255,
    },
    content: {
      type: DataTypes.Text,
    },
  },
});`}
            />
            <p className="text-muted-foreground mt-4">
              When enabled, Stabilize automatically adds a <code>deletedAt</code> column to your table.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Soft Deleting Records</h2>
            <p className="text-muted-foreground mb-4">
              Use the standard <code>delete</code> method - it will automatically perform a soft delete:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Post);

// Soft delete a post (sets deletedAt to current timestamp)
await repo.delete(1);

// The record still exists in the database
// but won't appear in normal queries`}
            />
          </section>

         

          <section>
            <h2 className="text-2xl font-bold mb-4">Restoring Soft Deleted Records</h2>
            <p className="text-muted-foreground mb-4">
              Restore a soft deleted record using the <code>recover</code> method:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Post);

// Restore a soft deleted post
await repo.recover(1);

// The post is now available in normal queries again
const post = await repo.findById(1);
console.log(post); // Post is restored

// Bulk restore
await repo.recover([1, 2, 3]);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Permanent Deletion</h2>
            <p className="text-muted-foreground mb-4">
              Force a permanent deletion using the <code>forceDelete</code> method:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Post);

// Permanently delete a post (removes from database)
await repo.forceDelete(1);

// This cannot be undone!`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Query Builder Integration</h2>
            <p className="text-muted-foreground mb-4">Soft delete filters work seamlessly with the query builder:</p>
            <CodeBlock
              code={`const repo = orm.getRepository(Post);

// Complex query excluding soft deleted
const posts = await repo
  .query()
  .where("published", "=", true)
  .orderBy("createdAt", "DESC")
  .limit(10)
  .findAll();
`}
            />
          </section>

         

          <section>
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use soft deletes for user-generated content that might need to be restored</li>
              <li>Implement a cleanup job to permanently delete old soft-deleted records</li>
              <li>Consider the storage implications of keeping deleted records</li>
              <li>Add indexes on the deletedAt column for better query performance</li>
              <li>Document which models use soft deletes in your team's guidelines</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
