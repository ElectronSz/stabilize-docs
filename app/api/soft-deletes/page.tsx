"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function SoftDeletesApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Soft Deletes API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Deleting without removing, recovering rows, and querying the trash
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Enabling soft delete
              </h2>
              <CodeBlock
                language="typescript"
                code={`interface ColumnConfig {
  softDelete?: boolean;   // this column records deletion
}`}
              />
              <p className="text-muted-foreground mb-4">
                Soft delete is switched on by a <strong>column</strong>, not by
                the model. Flag one column and that column becomes the
                model&apos;s deletion marker: a non-<code>NULL</code> value means
                the row is deleted, <code>NULL</code> means it is live.
              </p>
              <CodeBlock
                filename="models/User.ts"
                language="typescript"
                code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 255, required: true },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
});`}
              />
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  Only the first flagged column counts.
                </p>
                <p className="text-sm text-muted-foreground">
                  The repository resolves the marker by scanning the columns in
                  declaration order and taking the first one with{" "}
                  <code>softDelete: true</code>. Flagging a second column has no
                  effect. If no column is flagged, the model has no soft delete
                  at all and every delete is a real <code>DELETE</code>.
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  The model-level <code>softDelete</code> option does nothing.
                </p>
                <p className="text-sm text-muted-foreground">
                  <code>ModelConfig</code> also declares a{" "}
                  <code>softDelete?: boolean</code> field, and{" "}
                  <code>defineModel</code> faithfully stores it. Nothing ever
                  reads it &mdash; not the repository, not the migrator. Setting{" "}
                  <code>softDelete: true</code> at the model level without
                  flagging a column leaves the model <em>without</em> soft
                  delete. Use the column option.
                </p>
              </div>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                What delete() actually runs
              </h2>
              <CodeBlock
                language="typescript"
                code={`// with a soft-delete column
UPDATE users SET deletedAt = ? WHERE id = ?

// without one
DELETE FROM users WHERE id = ?`}
              />
              <p className="text-muted-foreground mb-4">
                The marker is written as a <strong>timestamp</strong> &mdash; the
                current <code>Date</code>, sanitized for the dialect. The soft
                delete column is therefore a date/time column, not a boolean, and{" "}
                <code>IS NULL</code> is the &ldquo;still live&rdquo; test used
                everywhere in the library.
              </p>
              <p className="text-muted-foreground mb-4">
                <code>delete()</code> does not fail on an already-deleted row and
                does not check the marker: it looks the row up by primary key,
                runs the <code>beforeDelete</code> and <code>afterDelete</code>{" "}
                hooks, and overwrites the marker with a fresh timestamp.
              </p>
              <CodeBlock
                filename="example/soft-delete.ts"
                language="typescript"
                code={`await userRepo.delete(1);      // sets deletedAt
await userRepo.delete(1);      // sets it again; not an error

