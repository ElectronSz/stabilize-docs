"use client";

import { CodeBlock } from "@/components/code-block";

export default function HooksExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Hooks & Lifecycle Events</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Use hooks and events to run custom logic at key points in the data
          lifecycle
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Available Hooks</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize supports these lifecycle hooks:
            </p>
            <CodeBlock
              filename="hooks/types.ts"
              language="typescript"
              code={`// Available hook types:
// - beforeCreate  - Before a record is created
// - afterCreate   - After a record is created
// - beforeUpdate  - Before a record is updated
// - afterUpdate   - After a record is updated
// - beforeDelete  - Before a record is deleted
// - afterDelete   - After a record is deleted
// - beforeSave    - Before create OR update
// - afterSave     - After create OR update`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Event Listeners</h2>
            <p className="text-muted-foreground mb-4">
              Listen to ORM events for logging and monitoring:
            </p>
            <CodeBlock
              filename="examples/events.ts"
              language="typescript"
              code={`const orm = new Stabilize(dbConfig);

// Connection events
orm.events.on("connection:open", (type) => {
  console.log(\`Connected to \${type}\`);
});

orm.events.on("connection:close", () => {
  console.log("Database connection closed");
});

// Query events
orm.events.on("query", (query) => {
  console.log("Executed:", query);
});

// Error events
orm.events.on("error", (error) => {
  console.error("Database error:", error);
});

// Transaction events
orm.events.on("transaction:start", () => {
  console.log("Transaction started");
});

orm.events.on("transaction:complete", () => {
  console.log("Transaction committed");
});

orm.events.on("transaction:error", (error) => {
  console.error("Transaction rolled back:", error);
});

// Migration events
orm.events.on("migration:start", () => {
  console.log("Migration started");
});

orm.events.on("migration:complete", () => {
  console.log("Migration complete");
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Practical Hook Patterns
            </h2>
            <CodeBlock
              filename="examples/hook-patterns.ts"
              language="typescript"
              code={`// Logging pattern - log all create operations
const userRepo = orm.getRepository(User);
const originalCreate = userRepo.create.bind(userRepo);

userRepo.create = async (entity, options) => {
  console.log("Creating user:", entity.email);
  const result = await originalCreate(entity, options);
  console.log("Created user with ID:", result.id);
  return result;
};

// Validation pattern - extra validation before save
const orderRepo = orm.getRepository(Order);
const originalUpdate = orderRepo.update.bind(orderRepo);

orderRepo.update = async (id, entity) => {
  if (entity.status === "shipped" && !entity.trackingNumber) {
    throw new Error("Tracking number required for shipped orders");
  }
  return originalUpdate(id, entity);
};

// Audit pattern - track who made changes
const postRepo = orm.getRepository(Post);
orm.events.on("query", (entry) => {
  if (entry.query.includes("UPDATE") || entry.query.includes("INSERT")) {
    console.log("Audit:", {
      query: entry.query,
      timestamp: new Date().toISOString(),
      duration: entry.durationMs,
    });
  }
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Middleware Pattern</h2>
            <CodeBlock
              filename="examples/middleware.ts"
              language="typescript"
              code={`// Create a middleware wrapper for repositories
function withLogging<T>(repo: any, tableName: string) {
  const wrap = (method: string) => {
    const original = repo[method].bind(repo);
    repo[method] = async (...args: any[]) => {
      const start = performance.now();
      const result = await original(...args);
      const ms = (performance.now() - start).toFixed(1);
      console.log(\`[\${tableName}] \${method} completed in \${ms}ms\`);
      return result;
    };
  };

  ["create", "update", "delete", "findOne"].forEach(wrap);
  return repo;
}

// Usage
const userRepo = withLogging(orm.getRepository(User), "users");
const postRepo = withLogging(orm.getRepository(Post), "posts");

// Now all operations are automatically logged
await userRepo.create({ id: "1", name: "Test" });
// [users] create completed in 2.3ms`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
