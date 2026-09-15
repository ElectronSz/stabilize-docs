import { CodeBlock } from "@/components/code-block";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
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
              Stabilize ORM never interpolates a value into SQL. Every statement
              the library generates is written with <code>?</code> placeholders,
              and every value is bound as a parameter. Before a statement
              reaches a driver, <code>rewritePlaceholders()</code> converts the
              placeholders into the dialect&apos;s own syntax — <code>$1</code>{" "}
              for PostgreSQL, <code>@param0</code> for SQL Server. MySQL and
              SQLite take <code>?</code> as written.
            </p>
            <p className="text-muted-foreground mb-4">
              Reads go through the query builder, whose <code>where()</code>{" "}
              parameters are bound. Raw statements accept a parameters array,
              which is bound the same way.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Safe: Parameterized query (automatic)
const user = await userRepo
  .find()
  .where("email = ?", userInput)
  .execute(orm.client);

// Safe: Raw query with parameters - the value is bound, not pasted in
const result = await orm.rawQuery(
  "SELECT * FROM users WHERE email = ?",
  [userInput]
);

// Safe: Raw write - same parameter binding
await orm.rawExec(
  "UPDATE users SET locked = ? WHERE email = ?",
  [true, userInput]
);

// Dangerous: concatenating user input into the SQL string
// The ORM cannot protect a value that never reaches it as a parameter.
const result = await orm.rawQuery(
  "SELECT * FROM users WHERE email = '" + userInput + "'"
);`}
            />
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                Parameter binding, not escaping
              </p>
              <p className="text-sm text-muted-foreground">
                Values are passed to the driver separately from the statement,
                so a string containing quotes or SQL keywords is data and
                nothing else. The gap is always the same one: building a query
                string yourself with{" "}
                <code>+</code> or a template literal. Pass the value in the{" "}
                <code>params</code> array instead.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Secure Database Credentials
            </h2>
            <p className="text-muted-foreground mb-4">
              Never hardcode credentials. Read them from the environment:
            </p>
            <CodeBlock
              filename=".env"
              code={`DATABASE_URL=postgresql://user:password@localhost:5432/myapp
REDIS_URL=redis://localhost:6379
ORM_ENCRYPTION_KEY=...`}
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
            <p className="text-muted-foreground mb-4">
              A column marked <code>encrypted: true</code> is encrypted on the
              way in and decrypted on the way out, transparently, by the
              repository. Mark the column and set the key — nothing else in your
              code changes:
            </p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true },
    ssn: { type: DataTypes.STRING, encrypted: true }, // stored as ciphertext
    email: { type: DataTypes.STRING, required: true },
  },
});

// Reads return plaintext: findOne, findBy, first, paginate and pluck all
// pass the row through the decrypting transform.
const user = await userRepo.findOne(id);
console.log(user.ssn); // the original value`}
            />
            <CodeBlock
              filename=".env"
              code={`# 64 hex characters (32 bytes), or a 32-byte utf8 string
ORM_ENCRYPTION_KEY=9f2c1d7a4b8e35061c9a7d2f4e8b1a3c5d7f9b2e4a6c8d0f1b3e5a7c9d1f3b5e`}
            />
            <p className="text-muted-foreground my-4">
              Encryption is AES-256-GCM. Each value is written as{" "}
              <code>v2:&lt;iv&gt;:&lt;auth tag&gt;:&lt;ciphertext&gt;</code>{" "}
              with a fresh random IV, all Base64 — the authentication tag means
              a value that was truncated or tampered with fails to decrypt
              rather than silently returning corrupted plaintext. Older rows
              written in the pre-<code>v2</code> CBC format are still readable,
              though nothing writes that format any more.
            </p>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                The key is required, and the legacy key is published
              </p>
              <p className="text-sm text-muted-foreground">
                <code>ORM_ENCRYPTION_KEY</code> has no default. It is read on
                every encrypt and decrypt, so setting it after importing the ORM
                still works — but a missing or wrong-length key throws rather
                than falling back to something. The key this library used to
                hard-code (<code>f71a3c8e9b12d5a49c0a3f98b1f2e46d</code>) is
                therefore public knowledge. Rows written by an older version
                were encrypted with it and offer no real confidentiality: set{" "}
                <code>ORM_ENCRYPTION_KEY</code> to that value to keep reading
                them, re-save the rows under a key of your own, then drop it.
                There is no automatic re-encryption tool.
              </p>
            </div>
            <p className="text-muted-foreground my-4">
              Encryption covers storage. Password hashing is a separate concern
              and stays in your hands — use a slow, salted algorithm:
            </p>
            <CodeBlock
              language="typescript"
              code={`import { hash, verify } from "@node-rs/argon2";

const hashedPassword = await hash(password);
await userRepo.create({ id: generateUUID(), email, password: hashedPassword });

// Verify on login
const isValid = await verify(user.password, inputPassword);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              6. Use Transactions for Critical Operations
            </h2>
            <p className="text-muted-foreground mb-4">
              A group of writes that must all land, or none, belongs in one
              transaction. <code>transaction()</code> takes a single argument —
              the callback — and hands it a client that every repository method
              accepts as its last parameter:
            </p>
            <CodeBlock
              filename="transfer.ts"
              language="typescript"
              code={`await orm.transaction(async (txClient) => {
  const sender = await accountRepo.findOne(fromId, {}, txClient);
  if (!sender || sender.balance < amount) {
    throw new Error("Insufficient funds");
  }

  await accountRepo.update(
    fromId,
    { balance: sender.balance - amount },
    txClient,
  );
  const receiver = await accountRepo.findOne(toId, {}, txClient);
  await accountRepo.update(
    toId,
    { balance: receiver.balance + amount },
    txClient,
  );

  // Returning commits. A throw anywhere above rolls the whole thing back.
});`}
            />
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">One argument, no savepoints</p>
              <p className="text-sm text-muted-foreground">
                <code>transaction()</code> does not take a second parameter for
                an existing client, and there is no isolation-level option on
                the call. A nested{" "}
                <code>transaction()</code> detects that it is already inside one
                and reuses the outer transaction instead of opening a second
                one — so there are no savepoints, and no partial rollback. An
                inner failure takes down the entire transaction; you cannot
                catch it and keep the outer work. Keep the callback short, and
                never make a network call to a third party inside it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              7. Implement Rate Limiting
            </h2>
            <p className="text-muted-foreground mb-4">
              This is application-level advice, not an ORM feature — the
              database is not the right place to notice that one address has
              tried to log in ten thousand times. Put a limiter in front of the
              endpoints that are worth brute-forcing:
            </p>
            <CodeBlock
              filename="login.ts"
              language="typescript"
              code={`import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 attempts per minute
});

