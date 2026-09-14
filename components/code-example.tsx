"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code"

const examples = [
  {
    title: "Define Models",
    language: "typescript",
    code: `import { defineModel, DataTypes, RelationType } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  versioned: true,
  columns: {
    id: { type: DataTypes.Integer, required: true },
    email: { type: DataTypes.String, length: 100, required: true },
    name: { type: DataTypes.String, length: 255 },
    createdAt: { type: DataTypes.DateTime, default: () => new Date() },
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Post,
      property: "posts",
      foreignKey: "userId",
    },
  ],
  hooks: {
    beforeCreate: (entity) => console.log(\`Creating: \${entity.email}\`),
    afterUpdate: (entity) => console.log(\`Updated: \${entity.id}\`),
  },
});`,
  },
  {
    title: "Query Data",
    language: "typescript",
    code: `import { orm } from "./db";
import { User } from "./models/User";

const userRepository = orm.getRepository(User);

// Simple queries
const user = await userRepository.findById(1);
const allUsers = await userRepository.findAll();

// Advanced queries with Query Builder
const activeAdmins = await userRepository
  .find()
  .join("roles", "user_roles.role_id = roles.id")
  .where("roles.name = ?", "Admin")
  .where("users.active = ?", true)
  .orderBy("users.email ASC")
  .limit(10)
  .execute();

// Bulk operations
await userRepository.bulkCreate([
  { email: "lwazi@icloud.com", name: "Lwazi Dlamini" },
  { email: "ciniso@stabilize.com", name: "Ciniso Matsebula" },
 ]);`,
  },
  {
    title: "Time-Travel Queries",
    language: "typescript",
    code: `const userRepository = orm.getRepository(User);

// Rollback to a previous version
await userRepository.rollback(1, 3);

// Get a snapshot as of a specific date
const userAsOf = await userRepository.asOf(1, new Date("2025-01-01T00:00:00Z"));

// View full version history
const history = await userRepository.history(1);

// Recover soft-deleted records
await userRepository.recover(1);`,
  },
  {
    title: "Relationships",
    language: "typescript",
    code: `// One-to-Many
const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.Integer, required: true },
    title: { type: DataTypes.String, length: 255 },
    userId: { type: DataTypes.Integer },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => User,
      property: "author",
      foreignKey: "userId",
    },
  ],
});

// Many-to-Many
const Tag = defineModel({
  tableName: "tags",
  columns: {
    id: { type: DataTypes.Integer, required: true },
    name: { type: DataTypes.String, length: 100 },
  },
  relations: [
    {
      type: RelationType.ManyToMany,
      target: () => Post,
      property: "posts",
      joinTable: "post_tags",
      joinColumn: "tagId",
      inverseJoinColumn: "postId",
    },
  ],
});`,
  },
  {
    title: "Transactions",
    language: "typescript",
    code: `import { orm } from "./db";

// Execute multiple operations in a transaction
await orm.transaction(async (trx) => {
  const userRepo = orm.getRepository(User);
  const postRepo = orm.getRepository(Post);
  
  const user = await userRepo.create({
    email: "lwazi@icloud.com",
    name: "Lwazi Dlamini"
  }, trx);
  
  await postRepo.create({
    title: "Ship stabilize-orm",
    userId: user.id,
    content: "Hope you enjoy v1.3.0 with it's awesome features"
  }, trx);
  
  //if any operation fails, it will be rolledback automatically
});`,
  },
    {
    title: "Custom Query Scopes",
    language: "typescript",
    code: `
const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer, required: true },
    isActive: { type: DataTypes.Boolean, required: true },
    createdAt: { type: DataTypes.DateTime },
  },
  scopes: {
    active: (qb) => qb.where("isActive = ?", true),
     recent: (qb, days: number) => qb.where("createdAt >= ?", new Date(Date.now() - days * 24 * 60 * 60 * 1000)),
  },
});

// Fetch active users
const activeUsers = await userRepository.scope("active").execute();

// Fetch users created in the last 7 days
const recentUsers = await userRepository.scope("recent", 7).execute();

// Combine scopes with other query operations
const recentActiveUsers = await userRepository
  .scope("active")
  .scope("recent", 7)
  .orderBy("createdAt DESC")
  .limit(10)
  .execute();
    `,
  },
  {
    title: "Caching",
    language: "typescript",
    code: `
import { Stabilize, type CacheConfig, type LoggerConfig, LogLevel } from "stabilize-orm";
import dbConfig from "./database";

const cacheConfig: CacheConfig = {
  enabled: process.env.CACHE_ENABLED === "true", //enable cache
  redisUrl: process.env.REDIS_URL,
  ttl: 60, //1 minute
};

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3,
};

// initialize orm with cache configuration
const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);

// initialize a user repository
const userRepository = orm.getRepository(User);

// Queries are automatically cached
const user = await userRepository.findById(1); // Cached
const sameUser = await userRepository.findById(1); // From cache

// Clear cache when needed
await orm.cache.clear("users:1");`,
  },
  {
    title: "CLI Commands",
    language: "bash",
    code: `# Generate a model
$ stabilize-cli generate model Product

# Generate a migration
$ stabilize-cli generate migration User

# Run migrations
$ stabilize-cli migrate

# Rollback migrations
$ stabilize-cli migrate:rollback

# Seed database
$ stabilize-cli seed

# Reset database
$ stabilize-cli db:reset`,
  },
      {
    title: "Express.js Integration",
    language: "typescript",
    code: `import express from "express";
import { orm } from "./db";
import { User } from "./models/User";

const app = express();
app.use(express.json());

const userRepository = orm.getRepository(User);

app.get("/users", async (req, res) => {
  try {
    const users = await userRepository.find().execute();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await userRepository.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "User creation failed." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000');
});
    `,
  },
]

export function CodeExample() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="relative py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center">
      <div className="container relative">
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-balance">
                Simple, powerful, and expressive
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Build complex database operations with clean, intuitive code that scales with your application.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={example.title}
                    variant={activeTab === index ? "default" : "outline"}
                    onClick={() => setActiveTab(index)}
                    className={
                      activeTab === index ? "bg-accent hover:bg-accent/90" : "border-accent/30 hover:bg-accent/10"
                    }
                    size="sm"
                  >
                    {example.title}
                  </Button>
                ))}
              </div>

              <Card className="border-accent/30 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-accent/10">
                <div className="bg-secondary/50 px-4 py-3 border-b border-accent/20">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground ml-2">{examples[activeTab].title}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <CodeBlock code={examples[activeTab].code} language={examples[activeTab].language} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
