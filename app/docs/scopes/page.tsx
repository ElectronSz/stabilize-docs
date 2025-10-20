"use client"

import { CodeBlock } from "@/components/code-block"

export default function ScopesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Query Scopes</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Reusable query filters for cleaner, more maintainable code
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Define Scopes</h2>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING, length: 100 },
    isActive: { type: DataTypes.BOOLEAN },
    role: { type: DataTypes.STRING, length: 50 },
  },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
    admin: (qb) => qb.where("role = ?", "admin"),
    byRole: (qb, role) => qb.where("role = ?", role),
  },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Use Scopes</h2>
              <CodeBlock
                filename="examples/use-scopes.ts"
                language="typescript"
                code={`const userRepo = stabilize.getRepository(User);

// Use a scope
const activeUsers = await userRepo
  .scope("active")
  .execute(stabilize.client);

// Chain multiple scopes
const activeAdmins = await userRepo
  .scope("active")
  .scope("admin")
  .execute(stabilize.client);

// Scope with parameters
const editors = await userRepo
  .scope("byRole", "editor")
  .execute(stabilize.client);`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}