import { CodeBlock } from "@/components/code-block";

export default function PostgreSQLPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">PostgreSQL</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Stabilize talks to PostgreSQL through <code>pg</code>, and Postgres is
        the dialect with the most syntax of its own: parameters are numbered,
        every write hands the affected row straight back through{" "}
        <code>RETURNING *</code>, and an id declared{" "}
        <code>DataTypes.STRING</code> becomes a real <code>UUID</code> column.
        The models, repositories and query builders are shared with every other
        dialect — the differences are all in the SQL the library emits.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Connecting</h2>
          <p className="text-muted-foreground mb-4">
            Set <code>type</code> to <code>DBType.Postgres</code> and supply a
            standard libpq connection string. <code>pg</code> is a dependency of
            the ORM, so nothing extra needs installing.
          </p>
          <CodeBlock
            filename="config/database.ts"
            language="typescript"
            code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString:
    process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
          />
          <p className="text-muted-foreground mt-4">
            The CLI scaffolds the same file with{" "}
            <code>--type postgres</code>:
          </p>
          <CodeBlock
            language="bash"
            filename="terminal"
            code={`stabilize-cli config:init --type postgres`}
          />
          <p className="text-muted-foreground mt-4">
            Unlike the SQL Server pool, the <code>pg</code> pool is built in the{" "}
            <code>DBClient</code> constructor, so{" "}
            <code>new Stabilize(config)</code> is the whole of the setup. There
            is no separate connect step in your code: a transaction borrows a
            connection from that pool and returns it when the callback settles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            What the Dialect Changes
          </h2>
          <p className="text-muted-foreground mb-4">
            Statements are written once against the builder and then rendered
            for the target dialect. Nothing is emulated at runtime — the SQL
            that reaches a Postgres server is native to it:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">
                    Construct
                  </th>
                  <th className="text-left py-2 font-semibold">
                    What Stabilize emits
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Placeholders", "$1, $2, …"],
                  ["Insert / upsert return value", "RETURNING *"],
                  ["Row limiting", "LIMIT n OFFSET m"],
                  [
                    "Upsert",
                    "ON CONFLICT (cols) DO UPDATE SET col = EXCLUDED.col",
                  ],
                  ["Auto-increment key", "SERIAL PRIMARY KEY"],
                  ["STRING or UUID id", "UUID PRIMARY KEY"],
                  ["Idempotent DDL", "CREATE TABLE / INDEX IF NOT EXISTS"],
                  ["Row locking", "SELECT … FOR UPDATE"],
                  ["Random row", "RANDOM()"],
                  ["Case-insensitive match", "ILIKE"],
                  ["Boolean toggle", "SET col = NOT col"],
                ].map(([construct, sql]) => (
                  <tr key={construct} className="border-b border-accent/10">
                    <td className="py-2 pr-4">{construct}</td>
                    <td className="py-2">
                      <code>{sql}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Writes Return the Row
          </h2>
          <p className="text-muted-foreground mb-4">
            <code>create()</code> sends one statement and reads the inserted row
            out of it. The generated key arrives with the row, so nothing has to
            be asked for separately:
          </p>
          <CodeBlock
            filename="sql/postgres-insert.sql"
            language="sql"
            code={`-- await userRepo.create({ email: "ada@example.com", name: "Ada" })
INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *`}
          />
          <p className="text-muted-foreground mt-4">
            <code>bulkCreate()</code> builds the same shape for a whole batch:
            the placeholders are numbered across every row and a single{" "}
            <code>RETURNING *</code> covers all of them.
          </p>
          <CodeBlock
            filename="sql/postgres-bulk-insert.sql"
            language="sql"
            code={`INSERT INTO users (email, name) VALUES ($1, $2), ($3, $4) RETURNING *`}
          />
          <p className="text-muted-foreground mt-4">
            This is the branch Postgres alone takes. The MySQL and SQLite paths
            emit no <code>RETURNING</code>, so there the generated key is read
            off the connection (<code>LAST_INSERT_ID()</code> or{" "}
            <code>last_insert_rowid()</code>) and the row is fetched again by id
            — three statements where Postgres needs one. Because{" "}
            <code>RETURNING</code> hands back raw column values, encrypted
            columns are decoded on the way out exactly as a read decodes them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Upsert with ON CONFLICT
          </h2>
          <p className="text-muted-foreground mb-4">
            <code>upsert(entity, keys)</code> turns the key list into the
            conflict target and updates every other column from{" "}
            <code>EXCLUDED</code>. Each value is bound once, on the{" "}
            <code>VALUES</code> line — the update list refers to the proposed row
            rather than binding the payload a second time.
          </p>
          <CodeBlock
            filename="sql/postgres-upsert.sql"
            language="sql"
            code={`-- await userRepo.upsert({ email: "ada@example.com", name: "Ada" }, ["email"])
INSERT INTO users (email, name) VALUES ($1, $2)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
RETURNING *`}
          />
          <p className="text-muted-foreground mt-4">
            The conflict target has to be backed by a unique index or
            constraint. PostgreSQL rejects the statement outright when nothing
            matches it —{" "}
            <em>
              there is no unique or exclusion constraint matching the ON CONFLICT
              specification
            </em>{" "}
            — so mark the key column <code>unique: true</code> on the model and
            let <code>autoMigrate</code> create the index, or create it in the
            migration yourself.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Row Limiting</h2>
          <p className="text-muted-foreground mb-4">
            Postgres spells row limiting the ordinary way, so{" "}
            <code>limit()</code> and <code>offset()</code> are emitted as
            written. One shared detail is worth knowing: the builder renders a
            single clause for all three <code>LIMIT</code> dialects, and MySQL
            and SQLite reject a bare <code>OFFSET</code>, so an offset with no
            limit is padded with a sentinel limit even here.
          </p>
          <CodeBlock
            filename="sql/postgres-limit.sql"
            language="sql"
            code={`-- repo.find().limit(10).offset(20)
SELECT * FROM users
LIMIT 10 OFFSET 20

-- repo.find().offset(20) -- no limit set
SELECT * FROM users
LIMIT 9223372036854775807 OFFSET 20

-- repo.find().paginate(2, 25) composes the two: offset = (page - 1) * pageSize
SELECT * FROM users
LIMIT 25 OFFSET 25`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            A STRING id Becomes a UUID
          </h2>
          <p className="text-muted-foreground mb-4">
            The declared type of an <code>id</code> column decides the primary
            key that is emitted. An integer id is generated by the database; a{" "}
            <code>STRING</code> or <code>UUID</code> id is supplied by the
            caller. What a <code>STRING</code> id becomes differs between
            dialects, and Postgres is the odd one out:
          </p>
          <CodeBlock
            filename="sql/primary-keys.sql"
            language="sql"
            code={`-- id: DataTypes.STRING -- the caller supplies it
Postgres      id UUID PRIMARY KEY
MySQL         id VARCHAR(255) PRIMARY KEY
SQLite        id TEXT PRIMARY KEY

-- id: DataTypes.UUID
Postgres      id UUID PRIMARY KEY`}
          />
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              A non-UUID string is rejected here and accepted elsewhere
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Because <code>DataTypes.STRING</code> maps to a genuine{" "}
              <code>UUID</code> column, the value you pass has to parse as one.
              A slug, a prefixed key or a hand-written id is a valid{" "}
              <code>TEXT</code> value on SQLite and a valid{" "}
              <code>VARCHAR(255)</code> value on MySQL, but fails on Postgres at
              the server rather than in validation. The same model, pointed at
              two databases, therefore accepts different ids.
            </p>
            <CodeBlock
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: {
    // UUID PRIMARY KEY on Postgres, TEXT PRIMARY KEY on SQLite.
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, required: true },
  },
});

