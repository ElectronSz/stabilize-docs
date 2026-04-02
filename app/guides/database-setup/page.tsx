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
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Database Setup Guide
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to configure PostgreSQL, MySQL, or SQLite with Stabilize ORM
        </p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>PostgreSQL Setup</CardTitle>
              <CardDescription>
                Recommended for production applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                code={`# Create database
psql postgres -c "CREATE DATABASE myapp;"

# Create user
psql postgres -c "CREATE USER myapp_user WITH PASSWORD 'secure_password';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;"`}
                language="sql"
              />
              <CodeBlock
                filename="config/database.ts"
                language="typescript"
                code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: "postgresql://myapp_user:secure_password@localhost:5432/myapp",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>MySQL Setup</CardTitle>
              <CardDescription>
                Popular choice for web applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                code={`mysql -u root -p -e "CREATE DATABASE myapp;
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;"`}
                language="sql"
              />
              <CodeBlock
                filename="config/database.ts"
                language="typescript"
                code={`const dbConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString: "mysql://myapp_user:secure_password@localhost:3306/myapp",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>SQLite Setup</CardTitle>
              <CardDescription>
                Perfect for development, testing, and small apps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                SQLite requires no installation. The database file is created
                automatically:
              </p>
              <CodeBlock
                filename="config/database.ts"
                language="typescript"
                code={`const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "./data/app.db",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
              />
            </CardContent>
          </Card>

          <section>
            <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
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
};`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
