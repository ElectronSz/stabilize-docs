"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";

const examples = [
  {
    title: "Models",
    code: `import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true },
    name: { type: DataTypes.STRING, length: 100 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
  },
});`,
    lang: "typescript",
  },
  {
    title: "Queries",
    code: `import { orm } from "./db";
import { User } from "./models/User";
import { generateUUID } from "stabilize-orm";

const userRepo = orm.getRepository(User);

// Create
const user = await userRepo.create({
  id: generateUUID(),
  email: "alice@example.com",
  name: "Alice Johnson",
});

// Find
const found = await userRepo.findOne(user.id);
const all = await userRepo.find().execute(orm.client);

// Advanced query builder
const admins = await userRepo
  .scope("active")
  .where("role = ?", "admin")
  .orderBy("createdAt", "DESC")
  .limit(10)
  .execute(orm.client);`,
    lang: "typescript",
  },
  {
    title: "Versioning",
    code: `const User = defineModel({
  tableName: "users",
  versioned: true,
  columns: {
    id: { type: DataTypes.STRING, required: true },
    name: { type: DataTypes.STRING, length: 100 },
  },
});

const repo = orm.getRepository(User);

// View history
const history = await repo.history(user.id);

// Time-travel query
const past = await repo.asOf(user.id, someDate);

// Rollback to version 2
await repo.rollback(user.id, 2);`,
    lang: "typescript",
  },
  {
    title: "Transactions",
    code: `await orm.transaction(async (txClient) => {
  const userRepo = orm.getRepository(User);
  const orderRepo = orm.getRepository(Order);

  const user = await userRepo.create({
    id: generateUUID(),
    email: "alice@example.com",
    name: "Alice Johnson",
  });

  const order = await orderRepo.create({
    id: generateUUID(),
    userId: user.id,
    totalAmount: 99.99,
  });

  // All operations are atomic
  // If any fail, everything rolls back
});`,
    lang: "typescript",
  },
  {
    title: "Migrations",
    code: `import { orm } from "./db";
import { User, Post } from "./models";

// Create or update tables until they match the models.
// Safe to run on every boot — existing tables are left alone.
await orm.autoMigrate([User, Post]);

// Or drive schema changes explicitly, with a way back:
import type { Migration } from "stabilize-orm";

const addSlug: Migration = {
  name: "2026_09_14_add_slug_to_posts",
  up: [
    "ALTER TABLE posts ADD COLUMN slug VARCHAR(255)",
    "CREATE UNIQUE INDEX posts_slug_idx ON posts (slug)",
  ],
  down: ["DROP INDEX posts_slug_idx", "ALTER TABLE posts DROP COLUMN slug"],
};

await orm.migrate(dbConfig, [addSlug]);`,
    lang: "typescript",
  },
  {
    title: "Relations",
    code: `const Book = defineModel({
  tableName: "books",
  columns: {
    id: { type: DataTypes.INTEGER, required: true },
    title: { type: DataTypes.STRING, required: true },
    authorId: { type: DataTypes.INTEGER, name: "author_id" },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => Author,
      property: "author",
      foreignKey: "authorId",
    },
    {
      type: RelationType.ManyToMany,
      target: () => Tag,
      property: "tags",
      joinTable: "book_tags",
      foreignKey: "book_id",
      inverseKey: "tag_id",
    },
  ],
});

// Ask for the relations you need — they load in one go
const book = await bookRepo.findOne(id, {
  relations: ["author", "tags"],
});

book.author.name;
book.tags.map((t) => t.label);`,
    lang: "typescript",
  },
  {
    title: "Pagination",
    code: `// Offset pagination, with the total for building page controls
const page = await userRepo.paginate(2, 20);

page.data;      // the 20 rows on page 2
page.total;     // rows matching the query overall
page.page;      // 2
page.pageSize;  // 20

// Cursor pagination for large or fast-changing result sets —
// no drifting rows when something is inserted mid-scroll
const next = await userRepo.findMany({
  where: { isActive: true },
  cursor: { field: "id", value: lastSeenId, direction: "forward" },
  take: 20,
  orderBy: { field: "id", direction: "ASC" },
});`,
    lang: "typescript",
  },
  {
    title: "Soft Deletes",
    code: `const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true },
    email: { type: DataTypes.STRING, length: 255 },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
});

const userRepo = orm.getRepository(User);

// Marks the row deleted rather than removing it
await userRepo.delete(user.id);

// It is now invisible to reads and aggregates
await userRepo.find().execute(orm.client); // omits it
await userRepo.count();                    // omits it

// And can be brought back
await userRepo.recover(user.id);

// ...or all at once
await userRepo.recoverAll();`,
    lang: "typescript",
  },
  {
    title: "CLI",
    code: `# Generate a model with columns
bunx stabilize-cli generate:model Product name:string price:decimal stock:int

# Generate a migration
bunx stabilize-cli generate:migration Product

# Run all pending migrations
bunx stabilize-cli migrate

# Backup the database
bunx stabilize-cli db:backup

# Generate a REST API scaffold
bunx stabilize-cli generate:api Product --prefix /api

# Fresh migration (drop + re-migrate)
bunx stabilize-cli migrate:fresh --force`,
    lang: "bash",
  },
];

export function CodeExample() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative section">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/40 to-background pointer-events-none" />
      <div className="relative container">
        <div className="text-center mb-12">
          <p className="text-small font-semibold text-accent uppercase tracking-widest mb-3">
            Code
          </p>
          <h2 className="text-h2 mb-4">Clean, intuitive, powerful</h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
            Write database operations with expressive, type-safe code.
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2 mb-5 justify-center"
          role="tablist"
          aria-label="Code examples"
        >
          {examples.map((example, index) => (
            <Button
              key={example.title}
              variant={activeTab === index ? "default" : "ghost"}
              role="tab"
              aria-selected={activeTab === index}
              onClick={() => setActiveTab(index)}
              className={
                activeTab === index
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                  : "text-muted-foreground hover:text-accent-subtle-foreground hover:bg-accent-subtle rounded-lg"
              }
              size="sm"
            >
              {example.title}
            </Button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <CodeBlock
            code={examples[activeTab].code}
            language={examples[activeTab].lang}
            filename={
              examples[activeTab].title.toLowerCase() +
              (examples[activeTab].lang === "bash" ? "" : ".ts")
            }
          />
        </div>
      </div>
    </section>
  );
}
