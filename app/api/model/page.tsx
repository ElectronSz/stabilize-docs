"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"

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
              code={`defineModel<T>(config: ModelConfig): Model<T>

export interface ModelConfig {
  tableName: string;
  versioned?: boolean;
  softDelete?: boolean;
  columns: Record<string, ColumnConfig>;
  relations?: RelationConfig[];
  scopes?: Record<string, (qb: QueryBuilder<any>, ...args: any[]) => QueryBuilder<any>>;
  timestamps?: TimestampsConfig;
}
`}
              language="typescript"
            />
            <p className="text-muted-foreground mb-4">
              Defines a new model with its schema, relationships, scopes, and options.
            </p>
            <h3 className="font-semibold mb-2">Model Definition Options:</h3>
            <ul className="space-y-2 mb-4">
              <li><Badge variant="outline" className="mr-2">tableName</Badge> <span className="text-muted-foreground">Database table name (required)</span></li>
              <li><Badge variant="outline" className="mr-2">columns</Badge> <span className="text-muted-foreground">Column definitions (required)</span></li>
              <li><Badge variant="outline" className="mr-2">relations</Badge> <span className="text-muted-foreground">Relationship definitions (optional)</span></li>
              <li><Badge variant="outline" className="mr-2">scopes</Badge> <span className="text-muted-foreground">Custom query scopes (optional)</span></li>
              <li><Badge variant="outline" className="mr-2">timestamps</Badge> <span className="text-muted-foreground">Auto-manage createdAt/updatedAt (optional)</span></li>
              <li><Badge variant="outline" className="mr-2">softDelete</Badge> <span className="text-muted-foreground">Enable soft deletes with deletedAt (optional)</span></li>
              <li><Badge variant="outline" className="mr-2">versioned</Badge> <span className="text-muted-foreground">Enable version tracking (optional)</span></li>
            </ul>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  softDelete: true,
  versioned: true,
  columns: {
    id: {
      type: DataTypes.Integer,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.String,
      length: 100,
      required: true,
      unique: true,
      index: "idx_email"
    },
    name: {
      type: DataTypes.String,
      length: 255,
      required: true,
    },
    deletedAt: {
      type: DataTypes.DateTime,
      softDelete: true,
    }
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Post,
      property: "posts",
      foreignKey: "userId",
    }
  ],
  scopes: {
    active: qb => qb.where("isActive = ?", true),
  }
});`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Column Options</h2>
            <p className="text-muted-foreground mb-4">Available options for column definitions:</p>
            <CodeBlock
              code={`export interface ColumnConfig {
  name?: string;
  type: DataTypes;
  length?: number;
  precision?: number;
  scale?: number;
  required?: boolean;
  unique?: boolean;
  defaultValue?: any;
  index?: string;
  softDelete?: boolean;
}`}
              language="typescript"
            />
            <ul className="space-y-3 mb-4">
              <li><Badge variant="outline" className="mr-2">type</Badge> <span className="text-muted-foreground">Data type (required)</span></li>
              <li><Badge variant="outline" className="mr-2">primaryKey</Badge> <span className="text-muted-foreground">Mark as primary key</span></li>
              <li><Badge variant="outline" className="mr-2">autoIncrement</Badge> <span className="text-muted-foreground">Auto-increment for integers</span></li>
              <li><Badge variant="outline" className="mr-2">required</Badge> <span className="text-muted-foreground">NOT NULL constraint</span></li>
              <li><Badge variant="outline" className="mr-2">unique</Badge> <span className="text-muted-foreground">UNIQUE constraint</span></li>
              <li><Badge variant="outline" className="mr-2">defaultValue</Badge> <span className="text-muted-foreground">Default value or function</span></li>
              <li><Badge variant="outline" className="mr-2">length</Badge> <span className="text-muted-foreground">Max length for strings</span></li>
              <li><Badge variant="outline" className="mr-2">precision</Badge> <span className="text-muted-foreground">Precision for decimals</span></li>
              <li><Badge variant="outline" className="mr-2">scale</Badge> <span className="text-muted-foreground">Scale for decimals</span></li>
              <li><Badge variant="outline" className="mr-2">index</Badge> <span className="text-muted-foreground">Index name (optional)</span></li>
              <li><Badge variant="outline" className="mr-2">softDelete</Badge> <span className="text-muted-foreground">Marks column as soft delete field</span></li>
            </ul>
            <CodeBlock
              filename="models/Product.ts"
              language="typescript"
              code={`columns: {
  id: { type: DataTypes.Integer, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.String, length: 100, required: true, unique: true, index: "idx_email" },
  price: { type: DataTypes.Decimal, precision: 10, scale: 2, defaultValue: 0 },
  createdAt: { type: DataTypes.DateTime, defaultValue: () => new Date() },
  deletedAt: { type: DataTypes.DateTime, softDelete: true }
}`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Relationship Options</h2>
            <p className="text-muted-foreground mb-4">Define relationships between models:</p>
            <CodeBlock
              code={`export interface RelationConfig {
  type: RelationType;
  target: () => any;
  property: string;
  foreignKey?: string;
  inverseKey?: string;
  joinTable?: string;
}`}
              language="typescript"
            />
            <ul className="space-y-3 mb-4">
              <li><Badge variant="outline" className="mr-2">type</Badge> <span className="text-muted-foreground">RelationType (OneToOne, OneToMany, ManyToOne, ManyToMany)</span></li>
              <li><Badge variant="outline" className="mr-2">target</Badge> <span className="text-muted-foreground">Target model function</span></li>
              <li><Badge variant="outline" className="mr-2">property</Badge> <span className="text-muted-foreground">Property name for the relation</span></li>
              <li><Badge variant="outline" className="mr-2">foreignKey</Badge> <span className="text-muted-foreground">Foreign key column name</span></li>
              <li><Badge variant="outline" className="mr-2">inverseKey</Badge> <span className="text-muted-foreground">Inverse key (OneToMany, ManyToMany)</span></li>
              <li><Badge variant="outline" className="mr-2">joinTable</Badge> <span className="text-muted-foreground">Junction table (ManyToMany only)</span></li>
            </ul>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`relations: [
  {
    type: RelationType.OneToMany,
    target: () => Post,
    property: "posts",
    foreignKey: "userId",
  },
  {
    type: RelationType.ManyToMany,
    target: () => Role,
    property: "roles",
    joinTable: "user_roles",
    foreignKey: "userId",
    inverseKey: "roleId",
  },
]`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Timestamps & Scopes</h2>
            <p className="text-muted-foreground mb-4">Auto-managed timestamp columns and custom query scopes:</p>
            <CodeBlock
              code={`export interface TimestampsConfig {
  createdAt?: string;
  updatedAt?: string;
}

scopes: {
  [name: string]: (qb: QueryBuilder<any>, ...args: any[]) => QueryBuilder<any>
}
`}
              language="typescript"
            />
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  scopes: {
    active: qb => qb.where("isActive = ?", true),
    byEmail: (qb, email) => qb.where("email = ?", email)
  }
});`}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}