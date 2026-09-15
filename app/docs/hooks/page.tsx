"use client";

import { CodeBlock } from "@/components/code-block";

export default function HooksPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
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
              <h2 className="text-2xl font-semibold mb-4">
                Hooks in defineModel
              </h2>
              <p className="text-muted-foreground mb-4">
                <code>registerHooks()</code> is not the only entry point. Hooks
                can also be declared inline on the model, which keeps the
                definition in one place:
              </p>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`const User = defineModel({
  tableName: "users",
  columns: { /* ... */ },
  hooks: {
    beforeCreate: async (entity) => {
      entity.password = await hashPassword(entity.password);
    },
  },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Hooks as Class Methods
              </h2>
              <p className="text-muted-foreground mb-4">
                A third form: if the entity has a method whose name matches the
                hook, it is called. This is resolved on the instance, so it works
                only where the ORM holds a real entity — a hook declared this way
                on a row that arrived as a plain object will not be found.
              </p>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`class UserEntity {
  id!: string;
  email!: string;

  async beforeCreate() {
    this.email = this.email.toLowerCase();
  }
}`}
              />
              <p className="text-muted-foreground mt-4">
                When more than one form is used,{" "}
                <code>defineModel</code> / <code>registerHooks</code> callbacks
                run first and class methods run second. Within a form, callbacks
                run in the order given.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Which Operations Fire Which Hook
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-accent/30">
                      <th className="text-left py-2 pr-4 font-semibold">
                        Method
                      </th>
                      <th className="text-left py-2 pr-4 font-semibold">
                        Hooks
                      </th>
                      <th className="text-left py-2 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">
                        <code>create()</code>
                      </td>
                      <td className="py-2 pr-4">
                        beforeCreate, beforeSave, afterCreate, afterSave
                      </td>
                      <td className="py-2">
                        <code>after*</code> sees the row with its generated id
                      </td>
                    </tr>
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">
                        <code>update()</code>
                      </td>
                      <td className="py-2 pr-4">
                        beforeUpdate, beforeSave, afterUpdate, afterSave
                      </td>
                      <td className="py-2">per call</td>
                    </tr>
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">
                        <code>delete()</code>
                      </td>
                      <td className="py-2 pr-4">beforeDelete, afterDelete</td>
                      <td className="py-2">
                        Both fire on a <em>soft</em> delete too — the row is
                        marked, not removed
                      </td>
                    </tr>
                    <tr className="border-b border-accent/10">
                      <td className="py-2 pr-4">
                        <code>bulkCreate()</code>
                      </td>
                      <td className="py-2 pr-4">beforeCreate, beforeSave</td>
                      <td className="py-2">
                        All rows, then one insert — entirely inside a single
                        transaction
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <code>bulkUpdate()</code>
                      </td>
                      <td className="py-2 pr-4">afterUpdate, afterSave</td>
                      <td className="py-2">
                        Runs per matched row; no <code>before*</code> hook
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-4">
                Note the asymmetry in <code>bulkCreate()</code>: the{" "}
                <em>before</em> hooks run for every row up front, but the insert is
                a single batched statement — so a hook that mutates the entity in
                place is reflected in the insert, while one that observes the
                database sees nothing yet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Events Are a Separate Mechanism
              </h2>
              <p className="text-muted-foreground mb-4">
                Hooks are per model and per row. The{" "}
                <code>orm.events</code> emitter is ORM-wide and concerns the
                connection, not your data — the two are unrelated, and an event
                handler cannot observe a row change. See{" "}
                <a href="/docs/events" className="text-accent underline">
                  Events
                </a>{" "}
                for the emitter and exactly which events fire today.
              </p>
            </section>
          </div>
    </div>
  );
}
