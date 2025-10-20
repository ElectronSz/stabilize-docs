import { CodeBlock } from "@/components/code-block"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function QuickStartPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Quick Start</h1>
        <p className="text-lg text-muted-foreground mb-8">Get up and running with Stabilize ORM in under 5 minutes</p>

        <div className="space-y-8">
          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  1
                </div>
                <CardTitle>Install Stabilize ORM</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CodeBlock code="bun add stabilize-orm" language="bash" />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  2
                </div>
                <CardTitle>Configure Database Connection</CardTitle>
              </div>
              <CardDescription>Create a configuration file for your database</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                filename="config/database.ts"
                code={`
import { DBType, type DBConfig } from "stabilize-orm";

// database configuration
const dbConfig: DBConfig = {
  type: DBType.Postgres, // or DBType.MySQL, DBType.SQLite
  connectionString: process.env.DATABASE_URL,
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
                language="typescript"
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  3
                </div>
                <CardTitle>Define Your First Model</CardTitle>
              </div>
              <CardDescription>Create a model to represent your data</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                filename="models/user.ts"
                code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";
import { UserRole } from "./UserRole";

const User = defineModel({
  tableName: "users",
  versioned: true, // versioned 
  columns: {
    id: { type: DataTypes.Integer, required: true },
    email: { type: DataTypes.String, length: 100, required: true, unique: true },
  },
  //timestamps
  timestamps: {
    createdAt: "created_at",
    updatedAt: "update_at",
  },
  // define relationships
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => UserRole,
      property: "roles",
      foreignKey: "userId",
    },
  ],
  // hooks
  hooks: {
    beforeSave: (entity) => {}),
    afterSave: (entity) => {}),
    beforeCreate: (entity) => {}),
    afterCreate: (entity) => {}),
    beforeUpdate: (entity) => {}),
    afterCreate: (entity) => {}),
  },
})

export { User };`}
                language="typescript"
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  4
                </div>
                <CardTitle>Initialize Stabilize</CardTitle>
              </div>
              <CardDescription>Initialize stabilize instance, configure cache and logger</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                filename="db/index.ts"
                code={`import { Stabilize,type CacheConfig, type LoggerConfig, LogLevel } from "stabilize-orm";
import dbConfig from "./database";

const cacheConfig: CacheConfig = {
  enabled: process.env.CACHE_ENABLED === "true",
  redisUrl: process.env.REDIS_URL,
  ttl: 60,
};

const loggerConfig: LoggerConfig = {
  level: LogLevel.Info,
  filePath: "logs/stabilize.log",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 3,
};

export const orm = new Stabilize(dbConfig, cacheConfig, loggerConfig);`}
                language="typescript"
              />
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                  5
                </div>
                <CardTitle>Start Querying</CardTitle>
              </div>
              <CardDescription>Use the repository to interact with your data</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`import { orm } from "./db";

// create a user repository
const userRepository = orm.getRepository(User);

// Create a new user
const newUser = await userRepository.create({
  email: "ciniso@stabilize.xyz",
  name: "Ciniso Matsebula ",
});

// find a single user
const foundUser = await userRepository.findOne(newUser.id);

// update a user
const updatedUser = await userRepository.update(newUser.id,
 { email: "admin@offbytesecure.com" }
);

// delete user
await userRepository.delete(newUser.id);
`}
                language="typescript"
              />
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <CardTitle className="text-green-500">You're All Set!</CardTitle>
              </div>
              <CardDescription>
                You now have a working Stabilize ORM setup. Explore the documentation to learn about advanced features
                like relationships, transactions, and caching.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}