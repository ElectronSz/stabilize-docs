import { CodeBlock } from "@/components/code-block"

export default function SeedingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Database Seeding</h1>
        <p className="text-lg text-muted-foreground mb-8">Populate your database with test or initial data</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Database seeding allows you to populate your database with initial or test data. This is useful for
              development, testing, and setting up demo environments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Creating Seed Files</h2>
            <p className="text-muted-foreground mb-4">
              Create seed files in the <code>seeds</code> directory:
            </p>
            <CodeBlock
              filename="seeds/users.seed.ts"
              code={`import { Stabilize } from "stabilize-orm";
import { User } from "../models/user";

export async function seed(orm: Stabilize) {
  const userRepo = orm.getRepository(User);

  // Create admin user
  await userRepo.create({
    email: "ciniso@stabilize.xyz",
    name: "Ciniso Matsebula",
    role: "admin",
  });

  // Create regular users
  const users = [
    { email: "lwazi@stabilize.xyz", name: "Lwazi Dlamini", role: "user" },
    { email: "faye@stabilize.xyz", name: "Faye Manana", role: "user" },
    { email: "botkiller@stabilize.xyz", name: "The Botkiller", role: "user" },
  ];

  await userRepo.bulkCreate(users);
}

export async function rollback(orm: Stabilize) {
  const userRepo = orm.getRepository(User);
  await userRepo.truncate();
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Keep seed files idempotent (safe to run multiple times)</li>
              <li>Use transactions for complex seeding operations</li>
              <li>Separate development and production seeds</li>
              <li>Document the order in which seeds should run</li>
              <li>Use bulk operations for large datasets</li>
              <li>Clean up test data in test environments after use</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
