import { CodeBlock } from "@/components/code-block";

const rows: [string, string, string, string, string][] = [
  ["STRING", "TEXT", "VARCHAR(255)", "TEXT", "NVARCHAR(255)"],
  ["TEXT", "TEXT", "TEXT", "TEXT", "NVARCHAR(MAX)"],
  ["INTEGER", "INTEGER", "INT", "INTEGER", "INT"],
  ["BIGINT", "BIGINT", "BIGINT", "INTEGER", "BIGINT"],
  ["FLOAT", "REAL", "FLOAT", "REAL", "REAL"],
  ["DOUBLE", "DOUBLE PRECISION", "DOUBLE", "REAL", "FLOAT"],
  ["DECIMAL", "DECIMAL", "DECIMAL(10,2)", "NUMERIC", "DECIMAL(10,2)"],
  ["BOOLEAN", "BOOLEAN", "TINYINT(1)", "INTEGER", "BIT"],
  ["DATE", "DATE", "DATE", "TEXT", "DATE"],
  ["DATETIME", "TIMESTAMP", "DATETIME", "TEXT", "DATETIME2"],
  ["JSON", "JSONB", "JSON", "TEXT", "NVARCHAR(MAX)"],
  ["UUID", "UUID", "CHAR(36)", "TEXT", "UNIQUEIDENTIFIER"],
  ["BLOB", "BYTEA", "BLOB", "BLOB", "VARBINARY(MAX)"],
];

