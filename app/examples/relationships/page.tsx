"use client"

import { CodeBlock } from "@/components/code-block"

export default function RelationshipsExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Working with Relationships</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Define and query relationships between models
        </p>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">One-to-Many Example</h2>
            <p className="text-muted-foreground mb-4">A user can have many posts:</p>
            <CodeBlock
              filename="models/relationships.ts"
              language="typescript"
              code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

// User model
export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer, primaryKey: true },
    name: { type: DataTypes.String, length: 255 },
    email: { type: DataTypes.String, length: 100 },
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Post,
      property: "posts",
      foreignKey: "userId",
    },
  ],
});

// Post model
export const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.Integer, primaryKey: true },
    userId: { type: DataTypes.Integer, required: true },
    title: { type: DataTypes.String, length: 255 },
    content: { type: DataTypes.Text },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => User,
      property: "user",
      foreignKey: "userId",
    },
  ],
});
`}
            />
            <p className="text-muted-foreground mb-4">Query with relationships (using JOIN):</p>
            <CodeBlock
              filename="examples/query-relationships.ts"
              language="typescript"
              code={`const userRepository = orm.getRepository(User);

// Load user with their posts using JOIN
const userWithPosts = await userRepository
  .find()
  .join("posts", "users.id = posts.userId")
  .where("users.id = ?", 1)
  .execute(client);

console.log(userWithPosts[0].name);
// To get posts, you may need to manually group or join results

// Load all users with their post counts
const usersWithPosts = await userRepository
  .find()
  .join("posts", "users.id = posts.userId")
  .select("users.id", "users.name", "COUNT(posts.id) as post_count")
  .groupBy("users.id", "users.name")
  .execute(client);

usersWithPosts.forEach(user => {
  console.log(\`\${user.name} has \${user.post_count} posts\`);
});`}
            />
            <p className="text-muted-foreground mb-2">
              Stabilize ORM uses <code>join()</code> for SQL joins. There is no <code>with()</code> method—use <code>join</code> and <code>select</code> to load related data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Many-to-Many Example</h2>
            <p className="text-muted-foreground mb-4">
              Users can have many roles, roles can belong to many users:
            </p>
            <CodeBlock
              filename="models/user-role.ts"
              language="typescript"
              code={`export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer, primaryKey: true },
    name: { type: DataTypes.String, length: 255 },
  },
  relations: [
    {
      type: RelationType.ManyToMany,
      target: () => Role,
      property: "roles",
      joinTable: "user_roles",
      foreignKey: "userId",
      inverseKey: "roleId",
    },
  ],
});

export const Role = defineModel({
  tableName: "roles",
  columns: {
    id: { type: DataTypes.Integer, primaryKey: true },
    name: { type: DataTypes.String, length: 50 },
  },
  relations: [
    {
      type: RelationType.ManyToMany,
      target: () => User,
      property: "users",
      joinTable: "user_roles",
      foreignKey: "roleId",
      inverseKey: "userId",
    },
  ],
});`}
            />
            <p className="text-muted-foreground mb-4">Query many-to-many relationships using joins:</p>
            <CodeBlock
              filename="examples/query-many-to-many.ts"
              language="typescript"
              code={`// Load user with roles (JOIN)
const userWithRoles = await userRepository
  .find()
  .join("user_roles", "users.id = user_roles.userId")
  .join("roles", "user_roles.roleId = roles.id")
  .where("users.id = ?", 1)
  .select("users.*", "roles.name as role_name")
  .execute(client);

userWithRoles.forEach(row => {
  console.log(\`\${row.name} has role: \${row.role_name}\`);
});

// Find all admins
const admins = await userRepository
  .find()
  .join("user_roles", "users.id = user_roles.userId")
  .join("roles", "user_roles.roleId = roles.id")
  .where("roles.name = ?", "Admin")
  .execute(client);

console.log(\`Found \${admins.length} admins\`);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Nested Relationships</h2>
            <p className="text-muted-foreground mb-4">
              To query nested relationships, use multiple joins:
            </p>
            <CodeBlock
              filename="examples/query-nested.ts"
              language="typescript"
              code={`// Load user with posts and each post's comments using JOINs
const usersWithPostsAndComments = await userRepository
  .find()
  .join("posts", "users.id = posts.userId")
  .join("comments", "posts.id = comments.postId")
  .where("users.id = ?", 1)
  .select("users.*", "posts.title as post_title", "comments.content as comment_content")
  .execute(client);

// Group results in code as needed:
usersWithPostsAndComments.forEach(row => {
  console.log(\`\${row.name} wrote post: \${row.post_title}\`);
  console.log(\`Comment: \${row.comment_content}\`);
});`}
            />
            <p className="text-muted-foreground mt-2">
              <strong>Note:</strong> Use <code>join()</code> and <code>select()</code> for relationship queries.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}