import { CodeBlock } from "@/components/code-block"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function DatabaseSetupPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">Database Setup Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to configure PostgreSQL, MySQL, or SQLite with Stabilize ORM
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🐘</span>
                PostgreSQL Setup
              </CardTitle>
              <CardDescription>Recommended for production applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Install PostgreSQL</h3>
                <CodeBlock
                  code={`# macOS
brew install postgresql@18

# Ubuntu/Debian
sudo apt-get install postgresql-18

# Or use a managed service like Neon, Supabase, or AWS RDS`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Create Database</h3>
                <CodeBlock
                  code={`# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE myapp;

# Create user
CREATE USER myapp_user WITH PASSWORD 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;`}
                  language="sql"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: "postgresql://myapp_user:secure_password@localhost:5432/myapp",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🐬</span>
                MySQL Setup
              </CardTitle>
              <CardDescription>Popular choice for web applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Install MySQL</h3>
                <CodeBlock
                  code={`# macOS
brew install mysql

# Ubuntu/Debian
sudo apt-get install mysql-server

# Or use managed services like PlanetScale or AWS RDS`}
                  language="bash"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Create Database</h3>
                <CodeBlock
                  code={`# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE myapp;

# Create user
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;`}
                  language="sql"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString: "mysql://myapp_user:secure_password@localhost:3306/myapp",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🪶</span>
                SQLite Setup
              </CardTitle>
              <CardDescription>Perfect for development and small applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. No Installation Required</h3>
                <p className="text-sm text-muted-foreground">
                  SQLite is embedded and requires no separate server installation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Configure Stabilize</h3>
                <CodeBlock
                  filename="config/database.ts"
                  code={`import { DBType, type DBConfig } from "stabilize-orm";

export const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "myaapp.db",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. File Location</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The database file will be created at the specified path. For production, consider:
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
              code={`import { DBType, type DBConfig } from "stabilize-orm";

export const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!,
  retryAttempts: 3,
  retryDelay: 1000,
};`}
            />
          </section>

        </div>
      </div>
    </div>
  )
}
