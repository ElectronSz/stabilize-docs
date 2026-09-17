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
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
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
              <p className="text-sm text-muted-foreground mb-4">
                One API covers five databases. Set <code>type</code> and supply
                the connection string that driver expects:
              </p>
              <CodeBlock
                filename="config/database.ts"
                language="typescript"
                code={`import { DBType, type DBConfig } from "stabilize-orm";

// Pick one. The rest of your application does not change.
const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "./data/app.db",
};

// PostgreSQL
//   type: DBType.Postgres,
//   connectionString: "postgres://user:pass@localhost:5432/mydb",

// MySQL / MariaDB
//   type: DBType.MySQL,
//   connectionString: "mysql://user:pass@localhost:3306/mydb",

// SQL Server -- note the comma between host and port
//   type: DBType.MSSQL,
//   connectionString:
//     "Server=localhost,1433;Database=mydb;User Id=sa;Password=Your_password123;TrustServerCertificate=true",

// MongoDB -- the driver is optional, and writes need a replica set
//   type: DBType.MongoDB,
//   connectionString:
//     "mongodb://localhost:27017/mydb?directConnection=true&replicaSet=rs0",

export default dbConfig;`}
              />
              <ul className="space-y-2 mt-4 text-sm text-muted-foreground">
                <li>
                  <strong>SQLite</strong> needs no server — the driver is built
                  into the runtime (<code>bun:sqlite</code> or{" "}
                  <code>node:sqlite</code>) and the file is created if it does
                  not exist.
                </li>
                <li>
                  <strong>PostgreSQL</strong> takes a <code>postgres://</code>{" "}
                  URL, <strong>MySQL and MariaDB</strong> a{" "}
                  <code>mysql://</code> one.
                </li>
                <li>
                  <strong>SQL Server</strong> takes an ADO-style string, where
                  the host and port are separated by a{" "}
                  <em>comma</em> — not a colon — and{" "}
                  <code>TrustServerCertificate=true</code> is needed for the
                  self-signed certificate a local container serves. Its pool
                  connects on the first query rather than at construction, so a
                  bad string surfaces then.
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Every dialect accepts the optional{" "}
                <code>retryAttempts</code> and <code>retryDelay</code> shown in{" "}
                <a className="underline" href="/docs/retry-and-pooling">
                  Retry and Pooling
                </a>
                . For the SQL Server specifics — <code>MERGE</code> upserts,{" "}
                <code>IDENTITY</code> keys, <code>OUTPUT INSERTED.*</code> —
                see{" "}
                <a className="underline" href="/docs/mssql">
                  SQL Server
                </a>
                .
              </p>
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
              <p className="text-sm text-muted-foreground mt-4">
                The <code>id</code> here is a <code>STRING</code>, so it is{" "}
                <strong>supplied by the caller</strong> rather than generated —
                step 5 fills it with <code>generateUUID()</code>. That choice is
                deliberate: it behaves identically on all five databases. An{" "}
                <code>INTEGER</code> <code>id</code> is instead generated by the
                database and must be omitted from the payload. On SQL Server
                that means an <code>IDENTITY</code> column, which rejects an
                explicit value, and on MongoDB a counter document — see{" "}
                <a className="underline" href="/docs/mssql">
                  SQL Server
                </a>
                . Either works on every backend; just be consistent about who
                assigns the key.
              </p>
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
                  You&apos;re All Set!
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
  );
}
