import { CodeBlock } from "@/components/code-block";

export default function SeedingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Database Seeding
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Populate your database with test or initial data
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Database seeding populates your database with initial or test
              data. Use the CLI to generate and run seed files:
            </p>
            <CodeBlock
              code="bunx stabilize-cli generate:seed User --count 10"
              language="bash"
            />
            <CodeBlock code="bunx stabilize-cli seed" language="bash" />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Creating Seed Files</h2>
            <p className="text-muted-foreground mb-4">
              Create seed files in the <code>seeds</code> directory:
            </p>
            <CodeBlock
              filename="seeds/users.seed.ts"
              language="typescript"
              code={`import { generateUUID } from "stabilize-orm";

export async function seed(orm: any) {
  const userRepo = orm.getRepository(User);

  // Create admin user
  await userRepo.create({
    id: generateUUID(),
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
  });

  // Create regular users
  await userRepo.bulkCreate([
    { id: generateUUID(), email: "alice@example.com", name: "Alice", role: "user" },
    { id: generateUUID(), email: "bob@example.com", name: "Bob", role: "user" },
  ]);
}

export async function rollback(orm: any) {
  const userRepo = orm.getRepository(User);
  await userRepo.truncate();
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Repository seed() Method
            </h2>
            <p className="text-muted-foreground mb-4">
              The repository also has a <code>seed()</code> method for simple
              seeding:
            </p>
            <CodeBlock
              filename="examples/seed.ts"
              language="typescript"
              code={`const userRepo = orm.getRepository(User);

// Seed data (skips if records already exist)
await userRepo.seed([
  { id: generateUUID(), email: "admin@example.com", name: "Admin" },
  { id: generateUUID(), email: "user@example.com", name: "User" },
], { ignoreDuplicates: true });`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Keep seed files idempotent (safe to run multiple times)</li>
              <li>Use transactions for complex seeding operations</li>
              <li>Separate development and production seeds</li>
              <li>
                Use <code>bulkCreate()</code> for large datasets
              </li>
              <li>
                Use <code>generateUUID()</code> for ID generation
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
