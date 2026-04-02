"use client";

import { CodeBlock } from "@/components/code-block";

export default function HooksPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Lifecycle Hooks</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Execute custom logic before and after database operations
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Available Hooks</h2>
              <p className="text-muted-foreground mb-4">
                Stabilize provides the following lifecycle hooks:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                <li>
                  <code>beforeCreate</code> - Before inserting a new record
                </li>
                <li>
                  <code>afterCreate</code> - After inserting a new record
                </li>
                <li>
                  <code>beforeUpdate</code> - Before updating a record
                </li>
                <li>
                  <code>afterUpdate</code> - After updating a record
                </li>
                <li>
                  <code>beforeSave</code> - Before create or update
                </li>
                <li>
                  <code>afterSave</code> - After create or update
                </li>
                <li>
                  <code>beforeDelete</code> - Before deleting a record
                </li>
                <li>
                  <code>afterDelete</code> - After deleting a record
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Register Hooks</h2>
              <p className="text-muted-foreground mb-4">
                Hooks are registered using <code>registerHooks()</code> after
                defining your model. You can pass a single callback or an array
                of callbacks for each hook type:
              </p>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`import { defineModel, DataTypes } from "stabilize-orm";
import { registerHooks } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true },
    password: { type: DataTypes.STRING, length: 255, required: true },
  },
});

// Register hooks after model definition
registerHooks(User, {
  beforeCreate: async (entity) => {
    console.log("Creating user:", entity.email);
    entity.password = await hashPassword(entity.password);
  },
  afterCreate: async (entity) => {
    console.log("User created with ID:", entity.id);
  },
  beforeUpdate: async (entity) => {
    console.log("Updating user:", entity.id);
  },
  beforeDelete: async (entity) => {
    console.log("Deleting user:", entity.id);
  },
});

export { User };`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Multiple Callbacks
              </h2>
              <p className="text-muted-foreground mb-4">
                You can register multiple callbacks for the same hook type. They
                execute in order:
              </p>
              <CodeBlock
                filename="hooks/multiple.ts"
                language="typescript"
                code={`import { registerHooks } from "stabilize-orm";

registerHooks(User, {
  beforeCreate: [
    async (entity) => {
      // First: validate
      if (!entity.email.includes("@")) {
        throw new Error("Invalid email");
      }
    },
    async (entity) => {
      // Second: hash password
      entity.password = await hashPassword(entity.password);
    },
    async (entity) => {
      // Third: set defaults
      entity.isActive = true;
    },
  ],
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Event System</h2>
              <p className="text-muted-foreground mb-4">
                Stabilize also provides an event emitter for ORM-level events.
                Use <code>orm.events.on()</code> to listen:
              </p>
              <CodeBlock
                filename="events.ts"
                language="typescript"
                code={`const orm = new Stabilize(dbConfig);

// Connection lifecycle
orm.events.on("connection:open", (dbType) => {
  console.log("Connected to:", dbType);
});

orm.events.on("connection:close", () => {
  console.log("Connection closed");
});

// Transaction lifecycle
orm.events.on("transaction:start", () => {
  console.log("Transaction started");
});

orm.events.on("transaction:complete", () => {
  console.log("Transaction committed");
});

orm.events.on("transaction:error", (error) => {
  console.error("Transaction failed:", error);
});

// Migration lifecycle
orm.events.on("migration:start", () => {
  console.log("Migration started");
});

orm.events.on("migration:complete", () => {
  console.log("Migration complete");
});

// Query and error events
orm.events.on("query", (entry) => {
  console.log(\`[\${entry.durationMs}ms] \${entry.query}\`);
});

orm.events.on("error", (error) => {
  console.error("Database error:", error);
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Event Types</h2>
              <p className="text-muted-foreground mb-4">
                The full list of available events:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <code>query</code> - Fired after each query with duration info
                </li>
                <li>
                  <code>error</code> - Fired on database errors
                </li>
                <li>
                  <code>migration:start</code> - Fired when migrations begin
                </li>
                <li>
                  <code>migration:complete</code> - Fired when migrations finish
                </li>
                <li>
                  <code>transaction:start</code> - Fired when a transaction
                  begins
                </li>
                <li>
                  <code>transaction:complete</code> - Fired when a transaction
                  commits
                </li>
                <li>
                  <code>transaction:error</code> - Fired when a transaction
                  rolls back
                </li>
                <li>
                  <code>connection:open</code> - Fired when a connection opens
                </li>
                <li>
                  <code>connection:close</code> - Fired when a connection closes
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
