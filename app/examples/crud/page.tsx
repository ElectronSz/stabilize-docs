"use client";

import { CodeBlock } from "@/components/code-block";

export default function CrudExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Basic CRUD Operations</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to create, read, update, and delete records
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Setup</h2>
            <p className="text-muted-foreground mb-4">
              First, define a simple User model:
            </p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      length: 255,
      required: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      length: 100,
      required: true,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Create (Insert)</h2>
            <p className="text-muted-foreground mb-4">
              Insert a new user into the database:
            </p>
            <CodeBlock
              filename="examples/create-user.ts"
              language="typescript"
              code={`import { orm } from "./db";
import { User } from "./models/User";
import { generateUUID } from "stabilize-orm";

const userRepository = orm.getRepository(User);

// Create a single user
const newUser = await userRepository.create({
  id: generateUUID(),
  email: "lwazicd@icloud.com",
  name: "Lwazi Dlamini",
  age: 30,
});

console.log("Created user:", newUser);

// Create multiple users at once
const users = await userRepository.bulkCreate([
  { id: generateUUID(), email: "sibusiso@swazi.com", name: "Sibusiso", age: 25 },
  { id: generateUUID(), email: "phindile@swazi.com", name: "Phindile", age: 35 },
]);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Read (Query)</h2>
            <p className="text-muted-foreground mb-4">
              Retrieve users from the database:
            </p>
            <CodeBlock
              filename="examples/read-users.ts"
              language="typescript"
              code={`// Find all users
const allUsers = await userRepository.find().execute(orm.client);

// Find by ID
const user = await userRepository.findOne(user.id);

// Find one by conditions (TypeORM-style)
const userByEmail = await userRepository.findOneBy({ email: "lwazicd@icloud.com" });

// Find many by conditions
const activeUsers = await userRepository.findBy({ isActive: true });

// Query builder with conditions
const filtered = await userRepository
  .find()
  .where("age >= ?", 25)
  .where("isActive = ?", true)
  .orderBy("name", "ASC")
  .limit(10)
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Update</h2>
            <p className="text-muted-foreground mb-4">
              Modify existing user records:
            </p>
            <CodeBlock
              filename="examples/update-user.ts"
              language="typescript"
              code={`// Update by ID
const updatedUser = await userRepository.update(user.id, {
  name: "Lwazi Smith",
  age: 31,
});
console.log("Updated:", updatedUser);

// Conditional bulk update
const affectedRows = await userRepository.updateBy(
  { isActive: false },
  { age: 0 }
);
console.log("Updated", affectedRows, "users");

// Increment/decrement a field
await userRepository.increment(user.id, "age", 1);
await userRepository.decrement(user.id, "age", 1);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Delete</h2>
            <p className="text-muted-foreground mb-4">
              Remove users from the database:
            </p>
            <CodeBlock
              filename="examples/delete-user.ts"
              language="typescript"
              code={`// Delete by ID (soft delete if model has deletedAt)
await userRepository.delete(user.id);

// Conditional bulk delete
const deletedCount = await userRepository.deleteBy({ isActive: false });
console.log("Deleted", deletedCount, "users");

// Bulk delete by IDs
await userRepository.bulkDelete([id1, id2, id3]);

// Recover soft-deleted record
await userRepository.recover(user.id);

// Recover all soft-deleted
await userRepository.recoverAll();`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Count & Aggregations
            </h2>
            <p className="text-muted-foreground mb-4">
              Get statistics about your data:
            </p>
            <CodeBlock
              filename="examples/aggregate-user.ts"
              language="typescript"
              code={`// Count all users
const totalUsers = await userRepository.count();

// Count with conditions
const activeCount = await userRepository.count({ isActive: true });

// Check existence
const exists = await userRepository.exists({ email: "lwazicd@icloud.com" });

// Aggregate functions
const stats = await userRepository.aggregate({
  count: "*",
  avg: ["age"],
  min: ["age"],
  max: ["age"],
});
console.log(stats);
// { count_all: 10, avg_age: 28.5, min_age: 18, max_age: 65 }

// Count distinct values
const distinctAges = await userRepository.countDistinct("age");

// Get single column values
const emails = await userRepository.pluck("email");`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
