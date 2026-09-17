import { CodeBlock } from "@/components/code-block";

const rows: [string, string, string, string, string, string][] = [
  ["STRING", "TEXT", "VARCHAR(255)", "TEXT", "NVARCHAR(255)", "string"],
  ["TEXT", "TEXT", "TEXT", "TEXT", "NVARCHAR(MAX)", "string"],
  ["INTEGER", "INTEGER", "INT", "INTEGER", "INT", "int | long | double"],
  ["BIGINT", "BIGINT", "BIGINT", "INTEGER", "BIGINT", "int | long | double"],
  ["FLOAT", "REAL", "FLOAT", "REAL", "REAL", "double | int | long | decimal"],
  [
    "DOUBLE",
    "DOUBLE PRECISION",
    "DOUBLE",
    "REAL",
    "FLOAT",
    "double | int | long | decimal",
  ],
  [
    "DECIMAL",
    "DECIMAL(10,2)",
    "DECIMAL(10,2)",
    "NUMERIC",
    "DECIMAL(10,2)",
    "double | int | long | decimal",
  ],
  ["BOOLEAN", "BOOLEAN", "TINYINT(1)", "INTEGER", "BIT", "bool"],
  ["DATE", "DATE", "DATE", "TEXT", "DATE", "date | string"],
  ["DATETIME", "TIMESTAMP", "DATETIME", "TEXT", "DATETIME2", "date | string"],
  ["JSON", "JSONB", "JSON", "TEXT", "NVARCHAR(MAX)", "object | array | string"],
  ["UUID", "UUID", "CHAR(36)", "TEXT", "UNIQUEIDENTIFIER", "string"],
  ["BLOB", "BYTEA", "BLOB", "BLOB", "VARBINARY(MAX)", "binData | string"],
];

