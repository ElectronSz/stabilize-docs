"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function GettingStartedGuidePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Getting Started Guide</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A complete walkthrough from installation to your first query
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Step 1: Install Stabilize
            </h2>
            <CodeBlock code="bun add stabilize-orm" language="bash" />
            <CodeBlock code="bun add -d stabilize-cli" language="bash" />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Step 2: Set Up Your Database
            </h2>
            <CodeBlock
              filename="config/database.ts"
              language="typescript"
              code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "./data/app.db",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Step 3: Initialize the ORM
            </h2>
            <CodeBlock
              filename="db/index.ts"
              language="typescript"
              code={`import { Stabilize, type CacheConfig, type LoggerConfig, LogLevel } from "stabilize-orm";
import dbConfig from "../config/database";

const cacheConfig: CacheConfig = {
  enabled: false,
  ttl: 60,
};

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024,
  maxFiles: 3,
};

export const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Step 4: Define Your First Model
            </h2>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 100, required: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
});`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Step 5: Create the Table
            </h2>
            <CodeBlock
              code="bunx stabilize-cli generate migration User"
              language="bash"
            />
            <CodeBlock code="bunx stabilize-cli migrate" language="bash" />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Step 6: Perform Your First Query
            </h2>
            <CodeBlock
              filename="example/user-crud.ts"
              language="typescript"
              code={`import { orm } from "../db";
import { User } from "../models/User";
import { generateUUID } from "stabilize-orm";

const userRepo = orm.getRepository(User);

// Create a user
const newUser = await userRepo.create({
  id: generateUUID(),
  email: "alice@example.com",
  name: "Alice Johnson",
});
console.log("Created:", newUser);

// Find all users
const allUsers = await userRepo.find().execute(orm.client);

// Find by conditions
const user = await userRepo.findOneBy({ email: "alice@example.com" });

// Update
await userRepo.update(user.id, { name: "Alice Smith" });

// Delete
await userRepo.delete(user.id);`}
            />
          </Card>

          <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-green-500">
                Next Steps
              </h2>
            </div>
            <ul className="space-y-2 mt-4 text-muted-foreground">
              <li>Learn about relationships between models</li>
              <li>Explore advanced query builder features</li>
              <li>Set up versioning for time-travel queries</li>
              <li>
                Add lifecycle hooks with <code>registerHooks()</code>
              </li>
              <li>Enable caching for better performance</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
