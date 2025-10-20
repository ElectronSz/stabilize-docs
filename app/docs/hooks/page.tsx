"use client"

import { CodeBlock } from "@/components/code-block"

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
              <p className="text-muted-foreground mb-4">Stabilize provides the following lifecycle hooks:</p>
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
              <h2 className="text-2xl font-semibold mb-4">Define Hooks in Model</h2>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING, length: 100 },
    password: { type: DataTypes.STRING, length: 255 },
  },
  hooks: {
    beforeCreate: async (entity) => {
      // Hash password before saving
      entity.password = await hashPassword(entity.password);
    },
    afterCreate: async (entity) => {
      // Send welcome email
      await sendWelcomeEmail(entity.email);
    },
    beforeUpdate: async (entity) => {
      // Update modified timestamp
      entity.updatedAt = new Date();
    },
  },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Multiple Hooks</h2>
              <p className="text-muted-foreground mb-4">You can define multiple callbacks for the same hook:</p>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`const User = defineModel({
  tableName: "users",
  columns: { /* ... */ },
  hooks: {
    beforeCreate: [
      async (entity) => {
        entity.password = await hashPassword(entity.password);
      },
      async (entity) => {
        entity.createdAt = new Date();
      },
    ],
  },
});`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}