await userRepo.bulkDelete([1, 2, 3]);   // same treatment per row
await userRepo.deleteBy({ status: "archived" });  // same`}
              />
              <p className="text-muted-foreground mt-4">
                <code>bulkDelete()</code> and <code>deleteBy()</code> follow the
                same rule. <code>deleteBy()</code> also adds{" "}
                <code>&lt;marker&gt; IS NULL</code> to its own{" "}
                <code>WHERE</code>, so it never re-stamps a row that is already
                in the trash &mdash; the returned count is the number of rows it
                actually moved.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Do not mark the column required
              </h2>
              <p className="text-muted-foreground mb-4">
                A <code>required: true</code> column is created{" "}
                <code>NOT NULL</code>. Recovery works by setting the marker back
                to <code>NULL</code>, so a required marker column makes every row
                unrecoverable: the <code>UPDATE</code> is rejected by the
                database. Leave the soft-delete column optional.
              </p>
              <CodeBlock
                language="typescript"
                code={`// WRONG — recovery will fail at the database
deletedAt: { type: DataTypes.DATETIME, softDelete: true, required: true },

// RIGHT
deletedAt: { type: DataTypes.DATETIME, softDelete: true },`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Recovering rows</h2>
              <CodeBlock
                language="typescript"
                code={`async recover(id: number | string, _client?: DBClient): Promise<T>
async recoverAll(_client?: DBClient): Promise<number>
async restoreBy(conditions: Partial<T>, _client?: DBClient): Promise<number>`}
              />
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    id
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Primary key of the row to restore.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    conditions
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Column values to match. Entries that are{" "}
                    <code>undefined</code> or <code>null</code> are skipped
                    rather than matching NULL.
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    _client
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Optional transactional client.
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                All three clear the marker. <code>recover()</code> restores one
                row and returns it; <code>recoverAll()</code> restores every
                trashed row and returns the count;{" "}
                <code>restoreBy()</code> restores the matching trashed rows and
                returns the count.
              </p>
              <p className="text-muted-foreground mb-4">
                All three also <strong>throw</strong> when the model has no
                soft-delete column, with code <code>RECOVER_ERROR</code> and the
                message <code>Soft delete not enabled</code> (the single-row{" "}
                <code>recover()</code> words it{" "}
                <code>Soft delete not enabled for this model</code>).
              </p>
              <p className="text-muted-foreground mb-4">
                <code>recover()</code> does not check that the row exists before
                clearing the marker: it runs the <code>UPDATE</code>, which
                affects nothing if the id is unknown, and then re-reads the row.
                A missing id therefore raises a second{" "}
                <code>RECOVER_ERROR</code>, messaged{" "}
                <code>Failed to find recovered record.</code> &mdash; not a{" "}
                <code>DELETE_ERROR</code>, and no other code.
              </p>
              <CodeBlock
                filename="example/recover.ts"
                language="typescript"
                code={`const restored = await userRepo.recover(1);
const all = await userRepo.recoverAll();
const byStatus = await userRepo.restoreBy({ status: "archived" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">Querying the trash</h2>
              <CodeBlock
                language="typescript"
                code={`findDeleted(): QueryBuilder<T>   // trashed rows only
withTrashed(): QueryBuilder<T>   // live AND trashed rows`}
              />
              <p className="text-muted-foreground mb-4">
                Both return a <code>QueryBuilder</code> and are chainable and
                terminal in the usual way, via{" "}
                <code>.execute(client)</code>. Unlike every other read path, the
                soft-delete filter is not applied to either of them.
              </p>
              <p className="text-muted-foreground mb-4">
                <code>findDeleted()</code> requires the model to have a
                soft-delete column and throws code <code>QUERY_ERROR</code> with
                the message <code>Soft delete not enabled</code> when it does
                not. <code>withTrashed()</code> has no such guard and never
                throws &mdash; on a model with no marker column it is simply an
                unfiltered builder, which is the same set of rows{" "}
                <code>find()</code> returns. Neither attaches a relation loader,
                so <code>.withRelations()</code> on either does not eager-load;
                use <code>find()</code> when you need relations.
              </p>
              <CodeBlock
                filename="example/querying-trash.ts"
                language="typescript"
                code={`const trashed = await userRepo.findDeleted().execute(orm.client);
const everything = await userRepo.withTrashed().execute(orm.client);

const oldest = await userRepo
  .findDeleted()
  .orderBy("deletedAt", "ASC")
  .limit(10)
  .execute(orm.client);`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Reads skip the trash automatically
              </h2>
              <p className="text-muted-foreground mb-4">
                When a model has a soft-delete column, the read paths add{" "}
                <code>&lt;marker&gt; IS NOT NULL</code> filtering for you. You do
                not opt in, and there is no flag to turn it off other than
                reaching for <code>withTrashed()</code>.
              </p>
              <CodeBlock
                language="typescript"
                code={`find()            findOne()      findOneBy()    findBy()
findMany()        first()        last()         exists()
count()           countDistinct()  healthCheck()  paginate()
findAndCount()    findAndCountAll()  aggregate()
pluck()           selectColumns()  increment()   decrement()
toggle()          update()  updateBy()  delete()  deleteBy()`}
              />
              <p className="text-muted-foreground mb-4">
                <code>update()</code> and <code>updateBy()</code> refuse to touch
                a trashed row: the marker filter is added to the{" "}
                <code>WHERE</code>, so a row in the trash simply matches nothing.
              </p>
              <CodeBlock
                filename="example/update-trashed.ts"
                language="typescript"
                code={`await userRepo.delete(1);

await userRepo.findOne(1);              // null
await userRepo.count();                 // excludes row 1
await userRepo.update(1, { name: "x" }); // matches no row

// Recover first, then update.
await userRepo.recover(1);
await userRepo.update(1, { name: "x" });`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                truncate() ignores all of it
              </h2>
              <CodeBlock
                language="typescript"
                code={`async truncate(_client?: DBClient): Promise<void>
// DELETE FROM <table>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>truncate()</code> issues a plain unqualified{" "}
                <code>DELETE FROM &lt;table&gt;</code>. It does not check for a
                soft-delete column, does not run the delete hooks, and does not
                write version history &mdash; every row, trashed or live, is gone
                and <code>recover()</code> cannot bring any of it back. It needs
                no soft delete to be enabled and never throws for lack of one.
              </p>
              <CodeBlock
                filename="example/truncate.ts"
                language="typescript"
                code={`await userRepo.truncate();   // destructive and final`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                The marker is hidden from toJSON()
              </h2>
              <CodeBlock
                language="typescript"
                code={`toJSON(entity: T): Record<string, any>`}
              />
              <p className="text-muted-foreground mb-4">
                <code>toJSON()</code> copies the model&apos;s columns onto a plain
                object but <strong>omits the soft-delete column</strong>, so a
                serialized row never leaks its deletion timestamp to a client.
                Every other column is copied through, including ones whose value
                is <code>undefined</code>.
              </p>
              <CodeBlock
                filename="example/to-json.ts"
                language="typescript"
                code={`const user = await userRepo.findOne(1);
const payload = userRepo.toJSON(user);
// { id: 1, name: "Alice" }  — no deletedAt key at all`}
              />
              <p className="text-muted-foreground">
                Because it is a mapping over the model&apos;s own columns, this is
                also the way to hide encrypted columns &mdash; the same method
                decrypts them on the way out.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Helpers on the repository
              </h2>
              <CodeBlock
                language="typescript"
                code={`getSoftDeleteField(): string | null
MetadataStorage.getSoftDeleteField(model: Function): string | null`}
              />
              <p className="text-muted-foreground">
                Returns the property name of the marker column, or{" "}
                <code>null</code> when the model has soft delete switched off.
                This is the property name (<code>&quot;deletedAt&quot;</code>),
                not the SQL column name &mdash; a column declared with{" "}
                <code>name</code> maps to that database column instead, and the
                static form reads the same metadata without a repository.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
