"use client"

import { CodeBlock } from "@/components/code-block"

export default function ManyToManyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Many-to-Many</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Link, unlink and reconcile rows across a join table. <br />
            <code className="text-accent">attach</code>,{" "}
            <code className="text-accent">detach</code> and{" "}
            <code className="text-accent">sync</code> manage the links; the rows
            on either side are untouched.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Declaring the Relation</h2>
              <p className="text-muted-foreground mb-4">
                A many-to-many relation names the join table and the two columns
                inside it. There is no pivot model — the join table is declared
                by name only, with exactly two keys.
              </p>
              <CodeBlock
                filename="models/post.ts"
                language="typescript"
                code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

export const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
  },
  relations: [
    {
      type: RelationType.ManyToMany,
      target: () => Tag,
      property: "tags",        // how you name it in code
      joinTable: "post_tags",  // the table holding the links
      foreignKey: "post_id",   // this model's column in the join table
      inverseKey: "tag_id",    // the other model's column
    },
  ],
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Create the Join Table</h2>
              <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  autoMigrate does not create join tables
                </p>
                <p className="text-sm text-muted-foreground">
                  AutoMigrate reads a model&apos;s{" "}
                  <code>columns</code> — the join table has no model, so nothing
                  generates it. Every{" "}
                  <code>attach</code>/<code>detach</code>/<code>sync</code> call
                  will fail with <code>RELATION_ERROR</code> until the table
                  exists. Declare it in a migration, or create it up front:
                </p>
              </div>
              <CodeBlock
                filename="migrations/20260402120000_post_tags.json"
                language="json"
                code={`{
  "name": "create_post_tags",
  "up": "CREATE TABLE post_tags (post_id INTEGER, tag_id INTEGER)",
  "down": "DROP TABLE post_tags"
}`}
              />
              <p className="text-muted-foreground mt-4">
                Give the two columns a composite primary key or a unique index
                if you want the database itself to reject duplicate links.
                Stabilize already dedupes within a single call, but two
                concurrent <code>attach</code> calls can still race.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">attach</h2>
              <p className="text-muted-foreground mb-4">
                Adds links. Accepts a single id or an array, dedupes the input,
                and returns how many links it created — re-attaching an existing
                link is a no-op, not an error, so{" "}
                <code className="text-accent">attach</code> is safe to call
                twice.
              </p>
              <CodeBlock
                filename="attach.ts"
                language="typescript"
                code={`const postRepo = orm.getRepository(Post);

await postRepo.attach(20, "tags", [1, 2]);  // => 2
await postRepo.attach(20, "tags", [1, 2]);  // => 0  (already linked)
await postRepo.attach(21, "tags", 1);       // => 1  (single id is fine)`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">detach</h2>
              <p className="text-muted-foreground mb-4">
                Removes links. Omit the third argument to unlink{" "}
                <strong>everything</strong> — an easy thing to do by accident,
                so pass an explicit list unless that is what you mean.
              </p>
              <CodeBlock
                filename="detach.ts"
                language="typescript"
                code={`await postRepo.detach(20, "tags", [2]);  // => 1
await postRepo.detach(21, "tags", 1);    // => 1
await postRepo.detach(20, "tags");       // => 2  (unlinks ALL tags)`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">sync</h2>
              <p className="text-muted-foreground mb-4">
                Makes the links match an exact set — attaching what is missing
                and detaching what is extra, in one transaction. This is what
                you want behind a checkbox list, where the client posts the
                complete selection and the server reconciles.
              </p>
              <CodeBlock
                filename="sync.ts"
                language="typescript"
                code={`await postRepo.sync(21, "tags", [2, 3]);
// => { attached: 2, detached: 1 }

await postRepo.sync(21, "tags", []);
// => { attached: 0, detached: 2 }   (clears all links)`}
              />
              <CodeBlock
                filename="route.ts"
                language="typescript"
                code={`app.put("/posts/:id/tags", async (req, res) => {
  const { tags } = req.body;   // [1, 4, 7] - the full selection
  const result = await postRepo.sync(Number(req.params.id), "tags", tags);
  res.json(result);
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Reading the Links</h2>
              <p className="text-muted-foreground mb-4">
                Load the related rows through{" "}
                <code className="text-accent">relations</code> on any finder.
                The relation is named by its{" "}
                <code className="text-accent">property</code>, not the table.
              </p>
              <CodeBlock
                filename="read.ts"
                language="typescript"
                code={`const post = await postRepo.findOne(20, { relations: ["tags"] });
console.log(post.tags.map((t) => t.name));`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
              <CodeBlock
                filename="api.ts"
                language="typescript"
                code={`attach(
  id: number | string,
  relation: string,
  targetIds: number | string | (number | string)[],
  client?: DBClient,
): Promise<number>                    // links created

detach(
  id: number | string,
  relation: string,
  targetIds?: number | string | (number | string)[],  // omit = unlink all
  client?: DBClient,
): Promise<number>                    // links removed

sync(
  id: number | string,
  relation: string,
  targetIds: (number | string)[],     // array only
  client?: DBClient,
): Promise<{ attached: number; detached: number }>`}
              />
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  Links carry no extra data
                </p>
                <p className="text-sm text-muted-foreground">
                  All three take ids only. There is no way to write an ordering
                  column, a timestamp or any other field onto the link itself —
                  the join table is two keys and nothing else. If your pivot
                  needs its own columns, model it explicitly: create a real
                  model for the join table with two{" "}
                  <code>ManyToOne</code> relations and treat it as an entity.
                </p>
              </div>
            </section>
          </div>
    </div>
  )
}
