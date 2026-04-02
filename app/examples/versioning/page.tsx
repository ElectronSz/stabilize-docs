"use client";

import { CodeBlock } from "@/components/code-block";

export default function VersioningExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Versioning & Time-Travel</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track changes and query historical data with automatic versioning
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Enable Versioning</h2>
            <p className="text-muted-foreground mb-4">
              Set <code>versioned: true</code> on your model:
            </p>
            <CodeBlock
              filename="models/Document.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Document = defineModel({
  tableName: "documents",
  versioned: true,
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    title: { type: DataTypes.STRING, length: 255, required: true },
    content: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, length: 50 },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Track Changes</h2>
            <p className="text-muted-foreground mb-4">
              Every create, update, and delete records a version:
            </p>
            <CodeBlock
              filename="examples/track-changes.ts"
              language="typescript"
              code={`import { generateUUID } from "stabilize-orm";

const docRepo = orm.getRepository(Document);

// Create initial document (version 1)
const doc = await docRepo.create({
  id: generateUUID(),
  title: "My Document",
  content: "Initial content",
  status: "draft",
});

// Update creates version 2
await docRepo.update(doc.id, { content: "Updated content" });

// Another update creates version 3
await docRepo.update(doc.id, { status: "published" });`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">View History</h2>
            <p className="text-muted-foreground mb-4">
              Get all versions of a record using <code>history(id)</code>:
            </p>
            <CodeBlock
              filename="examples/view-history.ts"
              language="typescript"
              code={`const history = await docRepo.history(doc.id);

console.log(\`Document has \${history.length} versions\`);

history.forEach(version => {
  console.log(\`Version \${version.version}:\`);
  console.log(\`  Title: \${version.title}\`);
  console.log(\`  Status: \${version.status}\`);
  console.log(\`  Operation: \${version.operation}\`);
  console.log(\`  Valid from: \${version.valid_from}\`);
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Time-Travel Queries</h2>
            <p className="text-muted-foreground mb-4">
              Query data as it existed at a specific point in time using{" "}
              <code>asOf(id, date)</code>:
            </p>
            <CodeBlock
              filename="examples/time-travel.ts"
              language="typescript"
              code={`// Get document as it was on a specific date
const pastDate = new Date("2025-01-01T00:00:00Z");
const docAsOf = await docRepo.asOf(doc.id, pastDate);

if (docAsOf) {
  console.log("Document on Jan 1, 2025:");
  console.log(\`  Title: \${docAsOf.title}\`);
  console.log(\`  Content: \${docAsOf.content}\`);
}`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Rollback Changes</h2>
            <p className="text-muted-foreground mb-4">
              Restore a previous version using{" "}
              <code>rollback(id, version)</code>. This creates a new version
              with the old data:
            </p>
            <CodeBlock
              filename="examples/rollback-version.ts"
              language="typescript"
              code={`// Rollback to version 2
await docRepo.rollback(doc.id, 2);

// The rollback creates a NEW version (e.g., version 4) with version 2's data
const currentDoc = await docRepo.findOne(doc.id);
console.log("Current version:", currentDoc.version);
console.log("Content restored from v2:", currentDoc.content);`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
