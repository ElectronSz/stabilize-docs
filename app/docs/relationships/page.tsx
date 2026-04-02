"use client";

import { CodeBlock } from "@/components/code-block";

export default function RelationshipsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Relationships</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Define and query relationships between your models
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Relationship Types</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize supports four relationship types:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <code>RelationType.OneToOne</code> - Each record in A relates to
                exactly one in B
              </li>
              <li>
                <code>RelationType.ManyToOne</code> - Many records in A relate
                to one in B
              </li>
              <li>
                <code>RelationType.OneToMany</code> - One record in A relates to
                many in B
              </li>
              <li>
                <code>RelationType.ManyToMany</code> - Many records in A relate
                to many in B (uses join table)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">One-to-Many</h2>
            <p className="text-muted-foreground mb-4">
              A user can have many posts:
            </p>
            <CodeBlock
              filename="models/User.ts"
              language="typescript"
              code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 100 },
    email: { type: DataTypes.STRING, length: 255, required: true, unique: true },
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Post,
      property: "posts",
      foreignKey: "authorId",
    },
  ],
});

export const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 200, required: true },
    body: { type: DataTypes.TEXT },
    authorId: { type: DataTypes.STRING, required: true },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => User,
      property: "author",
      foreignKey: "authorId",
    },
  ],
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">One-to-One</h2>
            <p className="text-muted-foreground mb-4">
              A user has one profile:
            </p>
            <CodeBlock
              filename="models/Profile.ts"
              language="typescript"
              code={`export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true, unique: true },
  },
  relations: [
    {
      type: RelationType.OneToOne,
      target: () => Profile,
      property: "profile",
      foreignKey: "userId",
    },
  ],
});

export const Profile = defineModel({
  tableName: "profiles",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    userId: { type: DataTypes.STRING, required: true, unique: true },
    bio: { type: DataTypes.TEXT },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Many-to-Many</h2>
            <p className="text-muted-foreground mb-4">
              Users can have many roles, roles can belong to many users:
            </p>
            <CodeBlock
              filename="models/Role.ts"
              language="typescript"
              code={`export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 100 },
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
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 50, required: true },
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
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Querying with JOINs</h2>
            <p className="text-muted-foreground mb-4">
              Use the query builder to load related data via SQL JOINs:
            </p>
            <CodeBlock
              filename="examples/query-relationships.ts"
              language="typescript"
              code={`const postRepo = orm.getRepository(Post);

// Find posts with author name
const postsWithAuthor = await postRepo
  .find()
  .join("users", "posts.authorId = users.id")
  .select("posts.*", "users.name as authorName")
  .execute(orm.client);

// Many-to-many: users with roles
const userRepo = orm.getRepository(User);
const usersWithRoles = await userRepo
  .find()
  .join("user_roles", "users.id = user_roles.userId")
  .join("roles", "user_roles.roleId = roles.id")
  .select("users.*", "roles.name as roleName")
  .execute(orm.client);

// Count posts per user
const userPostCounts = await userRepo
  .find()
  .leftJoin("posts", "users.id = posts.authorId")
  .select("users.name", "COUNT(posts.id) as postCount")
  .groupBy("users.id", "users.name")
  .execute(orm.client);`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
