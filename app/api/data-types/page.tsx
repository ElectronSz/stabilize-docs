"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function DataTypesApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Data Types</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Database-agnostic data types with automatic SQL mapping per database
        </p>

        <div className="space-y-6">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">DataTypes Enum</h2>
            <CodeBlock
              language="typescript"
              code={`import { DataTypes } from "stabilize-orm";

DataTypes.STRING     // VARCHAR - short text with optional length
DataTypes.TEXT       // TEXT - long text content
DataTypes.INTEGER    // INTEGER - whole numbers
DataTypes.BIGINT     // BIGINT - large whole numbers
DataTypes.FLOAT      // FLOAT - single-precision decimal
DataTypes.DOUBLE     // DOUBLE - double-precision decimal
DataTypes.DECIMAL    // DECIMAL - exact decimal (e.g. currency)
DataTypes.BOOLEAN    // BOOLEAN - true/false values
DataTypes.DATE       // DATE - date only
DataTypes.DATETIME   // DATETIME - date and time
DataTypes.JSON       // JSON - JSON data
DataTypes.UUID       // UUID - universally unique identifier
DataTypes.BLOB       // BLOB - binary data`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Database Type Mappings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-accent/30 mb-4">
                <thead>
                  <tr className="bg-secondary/40 text-muted-foreground">
                    <th className="py-2 px-3 text-left">DataType</th>
                    <th className="py-2 px-3 text-left">PostgreSQL</th>
                    <th className="py-2 px-3 text-left">MySQL</th>
                    <th className="py-2 px-3 text-left">SQLite</th>
                    <th className="py-2 px-3 text-left">SQL Server</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["STRING", "TEXT", "VARCHAR(255)", "TEXT", "NVARCHAR(255)"],
                    ["TEXT", "TEXT", "TEXT", "TEXT", "NVARCHAR(MAX)"],
                    ["INTEGER", "INTEGER", "INT", "INTEGER", "INT"],
                    ["BIGINT", "BIGINT", "BIGINT", "INTEGER", "BIGINT"],
                    ["FLOAT", "REAL", "FLOAT", "REAL", "REAL"],
                    ["DOUBLE", "DOUBLE PRECISION", "DOUBLE", "REAL", "FLOAT"],
                    ["DECIMAL", "DECIMAL(10,2)", "DECIMAL(10,2)", "NUMERIC", "DECIMAL(10,2)"],
                    ["BOOLEAN", "BOOLEAN", "TINYINT(1)", "INTEGER", "BIT"],
                    ["DATE", "DATE", "DATE", "TEXT", "DATE"],
                    ["DATETIME", "TIMESTAMP", "DATETIME", "TEXT", "DATETIME2"],
                    ["JSON", "JSONB", "JSON", "TEXT", "NVARCHAR(MAX)"],
                    ["UUID", "UUID", "CHAR(36)", "TEXT", "UNIQUEIDENTIFIER"],
                    ["BLOB", "BYTEA", "BLOB", "BLOB", "VARBINARY(MAX)"],
                  ].map(([name, pg, mysql, sqlite, mssql]) => (
                    <tr key={name} className="border-t border-accent/20">
                      <td className="py-1 px-3 font-mono font-semibold">{`DataTypes.${name}`}</td>
                      <td className="py-1 px-3">{pg}</td>
                      <td className="py-1 px-3">{mysql}</td>
                      <td className="py-1 px-3">{sqlite}</td>
                      <td className="py-1 px-3">{mssql}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">String Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    DataTypes.STRING
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → TEXT / VARCHAR(255) / TEXT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Variable-length string. Note that PostgreSQL maps this to{" "}
                  <code>TEXT</code> rather than a length-capped{" "}
                  <code>VARCHAR</code> — the{" "}
                  <code className="text-accent">length</code> option does not
                  produce a PostgreSQL length constraint, because Postgres treats{" "}
                  <code>TEXT</code> and <code>VARCHAR(n)</code> as the same type.
                  It is still enforced: the value is checked against the declared
                  length on write.
                </p>
                <CodeBlock
                  code={`{ type: DataTypes.STRING, length: 255 }`}
                  language="typescript"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    DataTypes.TEXT
                  </Badge>
                  <span className="text-sm text-muted-foreground">→ TEXT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Large text content with no length limit. Identical to{" "}
                  <code>STRING</code> at the SQL level, but expresses intent.
                </p>
                <CodeBlock code={`{ type: DataTypes.TEXT }`} language="typescript" />
              </div>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Numeric Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    DataTypes.INTEGER
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → INTEGER / INT / INTEGER
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Whole numbers.
                </p>
                <CodeBlock
                  code={`{ type: DataTypes.INTEGER }`}
                  language="typescript"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    DataTypes.BIGINT
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → BIGINT / BIGINT / INTEGER
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Large whole numbers. SQLite has no distinct 64-bit type, so it
                  falls back to <code>INTEGER</code>.
                </p>
                <CodeBlock code={`{ type: DataTypes.BIGINT }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    DataTypes.FLOAT
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → REAL / FLOAT / REAL
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Single-precision floating-point numbers.
                </p>
                <CodeBlock code={`{ type: DataTypes.FLOAT }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    DataTypes.DOUBLE
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → DOUBLE PRECISION / DOUBLE / REAL
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Double-precision floating-point numbers.
                </p>
                <CodeBlock code={`{ type: DataTypes.DOUBLE }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    DataTypes.DECIMAL
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → DECIMAL(10,2) / NUMERIC
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Exact decimal numbers — use this for money. Unlike{" "}
                  <code>FLOAT</code>/<code>DOUBLE</code> it stores the value you
                  wrote rather than the nearest binary approximation.
                </p>
                <CodeBlock
                  code={`{ type: DataTypes.DECIMAL, precision: 10, scale: 2 }`}
                  language="typescript"
                />
              </div>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Boolean Type</h2>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  DataTypes.BOOLEAN
                </Badge>
                <span className="text-sm text-muted-foreground">
                  → BOOLEAN / TINYINT(1) / INTEGER
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                True/false values.
              </p>
              <CodeBlock
                code={`{ type: DataTypes.BOOLEAN, defaultValue: false }`}
                language="typescript"
              />
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Date &amp; Time Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    DataTypes.DATETIME
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → TIMESTAMP / DATETIME / TEXT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Date and time.
                </p>
                <CodeBlock code={`{ type: DataTypes.DATETIME }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    DataTypes.DATE
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → DATE / DATE / TEXT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Date only, no time component.
                </p>
                <CodeBlock code={`{ type: DataTypes.DATE }`} language="typescript" />
              </div>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                There is no <code>DataTypes.TIME</code>. The enum stops at these
                two temporal types — store a time of day as a{" "}
                <code>STRING</code> or fold it into a{" "}
                <code>DATETIME</code>. SQLite stores both temporal types as{" "}
                <code>TEXT</code>, so a comparison there is a string comparison;
                an ISO-8601 value is the safe format to write.
              </p>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Special Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    DataTypes.JSON
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → JSONB / JSON / TEXT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  JSON data. PostgreSQL uses <code>JSONB</code>, which is stored
                  decomposed and can be indexed.
                </p>
                <CodeBlock code={`{ type: DataTypes.JSON }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    DataTypes.UUID
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → UUID / CHAR(36) / TEXT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Universally unique identifier. Only PostgreSQL has a native
                  type; MySQL and SQLite store the string form.
                </p>
                <CodeBlock
                  code={`import { generateUUID } from "stabilize-orm";

{ type: DataTypes.UUID, defaultValue: generateUUID() }`}
                  language="typescript"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    DataTypes.BLOB
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    → BYTEA / BLOB / BLOB
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Binary large object — files, images, raw bytes.
                </p>
                <CodeBlock code={`{ type: DataTypes.BLOB }`} language="typescript" />
              </div>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Primary Keys</h2>
            <p className="text-muted-foreground mb-4">
              There is no <code>primaryKey</code> or <code>autoIncrement</code>{" "}
              column option. The column keyed{" "}
              <code className="text-accent">id</code> is always the primary key,
              and the DDL chosen for it depends only on its{" "}
              <code>type</code>:
            </p>
            <CodeBlock
              language="typescript"
              code={`columns: {
  // Integer-style id → the dialect's auto-increment primary key
  id: { type: DataTypes.INTEGER },

  // STRING or UUID id → a client-supplied primary key, no auto-increment
  id: { type: DataTypes.UUID, required: true },
}`}
            />
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-accent/30">
                <thead>
                  <tr className="bg-secondary/40 text-muted-foreground">
                    <th className="py-2 px-3 text-left">id type</th>
                    <th className="py-2 px-3 text-left">Generated DDL</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "INTEGER / BIGINT / other",
                      "SERIAL PRIMARY KEY (Postgres) · INT AUTO_INCREMENT PRIMARY KEY (MySQL) · INTEGER PRIMARY KEY AUTOINCREMENT (SQLite) · INT IDENTITY(1,1) PRIMARY KEY (SQL Server)",
                    ],
                    [
                      "STRING",
                      "UUID PRIMARY KEY (Postgres) · VARCHAR(255) PRIMARY KEY (MySQL) · TEXT PRIMARY KEY (SQLite) · NVARCHAR(255) PRIMARY KEY (SQL Server)",
                    ],
                    [
                      "UUID",
                      "UUID PRIMARY KEY (Postgres) · VARCHAR(255) PRIMARY KEY (MySQL) · TEXT PRIMARY KEY (SQLite) · UNIQUEIDENTIFIER PRIMARY KEY (SQL Server)",
                    ],
                  ].map(([type, ddl]) => (
                    <tr key={type} className="border-t border-accent/20">
                      <td className="py-1 px-3 font-mono font-semibold">{type}</td>
                      <td className="py-1 px-3">{ddl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">
              Because the primary key is recognised by the column key{" "}
              <code>id</code>, a model that names it anything else gets no
              primary key at all.
            </p>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
            <CodeBlock
              filename="models/Product.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

const Product = defineModel({
  tableName: "products",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 255, required: true },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL, required: true },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    metadata: { type: DataTypes.JSON },
    releaseDate: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATETIME },
  },
});`}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
