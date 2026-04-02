import { CodeBlock } from "@/components/code-block";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Security Best Practices
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Protect your application from common security vulnerabilities
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. SQL Injection Prevention
            </h2>
            <p className="text-muted-foreground mb-4">
              Stabilize ORM uses parameterized queries automatically. All{" "}
              <code>where()</code> calls use <code>?</code> placeholders:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Safe: Parameterized query (automatic)
const user = await userRepo
  .find()
  .where("email = ?", userInput)
  .execute(orm.client);

// Safe: Raw query with parameters
const result = await orm.rawQuery(
  "SELECT * FROM users WHERE email = ?",
  [userInput]
);

// Dangerous: Never concatenate user input into SQL`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Secure Database Credentials
            </h2>
            <CodeBlock
              filename=".env"
              code={`DATABASE_URL=postgresql://user:password@localhost:5432/myapp
REDIS_URL=redis://localhost:6379`}
            />
            <CodeBlock
              filename=".gitignore"
              code={`.env
.env.local
.env.*.local`}
            />
            <CodeBlock
              filename="config/database.ts"
              language="typescript"
              code={`const dbConfig: DBConfig = {
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!, // From environment
};`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Input Validation</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize supports built-in column validation. You can also use
              external libraries:
            </p>
            <CodeBlock
              language="typescript"
              code={`// Built-in validation
const User = defineModel({
  tableName: "users",
  columns: {
    email: {
      type: DataTypes.STRING,
      required: true,
      pattern: /^[^@]+@[^@]+\\.[^@]+$/,
      customValidator: (val) => val.length <= 255 || "Email too long",
    },
    name: {
      type: DataTypes.STRING,
      minLength: 2,
      maxLength: 100,
    },
  },
});

// With zod (external)
import { z } from "zod";
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});
const validated = userSchema.parse(input);
await userRepo.create(validated);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Row-Level Security</h2>
            <CodeBlock
              language="typescript"
              code={`// Verify ownership before returning data
async function getPost(postId: string, userId: string) {
  const post = await postRepo.findOneBy({ id: postId, authorId: userId });
  if (!post) throw new Error("Not found or access denied");
  return post;
}

// Or use scopes
const Post = defineModel({
  tableName: "posts",
  columns: { /* ... */ },
  scopes: {
    ownedBy: (qb, userId: string) => qb.where("authorId = ?", userId),
  },
});

const userPosts = await postRepo.scope("ownedBy", currentUserId).execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              5. Protect Sensitive Data
            </h2>
            <CodeBlock
              language="typescript"
              code={`// Field-level encryption (built-in)
const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true },
    ssn: { type: DataTypes.STRING, encrypted: true },  // Auto-encrypted
    email: { type: DataTypes.STRING, required: true },
  },
});

// Hash passwords before storing (external)
import { hash, verify } from "@node-rs/argon2";

const hashedPassword = await hash(password);
await userRepo.create({ id: generateUUID(), email, password: hashedPassword });

// Verify on login
const isValid = await verify(user.password, inputPassword);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Optimistic Locking</h2>
            <CodeBlock
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true },
    balance: { type: DataTypes.DECIMAL },
    version: { type: DataTypes.INTEGER, optimisticLock: true },
  },
});

// Throws CONCURRENT_MODIFICATION if another transaction modified the record
try {
  await userRepo.update(user.id, { balance: newBalance, version: user.version });
} catch (err) {
  if (err.code === "CONCURRENT_MODIFICATION") {
    // Retry or notify user
  }
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Audit Logging with Hooks
            </h2>
            <CodeBlock
              language="typescript"
              code={`import { registerHooks } from "stabilize-orm";

registerHooks(User, {
  afterCreate: async (user) => {
    console.log("AUDIT: User created:", user.id);
  },
  afterUpdate: async (user) => {
    console.log("AUDIT: User updated:", user.id);
  },
  afterDelete: async (user) => {
    console.log("AUDIT: User deleted:", user.id);
  },
});

// Or use the event system
orm.events.on("query", (entry) => {
  if (entry.query.includes("DELETE")) {
    console.log("AUDIT: Dangerous query:", entry.query);
  }
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Security Checklist</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use parameterized queries (automatic in Stabilize)</li>
              <li>Store credentials in environment variables</li>
              <li>
                Validate input with column constraints and external schemas
              </li>
              <li>Implement row-level security checks</li>
              <li>
                Use <code>encrypted: true</code> for sensitive fields
              </li>
              <li>Enable optimistic locking for concurrent writes</li>
              <li>Use transactions for critical operations</li>
              <li>Add audit logging with hooks or events</li>
              <li>Follow principle of least privilege for database users</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
