import { CodeBlock } from "@/components/code-block";

export default function VersioningPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Versioning & Time Travel
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track changes to your data over time and query historical states
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize ORM provides built-in versioning that tracks every
              change to your records. When enabled, a{" "}
              <code>{`<table>`}_history</code> table stores all historical
              versions with timestamps, operation types, and version numbers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Enabling Versioning</h2>
            <p className="text-muted-foreground mb-4">
              Enable versioning on a model by setting{" "}
              <code>versioned: true</code>:
            </p>
            <CodeBlock
              filename="models/product.ts"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Product = defineModel({
  tableName: "products",
  versioned: true, // Enable version tracking
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 255, required: true },
    price: { type: DataTypes.DECIMAL, required: true },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-4">
              When versioning is enabled, Stabilize automatically creates a
              history table (e.g., <code>products_history</code>) that stores
              all historical versions. Each version includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>All column values at that point in time</li>
              <li>Version number (auto-incremented)</li>
              <li>Operation type (insert, update, delete)</li>
              <li>Valid from/to timestamps</li>
              <li>Modified by and modified at audit fields</li>
            </ul>
            <p className="text-muted-foreground">
              Version history is written automatically on create, update, and
              delete operations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Time Travel Queries</h2>
            <p className="text-muted-foreground mb-4">
              Query the state of a record at a specific point in time using the{" "}
              <code>asOf</code> method. Pass the record ID and a date:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Product);

// Get product as it existed on a specific date
const pastDate = new Date("2025-01-01T00:00:00Z");
const productAsOf = await repo.asOf(product.id, pastDate);

console.log("Name on Jan 1:", productAsOf?.name);
console.log("Price on Jan 1:", productAsOf?.price);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Version History</h2>
            <p className="text-muted-foreground mb-4">
              Retrieve the complete change history for a record using{" "}
              <code>history(id)</code>:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Product);

// Get all versions of a product
const versions = await repo.history(product.id);

console.log(\`Product has \${versions.length} versions\`);

versions.forEach(v => {
  console.log(\`Version \${v.version}:\`);
  console.log(\`  Name: \${v.name}\`);
  console.log(\`  Price: \${v.price}\`);
  console.log(\`  Operation: \${v.operation}\`);
  console.log(\`  Valid from: \${v.valid_from}\`);
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Rollback</h2>
            <p className="text-muted-foreground mb-4">
              Restore a record to a previous version using{" "}
              <code>rollback(id, version)</code>. This creates a new version
              with the old data:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Product);

// Rollback product #1 to version 2
await repo.rollback(product.id, 2);

// The rollback creates a NEW version (version N+1) with version 2's data
const current = await repo.findOne(product.id);
console.log("Current version:", current.version); // Latest version number
console.log("Data restored from version 2");`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Performance Considerations
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                Versioning adds storage overhead as all versions are retained
              </li>
              <li>
                Write operations are slightly slower due to history table
                inserts
              </li>
              <li>
                Consider archiving old versions for long-running applications
              </li>
              <li>
                History queries are indexed on id and version for fast lookups
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