export default function DataTypesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">Data Types</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <code>DataTypes</code> is the abstract type you declare on a column. Each
        of the four dialects picks its own SQL type for it, so the same model
        runs unchanged everywhere.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">The Thirteen Members</h2>
          <p className="text-muted-foreground mb-4">
            There are exactly thirteen, and they are not open-ended — a column
            needs one of these:
          </p>
          <CodeBlock
            filename="types.ts"
            language="typescript"
            code={`import { DataTypes } from "stabilize-orm";

DataTypes.STRING    DataTypes.TEXT      DataTypes.INTEGER
DataTypes.BIGINT    DataTypes.FLOAT     DataTypes.DOUBLE
DataTypes.DECIMAL   DataTypes.BOOLEAN   DataTypes.DATE
DataTypes.DATETIME  DataTypes.JSON      DataTypes.UUID
DataTypes.BLOB

// There is no DataTypes.TIME. A time-only column has no member here --
// use DATETIME, or a STRING with a format of your own.`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The Mapping</h2>
          <p className="text-muted-foreground mb-4">
            What each member becomes per dialect:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">DataTypes</th>
                  <th className="text-left py-2 pr-4 font-semibold">Postgres</th>
                  <th className="text-left py-2 pr-4 font-semibold">
                    MySQL / MariaDB
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold">SQLite</th>
                  <th className="text-left py-2 font-semibold">SQL Server</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {rows.map(([dt, pg, my, lite, ms]) => (
                  <tr key={dt} className="border-b border-accent/10">
                    <td className="py-2 pr-4">
                      <code>DataTypes.{dt}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code>{pg}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code>{my}</code>
                    </td>
                    <td className="py-2 pr-4">
                      <code>{lite}</code>
                    </td>
                    <td className="py-2">
                      <code>{ms}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            An unrecognised type falls back rather than failing:{" "}
            <code>TEXT</code> on Postgres, MySQL and SQLite, and{" "}
            <code>NVARCHAR(MAX)</code> on SQL Server — T-SQL&apos;s own{" "}
            <code>TEXT</code> is deprecated and unusable in most expressions, so
            it is never emitted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            <code>length</code>, <code>precision</code> and{" "}
            <code>scale</code> Do Nothing
          </h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              Three declared options are never read
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              <code>ColumnConfig</code> accepts <code>length</code>,{" "}
              <code>precision</code> and <code>scale</code>, and the library
              never consults any of them — not when generating the table, and not
              when validating a value. The SQL type comes from the{" "}
              <code>DataTypes</code> member alone. So{" "}
              <code>{"{ type: DataTypes.STRING, length: 50 }"}</code> still
              creates a <code>VARCHAR(255)</code> on MySQL, and a 200-character
              string written to it is stored without complaint.
            </p>
            <CodeBlock
              language="typescript"
              code={`const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 5 },   // length is ignored
  },
});

// Emitted DDL: title TEXT (Postgres) / VARCHAR(255) (MySQL) -- not (5).

// And no error on write:
await postRepo.create({ id: "p1", title: "a great deal longer than five" });`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              If you need a real limit, <code>maxLength</code> is enforced by the
              ORM&apos;s validation, and <code>minLength</code>,{" "}
              <code>pattern</code> and <code>customValidator</code> work the same
              way — those are checked by the library rather than by the database.
              See{" "}
              <a className="underline" href="/docs/validation">
                Validation
              </a>
              . The difference matters: <code>length</code> is a no-op you might
              reasonably assume is a constraint, while <code>maxLength</code>{" "}
              actually rejects.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Where the Dialects Disagree
          </h2>
          <p className="text-muted-foreground mb-4">
            The mapping is not a tidy one-to-one. These are the differences that
            change behaviour:
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">
            STRING is bounded on MySQL and SQL Server, unbounded elsewhere
          </h3>
          <p className="text-muted-foreground mb-4">
            <code>DataTypes.STRING</code> becomes <code>TEXT</code> on Postgres
            and SQLite — no length limit at all — but <code>VARCHAR(255)</code>{" "}
            on MySQL and <code>NVARCHAR(255)</code> on SQL Server. Since{" "}
            <code>length</code> is ignored, declaring{" "}
            <code>length: 1000</code> does not widen it. A value that fits
            comfortably on Postgres is silently truncated at 255 characters on
            MySQL, or rejected outright on SQL Server, depending on the server
            mode. Use <code>DataTypes.TEXT</code> when the value might be long.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">
            SQLite collapses several types
          </h3>
          <p className="text-muted-foreground mb-4">
            SQLite has no native boolean, date or decimal type, so{" "}
            <code>BIGINT</code> becomes <code>INTEGER</code>,{" "}
            <code>BOOLEAN</code> becomes <code>INTEGER</code>, and{" "}
            <code>DATE</code>, <code>DATETIME</code>, <code>JSON</code> and{" "}
            <code>UUID</code> all become <code>TEXT</code>. Dates are stored as
            strings, which is why the ORM binds ISO strings rather than{" "}
            <code>Date</code> objects on this dialect.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">
            DECIMAL is fixed at 10,2 on two dialects
          </h3>
          <p className="text-muted-foreground mb-4">
            <code>DataTypes.DECIMAL</code> becomes{" "}
            <code>DECIMAL(10,2)</code> on MySQL and SQL Server — a hardcoded
            ten-digit precision with two decimal places — while Postgres and
            SQLite get an unqualified <code>DECIMAL</code> /{" "}
            <code>NUMERIC</code> that the server sizes itself. Since{" "}
            <code>precision</code> and <code>scale</code> are ignored, you cannot
            widen the MySQL or SQL Server column from the model; a value needing
            more than 10 significant digits will not fit there while it fits
            fine on Postgres.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">
            FLOAT and DOUBLE swap places
          </h3>
          <p className="text-muted-foreground mb-4">
            On MySQL <code>FLOAT</code> is <code>FLOAT</code> and{" "}
            <code>DOUBLE</code> is <code>DOUBLE</code>. On SQL Server{" "}
            <code>FLOAT</code> is <code>REAL</code> (4-byte) and{" "}
            <code>DOUBLE</code> is <code>FLOAT</code> (8-byte) — T-SQL&apos;s{" "}
            <code>FLOAT</code> means double precision. Reading the emitted DDL
            alone is therefore misleading; the <code>DataTypes</code> member is
            what states your intent.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">
            Booleans are encoded differently everywhere
          </h3>
          <p className="text-muted-foreground mb-4">
            Postgres has a real <code>BOOLEAN</code>; MySQL uses{" "}
            <code>TINYINT(1)</code>, SQLite an <code>INTEGER</code> and SQL
            Server a <code>BIT</code>. All four round-trip to a JavaScript
            boolean through the ORM, so this is only worth knowing when you write
            raw SQL against the table — a <code>WHERE isActive = true</code> that
            works on Postgres will not parse on SQLite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            JSON Is the Least Portable Member
          </h2>
          <p className="text-muted-foreground mb-4">
            <code>DataTypes.JSON</code> maps to a genuine JSON type on only two
            dialects — <code>JSONB</code> on Postgres and <code>JSON</code> on
            MySQL. On SQLite it is <code>TEXT</code> and on SQL Server{" "}
            <code>NVARCHAR(MAX)</code>, and the ORM does not parse a value back
            into an object on read: whatever the driver returns is what you get.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">Dialect</th>
                  <th className="text-left py-2 pr-4 font-semibold">Column</th>
                  <th className="text-left py-2 pr-4 font-semibold">
                    Writing an object
                  </th>
                  <th className="text-left py-2 font-semibold">Reading it back</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">PostgreSQL</td>
                  <td className="py-2 pr-4">
                    <code>JSONB</code>
                  </td>
                  <td className="py-2 pr-4">driver serialises it</td>
                  <td className="py-2">an object</td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">MySQL</td>
                  <td className="py-2 pr-4">
                    <code>JSON</code>
                  </td>
                  <td className="py-2 pr-4">
                    ORM encodes to JSON text
                  </td>
                  <td className="py-2">an object</td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">MariaDB</td>
                  <td className="py-2 pr-4">
                    <code>JSON</code> (an alias for <code>LONGTEXT</code>)
                  </td>
                  <td className="py-2 pr-4">ORM encodes to JSON text</td>
                  <td className="py-2">
                    a <strong>string</strong> — parse it yourself
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">SQL Server</td>
                  <td className="py-2 pr-4">
                    <code>NVARCHAR(MAX)</code>
                  </td>
                  <td className="py-2 pr-4">ORM encodes to JSON text</td>
                  <td className="py-2">
                    a <strong>string</strong> — parse it yourself
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">SQLite</td>
                  <td className="py-2 pr-4">
                    <code>TEXT</code>
                  </td>
                  <td className="py-2 pr-4">
                    <strong>rejected</strong> — see below
                  </td>
                  <td className="py-2">
                    a <strong>string</strong> — parse it yourself
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-4">
            MariaDB is worth singling out because it is easy to mistake for
            MySQL: its <code>JSON</code> is an alias for <code>LONGTEXT</code>{" "}
            with a validity check, not a real type, so the driver reports the
            column as text and hands you the raw string. The same{" "}
            <code>DataTypes.JSON</code> declaration therefore round-trips as an
            object on MySQL and as a string on MariaDB.
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold mb-2">
              On SQLite, a JSON object written as an object fails
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              The ORM encodes a plain object to JSON text on the MySQL and SQL
              Server paths. The SQLite path applies no such encoding — the value
              is handed to <code>bun:sqlite</code> as-is, and the driver accepts
              only strings, numbers, bigints, booleans, <code>null</code> and
              typed arrays. Writing an object there fails the whole statement:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Fails on SQLite:
await postRepo.create({ id: "p1", meta: { tags: ["a"] } });
// Query failed after 1 attempt: Binding expected string, TypedArray,
// boolean, number, bigint or null

// Works -- serialise it yourself when targeting SQLite:
await postRepo.create({ id: "p1", meta: JSON.stringify({ tags: ["a"] }) });`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              Because the same call works on Postgres, MySQL and SQL Server,
              code written against one of those and later pointed at SQLite
              breaks at the first write. If a model is shared across dialects,
              store the string yourself and parse on read — that is portable to
              all four.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            The Column Named <code>id</code> Is Special
          </h2>
          <p className="text-muted-foreground mb-4">
            A column whose key is exactly <code>id</code> is treated as the
            primary key, and its type decides who assigns it. That decision is
            made from the <code>DataTypes</code> member, and it changes the
            emitted column in ways the table above does not show:
          </p>
          <CodeBlock
            filename="sql/primary-keys.sql"
            language="sql"
            code={`-- id: DataTypes.INTEGER -- the database generates it
Postgres      id SERIAL PRIMARY KEY
MySQL         id INT AUTO_INCREMENT PRIMARY KEY
SQLite        id INTEGER PRIMARY KEY AUTOINCREMENT
SQL Server    id INT IDENTITY(1,1) PRIMARY KEY

-- id: DataTypes.STRING -- the caller supplies it
Postgres      id UUID PRIMARY KEY
MySQL         id VARCHAR(255) PRIMARY KEY
SQLite        id TEXT PRIMARY KEY
SQL Server    id NVARCHAR(255) PRIMARY KEY

-- id: DataTypes.UUID -- the caller supplies it
Postgres      id UUID PRIMARY KEY
MySQL         id VARCHAR(255) PRIMARY KEY
SQLite        id TEXT PRIMARY KEY
SQL Server    id UNIQUEIDENTIFIER PRIMARY KEY`}
          />
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              A <code>STRING</code> id becomes <code>UUID</code> on Postgres
            </p>
            <p className="text-sm text-muted-foreground">
              Note the odd one out. Everywhere else a <code>STRING</code> id is a
              text primary key that accepts any value you give it, but on
              Postgres the same declaration produces a{" "}
              <code>UUID PRIMARY KEY</code>. Inserting{" "}
              <code>{`{ id: "user-1" }`}</code> therefore fails there with an
              invalid-UUID error while succeeding on the other three dialects —
              announce your intent with <code>DataTypes.UUID</code> and a{" "}
              <code>generateUUID()</code> value if you cross dialects, or use{" "}
              <code>DataTypes.INTEGER</code> and let the database assign it.
            </p>
          </div>
          <p className="text-muted-foreground mt-4">
            An integer or otherwise non-string <code>id</code> is generated, so
            it must be <em>omitted</em> from a create payload. A string or UUID{" "}
            <code>id</code> is not, so it stays required — omitting it fails
            validation with <code>Field id is required</code>. Which side of that
            line you are on is decided solely by the type. On SQL Server there is
            an extra wrinkle for the generated case, since an{" "}
            <code>IDENTITY</code> column rejects an explicit value; see{" "}
            <a className="underline" href="/docs/mssql">
              SQL Server
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Encrypted Columns</h2>
          <p className="text-muted-foreground mb-4">
            An <code>encrypted: true</code> column stores Base64 ciphertext, so
            the string it holds is longer than the plaintext — roughly 1.4× plus
            about 40 characters. Since <code>length</code> is ignored, size the
            column with the <code>DataTypes</code> member instead: on MySQL and
            SQL Server, <code>STRING</code> gives you only{" "}
            <code>VARCHAR(255)</code> / <code>NVARCHAR(255)</code>, which a
            moderately long secret will overflow. Use{" "}
            <code>DataTypes.TEXT</code>. See{" "}
            <a className="underline" href="/docs/encryption">
              Column Encryption
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
