"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function ManyToManyApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Many-to-Many API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Link management across a join table
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Relation declaration
              </h2>
              <CodeBlock
                language="typescript"
                code={`export interface RelationConfig {
  type: RelationType;
  target: () => any;
  property: string;
  foreignKey?: string;
  inverseKey?: string;
  joinTable?: string;
}`}
              />
              <p className="text-muted-foreground mb-4">
                <code>RelationType</code> is a numeric enum:{" "}
                <code>OneToOne</code>, <code>OneToMany</code>,{" "}
                <code>ManyToOne</code>, <code>ManyToMany</code>. A many-to-many
                relation is declared entirely by name &mdash; there is no{" "}
                <code>through</code> field and no per-column pivot definition.
                The join table has exactly two key columns.
              </p>
              <h3 className="font-semibold mb-2">Required fields:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    joinTable
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Name of the join table
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    foreignKey
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Key column pointing at this model
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    inverseKey
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Key column pointing at the target model
                  </span>
                </li>
              </ul>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  All three are required at runtime.
                </p>
                <p className="text-sm text-muted-foreground">
                  For a <code>ManyToMany</code> relation,{" "}
                  <code>joinTable</code>, <code>foreignKey</code> and{" "}
                  <code>inverseKey</code> must all be present. If any is
                  missing, the link methods throw a <code>StabilizeError</code>{" "}
                  with <code>code === &quot;RELATION_ERROR&quot;</code>.
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
                <p className="text-sm font-semibold mb-2">
                  autoMigrate does not create join tables.
                </p>
                <p className="text-sm text-muted-foreground">
                  <code>autoMigrate</code> only reads a model&apos;s{" "}
                  <code>columns</code>, and the join table has no model. Create
                  it yourself &mdash; a migration, raw SQL, or the{" "}
                  <code>stabilize-cli</code> migration flow &mdash; or the link
                  methods will fail because the table does not exist.
                </p>
              </div>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">attach()</h2>
              <CodeBlock
                language="typescript"
                code={`async attach(
  id: number | string,
  relation: string,
  targetIds: number | string | (number | string)[],
  _client?: DBClient,
): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                Adds links and returns how many were created. Dedupes the ids
                and is idempotent &mdash; ids that are already linked are not
                counted or written twice.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    id
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Primary key of the owning record
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    relation
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    The relation&apos;s <code>property</code> name, e.g.{" "}
                    <code>&quot;tags&quot;</code> &mdash; not the table name. It
                    must resolve to a <code>ManyToMany</code> relation or the
                    call throws <code>RELATION_ERROR</code>.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    targetIds
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    One id or an array of ids to link
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    _client
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Optional <code>DBClient</code> (optional)
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/attach.ts"
                language="typescript"
                code={`await postRepo.attach(20, "tags", [1, 2]); // => 2
await postRepo.attach(20, "tags", 1);        // => 0 (already linked)
await postRepo.attach(20, "tags", ["3"]);    // => 1 ("3" and 3 are the same id)`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">detach()</h2>
              <CodeBlock
                language="typescript"
                code={`async detach(
  id: number | string,
  relation: string,
  targetIds?: number | string | (number | string)[],
  _client?: DBClient,
): Promise<number>`}
              />
              <p className="text-muted-foreground mb-4">
                Removes links and returns how many were removed. Omit{" "}
                <code>targetIds</code> to unlink <em>all</em> links for the
                record.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    id
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Primary key of the owning record
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    relation
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    The relation&apos;s <code>property</code> name
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    targetIds
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Ids to unlink; omit to unlink everything (optional)
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    _client
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Optional <code>DBClient</code> (optional)
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/detach.ts"
                language="typescript"
                code={`await postRepo.detach(20, "tags", [1]);  // => 1
await postRepo.detach(20, "tags");      // => 1 (all remaining links)`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">sync()</h2>
              <CodeBlock
                language="typescript"
                code={`async sync(
  id: number | string,
  relation: string,
  targetIds: (number | string)[],
  _client?: DBClient,
): Promise<{ attached: number; detached: number }>`}
              />
              <p className="text-muted-foreground mb-4">
                Makes the link set exactly equal to <code>targetIds</code>:
                missing ids are attached, extra ids are detached. Runs inside a
                transaction. Takes an array only &mdash; it is the exact final
                set, not a delta.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    id
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Primary key of the owning record
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    relation
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    The relation&apos;s <code>property</code> name
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    targetIds
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    The exact final set of ids (array only)
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    _client
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Optional <code>DBClient</code> (optional)
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/sync.ts"
                language="typescript"
                code={`// Starting state: post 20 links tags 1 and 2.
const result = await postRepo.sync(20, "tags", [1, 2, 3]);
// { attached: 1, detached: 0 }
// The post now links exactly 1, 2 and 3.`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Ids only</h2>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
                <p className="text-sm font-semibold mb-2">
                  There is no pivot data.
                </p>
                <p className="text-sm text-muted-foreground">
                  All three methods take ids only. There is no argument for
                  extra columns on the link, so you cannot write a timestamp, an
                  ordering column, or any other pivot attribute onto a
                  relationship.
                </p>
              </div>
              <p className="text-muted-foreground mb-4">
                Ids are compared as strings, so <code>1</code> and{" "}
                <code>&quot;1&quot;</code> refer to the same link.{" "}
                <code>attach</code> and <code>sync</code> dedupe the ids they
                are given before writing.
              </p>
              <CodeBlock
                filename="example/many-to-many.ts"
                language="typescript"
                code={`const postRepo = orm.getRepository(Post);

await postRepo.attach(20, "tags", [1, 2]);
await postRepo.detach(20, "tags", 1);
const { attached, detached } = await postRepo.sync(20, "tags", [2, 3]);

// All of these require the relation to be ManyToMany and to declare
// joinTable, foreignKey and inverseKey -- otherwise: RELATION_ERROR.
// Remember: create the join table yourself; autoMigrate will not.`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
