import { CodeBlock } from "@/components/code-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "lucide-react";

export default function DatabaseSetupPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Database Setup Guide
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to configure PostgreSQL, MySQL, SQLite, SQL Server, or MongoDB with Stabilize ORM
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>PostgreSQL Setup</CardTitle>
              <CardDescription>
                Recommended for production applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Install PostgreSQL</h3>
                <CodeBlock
                  code={`# macOS
brew install postgresql@18

# Ubuntu/Debian
sudo apt-get install postgresql-18

# Or use a managed service such as Neon, Supabase or AWS RDS`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Create Database</h3>
                <CodeBlock
                  code={`# Create database
psql postgres -c "CREATE DATABASE myapp;"

# Create user
psql postgres -c "CREATE USER myapp_user WITH PASSWORD 'secure_password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;"`}
                  language="sql"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  language="typescript"
                  code={`import { Stabilize, DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: "postgresql://myapp_user:secure_password@localhost:5432/myapp",
  retryAttempts: 3,
  retryDelay: 1000,
  maxJitter: 100,
};

// Second argument is the cache config; the third would be the logger.
export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 });`}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  The connection string is parsed by the driver, which means
                  driver options belong in it — append{" "}
                  <code>?connection_limit=20</code> to size the pool, since{" "}
                  <code>DBConfig</code> has no pool-size field of its own.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>MySQL Setup</CardTitle>
              <CardDescription>
                Popular choice for web applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Install MySQL</h3>
                <CodeBlock
                  code={`# macOS
brew install mysql

# Ubuntu/Debian
sudo apt-get install mysql-server

# Or use a managed service such as PlanetScale or AWS RDS`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Create Database</h3>
                <CodeBlock
                  code={`mysql -u root -p -e "CREATE DATABASE myapp;
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;"`}
                  language="sql"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  language="typescript"
                  code={`import { Stabilize, DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString: "mysql://myapp_user:secure_password@localhost:3306/myapp",
  retryAttempts: 3,
  retryDelay: 1000,
  maxJitter: 100,
};

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 });`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>SQLite Setup</CardTitle>
              <CardDescription>
                Perfect for development, testing, and small apps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">
                  1. No Installation Required
                </h3>
                <p className="text-sm text-muted-foreground">
                  SQLite is embedded. Stabilize uses the SQLite driver that
                  ships with your runtime — <code>bun:sqlite</code> on Bun,{" "}
                  <code>node:sqlite</code> on Node.js — so there is no server to
                  install, start or connect to.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  language="typescript"
                  code={`import { Stabilize, DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "./data/app.db",
  retryAttempts: 3,
  retryDelay: 1000,
  maxJitter: 100,
};

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 });`}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Unlike the other two, <code>connectionString</code> here is a
                  file path, not a URL. Use <code>:memory:</code> for an
                  ephemeral database in tests.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. File Location</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The client opens the file with <code>create: true</code>, so
                  the database is created on first connect — you do not need to
                  make the file yourself. The directory it lives in does have to
                  exist. For production, consider:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Using an absolute path</li>
                  <li>Ensuring proper file permissions</li>
                  <li>Regular backups</li>
                  <li>Write-ahead logging (WAL) mode for better concurrency</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>SQL Server Setup</CardTitle>
              <CardDescription>
                For existing Microsoft SQL Server or Azure SQL infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Install SQL Server</h3>
                <CodeBlock
                  code={`# Docker (Linux, macOS, Windows)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Your_password123" \\
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest

# Or use a managed service such as Azure SQL Database`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Create Database</h3>
                <CodeBlock
                  code={`sqlcmd -S localhost -U sa -P 'Your_password123' -Q "CREATE DATABASE myapp;"`}
                  language="sql"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  language="typescript"
                  code={`import { Stabilize, DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MSSQL,
  connectionString:
    "Server=localhost,1433;Database=myapp;User Id=sa;Password=Your_password123;TrustServerCertificate=true",
  retryAttempts: 3,
  retryDelay: 1000,
  maxJitter: 100,
};

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 });`}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  This is an ADO-style connection string, not a URL —{" "}
                  <code>mssql://</code> is not accepted.{" "}
                  <code>TrustServerCertificate=true</code> is needed against a
                  container or any server using a self-signed certificate, or the
                  driver rejects the TLS handshake. The pool opens on the first
                  query rather than at construction, since{" "}
                  <code>mssql</code>&apos;s connect step is asynchronous. See{" "}
                  <a href="/docs/mssql" className="text-accent underline">
                    SQL Server
                  </a>{" "}
                  for the dialect differences.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>MongoDB Setup</CardTitle>
              <CardDescription>
                For document-oriented workloads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Install MongoDB</h3>
                <CodeBlock
                  code={`# Docker (Linux, macOS, Windows)
# --replSet is what makes this a single-node replica set; transactions need one
docker run -d --name stabilize-mongo -p 27017:27017 \\
  mongo:7 --replSet rs0 --bind_ip_all

# Initiate the set once, after the container is up
mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"127.0.0.1:27017"}]})'

# Or use a managed service such as MongoDB Atlas`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Install the Driver</h3>
                <CodeBlock code="bun add mongodb" language="bash" />
                <p className="text-sm text-muted-foreground mt-3">
                  The driver is an optional dependency and is not installed with
                  the ORM. A missing driver throws{" "}
                  <code>MONGO_DRIVER_MISSING</code> on the first statement, not
                  when the config is imported.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  language="typescript"
                  code={`import { Stabilize, DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MongoDB,
  connectionString:
    "mongodb://127.0.0.1:27017/myapp?directConnection=true&replicaSet=rs0",
  retryAttempts: 3,
  retryDelay: 1000,
  maxJitter: 100,
};

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 });`}
                />
                <p className="text-sm text-muted-foreground mt-3">
                  Two options in the connection string matter here.{" "}
                  <code>directConnection=true</code> skips topology discovery,
                  which a single-node set needs when the member registers itself
                  under a container-local address, and{" "}
                  <code>replicaSet=rs0</code> names the set to join.
                  Transactions require a replica set or sharded cluster, and
                  every ORM write is wrapped in one, so a standalone{" "}
                  <code>mongod</code> answers every read and then fails every
                  write. The separate <code>database</code> field is consulted
                  only when the connection string has no database path of its
                  own.
                </p>
              </div>
            </CardContent>
          </Card>

          <section>
            <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
            <p className="text-muted-foreground mb-4">
              Store database credentials securely using environment variables:
            </p>
            <CodeBlock
              filename=".env"
              code={`DATABASE_URL=postgresql://user:password@localhost:5432/myapp`}
            />
            <CodeBlock
              filename="config/database.ts"
              language="typescript"
              code={`const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!,
  retryAttempts: 3,
  retryDelay: 1000,
  maxJitter: 100,
};`}
            />
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                The connection string is the whole story
              </p>
              <p className="text-sm text-muted-foreground">
                Every SQL pool is built from <code>connectionString</code>{" "}
                alone. There is no <code>max</code>, <code>min</code>,{" "}
                <code>idleTimeout</code> or <code>connectionLimit</code> field
                on <code>DBConfig</code> — retries are governed by{" "}
                <code>retryAttempts</code>, <code>retryDelay</code> and{" "}
                <code>maxJitter</code>, and everything else is whatever the
                driver reads out of the connection string. MongoDB also reads{" "}
                <code>database</code> and <code>mongoOptions</code>.
              </p>
            </div>
          </section>
        </div>
    </div>
  );
}
