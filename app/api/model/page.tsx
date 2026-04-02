"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function ModelApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Model Definition API</h1>
        <p className="text-muted-foreground mb-8">
          Define models with columns, relationships, scopes, and options
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">defineModel()</h2>
            <CodeBlock
              language="typescript"
              code={`defineModel(config: ModelConfig): ModelClass

interface ModelConfig {
  tableName: string;
  versioned?: boolean;
  softDelete?: boolean;
  columns: Record<string, ColumnConfig>;
  relations?: RelationConfig[];
  scopes?: Record<string, (qb: QueryBuilder, ...args: any[]) => QueryBuilder>;
  timestamps?: { createdAt?: string; updatedAt?: string };
}`}
            />
            <h3 className="font-semibold mb-2">Options:</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  tableName
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Database table name (required)
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  columns
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Column definitions (required)
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  versioned
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Enable version history tracking
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  timestamps
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Auto-manage createdAt/updatedAt columns
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  relations
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Relationship definitions
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  scopes
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Reusable query filters
                </span>
              </li>
            </ul>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">ColumnConfig</h2>
            <CodeBlock
              language="typescript"
              code={`interface ColumnConfig {
  type: DataTypes;           // Column data type (required)
  name?: string;             // Override SQL column name
  length?: number;           // Max length for STRING
  required?: boolean;        // NOT NULL constraint
  unique?: boolean;          // UNIQUE constraint
  defaultValue?: any;        // Default value on insert
  defaultExpression?: { sql: string };  // SQL default expression
  index?: string;            // Index name
  softDelete?: boolean;      // Mark as soft delete field
  optimisticLock?: boolean;  // Enable optimistic locking
  encrypted?: boolean;       // Field-level encryption
  minLength?: number;        // Min string length (validation)
  maxLength?: number;        // Max string length (validation)
  pattern?: RegExp;          // Regex validation
  customValidator?: (val: any) => boolean | string;  // Custom validation
}`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Full Example</h2>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";
import { registerHooks } from "stabilize-orm";
import { generateUUID } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  versioned: true,
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: {
      type: DataTypes.STRING,
      length: 255,
      required: true,
      unique: true,
      pattern: /^[^@]+@[^@]+\\.[^@]+$/,
    },
    name: { type: DataTypes.STRING, length: 100, required: true },
    bio: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    role: { type: DataTypes.STRING, length: 50, defaultValue: "user" },
    metadata: { type: DataTypes.JSON, encrypted: true },
    version: { type: DataTypes.INTEGER, optimisticLock: true },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Post,
      property: "posts",
      foreignKey: "authorId",
    },
  ],
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    admin: (qb) => qb.where("role = ?", "admin"),
    byRole: (qb, role: string) => qb.where("role = ?", role),
  },
});

// Register hooks after model definition
registerHooks(User, {
  beforeCreate: async (entity) => {
    console.log("Creating user:", entity.email);
  },
});

export { User };`}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
