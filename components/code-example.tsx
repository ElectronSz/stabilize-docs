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
    <section className="relative py-20 sm:py-24 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-3">
            Code
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Clean, intuitive, powerful
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Write database operations with expressive, type-safe code.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          {examples.map((example, index) => (
            <Button
              key={example.title}
              variant={activeTab === index ? "default" : "ghost"}
              onClick={() => setActiveTab(index)}
              className={
                activeTab === index
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg"
              }
              size="sm"
            >
              {example.title}
            </Button>
          ))}
        </div>

        <CodeBlock
          code={examples[activeTab].code}
          language={examples[activeTab].lang}
          filename={
            examples[activeTab].title.toLowerCase() +
            (examples[activeTab].lang === "bash" ? "" : ".ts")
          }
        />
      </div>
    </section>
  );
}
