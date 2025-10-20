"use client"

import { CodeBlock } from "@/components/code-block"

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
            <p className="text-muted-foreground mb-4">First, define a simple User model:</p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: {
      type: DataTypes.Integer,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.String,
      length: 100,
      required: true,
      unique: true,
    },
    name: {
      type: DataTypes.String,
      length: 255,
      required: true,
    },
    age: {
      type: DataTypes.Integer,
    },
    isActive: {
      type: DataTypes.Boolean,
      defaultValue: true,
    },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Create (Insert)</h2>
            <p className="text-muted-foreground mb-4">Insert a new user into the database:</p>
            <CodeBlock
              filename="examples/create-user.ts"
              language="typescript"
              code={`import { orm } from "./db";
import { User } from "./models/User";

const userRepository = orm.getRepository(User);

// Create a single user
const newUser = await userRepository.create({
  email: "lwazicd@icloud.com",
  name: "Lwazi Dlamini",
  age: 30,
  isActive: true,
});

console.log("Created user:", newUser);
// Output: { id: 1, email: "lwazicd@icloud.com", name: "Lwazi Dlamini", ... }

// Create multiple users
const users = await Promise.all([
  userRepository.create({ email: "sibusiso@swazi.com", name: "Sibusiso Simelane", age: 25 }),
  userRepository.create({ email: "phindile@swazi.com", name: "Phindile Nxumalo", age: 35 }),
]);

console.log(\`Created \${users.length} users\`);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Read (Query)</h2>
            <p className="text-muted-foreground mb-4">Retrieve users from the database:</p>
            <CodeBlock
              filename="examples/read-users.ts"
              language="typescript"
              code={`// Find all users
const allUsers = await userRepository.find().execute();
console.log("All users:", allUsers);

// Find by ID
const user = await userRepository.findOne(1);
console.log("User by ID:", user);

// Find with conditions
const activeUsers = await userRepository
  .find()
  .where("isActive = ?", true)
  .execute();

console.log("Active users:", activeUsers);

// Find one user
const firstUser = await userRepository
  .find()
  .where("age > ?", 25)
  .orderBy("createdAt DESC")
  .first();

console.log("First user over 25:", firstUser);

// Find with multiple conditions
const specificUsers = await userRepository
  .find()
  .where("age >= ?", 25)
  .where("isActive = ?", true)
  .orderBy("name ASC")
  .execute();

console.log("Specific users:", specificUsers);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Update</h2>
            <p className="text-muted-foreground mb-4">Modify existing user records:</p>
            <CodeBlock
              filename="examples/update-user.ts"
              language="typescript"
              code={`// Update by ID
const updatedUser = await userRepository.update(1, {
  name: "Lwazi Smith",
  age: 31,
});

console.log("Updated user:", updatedUser);

// Update multiple fields
await userRepository.update(2, {
  isActive: false,
  age: 26,
});

// Conditional update (using query builder, if supported)
const result = await userRepository
  .find()
  .where("age < ?", 18)
  // .update({ isActive: false }); // Uncomment if your ORM supports batch update from QueryBuilder

// console.log(\`Updated \${result.affectedRows} users\`);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Delete</h2>
            <p className="text-muted-foreground mb-4">Remove users from the database:</p>
            <CodeBlock
              filename="examples/delete-user.ts"
              language="typescript"
              code={`// Delete by ID
await userRepository.delete(1);
console.log("User deleted");

// Delete with conditions (if your ORM supports QueryBuilder.delete)
const deletedCount = await userRepository
  .find()
  .where("isActive = ?", false)
  .where("age < ?", 18)
  // .delete(); // Uncomment if your ORM supports batch delete from QueryBuilder

// console.log(\`Deleted \${deletedCount} users\`);

// Soft delete (if enabled in model)
await userRepository.recover(2);
console.log("User recovered (restored from soft delete)");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Count & Aggregations</h2>
            <p className="text-muted-foreground mb-4">Get statistics about your data:</p>
            <CodeBlock
              filename="examples/aggregate-user.ts"
              language="typescript"
              code={`// Count all users
const totalUsers = await userRepository.find().count();
console.log(\`Total users: \${totalUsers}\`);

// Count with conditions
const activeCount = await userRepository
  .find()
  .where("isActive = ?", true)
  .count();

console.log(\`Active users: \${activeCount}\`);

// Average age (if supported)
const avgAge = await userRepository.find().avg("age");
console.log(\`Average age: \${avgAge}\`);

// Min and max age
const minAge = await userRepository.find().min("age");
const maxAge = await userRepository.find().max("age");
console.log(\`Age range: \${minAge} - \${maxAge}\`);

// Sum
const totalAge = await userRepository.find().sum("age");
console.log(\`Total age: \${totalAge}\`);`}
            />
          </section>
        </div>
      </div>
    </div>
  )
}