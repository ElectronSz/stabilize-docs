import { CodeBlock } from "@/components/code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function QuickStartPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Quick Start</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Get up and running with Stabilize ORM in under 5 minutes
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  1
                </div>
                <CardTitle>Install Stabilize ORM</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code="bun add stabilize-orm" language="bash" />
              <CodeBlock code="bun add -d stabilize-cli" language="bash" />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  2
                </div>
                <CardTitle>Configure Database Connection</CardTitle>
              </div>
              <CardDescription>
                Create a configuration file for your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                filename="config/database.ts"
                language="typescript"
                code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.SQLite, // or DBType.Postgres, DBType.MySQL
  connectionString: "./data/app.db",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  3
                </div>
                <CardTitle>Define Your First Model</CardTitle>
              </div>
              <CardDescription>
                Create a model to represent your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                filename="models/User.ts"
                language="typescript"
                code={`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 100, required: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
  },
});

export { User };`}
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  4
                </div>
                <CardTitle>Initialize Stabilize</CardTitle>
              </div>
              <CardDescription>
                Create an ORM instance and connect to your database
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  5
                </div>
                <CardTitle>Start Querying</CardTitle>
              </div>
              <CardDescription>
                Use the repository to interact with your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                language="typescript"
                code={`import { orm } from "../db";
import { User } from "../models/User";
import { generateUUID } from "stabilize-orm";

const userRepo = orm.getRepository(User);

// Create a new user
const newUser = await userRepo.create({
  id: generateUUID(),
  email: "alice@example.com",
  name: "Alice Johnson",
});
console.log("Created:", newUser);

// Find by ID
const found = await userRepo.findOne(newUser.id);

// Update
const updated = await userRepo.update(newUser.id, { name: "Alice Smith" });

// Delete (soft delete if deletedAt column exists)
await userRepo.delete(newUser.id);

// Find all
const allUsers = await userRepo.find().execute(orm.client);`}
              />
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle className="text-green-500">
                  You're All Set!
                </CardTitle>
              </div>
              <CardDescription>
                You now have a working Stabilize ORM setup. Explore the
                documentation to learn about advanced features like
                relationships, versioning, caching, and the CLI.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
