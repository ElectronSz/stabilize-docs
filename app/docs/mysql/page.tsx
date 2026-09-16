import { CodeBlock } from "@/components/code-block";

export default function MySQLPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">MySQL and MariaDB</h1>
      <p className="text-lg text-muted-foreground mb-8">
        One dialect covers both servers. <code>DBType.MySQL</code> selects the{" "}
        <code>mysql2</code> pool, and the same generated SQL — backticked
        identifiers, <code>AUTO_INCREMENT</code> keys,{" "}
        <code>ON DUPLICATE KEY UPDATE</code> — is sent to MySQL and to MariaDB
        alike. Models, repositories and query builders are unchanged.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Connecting</h2>
          <p className="text-muted-foreground mb-4">
            Supply a <code>mysql://</code> connection string. The same string
            shape reaches MariaDB: <code>mysql2</code> is the driver for both,
            and <code>mysql2</code> is a dependency of the ORM.
          </p>
          <CodeBlock
            filename="config/database.ts"
            language="typescript"
            code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString:
    process.env.DATABASE_URL || "mysql://user:pass@localhost:3306/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
          />
          <p className="text-muted-foreground mt-4">
            The CLI scaffolds the same file with <code>--type mysql</code>:
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            code={`stabilize-cli config:init --type mysql`}
          />
          <p className="text-muted-foreground mt-4">
            The pool is created in the <code>DBClient</code> constructor, and
            connections are taken from it for the duration of a transaction and
            released afterwards. The <code>mysql2</code> pool is not the only
            thing here that behaves differently from the other dialects — unlike
            Postgres, the driver does not encode values for you, which is what
            the Parameter Binding section below covers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            What the Dialect Changes
          </h2>
          <p className="text-muted-foreground mb-4">
            Every statement is built once and rendered for the target dialect.
            For MySQL and MariaDB that rendering is:
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
                  ["Identifier quoting", "`backticks`"],
                  ["Placeholders", "? — used exactly as written"],
                  ["Insert return value", "none — LAST_INSERT_ID() afterwards"],
                  ["Row limiting", "LIMIT n OFFSET m"],
                  ["Upsert", "ON DUPLICATE KEY UPDATE col = ?"],
                  ["Auto-increment key", "INT AUTO_INCREMENT PRIMARY KEY"],
                  ["STRING or UUID id", "VARCHAR(255) PRIMARY KEY"],
                  ["Idempotent table DDL", "CREATE TABLE IF NOT EXISTS"],
                  ["Idempotent index DDL", "none — autoMigrate pre-checks"],
                  ["Row locking", "SELECT … FOR UPDATE"],
                  ["Random row", "RAND()"],
                  ["Boolean toggle", "SET col = NOT col"],
                  ["Object / array parameters", "JSON-encoded before binding"],
                  ["Date parameters", "YYYY-MM-DD HH:MM:SS, no zone"],
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
            Identifiers Are Backticked
          </h2>
          <p className="text-muted-foreground mb-4">
            MySQL and MariaDB are the only supported servers where{" "}
            <code>&quot;</code> does not quote an identifier — it starts a
            string literal instead, unless the server runs with{" "}
            <code>ANSI_QUOTES</code> in <code>sql_mode</code>, which is off by
            default. <code>CREATE TABLE &quot;users&quot; (…)</code> is
            therefore a syntax error there, and backticks are the spelling that
            always parses. Every identifier <code>autoMigrate</code> emits goes
            through that quoting:
          </p>
          <CodeBlock
            filename="sql/mysql-ddl.sql"
            language="sql"
            code={`CREATE TABLE IF NOT EXISTS \`users\` (\`id\` INT AUTO_INCREMENT PRIMARY KEY, \`email\` VARCHAR(255) NOT NULL)

ALTER TABLE \`users\` ADD COLUMN \`nickname\` VARCHAR(255)

CREATE UNIQUE INDEX \`users_email_uniq\` ON \`users\` (\`email\`)`}
          />
          <p className="text-muted-foreground mt-4">
            Note the third statement: MySQL has no{" "}
            <code>IF NOT EXISTS</code> clause on <code>CREATE INDEX</code> and
            no inline substitute for one, so <code>autoMigrate</code> reads the
            table&apos;s indexes first — through{" "}
            <code>SHOW INDEX FROM `users`</code> — and skips any name it finds.
            That pre-check is what makes <code>autoMigrate</code> idempotent on
            this dialect, and it runs on every dialect. Statements you write by
            hand have to do the same check yourself.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Writes and LAST_INSERT_ID()
          </h2>
          <p className="text-muted-foreground mb-4">
            There is no <code>RETURNING</code> on this dialect, so{" "}
            <code>create()</code> inserts plainly, asks the same connection for
            the generated key, and fetches the row back by id — three
            statements where Postgres needs one:
          </p>
          <CodeBlock
            filename="sql/mysql-insert.sql"
            language="sql"
            code={`-- await userRepo.create({ email: "ada@example.com", name: "Ada" })
INSERT INTO users (email, name) VALUES (?, ?)
SELECT LAST_INSERT_ID()
SELECT * FROM users WHERE users.id = ? LIMIT 1`}
          />
          <p className="text-muted-foreground mt-4">
            The key probe only runs when the database assigned the key. A model
            whose id is <code>STRING</code> or <code>UUID</code> is
            caller-supplied, so the value you passed is used as-is and only the
            read-back follows. <code>LAST_INSERT_ID()</code> is read on the same
            pooled connection that ran the insert; if either half of that pair
            were missing, the id would come back undefined.
          </p>
          <p className="text-muted-foreground mt-4">
            <code>bulkCreate()</code> inserts every row in one statement, and
            the key it reads back is the <em>first</em> of the batch — SQLite
            reports the last, so the arithmetic that recovers the rest of the
            ids differs between the two.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Upsert with ON DUPLICATE KEY UPDATE
          </h2>
          <p className="text-muted-foreground mb-4">
            <code>upsert(entity, keys)</code> emits the MySQL form, which names
            no conflict target. The update list is bound as parameters a second
            time, so the payload appears twice in the parameter array — the{" "}
            <code>EXCLUDED</code> trick Postgres uses to avoid that has no
            equivalent here.
          </p>
          <CodeBlock
            filename="sql/mysql-upsert.sql"
            language="sql"
            code={`-- await userRepo.upsert({ email: "ada@example.com", name: "Ada" }, ["email"])
INSERT INTO users (email, name) VALUES (?, ?)
ON DUPLICATE KEY UPDATE name = ?`}
          />
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              With no target clause, the key list is documentation
            </p>
            <p className="text-sm text-muted-foreground">
              <code>ON DUPLICATE KEY UPDATE</code> fires on a violation of{" "}
              <em>any</em> unique or primary key on the table, not on the
              columns you passed as <code>keys</code>. If the column you name
              carries no unique index, a second call has nothing to conflict
              with, so the statement degrades into a plain{" "}
              <code>INSERT</code> and silently appends a duplicate row. Mark the
              key column <code>unique: true</code> on the model, exactly as the
              Postgres conflict target requires — for the opposite reason.
            </p>
          </div>
          <p className="text-muted-foreground mt-4">
            Because nothing is returned by the statement, the row is read back
            afterwards by the conflict keys, and it is also read <em>before</em>{" "}
            the write so the ORM knows whether this is an insert or an update —
            that answer decides which hooks run.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Row Limiting</h2>
          <p className="text-muted-foreground mb-4">
            <code>limit()</code> and <code>offset()</code> are emitted as
            written. A bare <code>OFFSET</code> is not legal here, so an offset
            with no limit is padded with the largest signed 64-bit value rather
            than being rejected or silently dropped.
          </p>
          <CodeBlock
            filename="sql/mysql-limit.sql"
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
          <h2 className="text-2xl font-semibold mb-4">Parameter Binding</h2>
          <p className="text-muted-foreground mb-4">
            MySQL is one of the two dialects that takes the library&apos;s{" "}
            <code>?</code> placeholders exactly as written — nothing is
            renumbered, so the parameters bind in the order they appear.
          </p>
          <p className="text-muted-foreground mb-4">
            Values, however, are not passed through untouched.{" "}
            <code>mysql2</code> does not serialise an object to JSON the way{" "}
            <code>pg</code> does: it reads a plain object as a set of
            assignments, so <code>{`{ nested: 1 }`}</code> binds as{" "}
            <code>`nested` = 1</code>. Meaningful in an <code>UPDATE … SET</code>{" "}
            list, a syntax error in a <code>VALUES</code> list — the server
            either finds the column count no longer matches (
            <em>Column count doesn&apos;t match value count at row 1</em>) or
            reads the object&apos;s own keys as column names (
            <em>Unknown column &apos;nested&apos; in &apos;field list&apos;</em>
            ). The ORM therefore JSON-encodes every plain object and array
            before the driver sees it, which is what makes a{" "}
            <code>DataTypes.JSON</code> column writable with the object itself.
          </p>
          <p className="text-muted-foreground mb-4">
            A <code>Date</code> is normalised for this dialect too, and the
            spelling is not cosmetic: a <code>DATETIME</code> column under the
            default <code>STRICT_TRANS_TABLES</code> refuses the{" "}
            <code>T</code> and the <code>Z</code> of an ISO string with{" "}
            <em>Incorrect datetime value</em>. Dates are therefore bound
            space-separated and at second resolution, which the whole MySQL
            family accepts and which is all a <code>DATETIME</code> column
            stores by default.
          </p>
          <CodeBlock
            filename="datetime-binding.ts"
            language="typescript"
            code={`// repo.create({ createdAt: new Date("2024-01-15T10:30:00Z") })

// MySQL / MariaDB -- space separator, seconds, no zone:
//   "2024-01-15 10:30:00"

// PostgreSQL, SQLite and SQL Server bind the ISO form instead:
//   "2024-01-15T10:30:00.000Z"`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Type Mapping</h2>
          <p className="text-muted-foreground mb-4">
            Every <code>DataTypes</code> member maps to a MySQL type. Note the
            unpinned precision on <code>FLOAT</code> and <code>DOUBLE</code>,{" "}
            the default <code>DECIMAL(10,2)</code>, and that neither{" "}
            <code>BOOLEAN</code> nor <code>UUID</code> is a real type here. The
            widths shown are the defaults: <code>length</code> widens{" "}
            <code>STRING</code>, <code>precision</code> and <code>scale</code>{" "}
            size <code>DECIMAL</code>, and on <code>FLOAT</code> — the one
            dialect where a single-precision column takes a bit width —{" "}
            <code>precision</code> gives you <code>FLOAT(n)</code>.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">
                    DataTypes
                  </th>
                  <th className="text-left py-2 font-semibold">MySQL</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["STRING", "VARCHAR(255)"],
                  ["TEXT", "TEXT"],
                  ["INTEGER", "INT"],
                  ["BIGINT", "BIGINT"],
                  ["FLOAT", "FLOAT"],
                  ["DOUBLE", "DOUBLE"],
                  ["DECIMAL", "DECIMAL(10,2)"],
                  ["BOOLEAN", "TINYINT(1)"],
                  ["DATE", "DATE"],
                  ["DATETIME", "DATETIME"],
                  ["JSON", "JSON"],
                  ["UUID", "CHAR(36)"],
                  ["BLOB", "BLOB"],
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
          <ul className="text-muted-foreground mt-4 space-y-2 list-disc list-inside">
            <li>
              <code>BOOLEAN</code> is <code>TINYINT(1)</code> — there is no real
              boolean in either MySQL or MariaDB. The driver hands the column
              back as the number <code>1</code> or <code>0</code>, never as{" "}
              <code>true</code>/<code>false</code>; it is boolean by convention
              only. The generated toggle (<code>SET col = NOT col</code>) relies
              on that numeric truthiness.
            </li>
            <li>
              <code>UUID</code> is <code>CHAR(36)</code>, so it round-trips as
              the plain string you supplied. <code>STRING</code> is{" "}
              <code>VARCHAR(255)</code> whatever <code>length</code> you
              declare; the mapper does not read it.
            </li>
            <li>
              A <code>BLOB</code> column comes back as a <code>Buffer</code>,
              not as a string.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">MariaDB</h2>
          <p className="text-muted-foreground mb-4">
            MariaDB is served by the same dialect, and the dialect never branches
            on the server version — <code>SELECT VERSION()</code> answers with a
            string containing <code>MariaDB</code>, not a MySQL one, so a
            version check would not be a safe place to fork the behaviour
            anyway. Two consequences are worth knowing:
          </p>
          <ul className="text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              A <code>DataTypes.JSON</code> column is an alias for{" "}
              <code>LONGTEXT</code> with a validity check attached, not a real
              type. The column is reported as <code>longtext</code> by{" "}
              <code>information_schema</code>, and the driver hands the value
              back as a string rather than a parsed object. See{" "}
              <a className="underline" href="/docs/data-types">
                Data Types
              </a>
              .
            </li>
            <li>
              MariaDB accepts <code>INSERT … RETURNING</code>, which MySQL does
              not. The dialect still emits neither: writes keep the{" "}
              <code>ON DUPLICATE KEY UPDATE</code> and{" "}
              <code>LAST_INSERT_ID()</code> path described above.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground mb-4">
            A transaction takes a connection out of the pool, opens it with{" "}
            <code>START TRANSACTION</code>, and commits or rolls back on that
            same connection before releasing it back. The ORM does that wiring
            for you, so the callback looks the same as on every other dialect.
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
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
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
                It reads <code>size</code>, <code>borrowed</code> and{" "}
                <code>available</code> off the <code>mssql</code> pool. For any
                other driver it returns{" "}
                <code>{`{ active: -1, idle: -1, total: -1 }`}</code>.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
