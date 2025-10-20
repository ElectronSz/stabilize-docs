"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"

export default function DataTypesApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Data Types</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Available data types for model columns, with database-specific mappings
        </p>

        <div className="space-y-6">
          {/* DataTypes Enum */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">DataTypes Enum</h2>
            <CodeBlock
              filename="types.ts"
              language="typescript"
              code={`export enum DataTypes {
  STRING,    // Maps to VARCHAR or TEXT
  TEXT,      // Maps to TEXT
  INTEGER,   // Maps to INTEGER or INT
  BIGINT,    // Maps to BIGINT
  FLOAT,     // Maps to REAL or FLOAT
  DOUBLE,    // Maps to DOUBLE PRECISION
  DECIMAL,   // Maps to DECIMAL or NUMERIC
  BOOLEAN,   // Maps to BOOLEAN or TINYINT/INTEGER
  DATE,      // Maps to DATE or TEXT
  DATETIME,  // Maps to TIMESTAMP, DATETIME, or TEXT
  JSON,      // Maps to JSON, JSONB, or TEXT
  UUID,      // Maps to UUID or VARCHAR(36)
  BLOB,      // Maps to BYTEA or BLOB
}
`}
            />
            <p className="text-muted-foreground mb-4">
              Abstract data types for model columns, mapped to native SQL column types per database.
            </p>
          </Card>

          {/* Data Type Mapping Table */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Database Type Mappings</h2>
            <p className="text-muted-foreground mb-4">
              How each <code>DataTypes</code> value maps to native column types in major databases:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-accent/30 mb-4">
                <thead>
                  <tr className="bg-secondary/40 text-muted-foreground">
                    <th className="py-2 px-3">DataType</th>
                    <th className="py-2 px-3">Postgres</th>
                    <th className="py-2 px-3">MySQL</th>
                    <th className="py-2 px-3">SQLite</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["STRING", "TEXT", "VARCHAR(255)", "TEXT"],
                    ["TEXT", "TEXT", "TEXT", "TEXT"],
                    ["INTEGER", "INTEGER", "INT", "INTEGER"],
                    ["BIGINT", "BIGINT", "BIGINT", "INTEGER"],
                    ["FLOAT", "REAL", "FLOAT", "REAL"],
                    ["DOUBLE", "DOUBLE PRECISION", "DOUBLE", "REAL"],
                    ["DECIMAL", "DECIMAL", "DECIMAL(10,2)", "NUMERIC"],
                    ["BOOLEAN", "BOOLEAN", "TINYINT(1)", "INTEGER"],
                    ["DATE", "DATE", "DATE", "TEXT"],
                    ["DATETIME", "TIMESTAMP", "DATETIME", "TEXT"],
                    ["JSON", "JSONB", "JSON", "TEXT"],
                    ["UUID", "UUID", "CHAR(36)", "TEXT"],
                    ["BLOB", "BYTEA", "BLOB", "BLOB"]
                  ].map(([name, pg, mysql, sqlite]) => (
                    <tr key={name}>
                      <td className="py-1 px-3 font-mono font-semibold">{`DataTypes.${name}`}</td>
                      <td className="py-1 px-3">{pg}</td>
                      <td className="py-1 px-3">{mysql}</td>
                      <td className="py-1 px-3">{sqlite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock
              filename="mapDataTypeToSql.ts"
              language="typescript"
              code={`function mapDataTypeToSql(dt: DataTypes | string, dbType: DBType): string {
  // ...see codebase implementation above...
}`}
            />
          </Card>

          {/* String Types */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">String Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">DataTypes.STRING</Badge>
                  <span className="text-sm text-muted-foreground">→ VARCHAR / TEXT / VARCHAR(255)</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Variable-length string with specified max length.</p>
                <CodeBlock code={`{ type: DataTypes.STRING, length: 255 }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">DataTypes.TEXT</Badge>
                  <span className="text-sm text-muted-foreground">→ TEXT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Large text content without length limit.</p>
                <CodeBlock code={`{ type: DataTypes.TEXT }`} language="typescript" />
              </div>
            </div>
          </Card>

          {/* Numeric Types */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Numeric Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">DataTypes.INTEGER</Badge>
                  <span className="text-sm text-muted-foreground">→ INTEGER / INT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Whole numbers.</p>
                <CodeBlock code={`{ type: DataTypes.INTEGER, autoIncrement: true }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">DataTypes.BIGINT</Badge>
                  <span className="text-sm text-muted-foreground">→ BIGINT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Large whole numbers.</p>
                <CodeBlock code={`{ type: DataTypes.BIGINT }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">DataTypes.FLOAT</Badge>
                  <span className="text-sm text-muted-foreground">→ FLOAT / REAL</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Floating-point numbers.</p>
                <CodeBlock code={`{ type: DataTypes.FLOAT }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">DataTypes.DOUBLE</Badge>
                  <span className="text-sm text-muted-foreground">→ DOUBLE PRECISION / DOUBLE</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Double-precision floating-point numbers.</p>
                <CodeBlock code={`{ type: DataTypes.DOUBLE }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">DataTypes.DECIMAL</Badge>
                  <span className="text-sm text-muted-foreground">→ DECIMAL / NUMERIC</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Precise decimal numbers (currency, etc.).</p>
                <CodeBlock code={`{ type: DataTypes.DECIMAL, precision: 10, scale: 2 }`} language="typescript" />
              </div>
            </div>
          </Card>

          {/* Boolean Type */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Boolean Type</h2>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">DataTypes.BOOLEAN</Badge>
                <span className="text-sm text-muted-foreground">→ BOOLEAN / TINYINT(1) / INTEGER</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">True/false values.</p>
              <CodeBlock code={`{ type: DataTypes.BOOLEAN, defaultValue: false }`} language="typescript" />
            </div>
          </Card>

          {/* Date & Time Types */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Date & Time Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">DataTypes.DATETIME</Badge>
                  <span className="text-sm text-muted-foreground">→ TIMESTAMP / DATETIME / TEXT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Date and time with timezone.</p>
                <CodeBlock code={`{ type: DataTypes.DATETIME, defaultValue: () => new Date() }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">DataTypes.DATE</Badge>
                  <span className="text-sm text-muted-foreground">→ DATE / TEXT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Date only (no time).</p>
                <CodeBlock code={`{ type: DataTypes.DATE }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">DataTypes.TIME</Badge>
                  <span className="text-sm text-muted-foreground">→ TIME</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Time only (no date).</p>
                <CodeBlock code={`{ type: DataTypes.TIME }`} language="typescript" />
              </div>
            </div>
          </Card>

          {/* Special Types */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Special Types</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">DataTypes.JSON</Badge>
                  <span className="text-sm text-muted-foreground">→ JSON / JSONB / TEXT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">JSON data (objects, arrays).</p>
                <CodeBlock code={`{ type: DataTypes.JSON }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">DataTypes.UUID</Badge>
                  <span className="text-sm text-muted-foreground">→ UUID / CHAR(36) / TEXT</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Universally unique identifier.</p>
                <CodeBlock code={`{ type: DataTypes.UUID, defaultValue: () => crypto.randomUUID() }`} language="typescript" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">DataTypes.BLOB</Badge>
                  <span className="text-sm text-muted-foreground">→ BYTEA / BLOB</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Binary large object (file, image, etc.).</p>
                <CodeBlock code={`{ type: DataTypes.BLOB }`} language="typescript" />
              </div>
            </div>
          </Card>

          {/* Complete Example */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Complete Example</h2>
            <CodeBlock
              filename="models/Product.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

const Product = defineModel({
  tableName: "products",
  columns: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => crypto.randomUUID(),
    },
    name: {
      type: DataTypes.STRING,
      length: 255,
      required: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL,
      precision: 10,
      scale: 2,
      required: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSON,
    },
    image: {
      type: DataTypes.BLOB,
    },
    releaseDate: {
      type: DataTypes.DATE,
    },
    createdAt: {
      type: DataTypes.DATETIME,
      defaultValue: () => new Date(),
    },
  },
});`}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}