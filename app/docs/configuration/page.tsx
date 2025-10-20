"use client"

import { CodeBlock } from "@/components/code-block"

export default function ConfigurationPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Configuration</h1>
        <p className="text-lg text-muted-foreground mb-8">Configure Stabilize ORM for your database</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Database Configuration</h2>
            <p className="text-muted-foreground mb-4">Create a configuration file to connect to your database:</p>
          
              <CodeBlock
                filename="config/database.ts"
                code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.Postgres, // or DBType.MySQL, DBType.SQLite
  connectionString: process.env.DATABASE_URL,
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">PostgreSQL Configuration</h2>
            <CodeBlock
                filename="config/database.ts"
                code={`const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: "postgresql://user:password@localhost:5432/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">MySQL Configuration</h2>
             <CodeBlock
                filename="config/database.ts"
                code={`const dbConfig: DBConfig = {
  type: DBType.MySQL,
  connectionString: "mysql://user:password@localhost:3306/mydb",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">SQLite Configuration</h2>
              <CodeBlock
                filename="config/database.ts"
                code={`const dbConfig: DBConfig = {
  type: DBType.SQLite,
  connectionString: "myadb.db",
  retryAttempts: 3,
  retryDelay: 1000,
};`}
                language="typescript"
              />
          </section>

         

          <section>
            <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
            <p className="text-muted-foreground mb-4">
              It's recommended to use environment variables for sensitive data:
            </p>
             <CodeBlock
                filename=".env"
                code={`DATABASE_URL=postgresql://user:password@localhost:5432/mydb`}
                language="dotenv"
              />
          </section>
        </div>
      </div>
    </div>
  )
}