"use client"

import { CodeBlock } from "@/components/code-block"

export default function VersioningExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">Versioning & Time-Travel</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track changes and query historical data with automatic versioning
        </p>

        <div className="space-y-8">
          {/* Enable Versioning */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Enable Versioning</h2>
            <p className="text-muted-foreground mb-4">Add versioning to your model:</p>
            <CodeBlock
              filename="models/Document.ts"
              language="typescript"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Document = defineModel({
  tableName: "documents",
  versioned: true, // Enable automatic versioning
  columns: {
    id: { type: DataTypes.Integer, primaryKey: true },
    title: { type: DataTypes.String, length: 255 },
    content: { type: DataTypes.Text },
    status: { type: DataTypes.String, length: 50 },
  },
});`}
            />
          </section>

          {/* Track Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Track Changes</h2>
            <p className="text-muted-foreground mb-4">Every update creates a new version:</p>
            <CodeBlock
              filename="examples/track-changes.ts"
              language="typescript"
              code={`const docRepository = orm.getRepository(Document);

// Create initial document (version 1)
const doc = await docRepository.create({
  title: "My Document",
  content: "Initial content",
  status: "draft",
});

console.log("Created document, version:", doc.version); // 1

// Update creates version 2
await docRepository.update(doc.id, {
  content: "Updated content",
});

// Another update creates version 3
await docRepository.update(doc.id, {
  status: "published",
});

console.log("Document now at version 3");`}
            />
          </section>

          {/* View History */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">View History</h2>
            <p className="text-muted-foreground mb-4">Get all versions of a record:</p>
            <CodeBlock
              filename="examples/view-history.ts"
              language="typescript"
              code={`// Get full version history
const history = await docRepository.history(doc.id);

console.log(\`Document has \${history.length} versions\`);

history.forEach(version => {
  console.log(\`Version \${version.version}:\`);
  console.log(\`  Title: \${version.title}\`);
  console.log(\`  Status: \${version.status}\`);
  console.log(\`  Changed at: \${version.modified_at}\`);
});`}
            />
          </section>

          {/* Time-Travel Queries */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Time-Travel Queries</h2>
            <p className="text-muted-foreground mb-4">Query data as it existed at a specific point in time:</p>
            <CodeBlock
              filename="examples/time-travel.ts"
              language="typescript"
              code={`// Get document as it was on a specific date
const pastDate = new Date("2025-01-01T00:00:00Z");
const docAsOf = await docRepository.asOf(doc.id, pastDate);

console.log("Document on Jan 1, 2025:");
console.log(\`  Title: \${docAsOf.title}\`);
console.log(\`  Content: \${docAsOf.content}\`);
console.log(\`  Status: \${docAsOf.status}\`);

// Get a specific version (may require a helper or history lookup)
const version2 = (await docRepository.history(doc.id)).find(v => v.version === 2);
console.log("Version 2 content:", version2?.content);`}
            />
          </section>

          {/* Rollback Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Rollback Changes</h2>
            <p className="text-muted-foreground mb-4">Restore a previous version:</p>
            <CodeBlock
              filename="examples/rollback-version.ts"
              language="typescript"
              code={`// Rollback to version 2
await docRepository.rollback(doc.id, 2);

const currentDoc = await docRepository.findOne(doc.id);
console.log("Rolled back to version 2");
console.log("Current content:", currentDoc.content);
console.log("Current version:", currentDoc.version); // Creates new version

// Rollback creates a new version with old data
// So if you were at version 5 and rollback to version 2,
// you'll now be at version 6 with version 2's data`}
            />
          </section>

          {/* Audit Trail */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Audit Trail</h2>
            <p className="text-muted-foreground mb-4">Track who made changes and when:</p>
            <CodeBlock
              filename="examples/audit-trail.ts"
              language="typescript"
              code={`// Get audit trail with user information
const auditTrail = await docRepository.history(doc.id);

console.log("Change History:");
auditTrail.forEach(version => {
  console.log(\`Version \${version.version}:\`);
  console.log(\`  Changed by: \${version.modified_by || "System"}\`);
  console.log(\`  Changed at: \${version.modified_at}\`);
  // You may need to diff fields manually for "changes"
});`}
            />
          </section>
        </div>
      </div>
    </div>
  )
}