// Accepted everywhere:
await userRepo.create({ id: "550e8400-e29b-41d4-a716-446655440000", email: "a@b.c" });

// Accepted on SQLite and MySQL; on Postgres the server rejects it:
// await userRepo.create({ id: "user-1", email: "a@b.c" });`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              Use <code>DataTypes.UUID</code> with a <code>generateUUID()</code>{" "}
              value to say what you mean, or <code>DataTypes.INTEGER</code> to
              let the database assign the key.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Type Mapping</h2>
          <p className="text-muted-foreground mb-4">
            Every <code>DataTypes</code> member maps to a Postgres type. Note{" "}
            <code>JSONB</code> for JSON, <code>BYTEA</code> for blobs, and{" "}
            <code>DECIMAL(10,2)</code> as the default — a bare Postgres{" "}
            <code>DECIMAL</code> stores whatever it is handed, so the
            constrained form is emitted instead. Declare <code>precision</code>{" "}
            and <code>scale</code> to size it yourself. <code>STRING</code> is{" "}
            <code>TEXT</code> here, with no width to declare: Postgres treats{" "}
            <code>TEXT</code> and <code>VARCHAR(n)</code> identically, so a{" "}
            <code>length</code> is enforced by the ORM rather than written into
            the DDL.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">
                    DataTypes
                  </th>
                  <th className="text-left py-2 font-semibold">PostgreSQL</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["STRING", "TEXT"],
                  ["TEXT", "TEXT"],
                  ["INTEGER", "INTEGER"],
                  ["BIGINT", "BIGINT"],
                  ["FLOAT", "REAL"],
                  ["DOUBLE", "DOUBLE PRECISION"],
                  ["DECIMAL", "DECIMAL(10,2)"],
                  ["BOOLEAN", "BOOLEAN"],
                  ["DATE", "DATE"],
                  ["DATETIME", "TIMESTAMP"],
                  ["JSON", "JSONB"],
                  ["UUID", "UUID"],
                  ["BLOB", "BYTEA"],
                ].map(([dt, sql]) => (
                  <tr key={dt} className="border-b border-accent/10">
                    <td className="py-2 pr-4">
                      <code>DataTypes.{dt}</code>
                    </td>
                    <td className="py-2">
                      <code>{sql}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            A declared <code>length</code> never reaches the DDL:{" "}
            <code>STRING</code> is <code>TEXT</code> here whatever length you
            ask for, because Postgres treats <code>TEXT</code> and{" "}
            <code>VARCHAR(n)</code> as the same type. The limit is enforced by
            the ORM on write instead, so <code>length: 50</code> still rejects a
            60-character value. <code>BOOLEAN</code> is a real type on Postgres,
            which is why the generated toggle is <code>SET col = NOT col</code>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Parameter Binding</h2>
          <p className="text-muted-foreground mb-4">
            The library writes every statement with <code>?</code> placeholders
            and rewrites them for the target driver. Postgres gets{" "}
            <code>$1</code>, <code>$2</code>, … in the order they appear, so
            user code never has to number anything —{" "}
            <code>whereRaw(&quot;name = ?&quot;, value)</code> and{" "}
            <code>havingRaw</code> are written the same way on every dialect.
          </p>
          <p className="text-muted-foreground mb-4">
            The rewrite is textual, and it replaces every <code>?</code> in the
            statement rather than only the ones the builder placed. A literal
            question mark inside a raw fragment — in a string, or in
            Postgres&apos; own <code>?</code> jsonb key-exists operator — is
            rewritten too, which shifts the numbering of every parameter after
            it. Keep <code>?</code> out of raw fragments; bind the value
            instead.
          </p>
          <p className="text-muted-foreground mb-4">
            The <code>pg</code> driver serialises a plain object or array
            parameter to JSON on the way out, so a JSON column accepts the
            object itself — no <code>JSON.stringify</code> in your code. That is
            a Postgres-only property; MySQL and SQL Server have the ORM encode
            the value instead.
          </p>
          <CodeBlock
            filename="json-column.ts"
            language="typescript"
            code={`const Event = defineModel({
  tableName: "events",
  columns: {
    id: { type: DataTypes.INTEGER, required: true, unique: true },
    // JSONB on Postgres; the object is serialised by the driver.
    payload: { type: DataTypes.JSON },
  },
});

await eventRepo.create({ payload: { type: "signup", plan: "pro" } });`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground mb-4">
            A transaction borrows a connection from the pool, sends{" "}
            <code>BEGIN</code>, and commits or rolls back on that same
            connection before releasing it — an unrelated connection would
            commit on its own. The ORM does that wiring for you, so the callback
            looks the same as on every other dialect.
          </p>
          <CodeBlock
            filename="transaction.ts"
            language="typescript"
            code={`await orm.transaction(async (txClient) => {
  const userRepo = orm.getRepository(User);
  const profileRepo = orm.getRepository(Profile);

  const user = await userRepo.create({ email: "ada@example.com" }, {}, txClient);
  await profileRepo.create({ userId: user.id }, {}, txClient);
});`}
          />
          <p className="text-muted-foreground mt-4">
            Pass the <code>txClient</code> to every call inside the callback.
            A repository call that falls back to the ORM client takes a
            different connection and runs outside the transaction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
              <li>
                <strong>No savepoints.</strong> Nested{" "}
                <code>transaction()</code> calls reuse the outer transaction on
                every dialect, so an inner failure rolls back the whole thing.
              </li>
              <li>
                <strong>
                  <code>poolStats()</code> is SQL Server only.
                </strong>{" "}
                It reads <code>size</code>, <code>borrowed</code> and{" "}
                <code>available</code> off the <code>mssql</code> pool. For any
                other driver it returns{" "}
                <code>{`{ active: -1, idle: -1, total: -1 }`}</code>, Postgres
                included.
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground mt-4">
            One thing that is <em>not</em> a limitation here:{" "}
            <code>whereILike</code> emits <code>ILIKE</code>, and Postgres is
            the only dialect that understands it. On MySQL and SQLite the same
            call produces a syntax error, so a query written here does not
            travel to the other dialects unmodified.
          </p>
        </section>
      </div>
    </div>
  );
}
