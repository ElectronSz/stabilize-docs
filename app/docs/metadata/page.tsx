import { CodeBlock } from "@/components/code-block";

export default function MetadataPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">Model Metadata</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Read back what a model declares — table name, columns, relations, scopes
        — from your own code, without instantiating a repository.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">What It Is For</h2>
          <p className="text-muted-foreground mb-4">
            <code>defineModel</code> stores a model&apos;s configuration in a
            registry as well as returning the class.{" "}
            <code>MetadataStorage</code> is the read side of that registry, and
            it is what the ORM itself uses internally — <code>Repository</code>{" "}
            reads your column definitions through it rather than off the class.
          </p>
          <p className="text-muted-foreground mb-4">
            Reach for it when you are writing code that has to work across models
            it does not know about at compile time: an admin UI that renders a
            form per model, a schema inventory or audit script, a seed generator,
            a linter that checks every table has a primary key.
          </p>
          <CodeBlock
            filename="schema-report.ts"
            language="typescript"
            code={`import { MetadataStorage } from "stabilize-orm";
import { User } from "./models/user";

MetadataStorage.getTableName(User);  // "users"
Object.keys(MetadataStorage.getColumns(User)); // ["id", "email", "nationalId"]

MetadataStorage.isVersioned(User);        // false
MetadataStorage.getSoftDeleteField(User); // "deletedAt", or null
MetadataStorage.getTimestamps(User);      // the timestamps config, or {} if none`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The Methods</h2>
          <p className="text-muted-foreground mb-4">
            Every method takes the model class — the value{" "}
            <code>defineModel</code> returned — and is static.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">Method</th>
                  <th className="text-left py-2 font-semibold">Returns</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getModelMetadata(model)</code>
                  </td>
                  <td className="py-2">
                    the whole <code>ModelConfig</code>, or{" "}
                    <code>undefined</code>
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getTableName(model)</code>
                  </td>
                  <td className="py-2">
                    the table name, or <code>&quot;&quot;</code>
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getColumns(model)</code>
                  </td>
                  <td className="py-2">
                    <code>Record&lt;string, ColumnConfig&gt;</code> keyed by
                    property name
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getRelations(model)</code>
                  </td>
                  <td className="py-2">
                    <code>Record&lt;string, RelationConfig&gt;</code> keyed by
                    relation property
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getScopes(model)</code>
                  </td>
                  <td className="py-2">a record of scope name to scope function</td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getValidators(model)</code>
                  </td>
                  <td className="py-2">
                    <code>Record&lt;string, string[]&gt;</code> — see the
                    warning below
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getSoftDeleteField(model)</code>
                  </td>
                  <td className="py-2">
                    the soft-delete property name, or <code>null</code>
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>isVersioned(model)</code>
                  </td>
                  <td className="py-2">
                    <code>boolean</code>
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getTimestamps(model)</code>
                  </td>
                  <td className="py-2">
                    a <code>TimestampsConfig</code>, or <code>{"{}"}</code>
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>getModelByTableName(tableName)</code>
                  </td>
                  <td className="py-2">
                    the model class, or <code>undefined</code>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code>setModelMetadata(model, config)</code>
                  </td>
                  <td className="py-2">
                    <code>void</code> — usually called by{" "}
                    <code>defineModel</code>, not by you
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Absent Models Do Not Throw</h2>
          <p className="text-muted-foreground mb-4">
            Nothing here raises on an unregistered model. Each getter falls back
            to a neutral value, which is convenient for the ORM internally and
            dangerous in a script that expects to be told it made a mistake:
          </p>
          <CodeBlock
            filename="silent-miss.ts"
            language="typescript"
            code={`class NotAModel {}

MetadataStorage.getTableName(NotAModel);   // ""  — not undefined
MetadataStorage.getColumns(NotAModel);     // {}
MetadataStorage.getRelations(NotAModel);   // {}
MetadataStorage.isVersioned(NotAModel);    // false
MetadataStorage.getSoftDeleteField(NotAModel); // null
MetadataStorage.getModelMetadata(NotAModel);   // undefined — the one real signal`}
          />
          <p className="text-muted-foreground mt-4">
            Note the asymmetry: <code>getTableName</code> answers{" "}
            <code>&quot;&quot;</code> and <code>isVersioned</code> answers{" "}
            <code>false</code> for a model that was never defined, so an empty
            string or a <code>false</code> is ambiguous between &ldquo;declared
            this way&rdquo; and &ldquo;never registered&rdquo;. When that
            distinction matters, test{" "}
            <code>getModelMetadata(model) !== undefined</code> instead.
          </p>
          <CodeBlock
            filename="is-defined.ts"
            language="typescript"
            code={`import { MetadataStorage } from "stabilize-orm";

function isRegistered(model: Function): boolean {
  return MetadataStorage.getModelMetadata(model) !== undefined;
}

if (!isRegistered(User)) {
  throw new Error("User model was never registered — check the import path");
}`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            <code>getValidators</code> Is Narrower Than It Sounds
          </h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold mb-2">
              It reports <code>required</code> and <code>unique</code>, and
              nothing else
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              The name suggests every rule a column carries, but the method walks
              the columns and emits only two rule names. A column declared with{" "}
              <code>minLength</code>, <code>maxLength</code>, <code>pattern</code>{" "}
              or <code>customValidator</code> shows up as an empty array — so a
              form generated from this output silently drops those constraints.
            </p>
            <CodeBlock
              language="typescript"
              code={`// id:    { type: DataTypes.INTEGER, required: true, unique: true }
// email: { type: DataTypes.STRING, minLength: 3, pattern: /@/ }

MetadataStorage.getValidators(User);
// {
//   id:    ["required", "unique"],
//   email: [],                    // minLength and pattern are not reported
// }`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              Read the column configs directly if you need the rest —{" "}
              <code>getColumns(model)</code> carries the full{" "}
              <code>ColumnConfig</code>, including those fields. Enforcement at
              write time is unchanged; this only affects what the metadata
              reports. See{" "}
              <a className="underline" href="/docs/validation">
                Validation
              </a>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Property Names, Not Column Names</h2>
          <p className="text-muted-foreground mb-4">
            <code>getColumns</code> and <code>getSoftDeleteField</code> are keyed
            by the property name you wrote in <code>defineModel</code>. If a
            column is mapped to a different database name, the key is still the
            property, and the mapping lives inside the value:
          </p>
          <CodeBlock
            filename="mapping.ts"
            language="typescript"
            code={`export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.INTEGER, name: "user_id", required: true },
  },
});

MetadataStorage.getSoftDeleteField(User); // the property name, not the DB column
Object.keys(MetadataStorage.getColumns(User)); // ["id"]

// The database name is on the value when overridden:
MetadataStorage.getColumns(User).id.name; // "user_id"`}
          />
          <p className="text-muted-foreground mt-4">
            A repository resolves the mapping for you — this matters only when
            you are emitting SQL or building a schema report yourself, where a
            property name in a query will not match a renamed column.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why It Survives a Duplicate ORM Copy
          </h2>
          <p className="text-muted-foreground mb-4">
            The registry is stored on <code>globalThis</code> under a{" "}
            <code>Symbol.for(...)</code> key rather than in a module-local
            variable, and <code>setModelMetadata</code> additionally mirrors the
            configuration onto static properties of the class. Both exist for the
            same failure mode: if the ORM ends up loaded twice — a duplicated
            dependency, mixed CJS and ESM resolution, a CLI process plus your app
            — two module instances would otherwise each hold their own registry,
            and models registered by one would look undefined to the other.
          </p>
          <p className="text-muted-foreground mb-4">
            The <code>globalThis</code> registry is the authoritative copy.{" "}
            <code>getModelMetadata</code> consults it first and only falls back
            to the static mirror, which is written best-effort: a frozen class, or
            one whose <code>columns</code> is a getter without a setter, will not
            take the mirror and will not throw over it. Metadata is still
            available through the registry in that case.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Finding a Model by Table</h2>
          <p className="text-muted-foreground mb-4">
            <code>getModelByTableName</code> scans the registry — it is a linear
            search, so it suits startup work rather than a per-request lookup.
            Table names are not enforced unique, and the first registration wins
            if two models claim one.
          </p>
          <CodeBlock
            filename="by-table.ts"
            language="typescript"
            code={`const model = MetadataStorage.getModelByTableName("users");
if (model) {
  const repo = orm.getRepository(model as any);
  await repo.find().execute(orm.client);
}`}
          />
        </section>
      </div>
    </div>
  );
}