export default function DataTypesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">Data Types</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <code>DataTypes</code> is the abstract type you declare on a column. Each
        backend picks its own type for it — a SQL type on the four dialects, the
        BSON types a validator accepts on MongoDB — so the same model runs
        unchanged everywhere.
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
            What each member becomes per backend. The widths shown are the
            defaults — <code>length</code> widens <code>STRING</code>, and{" "}
            <code>precision</code> with <code>scale</code> sizes{" "}
            <code>DECIMAL</code>. See{" "}
            <a className="underline" href="#length-precision-and-scale">
              below
            </a>
            :
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
                  <th className="text-left py-2 pr-4 font-semibold">SQL Server</th>
                  <th className="text-left py-2 font-semibold">MongoDB</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {rows.map(([dt, pg, my, lite, ms, mongo]) => (
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
                    <td className="py-2 pr-4">
                      <code>{ms}</code>
                    </td>
                    <td className="py-2">
                      <code>{mongo}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            An unrecognised type falls back rather than failing:{" "}
            <code>TEXT</code> on Postgres, MySQL and SQLite,{" "}
            <code>NVARCHAR(MAX)</code> on SQL Server — T-SQL&apos;s own{" "}
            <code>TEXT</code> is deprecated and unusable in most expressions, so
            it is never emitted — and <code>string</code> on MongoDB.
          </p>
          <p className="text-muted-foreground mt-4">
            The MongoDB column is a list rather than a single type because it is
            a <code>$jsonSchema</code> validator rather than a column
            declaration, and several members accept more than one BSON type on
            purpose: a JavaScript integer arrives as an <code>int</code> inside
            32-bit range and a <code>double</code> beyond it, so accepting only{" "}
            <code>int</code> would reject every id past two billion.
          </p>
        </section>

        <section id="length-precision-and-scale">
          <h2 className="text-2xl font-semibold mb-4">
            <code>length</code>, <code>precision</code> and{" "}
            <code>scale</code>
          </h2>
          <p className="text-muted-foreground mb-4">
            These three options shape the emitted type, and the value written to
            it is checked against the same limit. Declaring{" "}
            <code>{"{ type: DataTypes.STRING, length: 50 }"}</code> produces{" "}
            <code>VARCHAR(50)</code> on MySQL, and a 60-character string is
            rejected rather than stored.
          </p>
          <CodeBlock
            language="typescript"
            code={`const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 5 },
    price: { type: DataTypes.DECIMAL, precision: 12, scale: 4 },
  },
});

// Emitted DDL
//   MySQL     title VARCHAR(5)             price DECIMAL(12,4)
//   MSSQL     title NVARCHAR(5)            price DECIMAL(12,4)
//   Postgres  title TEXT                   price DECIMAL(12,4)
//   SQLite    title TEXT                   price NUMERIC

// And a value over the limit is rejected:
await postRepo.create({ id: "p1", title: "a great deal longer than five" });
// StabilizeError: Field title too long   (code: VALIDATION_ERROR)`}
          />
          <p className="text-muted-foreground mt-4">
            Postgres and SQLite have no width to write. <code>TEXT</code> and{" "}
            <code>VARCHAR(n)</code> are the same type in Postgres with no
            performance difference, and SQLite&apos;s <code>NUMERIC</code> keeps
            no scale — so emitting a width there would claim a constraint the
            server does not enforce. The limit is applied in process instead, so
            the rule holds on every dialect even where the DDL cannot express it.
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-6">
            length and maxLength together
          </h3>
          <p className="text-muted-foreground mb-4">
            Each keeps the meaning it already had, which matters for models
            written before any of this was enforced:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>
              <code>length</code> alone is both the column width and the
              validation limit.
            </li>
            <li>
              <code>maxLength</code> alone stays validation-only. It changes no
              DDL, exactly as before.
            </li>
            <li>
              Given both, <code>length</code> sets the column width and{" "}
              <code>maxLength</code> is what a value is checked against.
            </li>
          </ul>
          <p className="text-muted-foreground">
            <code>minLength</code>, <code>pattern</code> and{" "}
            <code>customValidator</code> are unaffected and remain checked by the
            library rather than by the database. See{" "}
            <a className="underline" href="/docs/validation">
              Validation
            </a>
            .
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              Writing what you already store
            </p>
            <p className="text-sm text-muted-foreground">
              A column narrower than its widest existing value now rejects what
              used to be accepted. If you are adding <code>length</code> to a
              table that already holds longer values, widen the column rather
              than assuming the check is advisory — and expect a write that
              previously succeeded to fail once the limit is enforced.
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
            on MySQL and <code>NVARCHAR(255)</code> on SQL Server. That 255 is
            the default, not a ceiling: declaring <code>length: 1000</code>{" "}
            widens the column to <code>VARCHAR(1000)</code> and the value is
            checked against 1000. Leave <code>length</code> off and the 255
            stands, so a value that fits comfortably on Postgres is truncated at
            255 characters on MySQL, or rejected outright on SQL Server,
            depending on the server mode. Use <code>DataTypes.TEXT</code> when
            the value might be long, or name the width you need.
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
            DECIMAL defaults to 10,2 everywhere
          </h3>
          <p className="text-muted-foreground mb-4">
            <code>DataTypes.DECIMAL</code> becomes{" "}
            <code>DECIMAL(10,2)</code> on MySQL, SQL Server and Postgres — ten
            digits with two decimal places — and <code>NUMERIC</code> on SQLite,
            which is dynamically typed and keeps no scale. Declare{" "}
            <code>precision</code> and <code>scale</code> to size it yourself;
            without them the 10,2 default stands, and a value needing more than
            10 significant digits will not fit. On SQLite the declared precision
            and scale are enforced by the ORM instead, since the column itself
            will not.
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

          <h3 className="text-lg font-semibold mb-2 mt-6">
            MongoDB validates the type instead of declaring it
          </h3>
          <p className="text-muted-foreground mb-4">
            There is no column to declare on a document store, so the declared
            type becomes the <code>$jsonSchema</code> validator on the collection
            and a value of the wrong BSON type is rejected by the server, where a
            SQL backend would have coerced or truncated it. Two consequences
            follow from the mapping above. Nothing is bounded:{" "}
            <code>DataTypes.STRING</code> is a <code>string</code> of any length,
            so the 255-character limit MySQL and SQL Server impose does not exist
            here. And <code>DataTypes.DECIMAL</code> is a{" "}
            <strong>
              <code>double</code>
            </strong>
            , because MongoDB has no exact decimal unless the caller supplies a{" "}
            <code>Decimal128</code> — so a money column loses precision the way
            any binary float does. Store the smallest unit as an{" "}
            <code>INTEGER</code>/<code>BIGINT</code>, or the value as a{" "}
            <code>STRING</code>. See{" "}
            <a className="underline" href="/docs/mongodb">
              MongoDB
            </a>
            .
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
              is handed to the driver as-is, and the built-in SQLite drivers
              accept only strings, numbers, bigints, booleans, <code>null</code>{" "}
              and typed arrays. Writing an object there fails the whole
              statement, on either runtime:
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
MongoDB       _id from stabilize_counters

-- id: DataTypes.STRING -- the caller supplies it
Postgres      id UUID PRIMARY KEY
MySQL         id VARCHAR(255) PRIMARY KEY
SQLite        id TEXT PRIMARY KEY
SQL Server    id NVARCHAR(255) PRIMARY KEY
MongoDB       _id string, caller-supplied

-- id: DataTypes.UUID -- the caller supplies it
Postgres      id UUID PRIMARY KEY
MySQL         id VARCHAR(255) PRIMARY KEY
SQLite        id TEXT PRIMARY KEY
SQL Server    id UNIQUEIDENTIFIER PRIMARY KEY
MongoDB       _id string, caller-supplied`}
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
            . On MongoDB the same <code>id</code> column is stored as the
            document&apos;s <code>_id</code>, which is a storage detail inside
            the backend rather than something the API exposes — and an integer{" "}
            <code>id</code> there is allocated from a counters collection rather
            than by the server.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Encrypted Columns</h2>
          <p className="text-muted-foreground mb-4">
            An <code>encrypted: true</code> column stores Base64 ciphertext, so
            the string it holds is longer than the plaintext — roughly 1.4× plus
            about 55 characters of framing. A default{" "}
            <code>STRING</code> leaves you <code>VARCHAR(255)</code> /{" "}
            <code>NVARCHAR(255)</code> on MySQL and SQL Server, which a
            moderately long secret will overflow; you can widen it with{" "}
            <code>length</code>, but <code>DataTypes.TEXT</code> is the better
            answer because the ciphertext cannot be sized from the plaintext you
            have in mind. See{" "}
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
