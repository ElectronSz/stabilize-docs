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
                    ["BLOB", "BYTEA", "BLOB", "BLOB"],
                  ].map(([name, pg, mysql, sqlite]) => (
                    <tr key={name} className="border-t border-accent/20">
                      <td className="py-1 px-3 font-mono font-semibold">{`DataTypes.${name}`}</td>
                      <td className="py-1 px-3">{pg}</td>
                      <td className="py-1 px-3">{mysql}</td>
                      <td className="py-1 px-3">{sqlite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
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
