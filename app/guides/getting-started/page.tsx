"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { CodeBlock } from "@/components/code-block"

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
            <h2 className="text-2xl font-semibold mb-4">Step 1: Install Stabilize</h2>
            <p className="text-muted-foreground mb-4">Install both the ORM and CLI tools:</p>
            <CodeBlock code="bun add stabilize-orm" language="bash" />
            <CodeBlock code="bun add -d stabilize-cli" language="bash" />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 2: Set Up Your Database</h2>
            <p className="text-muted-foreground mb-4">Create a database configuration file:</p>
            <CodeBlock
              filename="config/database.ts"
              language="typescript"
              code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL,
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 3: Initialize the ORM</h2>
            <p className="text-muted-foreground mb-4">Create an ORM instance and connect to your database:</p>
            <CodeBlock
              filename="db/index.ts"
              language="typescript"
              code={`import { Stabilize, type CacheConfig, type LoggerConfig, LogLevel } from "stabilize-orm";
import dbConfig from "./config/database";

const cacheConfig: CacheConfig = {
  enabled: process.env.CACHE_ENABLED === "true",
  redisUrl: process.env.REDIS_URL,
  ttl: 60,
};

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3,
};

export const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 4: Define Your First Model</h2>
            <p className="text-muted-foreground mb-4">Create a User model:</p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  columns: {
    id: {
      type: DataTypes.Integer,
    },
    email: {
      type: DataTypes.String,
      length: 100,
      required: true,
      unique: true,
    },
    name: {
      type: DataTypes.String,
      length: 255,
      required: true,
    },
    isActive: {
      type: DataTypes.Boolean,
    },
  },
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 5: Create the Table</h2>
            <p className="text-muted-foreground mb-4">Use the CLI to generate and run a migration:</p>
            <CodeBlock code="bunx stabilize-cli generate migration User" language="bash" />
            <CodeBlock code="bunx stabilize-cli migrate" language="bash" />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Step 6: Perform Your First Query</h2>
            <p className="text-muted-foreground mb-4">Create, read, update, and delete users:</p>
            <CodeBlock
              filename="example/user-crud.ts"
              language="typescript"
              code={`import { orm } from "./db";
import { User } from "./models/User";

const userRepository = orm.getRepository(User);

// Create a user
const newUser = await userRepository.create({
  email: "ciniso@stabilize.xyz",
  name: "Ciniso Dlamini",
});

console.log("Created user:", newUser);

// Find all users
const allUsers = await userRepository.find().execute();
console.log("All users:", allUsers);

// Find one user
const user = await userRepository
  .find()
  .where("email = ?", "ciniso@stabilize.xyz")
  .first();

console.log("Found user:", user);

// Update a user
await userRepository.update(user.id, {
  name: "Ciniso Dlamini",
});

// Delete a user
await userRepository.delete(user.id);`}
            />
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Learn about relationships between models</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Explore advanced query builder features</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Set up versioning for time-travel queries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Add lifecycle hooks to your models</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}