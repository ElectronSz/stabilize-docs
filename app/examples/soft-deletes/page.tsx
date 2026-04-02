"use client";

import { CodeBlock } from "@/components/code-block";

export default function SoftDeletesExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Soft Deletes & Recovery</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Implement soft delete, recovery, bulk operations, and permanent
          deletion patterns
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Enable Soft Delete</h2>
            <p className="text-muted-foreground mb-4">
              Add the deletedAt column with softDelete flag:
            </p>
            <CodeBlock
              filename="models/Post.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Post = defineModel({
  tableName: "posts",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 200, required: true },
    body: { type: DataTypes.TEXT },
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Soft Delete a Record
            </h2>
            <CodeBlock
              filename="examples/soft-delete.ts"
              language="typescript"
              code={`const postRepo = orm.getRepository(Post);

// Create a post
const post = await postRepo.create({
  id: generateUUID(),
  title: "My Post",
  body: "Post content here",
});
console.log("Created:", post.id);

// Soft delete - sets deletedAt timestamp
await postRepo.delete(post.id);
console.log("Soft-deleted");

// The post is no longer returned by normal queries
const activePosts = await postRepo.find().execute(orm.client);
console.log("Active posts:", activePosts.length); // post is excluded`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Find Deleted Records
            </h2>
            <CodeBlock
              filename="examples/find-deleted.ts"
              language="typescript"
              code={`// Find only soft-deleted records
const deletedPosts = await postRepo.findDeleted().execute(orm.client);
console.log("Deleted posts:", deletedPosts.length);

// Count deleted records
const deletedCount = await postRepo.countDeleted();
console.log("Deleted count:", deletedCount);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Recover Deleted Records
            </h2>
            <CodeBlock
              filename="examples/recover.ts"
              language="typescript"
              code={`// Recover a single record
const recovered = await postRepo.recover(post.id);
console.log("Recovered:", recovered.title);

// Recover all soft-deleted records
const recoveredCount = await postRepo.recoverAll();
console.log("Recovered", recoveredCount, "records");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Bulk Soft Delete</h2>
            <CodeBlock
              filename="examples/bulk-delete.ts"
              language="typescript"
              code={`// Bulk soft delete multiple records
await postRepo.bulkDelete([post1.id, post2.id, post3.id]);
console.log("Bulk deleted 3 posts");

// Bulk delete is also transactional and runs hooks
// beforeDelete and afterDelete hooks fire for each record`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Scopes with Soft Delete
            </h2>
            <CodeBlock
              filename="examples/scopes-soft-delete.ts"
              language="typescript"
              code={`// The find() method automatically excludes soft-deleted records
const active = await postRepo.find().execute(orm.client);
// WHERE deletedAt IS NULL is automatically added

// Use findDeleted() to get only deleted records
const deleted = await postRepo.findDeleted().execute(orm.client);

// Other query methods also respect soft delete
const count = await postRepo.count(); // excludes deleted
const exists = await postRepo.exists({ title: "My Post" }); // excludes deleted
const page = await postRepo.paginate(1, 10); // excludes deleted`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
