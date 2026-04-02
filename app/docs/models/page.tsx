"use client";

import { CodeBlock } from "@/components/code-block";

export default function ModelsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Models</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Define your data models with type-safe schemas
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Basic Model Definition
            </h2>
            <p className="text-muted-foreground mb-4">
              Models represent your database tables and define their structure
              using <code>defineModel</code>:
            </p>
            <CodeBlock
              filename="models/user.ts"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { 
      type: DataTypes.STRING, 
      required: true,
      unique: true,
    },
    email: { 
      type: DataTypes.STRING, 
      length: 255, 
      required: true,
      unique: true,
    },
    name: { 
      type: DataTypes.STRING, 
      length: 100,
      required: true,
    },
    bio: { 
      type: DataTypes.TEXT,
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true,
    },
  },
});

export { User };`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Available Data Types
            </h2>
            <p className="text-muted-foreground mb-4">
              Stabilize provides these database-agnostic data types. They map to
              database-specific types automatically:
            </p>
            <CodeBlock
              filename="types.ts"
              code={`DataTypes.STRING      // VARCHAR - short text with optional length
DataTypes.TEXT        // TEXT - long text content
DataTypes.INTEGER     // INTEGER - whole numbers
DataTypes.BIGINT      // BIGINT - large whole numbers
DataTypes.FLOAT       // FLOAT - single-precision decimal
DataTypes.DOUBLE      // DOUBLE - double-precision decimal
DataTypes.DECIMAL     // DECIMAL - exact decimal (e.g. currency)
DataTypes.BOOLEAN     // BOOLEAN - true/false values
DataTypes.DATE        // DATE - date only
DataTypes.DATETIME    // DATETIME - date and time
DataTypes.JSON        // JSON - JSON data
DataTypes.UUID        // UUID - universally unique identifier
DataTypes.BLOB        // BLOB - binary data`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Column Options</h2>
            <p className="text-muted-foreground mb-4">
              Each column supports these configuration options:
            </p>
            <CodeBlock
              filename="column-options.ts"
              code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { 
      type: DataTypes.STRING, 
      required: true,    // NOT NULL constraint
      unique: true,      // UNIQUE constraint
    },
    email: {
      type: DataTypes.STRING,
      length: 255,       // VARCHAR(255)
      required: true,
      unique: true,
      pattern: /^[^@]+@[^@]+\\.[^@]+$/,  // Regex validation
      customValidator: (val: string) => 
        val.includes("@") || "Must be a valid email",
    },
    name: {
      type: DataTypes.STRING,
      minLength: 2,      // Minimum string length
      maxLength: 100,    // Maximum string length
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "active",  // Default value on insert
    },
    metadata: {
      type: DataTypes.JSON,
      encrypted: true,   // Field-level encryption
    },
    version: {
      type: DataTypes.INTEGER,
      optimisticLock: true,  // Optimistic concurrency control
    },
  },
});`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Model with Timestamps
            </h2>
            <p className="text-muted-foreground mb-4">
              Enable automatic timestamp management with the{" "}
              <code>timestamps</code> config. These fields are set automatically
              on create and update:
            </p>
            <CodeBlock
              filename="models/post.ts"
              code={`const Post = defineModel({
  tableName: "posts",
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 255, required: true },
    body: { type: DataTypes.TEXT },
  },
});`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Model with Soft Deletes
            </h2>
            <p className="text-muted-foreground mb-4">
              Add a <code>deletedAt</code> column with{" "}
              <code>softDelete: true</code> to enable soft deletes. Queries
              automatically exclude soft-deleted rows:
            </p>
            <CodeBlock
              filename="models/product.ts"
              code={`const Product = defineModel({
  tableName: "products",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 255, required: true },
    price: { type: DataTypes.DECIMAL, required: true },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
});

// Usage:
const repo = orm.getRepository(Product);
await repo.delete(id);      // Sets deletedAt timestamp
await repo.recover(id);     // Clears deletedAt
await repo.recoverAll();    // Restores all soft-deleted`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Model with Versioning
            </h2>
            <p className="text-muted-foreground mb-4">
              Set <code>versioned: true</code> to enable automatic history
              tracking. A <code>{`<table>`}_history</code> table is created to
              store all changes:
            </p>
            <CodeBlock
              filename="models/document.ts"
              code={`const Document = defineModel({
  tableName: "documents",
  versioned: true,
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 255, required: true },
    content: { type: DataTypes.TEXT },
  },
});

// Usage:
const repo = orm.getRepository(Document);
const history = await repo.history(id);       // All versions
const past = await repo.asOf(id, someDate);   // Time-travel query
await repo.rollback(id, version);             // Restore old version`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Model with Scopes</h2>
            <p className="text-muted-foreground mb-4">
              Define reusable query filters as scopes. Scopes can accept
              parameters:
            </p>
            <CodeBlock
              filename="models/task.ts"
              code={`const Task = defineModel({
  tableName: "tasks",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 200, required: true },
    status: { type: DataTypes.STRING, defaultValue: "todo" },
    priority: { type: DataTypes.STRING, defaultValue: "medium" },
    dueDate: { type: DataTypes.DATETIME },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
  scopes: {
    todo: (qb) => qb.where("status = ?", "todo"),
    inProgress: (qb) => qb.where("status = ?", "in_progress"),
    done: (qb) => qb.where("status = ?", "done"),
    highPriority: (qb) => qb.where("priority = ?", "high"),
    overdue: (qb) => qb.where("dueDate < ?", new Date().toISOString()),
    byPriority: (qb, level: string) => qb.where("priority = ?", level),
  },
});

// Usage:
const repo = orm.getRepository(Task);
const todos = await repo.scope("todo").execute(orm.client);
const urgent = await repo.scope("highPriority").scope("overdue").execute(orm.client);`}
              language="typescript"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Model with Relationships
            </h2>
            <p className="text-muted-foreground mb-4">
              Define relationships between models using{" "}
              <code>RelationType</code>:
            </p>
            <CodeBlock
              filename="models/relationships.ts"
              code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 100 },
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Post,
      property: "posts",
      foreignKey: "authorId",
    },
  ],
});

const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 200 },
    authorId: { type: DataTypes.STRING, required: true },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => User,
      property: "author",
      foreignKey: "authorId",
    },
  ],
});

// Relation types: OneToOne, ManyToOne, OneToMany, ManyToMany`}
              language="typescript"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
