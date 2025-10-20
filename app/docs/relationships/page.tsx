"use client"

import { CodeBlock } from "@/components/code-block"

export default function RelationshipsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Relationships</h1>
        <p className="text-lg text-muted-foreground mb-8">Define relationships between your models</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">One-to-Many Relationship</h2>
            <p className="text-muted-foreground mb-4">A user can have many posts:</p>
             <CodeBlock
                filename="models/one-to-many.ts"
                code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer },
    name: { type: DataTypes.String, length: 255 },
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

const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.Integer },
    userId: { type: DataTypes.Integer, required: true },
    title: { type: DataTypes.String, length: 255 },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => User,
      property: "user",
      foreignKey: "userId",
    },
  ],
});`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">One-to-One Relationship</h2>
            <p className="text-muted-foreground mb-4">A user has one profile:</p>
             <CodeBlock
                filename="models/one-to-one.ts"
                code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer },
    email: { type: DataTypes.String, length: 100 },
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

const Profile = defineModel({
  tableName: "profiles",
  columns: {
    id: { type: DataTypes.Integer },
    userId: { type: DataTypes.Integer, required: true, unique: true },
    bio: { type: DataTypes.Text },
  },
});`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Many-to-Many Relationship</h2>
            <p className="text-muted-foreground mb-4">Users can have many roles, and roles can belong to many users:</p>
             <CodeBlock
                filename="models/many-to-many.ts"
                code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.Integer },
    name: { type: DataTypes.String, length: 255 },
  },
  relations: [
    {
      type: RelationType.ManyToMany,
      target: () => Role,
      property: "roles",
      through: "user_roles",
      foreignKey: "userId",
      otherKey: "roleId",
    },
  ],
});

const Role = defineModel({
  tableName: "roles",
  columns: {
    id: { type: DataTypes.Integer },
    name: { type: DataTypes.String, length: 50 },
  },
  relations: [
    {
      type: RelationType.ManyToMany,
      target: () => User,
      property: "users",
      through: "user_roles",
      foreignKey: "roleId",
      otherKey: "userId",
    },
  ],
});`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Querying with Relations</h2>
            <p className="text-muted-foreground mb-4">Load related data with your queries:</p>
              <CodeBlock
                filename="queries/with-relations.ts"
                code={`const userRepository = orm.getRepository(User);

// Load user with posts
const userWithPosts = await userRepository
  .find()
  .with("posts")
  .where("id = ?", 1)
  .first();

// Load user with posts and roles
const userWithRelations = await userRepository
  .find()
  .with(["posts", "roles"])
  .where("id = ?", 1)
  .first();`}
                language="typescript"
              />
          </section>
        </div>
      </div>
    </div>
  )
}