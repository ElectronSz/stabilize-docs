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
              code={`function defineModel(config: ModelConfig): typeof Model

// The returned value is a class generated for this config. Its constructor
// takes a plain object and assigns it onto the instance:
class Model {
  constructor(data: any);
}
`}
            />
            <p className="text-muted-foreground mb-4">
              Registers the model and returns its generated class. Pass that
              class to <code>orm.getRepository()</code>, to{" "}
              <code>autoMigrate()</code>, and to{" "}
              <code>MetadataStorage</code>.
            </p>
            <h3 className="font-semibold mb-2">ModelConfig:</h3>
            <CodeBlock
              language="typescript"
              code={`interface ModelConfig {
  tableName: string;                  // required
  columns: Record<string, ColumnConfig>; // required
  versioned?: boolean;                // version history table
  softDelete?: boolean;               // enable soft deletes
  relations?: RelationConfig[];
  scopes?: Record<
    string,
    (qb: QueryBuilder<any>, ...args: any[]) => QueryBuilder<any>
  >;
  timestamps?: TimestampsConfig;
  hooks?: Partial<Record<HookType, HookCallback | HookCallback[]>>;
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
              <li>
                <Badge variant="outline" className="mr-2">
                  softDelete
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Enable soft deletes. A column must also be marked{" "}
                  <code>softDelete: true</code> to name the field.
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  hooks
                </Badge>{" "}
                <span className="text-muted-foreground">
                  Lifecycle callbacks, usually attached with{" "}
                  <code>registerHooks()</code> rather than set here
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
  precision?: number;        // Precision for DECIMAL
  scale?: number;            // Scale for DECIMAL
  required?: boolean;        // NOT NULL constraint
  unique?: boolean;          // UNIQUE constraint
  defaultValue?: any;        // Default value on insert
  defaultExpression?: DefaultExpression;  // SQL default expression
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
            <p className="text-muted-foreground mt-4">
              There is <strong>no</strong> <code>primaryKey</code> or{" "}
              <code>autoIncrement</code> option. The column keyed{" "}
              <code>id</code> is the primary key; whether it auto-increments is
              decided by its <code>type</code>. See the Data Types page.
            </p>
            <p className="text-muted-foreground mt-2">
              Not every option reaches DDL. <code>name</code>,{" "}
              <code>type</code>, <code>required</code>, <code>unique</code>,{" "}
              <code>defaultValue</code>, <code>defaultExpression</code>,{" "}
              <code>index</code>, <code>length</code>, <code>precision</code>{" "}
              and <code>scale</code> are used when generating{" "}
              <code>CREATE TABLE</code>. The last three also bound the value on
              write, so they are enforced even on dialects whose DDL cannot
              express them — Postgres and SQLite, which get <code>TEXT</code>{" "}
              and <code>NUMERIC</code> respectively.
            </p>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">RelationConfig</h2>
            <CodeBlock
              language="typescript"
              code={`enum RelationType {
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
}

interface RelationConfig {
  type: RelationType;   // required
  target: () => any;    // required — a thunk returning the target model
  property: string;     // required — property name for the relation
  foreignKey?: string;
  inverseKey?: string;
  joinTable?: string;   // ManyToMany only
}`}
            />
            <ul className="space-y-2 mt-4">
              <li>
                <Badge variant="outline" className="mr-2">
                  foreignKey
                </Badge>{" "}
                <span className="text-muted-foreground">
                  The join column on the child/join table
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  inverseKey
                </Badge>{" "}
                <span className="text-muted-foreground">
                  The other side of the join — required for{" "}
                  <code>ManyToMany</code>, and used by{" "}
                  <code>attach()</code>/<code>detach()</code>/<code>sync()</code>
                </span>
              </li>
              <li>
                <Badge variant="outline" className="mr-2">
                  joinTable
                </Badge>{" "}
                <span className="text-muted-foreground">
                  The junction table for <code>ManyToMany</code>
                </span>
              </li>
            </ul>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`relations: [
  {
    type: RelationType.OneToMany,
    target: () => Post,
    property: "posts",
    foreignKey: "authorId",
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
            <p className="text-sm text-muted-foreground mt-4">
              <code>target</code> is a function rather than the class itself so
              two models can reference each other before both are defined.
            </p>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              TimestampsConfig &amp; Scopes
            </h2>
            <CodeBlock
              language="typescript"
              code={`interface TimestampsConfig {
  createdAt?: string;
  updatedAt?: string;
}`}
            />
            <p className="text-muted-foreground mb-4 mt-4">
              The values are <em>column names</em>, not property names — they
              must match the SQL columns the ORM should keep updated. A column
              listed here is also created if the model does not declare it. The
              ORM sets <code>createdAt</code> on insert and{" "}
              <code>updatedAt</code> on every update.
            </p>
            <CodeBlock
              language="typescript"
              code={`// A scope receives the builder plus any arguments the caller passes
scopes?: Record<
  string,
  (qb: QueryBuilder<any>, ...args: any[]) => QueryBuilder<any>
>;

const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: { /* ... */ },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    byRole: (qb, role: string) => qb.where("role = ?", role),
  },
});

// Applied through the repository
const admins = await userRepo.scope("byRole", "admin").execute(orm.client);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Full Example</h2>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes, RelationType, generateUUID } from "stabilize-orm";
// registerHooks is exported from the \`/hooks\` subpath, not the package root
import { registerHooks } from "stabilize-orm/hooks";

const User = defineModel({
  tableName: "users",
  versioned: true,
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.UUID, defaultValue: generateUUID() },
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
