"use client"

import { CodeBlock } from "@/components/code-block"

export default function ModelsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Models</h1>
        <p className="text-lg text-muted-foreground mb-8">Define your data models with type-safe schemas</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Basic Model Definition</h2>
            <p className="text-muted-foreground mb-4">
              Models represent your database tables and define their structure:
            </p>
             <CodeBlock
                filename="models/user.ts"
                code={`import { defineModel, DataTypes } from "stabilize-orm";

const User = defineModel({
  tableName: "users",
  columns: {
    id: { 
      type: DataTypes.INTEGER, 
      required: true,
    },
    email: { 
      type: DataTypes.STRING, 
      length: 100, 
      required: true,
      unique: true
    },
    name: { 
      type: DataTypes.STRING, 
      length: 255 
    },
    age: { 
      type: DataTypes.INTEGER 
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },
    createdAt: { 
      type: DataTypes.DATETIME,
      defaultValue: () => new Date()
    },
  },
});`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Available Data Types</h2>
              <CodeBlock
                filename="types.ts"
                code={`DataTypes.STRING      // VARCHAR
DataTypes.TEXT        // TEXT
DataTypes.INTEGER     // INTEGER
DataTypes.FLOAT       // FLOAT
DataTypes.DECIMAL     // DECIMAL
DataTypes.BOOLEAN     // BOOLEAN
DataTypes.DATETIME    // TIMESTAMP
DataTypes.DATE        // DATE
DataTypes.TIME        // TIME
DataTypes.JSON        // JSON
DataTypes.UUID        // UUID`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Model with Timestamps</h2>
            <p className="text-muted-foreground mb-4">Enable automatic timestamp management:</p>
             <CodeBlock
                filename="models/post.ts"
                code={`const Post = defineModel({
  tableName: "posts",
  columns: {
    id: { type: DataTypes.INTEGER },
    title: { type: DataTypes.STRING, length: 255 },
    content: { type: DataTypes.TEXT },
  },
  // Adds createdAt and updatedAt
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Model with Soft Deletes</h2>
            <p className="text-muted-foreground mb-4">
              Enable soft deletes to mark records as deleted without removing them:
            </p>
             <CodeBlock
                filename="models/product.ts"
                code={`const Product = defineModel({
  tableName: "products",
  softDelete: true, // Adds deletedAt column
  columns: {
    id: { type: DataTypes.INTEGER},
    name: { type: DataTypes.STRING, length: 255 },
    price: { type: DataTypes.DECIMAL },
  },
});`}
                language="typescript"
              />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Model with Versioning</h2>
            <p className="text-muted-foreground mb-4">Enable automatic versioning for time-travel queries:</p>
             <CodeBlock
                filename="models/document.ts"
                code={`const Document = defineModel({
  tableName: "documents",
  versioned: true, // Enable version tracking
  columns: {
    id: { type: DataTypes.Integer },
    title: { type: DataTypes.STRING, length: 255 },
    content: { type: DataTypes.TEXT },
  },
});`}
                language="typescript"
              />
          </section>
        </div>
      </div>
    </div>
  )
}