import { CodeBlock } from "@/components/code-block";

export default function MSSQLPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-4">SQL Server</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Stabilize supports Microsoft SQL Server as a first-class dialect. The
          same models, repositories and query builders work unchanged — the
          differences are all in the SQL the library emits.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Connecting</h2>
            <p className="text-muted-foreground mb-4">
              Set <code>type</code> to <code>DBType.MSSQL</code> and supply an{" "}
              <code>mssql</code>-style connection string. The driver (
              <code>mssql</code> v12) is a dependency of the ORM, so nothing
              extra needs installing.
            </p>
            <CodeBlock
              filename="config/database.ts"
              language="typescript"
              code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MSSQL,
  connectionString:
    "Server=localhost,1433;Database=mydb;User Id=sa;Password=Your_password123;TrustServerCertificate=true",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
            />
            <p className="text-muted-foreground mt-4">
              Unlike the <code>pg</code> and <code>mysql2</code> pools, the SQL
              Server pool is <strong>not</strong> opened in the{" "}
              <code>DBClient</code> constructor.{" "}
              <code>ConnectionPool.connect()</code> is asynchronous and the
              constructor is not, so the pool is built there and connected on
              first use instead. The first query therefore pays the connection
              cost, and a bad connection string surfaces on that first query
              rather than at construction. Concurrent first queries share a
              single connection attempt.
            </p>
            <CodeBlock
              filename="connect.ts"
              language="typescript"
              code={`// Nothing connects here...
const orm = new Stabilize(dbConfig);

// ...the pool opens here, on the first statement.
const users = await orm.getRepository(User).find().execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              What the Dialect Changes
            </h2>
            <p className="text-muted-foreground mb-4">
              T-SQL has no equivalent for several constructs the other three
              dialects share. Each one is rewritten rather than emulated at
              runtime, so statements sent to SQL Server are valid T-SQL:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-accent/30">
                    <th className="text-left py-2 pr-4 font-semibold">
                      Construct
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold">
                      Postgres / MySQL / SQLite
                    </th>
                    <th className="text-left py-2 font-semibold">
                      SQL Server
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Placeholders</td>
                    <td className="py-2 pr-4">
                      <code>?</code>, or <code>$1</code> on Postgres
                    </td>
                    <td className="py-2">
                      <code>@param0</code>, <code>@param1</code>, …
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Returning the inserted row</td>
                    <td className="py-2 pr-4">
                      <code>RETURNING *</code> (trails the statement)
                    </td>
                    <td className="py-2">
                      <code>OUTPUT INSERTED.*</code> (before{" "}
                      <code>VALUES</code>)
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Row limiting</td>
                    <td className="py-2 pr-4">
                      <code>LIMIT n OFFSET m</code>
                    </td>
                    <td className="py-2">
                      <code>OFFSET n ROWS FETCH NEXT m ROWS ONLY</code>
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Upsert</td>
                    <td className="py-2 pr-4">
                      <code>ON CONFLICT … DO UPDATE</code> /{" "}
                      <code>ON DUPLICATE KEY UPDATE</code>
                    </td>
                    <td className="py-2">
                      <code>MERGE INTO … USING …</code>
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Auto-increment key</td>
                    <td className="py-2 pr-4">
                      <code>SERIAL</code> / <code>AUTO_INCREMENT</code>
                    </td>
                    <td className="py-2">
                      <code>IDENTITY(1,1)</code>
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Idempotent DDL</td>
                    <td className="py-2 pr-4">
                      <code>CREATE TABLE IF NOT EXISTS</code>
                    </td>
                    <td className="py-2">
                      <code>IF OBJECT_ID(...) IS NULL</code>
                    </td>
                  </tr>
                  <tr className="border-b border-accent/10">
                    <td className="py-2 pr-4">Row locking</td>
                    <td className="py-2 pr-4">
                      <code>SELECT … FOR UPDATE</code>
                    </td>
                    <td className="py-2">table hint only — not emitted</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Random row</td>
                    <td className="py-2 pr-4">
                      <code>RANDOM()</code> / <code>RAND()</code>
                    </td>
                    <td className="py-2">
                      <code>NEWID()</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Writes and OUTPUT INSERTED.*
            </h2>
            <p className="text-muted-foreground mb-4">
              <code>RETURNING</code> and <code>OUTPUT</code> do different jobs
              in different places. <code>RETURNING</code> trails the whole
              statement; <code>OUTPUT</code> has to sit{" "}
              <strong>between the column list and the VALUES clause</strong>.
              Appending it the way <code>RETURNING</code> is appended is a
              syntax error — <code>Incorrect syntax near &apos;OUTPUT&apos;</code>.
              <code>create()</code> and <code>upsert()</code> place it
              correctly, and read the row back out of the result set rather than
              relying on <code>last_insert_rowid()</code> or{" "}
              <code>LAST_INSERT_ID()</code>, neither of which exists here.
            </p>
            <CodeBlock
              filename="sql/mssql-insert.sql"
              language="sql"
              code={`-- What create() emits:
INSERT INTO "users" ("email", "name") OUTPUT INSERTED.* VALUES (@param0, @param1)`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Upsert Becomes MERGE
            </h2>
            <p className="text-muted-foreground mb-4">
              SQL Server supports neither <code>ON CONFLICT … DO UPDATE</code>{" "}
              nor <code>ON DUPLICATE KEY UPDATE</code>. The equivalent is{" "}
              <code>MERGE</code>: the payload is offered as a one-row{" "}
              <code>source</code> table whose columns are the bound parameters,
              and the <code>WHEN MATCHED</code> /{" "}
              <code>WHEN NOT MATCHED</code> branches refer to those columns by
              name. Every value is bound exactly once — on the{" "}
              <code>USING</code> line — however many times the column is
              referenced afterwards.
            </p>
            <CodeBlock
              filename="sql/mssql-merge.sql"
              language="sql"
              code={`-- await repo.upsert({ email: "ada@example.com", name: "Ada" }, ["email"])
MERGE INTO "users" AS target
USING (SELECT @param0 AS email, @param1 AS name) AS source
ON (target.email = source.email)
WHEN MATCHED THEN UPDATE SET target.name = source.name
WHEN NOT MATCHED THEN INSERT (email, name) VALUES (source.email, source.name)
OUTPUT INSERTED.*;

-- With an empty key list there is nothing to match against, so it can only
-- ever insert, and the builder emits a plain INSERT ... OUTPUT INSERTED.*.`}
            />
            <p className="text-muted-foreground mt-4">
              The statement is terminated with a semicolon, which{" "}
              <code>MERGE</code> requires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Row Limiting Needs an ORDER BY
            </h2>
            <p className="text-muted-foreground mb-4">
              T-SQL has no <code>LIMIT</code>. It spells row limiting{" "}
              <code>OFFSET … ROWS FETCH NEXT … ROWS ONLY</code>, and both
              clauses are legal only on a statement that carries an{" "}
              <code>ORDER BY</code>. A query with no ordering is therefore given{" "}
              <code>ORDER BY (SELECT NULL)</code> purely to satisfy that rule —
              a constant ordering, which leaves the row order undefined exactly
              as an unordered <code>LIMIT</code> did.
            </p>
            <CodeBlock
              filename="sql/mssql-limit.sql"
              language="sql"
              code={`-- repo.find().limit(10).offset(20), no ORDER BY set:
SELECT * FROM "users"
ORDER BY (SELECT NULL)
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY

-- A bare limit skips nothing, because FETCH NEXT cannot appear without OFFSET:
-- repo.find().limit(10)
SELECT * FROM "users"
ORDER BY (SELECT NULL)
OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY

-- An offset with no limit is also legal:
-- repo.find().offset(20)
SELECT * FROM "users"
ORDER BY (SELECT NULL)
OFFSET 20 ROWS`}
            />
            <p className="text-muted-foreground mt-4">
              As on every other dialect, <code>paginate(page, pageSize)</code>{" "}
              composes limit and offset — so SQL Server pagination works through
              the same call.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Schema and Migrations
            </h2>
            <p className="text-muted-foreground mb-4">
              Two DDL clauses used elsewhere do not exist in T-SQL. Both get an
              equivalent written as a leading existence check on the same batch.
            </p>
            <CodeBlock
              filename="sql/mssql-ddl.sql"
              language="sql"
              code={`-- CREATE TABLE IF NOT EXISTS does not exist. Instead:
IF OBJECT_ID(N'users', N'U') IS NULL CREATE TABLE "users" ("id" INT IDENTITY(1,1) PRIMARY KEY, ...)

-- CREATE INDEX IF NOT EXISTS does not exist either. A catalogue probe instead:
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'users_email_uniq' AND object_id = OBJECT_ID(N'users'))
  CREATE UNIQUE INDEX "users_email_uniq" ON "users" ("email")