async function login(email: string, password: string, ip: string) {
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    throw new Error("Too many login attempts. Please try again later.");
  }

  // Proceed with login
}`}
            />
            <p className="text-muted-foreground mt-4">
              Rate-limit by the identifier the attacker has to change — the
              account being targeted, not only the IP — and apply the same
              ceiling to password resets, one-time codes and anything else that
              can be guessed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Audit Logging</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize has two mechanisms for a record of what happened, and
              they cover different things. For row-level changes, use lifecycle
              hooks on the model:
            </p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, registerHooks } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: { /* ... */ },
});

registerHooks(User, {
  afterCreate: async (user) => {
    await auditRepo.create({
      action: "USER_CREATED",
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
  },
  afterUpdate: async (user) => {
    await auditRepo.create({
      action: "USER_UPDATED",
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
  },
  afterDelete: async (user) => {
    await auditRepo.create({
      action: "USER_DELETED",
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
  },
});`}
            />
            <p className="text-muted-foreground my-4">
              For the ORM&apos;s own activity, pass a{" "}
              <code>LoggerConfig</code> as the third constructor argument. Query
              text, bound parameters and execution time are written to the file,
              with rotation:
            </p>
            <CodeBlock
              filename="db.ts"
              language="typescript"
              code={`import { Stabilize, LogLevel, type LoggerConfig } from "stabilize-orm";

const loggerConfig: LoggerConfig = {
  level: LogLevel.Debug,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024, // rotate at 5MB
  maxFiles: 3,                  // keep 3 files
};

export const orm = new Stabilize(dbConfig, { enabled: false, ttl: 60 }, loggerConfig);`}
            />
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">
                Only two events actually fire
              </p>
              <p className="text-sm text-muted-foreground">
                <code>orm.events</code> is a{" "}
                <code>StabilizeEmitter</code> with{" "}
                <code>on()</code>, <code>off()</code> and <code>emit()</code>.
                Its <code>StabilizeEvent</code> type declares nine names, but
                only <code>connection:open</code> and{" "}
                <code>connection:close</code> are emitted anywhere in the
                library today. A handler registered for{" "}
                <code>query</code>, <code>error</code>, the{" "}
                <code>migration:*</code> names or the{" "}
                <code>transaction:*</code> names will never be called — do not
                build an audit trail on them. Use hooks (above) for row changes
                and the logger for statement-level visibility.
              </p>
            </div>
            <p className="text-muted-foreground my-4">
              An audit record is only worth keeping if it is complete and
              trustworthy: write it in the same transaction as the change it
              describes, keep it append-only, and never let it store the
              sensitive value it is recording (log the fact that a column
              changed, not its new contents).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              9. Principle of Least Privilege
            </h2>
            <p className="text-muted-foreground mb-4">
              Infrastructure advice rather than an ORM feature, and the cheapest
              control here: the account your application connects with should be
              able to do its job and nothing more. Migrations are the usual
              exception — run them as a separate, more privileged user.
            </p>
            <CodeBlock
              code={`-- Read-only user for reporting
CREATE USER reporting_user WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reporting_user;

-- Application user: row data only
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Do not grant DROP, TRUNCATE or ALTER to the application user, and do not
-- let it connect as the database owner or a superuser.`}
              language="sql"
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
                Use <code>encrypted: true</code> for sensitive fields, and set{" "}
                <code>ORM_ENCRYPTION_KEY</code> — never rely on the published
                legacy key
              </li>
              <li>Hash passwords with a slow, salted algorithm</li>
              <li>Enable optimistic locking for concurrent writes</li>
              <li>Use transactions for critical operations</li>
              <li>Rate-limit authentication and other guessable endpoints</li>
              <li>Add audit logging with hooks and the file logger</li>
              <li>Follow principle of least privilege for database users</li>
              <li>Keep dependencies updated and re-audit periodically</li>
            </ul>
          </section>
        </div>
    </div>
  );
}
