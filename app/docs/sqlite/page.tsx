import { CodeBlock } from "@/components/code-block";

export default function SQLitePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">SQLite</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <code>DBType.SQLite</code> is served by whichever SQLite driver is built
        into the runtime you are on — <code>bun:sqlite</code> on Bun,{" "}
        <code>node:sqlite</code> on Node.js. Neither is an npm package, the ORM
        picks between them at run time, and the dialect behaves the same either
        way. There is no server, no connection string and no pool — just a file
        — so this is the dialect where the storage layer itself does the least
        and the ORM has to do the rest. Models, repositories and query builders
        are unchanged.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Connecting</h2>
          <p className="text-muted-foreground mb-4">
            The connection string is a file path, or <code>:memory:</code> for a
            database that lives only as long as the process. The file is created
            if it does not exist yet, so there is nothing to provision first.
          </p>
          <CodeBlock
            filename="config/database.ts"
            language="typescript"
            code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: process.env.DATABASE_PATH || "./data/app.db",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
          />
          <p className="text-muted-foreground mt-4">
            The CLI scaffolds the same file with <code>--type sqlite</code>:
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            code={`stabilize-cli config:init --type sqlite`}
          />
          <p className="text-muted-foreground mt-4">
            There is nothing to install for this dialect, because neither driver
            is an npm package — each is part of its runtime.{" "}
            <code>node:sqlite</code> arrived in Node 22.5 behind a flag and is
            available without one from <strong>Node 22.13</strong>, which is
            therefore the version this dialect needs on Node. Bun has shipped{" "}
            <code>bun:sqlite</code> built in throughout.
          </p>
          <CodeBlock
            filename="tests/setup.ts"
            language="typescript"
            code={`// An in-memory database is the usual choice for a test suite:
const orm = new Stabilize({
  type: DBType.SQLite,
  connectionString: ":memory:",
});`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            What the Dialect Changes
          </h2>
          <p className="text-muted-foreground mb-4">
            SQLite is the dialect the builder departs from least: most of the
            SQL it emits is the SQLite spelling. What does differ is the return
            path for writes, the storage classes, and the absence of locking
            clauses:
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
                  ["Identifier quoting", '"double quotes"'],
                  ["Placeholders", "? — used exactly as written"],
                  ["Insert return value", "none — last_insert_rowid() afterwards"],
                  ["Row limiting", "LIMIT n OFFSET m"],
                  ["Upsert", "ON CONFLICT (cols) DO UPDATE SET col = ?"],
                  ["Auto-increment key", "INTEGER PRIMARY KEY AUTOINCREMENT"],
                  ["STRING or UUID id", "TEXT PRIMARY KEY"],
                  ["Idempotent DDL", "CREATE TABLE / INDEX IF NOT EXISTS"],
                  ["Row locking", "none — FOR UPDATE is not emitted"],
                  ["Random row", "RANDOM()"],
                  ["Boolean toggle", "SET col = CASE WHEN col = 1 THEN 0 ELSE 1 END"],
                  ["Storage classes", "TEXT, INTEGER, REAL, BLOB only"],
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
            Writes and last_insert_rowid()
          </h2>
          <p className="text-muted-foreground mb-4">
            Instead of a <code>RETURNING</code> clause, <code>create()</code>{" "}
            inserts, asks the connection for the rowid it just assigned, and
            then reads the row back by id:
          </p>
          <CodeBlock
            filename="sql/sqlite-insert.sql"
            language="sql"
            code={`-- await userRepo.create({ email: "ada@example.com", name: "Ada" })
INSERT INTO users (email, name) VALUES (?, ?)
SELECT last_insert_rowid() as id
SELECT * FROM users WHERE users.id = ? LIMIT 1`}
          />
          <p className="text-muted-foreground mt-4">
            The rowid probe only runs when the database assigned the key. A
            model whose <code>id</code> is <code>STRING</code> or{" "}
            <code>UUID</code> holds a value the caller supplied, so that value
            is used directly and only the read-back follows.
          </p>
          <p className="text-muted-foreground mt-4">
            <code>bulkCreate()</code> inserts the whole batch in one statement
            and recovers the ids from the rowid it gets back — which is the{" "}
            <em>last</em> id of the run, with the earlier ones counted backwards
            from it. MySQL reports the first instead, so the same code cannot
            share the arithmetic between the two.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Upsert with ON CONFLICT
          </h2>
          <p className="text-muted-foreground mb-4">
            SQLite supports the conflict target Postgres uses, but its{" "}
            <code>DO UPDATE</code> clause binds the new values as parameters
            rather than referring to <code>EXCLUDED</code>, so the update payload
            appears a second time in the parameter list.
          </p>
          <CodeBlock
            filename="sql/sqlite-upsert.sql"
            language="sql"
            code={`-- await userRepo.upsert({ email: "ada@example.com", name: "Ada" }, ["email"])
INSERT INTO users (email, name) VALUES (?, ?)
ON CONFLICT (email) DO UPDATE SET name = ?`}
          />
          <p className="text-muted-foreground mt-4">
            The statement returns nothing — the SQLite path emits no{" "}
            <code>RETURNING</code> — so the row is read back afterwards with a{" "}
            <code>SELECT … WHERE email = ? LIMIT 1</code>. It is also read{" "}
            <em>before</em> the write, to decide whether this is an insert or an
            update, which is what selects the hook pair that runs.
            The conflict target has to be backed by a unique index, so mark the
            key column <code>unique: true</code> on the model and let{" "}
            <code>autoMigrate</code> create it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Row Limiting</h2>
          <p className="text-muted-foreground mb-4">
            <code>limit()</code> and <code>offset()</code> are emitted as
            written. A bare <code>OFFSET</code> is not accepted here, so an
            offset with no limit is padded with the largest signed 64-bit value
            rather than being rejected at the server:
          </p>
          <CodeBlock
            filename="sql/sqlite-limit.sql"
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
          <h2 className="text-2xl font-semibold mb-4">Storage Classes</h2>
          <p className="text-muted-foreground mb-4">
            SQLite has five storage classes — NULL, INTEGER, REAL, TEXT and
            BLOB — and no boolean, date, datetime, JSON or UUID type. Those
            members all land on <code>TEXT</code> or <code>INTEGER</code>, and
            the ORM does the conversion in JavaScript. <code>BIGINT</code> maps
            to <code>INTEGER</code> for the same reason{" "}
            <code>INTEGER</code> does: a SQLite integer is already 64-bit.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">
                    DataTypes
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold">SQLite</th>
                  <th className="text-left py-2 font-semibold">Stored as</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["STRING", "TEXT", "text"],
                  ["TEXT", "TEXT", "text"],
                  ["INTEGER", "INTEGER", "integer"],
                  ["BIGINT", "INTEGER", "integer"],
                  ["FLOAT", "REAL", "real"],
                  ["DOUBLE", "REAL", "real"],
                  ["DECIMAL", "NUMERIC", "numeric affinity"],
                  ["BOOLEAN", "INTEGER", "1 / 0"],
                  ["DATE", "TEXT", "ISO string"],
                  ["DATETIME", "TEXT", "ISO string"],
                  ["JSON", "TEXT", "JSON text"],
                  ["UUID", "TEXT", "string"],
                  ["BLOB", "BLOB", "bytes"],
                ].map(([dt, sql, stored]) => (
                  <tr key={dt} className="border-b border-accent/10">
                    <td className="py-2 pr-4">
                      <code>DataTypes.{dt}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code>{sql}</code>
                    </td>
                    <td className="py-2">{stored}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            Two consequences are worth spelling out. A <code>Date</code> is
            bound as an ISO string rather than handed to the driver as an object
            — SQLite rejects a <code>Date</code> parameter outright, which is
            why the time-travel path converts one before binding it. And a
            boolean column is an <code>INTEGER</code>, so the generated toggle
            is a <code>CASE</code> expression rather than the{" "}
            <code>NOT col</code> Postgres and MySQL accept. A declared{" "}
            <code>length</code> never reaches the DDL — SQLite&apos;s declared
            type decides type affinity rather than constraining the value — so
            the limit is enforced by the ORM on write instead.
          </p>
          <p className="text-muted-foreground mt-4">
            A SQLite integer is 64-bit, which is wider than a JavaScript{" "}
            <code>number</code> represents exactly, and past that point the two
            drivers diverge. On Node.js a value beyond{" "}
            <code>Number.MAX_SAFE_INTEGER</code> is returned as a{" "}
            <code>bigint</code>, so it stays exact; <code>bun:sqlite</code> has
            no equivalent escape hatch and returns the rounded number. Within the
            safe range both return plain <code>number</code>s, so ordinary{" "}
            <code>id</code> columns are the same on either runtime — the
            difference only appears if you actually store integers that large.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Primary Keys and AUTOINCREMENT
          </h2>
          <p className="text-muted-foreground mb-4">
            An integer <code>id</code> becomes{" "}
            <code>INTEGER PRIMARY KEY AUTOINCREMENT</code> and is assigned by
            the database, so it must be left out of the payload. A{" "}
            <code>STRING</code> or <code>UUID</code> id is a{" "}
            <code>TEXT</code> primary key the caller supplies:
          </p>
          <CodeBlock
            filename="sql/sqlite-primary-keys.sql"
            language="sql"
            code={`-- id: DataTypes.INTEGER -- generated
CREATE TABLE IF NOT EXISTS "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "email" TEXT NOT NULL)

-- id: DataTypes.UUID or DataTypes.STRING -- caller supplied
CREATE TABLE IF NOT EXISTS "accounts" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL)`}
          />
          <p className="text-muted-foreground mt-4">
            The <code>NOT NULL</code> on the second is deliberate. A SQLite
            primary key that is not an <code>INTEGER PRIMARY KEY</code> may
            still hold NULL, so <code>required: true</code> is only enforced if
            the constraint is written out — and the DDL generator writes it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            One Connection and Cached Statements
          </h2>
          <p className="text-muted-foreground mb-4">
            The other three dialects are pool-backed; this one is a single
            connection object held for the life of the client. Two things follow
            from that, both of which are why the client has SQLite-specific
            branches at all.
          </p>
          <p className="text-muted-foreground mb-4">
            First, every statement is prepared once and kept in a cache keyed by
            the SQL text, so a query that is run repeatedly — and any statement
            whose values arrive as parameters rather than being interpolated —
            reuses the compiled statement. Second, a transaction cannot borrow a
            second connection, because there is no second connection to borrow.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground mb-4">
            <code>BEGIN</code>, <code>COMMIT</code> and <code>ROLLBACK</code>{" "}
            are ordinary statements here, sent on the one connection the client
            owns. The callback therefore receives the same client you already
            have rather than a fresh handle, and the ORM marks it as being
            inside a transaction for the duration so that a repository write
            inside your callback does not open a second one.
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
            One implementation note, since it changes what you can rely on: the
            driver&apos;s own transaction helper is not used.{" "}
            <code>bun:sqlite</code>&apos;s <code>db.transaction()</code> commits
            as soon as the callback returns, and an async callback returns a
            pending promise at its first <code>await</code> — the commit would
            land before the work finished, and a later throw would roll nothing
            back. <code>node:sqlite</code> offers no such helper at all. The
            statements are issued explicitly on either driver, so a failed
            callback really does undo every write inside it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
              <li>
                <strong>JSON is stored as text, not parsed back.</strong> A
                model with a <code>DataTypes.JSON</code> column writes an object
                or array and reads a string, matching SQL Server and MariaDB.
                Postgres and MySQL parse the column on load, so the same model
                returns an object there — a difference to plan for if you target
                both. Nothing needs pre-stringifying.
              </li>
              <li>
                <strong>No row locking.</strong> SQLite has no{" "}
                <code>FOR UPDATE</code>, so{" "}
                <code>lockForUpdate(id)</code> skips the clause and returns the
                row without taking a lock. Wrap the read in a transaction if you
                need the read and the write that follows to be one unit.
              </li>
              <li>
                <strong>
                  <code>whereILike</code> does not work.
                </strong>{" "}
                It emits <code>ILIKE</code>, which exists on Postgres only. Use{" "}
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
                There is no pool here at all, and the call returns{" "}
                <code>{`{ active: -1, idle: -1, total: -1 }`}</code>.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