-- ALTER TABLE ... ADD COLUMN does not exist -- T-SQL's grammar is ADD <definition>:
ALTER TABLE "users" ADD "nickname" NVARCHAR(255) NOT NULL`}
            />
            <p className="text-muted-foreground mt-4">
              On MySQL the <code>CREATE INDEX</code> check cannot be written
              inline at all, so <code>autoMigrate</code> does it in TypeScript
              by reading the table&apos;s indexes first. That pre-check runs on
              every dialect, which is what makes{" "}
              <code>autoMigrate</code> idempotent everywhere.{" "}
              <code>stabilize_migrations</code> is created with the same{" "}
              <code>IF OBJECT_ID</code> guard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              IDENTITY Rejects Explicit Values
            </h2>
            <p className="text-muted-foreground mb-4">
              An integer <code>id</code> becomes{" "}
              <code>INT IDENTITY(1,1) PRIMARY KEY</code>, so the database
              generates it and you must leave it out of the payload. That is the
              ordinary path and it works: <code>create({`{ email }`})</code>{" "}
              inserts and returns the row with its generated id.
            </p>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
              <p className="text-sm font-semibold mb-2">
                Do not pass an explicit <code>id</code> on an IDENTITY table
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                SQL Server rejects a caller-supplied value for an{" "}
                <code>IDENTITY</code> column unless{" "}
                <code>SET IDENTITY_INSERT</code> is switched on for the table,
                and the ORM does not switch it on. Passing an{" "}
                <code>id</code> in the payload of{" "}
                <code>create()</code> or <code>upsert()</code> therefore fails
                at the server with{" "}
                <em>
                  Cannot insert explicit value for identity column in table
                  &apos;users&apos; when IDENTITY_INSERT is set to OFF
                </em>
                . This is a known limitation on this dialect rather than a
                supported way to set a key, and it is not the same behaviour the
                other three dialects give you — there, an explicit{" "}
                <code>id</code> is accepted. Omit the column and let the
                database assign it.
              </p>
              <CodeBlock
                language="typescript"
                code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.INTEGER, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true },
  },
});

// Correct -- id is IDENTITY, so it is generated:
const user = await userRepo.create({ email: "ada@example.com" });

// Fails on SQL Server, though the same call succeeds on the other dialects:
// await userRepo.create({ id: 1, email: "ada@example.com" });`}
              />
              <p className="text-sm text-muted-foreground mt-3">
                Note that the failure is the server&apos;s, so it arrives as a
                driver error rather than a validation message naming the field.
                A model whose <code>id</code> is <code>UUID</code> or{" "}
                <code>STRING</code> is a different case: it does not become an{" "}
                <code>IDENTITY</code> column at all, the caller is expected to
                supply the value, and <code>id</code> stays required. Both are
                shown below.
              </p>
            </div>
            <p className="text-muted-foreground mb-4">
              Updating a row is unaffected: <code>update(id, data)</code> builds
              its <code>SET</code> list from the fields you pass, so the id
              column is not written back and the identity guard above is never
              reached. The exception is a payload that itself contains{" "}
              <code>id</code>, which fails with{" "}
              <em>Cannot update identity column &apos;id&apos;</em>.
            </p>
            <CodeBlock
              filename="models/account.ts"
              language="typescript"
              code={`// UUID id -- not an IDENTITY column. It maps to UNIQUEIDENTIFIER and the
// caller supplies the value, exactly as on the other dialects.
const Account = defineModel({
  tableName: "accounts",
  columns: {
    id: { type: DataTypes.UUID, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true },
  },
});

await accountRepo.create({ id: generateUUID(), email: "ada@example.com" });`}
            />
            <p className="text-muted-foreground mt-4">
              A <code>STRING</code> <code>id</code> is caller-supplied too, but
              note that the same declaration becomes a different column per
              dialect — see{" "}
              <a className="underline" href="/docs/data-types">
                Data Types
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Type Mapping</h2>
            <p className="text-muted-foreground mb-4">
              Every <code>DataTypes</code> member maps to a T-SQL type. The
              unmapped fallback is <code>NVARCHAR(MAX)</code>, not{" "}
              <code>TEXT</code> — T-SQL&apos;s <code>TEXT</code> is deprecated
              and unusable in most expressions.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-accent/30">
                    <th className="text-left py-2 pr-4 font-semibold">
                      DataTypes
                    </th>
                    <th className="text-left py-2 font-semibold">SQL Server</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["STRING", "NVARCHAR(255)"],
                    ["TEXT", "NVARCHAR(MAX)"],
                    ["INTEGER", "INT"],
                    ["BIGINT", "BIGINT"],
                    ["FLOAT", "REAL"],
                    ["DOUBLE", "FLOAT"],
                    ["DECIMAL", "DECIMAL(10,2)"],
                    ["BOOLEAN", "BIT"],
                    ["DATE", "DATE"],
                    ["DATETIME", "DATETIME2"],
                    ["JSON", "NVARCHAR(MAX)"],
                    ["UUID", "UNIQUEIDENTIFIER"],
                    ["BLOB", "VARBINARY(MAX)"],
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Parameter Binding
            </h2>
            <p className="text-muted-foreground mb-4">
              <code>mssql</code> infers a parameter&apos;s type from the value
              it is handed, and has nothing to infer from for{" "}
              <code>null</code> — the request would be sent with a type the
              server rejects. Those are bound explicitly as a nullable{" "}
              <code>NVARCHAR</code>. A plain object or array gets the same
              treatment for a different reason: only Postgres&apos; driver
              serialises an object parameter to JSON on the way out, so on SQL
              Server (and MySQL) the ORM encodes it to JSON text itself.
              <code>Date</code> and <code>Buffer</code> are left to the driver,
              which infers a correct type for both.
            </p>
            <CodeBlock
              filename="json-column.ts"
              language="typescript"
              code={`const Event = defineModel({
  tableName: "events",
  columns: {
    id: { type: DataTypes.INTEGER, required: true, unique: true },
    // NVARCHAR(MAX) on SQL Server; the object is stringified on the way in.
    payload: { type: DataTypes.JSON },
  },
});

await eventRepo.create({ payload: { type: "signup", plan: "pro" } });`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
            <p className="text-muted-foreground mb-4">
              SQL Server has no <code>BEGIN</code>/<code>COMMIT</code> text
              commands. A transaction is a server-side object opened on a
              borrowed pooled connection, and every statement inside it must be
              sent through a <code>Request</code> built from that object — one
              built from the pool would run on an unrelated connection and
              commit on its own. The ORM does that wiring for you; the callback
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
              Nothing has to be released by hand: unlike the <code>pg</code> and{" "}
              <code>mysql2</code> pools, <code>mssql</code> returns the borrowed
              connection to the pool as part of commit or rollback.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
              <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
                <li>
                  <strong>No row locking.</strong> T-SQL has no{" "}
                  <code>FOR UPDATE</code>; its equivalent is a table hint (
                  <code>WITH (UPDLOCK)</code>), which the query builder cannot
                  express. <code>lockForUpdate(id)</code> therefore skips the
                  clause entirely on SQL Server and returns the row without
                  taking the lock the other dialects take. Wrap the read in a
                  transaction with an appropriate isolation level if you need
                  the guarantee.
                </li>
                <li>
                  <strong>
                    <code>whereILike</code> does not work.
                  </strong>{" "}
                  It emits <code>ILIKE</code>, which exists on Postgres only.
                  The same is true on MySQL and SQLite. Use{" "}
                  <code>whereLike</code>, or{" "}
                  <code>whereRaw(&quot;LOWER(name) LIKE ?&quot;, pattern)</code>.
                </li>
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
                  <code>available</code> off the <code>mssql</code> pool. For
                  any other driver it returns{" "}
                  <code>{`{ active: -1, idle: -1, total: -1 }`}</code>.
                </li>
              </ul>
            </div>
          </section>
        </div>
    </div>
  );
}
