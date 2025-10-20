import { CodeBlock } from "@/components/code-block"
import { Shield } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">Security Best Practices</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Protect your application from common security vulnerabilities
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. SQL Injection Prevention</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize ORM automatically uses parameterized queries to prevent SQL injection:
            </p>
            <CodeBlock
              code={`// ✅ Safe: Parameterized query (automatic)
const user = await repo
  .query()
  .where("email", "=", userInput)
  .findOne();

// ❌ Dangerous: Raw SQL with user input
const result = await orm.rawQuery(
  \`SELECT * FROM users WHERE email = '\${userInput}'\`
);

// ✅ Safe: Raw query with parameters
const result = await orm.rawQuery(
  "SELECT * FROM users WHERE email = ?",
  [userInput]
);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Secure Database Credentials</h2>
            <p className="text-muted-foreground mb-4">Never hardcode credentials. Use environment variables:</p>
            <CodeBlock
              filename=".env"
              code={`NEON_DATABASE_URL=postgresql://user:password@localhost:5432/myapp
REDIS_URL=redis://localhost:6379`}
            />
            <CodeBlock
              filename="db.config.ts"
              code={`import { DBType, type DBConfig } from "stabilize-orm";

export const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL, // From environment
  // Never commit credentials to version control
};`}
            />
            <p className="text-muted-foreground mt-4">
              Add <code>.env</code> to your <code>.gitignore</code>:
            </p>
            <CodeBlock
              filename=".gitignore"
              code={`.env
.env.local
.env.*.local`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Input Validation</h2>
            <p className="text-muted-foreground mb-4">
              Always validate and sanitize user input before database operations:
            </p>
            <CodeBlock
              code={`import { z } from "zod";

// Define validation schema
const userSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150),
});

// Validate before creating
async function createUser(input: unknown) {
  try {
    const validated = userSchema.parse(input);
    return await repo.create(validated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid input: " + error.message);
    }
    throw error;
  }
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Implement Row-Level Security</h2>
            <p className="text-muted-foreground mb-4">Ensure users can only access their own data:</p>
            <CodeBlock
              code={`// ❌ Bad: No authorization check
async function getPost(postId: number) {
  return await postRepo.findById(postId);
}

// ✅ Good: Verify ownership
async function getPost(postId: number, userId: number) {
  const post = await postRepo
    .query()
    .where("id", "=", postId)
    .where("userId", "=", userId) // Ensure user owns the post
    .findOne();

  if (!post) {
    throw new Error("Post not found or access denied");
  }

  return post;
}

// ✅ Better: Use query scopes
export const Post = defineModel({
  tableName: "posts",
  columns: { /* ... */ },
  scopes: {
    ownedBy: (query, userId: number) =>
      query.where("userId", "=", userId),
  },
});

// Usage
const userPosts = await postRepo.scope("ownedBy", currentUserId).find();`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Protect Sensitive Data</h2>
            <p className="text-muted-foreground mb-4">Hash passwords and encrypt sensitive information:</p>
            <CodeBlock
              code={`import { hash, verify } from "@node-rs/argon2";

// Hash password before storing
async function createUser(email: string, password: string) {
  const hashedPassword = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  return await userRepo.create({
    email,
    password: hashedPassword, // Store hashed password
  });
}

// Verify password on login
async function login(email: string, password: string) {
  const user = await userRepo.query().where("email", "=", email).findOne();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verify(user.password, password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Use Transactions for Critical Operations</h2>
            <p className="text-muted-foreground mb-4">Ensure data consistency with transactions:</p>
            <CodeBlock
              code={`// ✅ Good: Use transaction for related operations
async function transferFunds(fromId: number, toId: number, amount: number) {
  await orm.transaction(async (trx) => {
    // Deduct from sender
    const sender = await accountRepo.findById(fromId, trx);
    if (sender.balance < amount) {
      throw new Error("Insufficient funds");
    }
    await accountRepo.update(fromId, {
      balance: sender.balance - amount,
    }, trx);

    // Add to receiver
    const receiver = await accountRepo.findById(toId, trx);
    await accountRepo.update(toId, {
      balance: receiver.balance + amount,
    }, trx);

    // If any operation fails, entire transaction rolls back
  });
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Implement Rate Limiting</h2>
            <p className="text-muted-foreground mb-4">Protect against brute force attacks:</p>
            <CodeBlock
              code={`import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 requests per minute
});

async function login(email: string, password: string, ip: string) {
  // Check rate limit
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    throw new Error("Too many login attempts. Please try again later.");
  }

  // Proceed with login
  // ...
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Audit Logging</h2>
            <p className="text-muted-foreground mb-4">Track sensitive operations with lifecycle hooks:</p>
            <CodeBlock
              code={`export const User = defineModel({
  tableName: "users",
  columns: { /* ... */ },
  hooks: {
    afterCreate: async (user) => {
      await auditRepo.create({
        action: "USER_CREATED",
        userId: user.id,
        timestamp: new Date(),
        metadata: { email: user.email },
      });
    },
    afterUpdate: async (user, changes) => {
      await auditRepo.create({
        action: "USER_UPDATED",
        userId: user.id,
        timestamp: new Date(),
        metadata: { changes },
      });
    },
    afterDelete: async (user) => {
      await auditRepo.create({
        action: "USER_DELETED",
        userId: user.id,
        timestamp: new Date(),
      });
    },
  },
});`}
            />
          </section>

          

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Principle of Least Privilege</h2>
            <p className="text-muted-foreground mb-4">Grant database users only the permissions they need:</p>
            <CodeBlock
              code={`-- Create read-only user for reporting
CREATE USER reporting_user WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting_user;

-- Create app user with limited permissions
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Don't grant DROP, TRUNCATE, or ALTER permissions to app users`}
              language="sql"
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Security Checklist</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>✓ Use parameterized queries (automatic in Stabilize)</li>
              <li>✓ Store credentials in environment variables</li>
              <li>✓ Validate all user input with schemas</li>
              <li>✓ Implement row-level security checks</li>
              <li>✓ Hash passwords with strong algorithms</li>
              <li>✓ Use transactions for critical operations</li>
              <li>✓ Implement rate limiting on sensitive endpoints</li>
              <li>✓ Enable audit logging for compliance</li>
              <li>✓ Follow principle of least privilege</li>
              <li>✓ Keep dependencies updated</li>
              <li>✓ Regular security audits</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
