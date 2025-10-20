import { CodeBlock } from "@/components/code-block"

export default function VersioningPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Versioning & Time Travel</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Track changes to your data over time and query historical states
        </p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              Stabilize ORM provides built-in versioning capabilities that allow you to track every change made to your
              records. This enables powerful features like time-travel queries, audit trails, and rollback
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Enabling Versioning</h2>
            <p className="text-muted-foreground mb-4">
              Enable versioning on a model by setting the <code>versioning</code> option:
            </p>
            <CodeBlock
              filename="models/product.ts"
              code={`import { defineModel, DataTypes } from "stabilize-orm";

export const Product = defineModel({
  tableName: "products",
  versioning: true, // Enable versioning
  columns: {
    id: {
      type: DataTypes.Integer,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.String,
      length: 255,
    },
    price: {
      type: DataTypes.Decimal,
      precision: 10,
      scale: 2,
    },
  },
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-4">
              When versioning is enabled, Stabilize automatically creates a shadow table (e.g.,{" "}
              <code>products_history</code>) that stores all historical versions of your records. Each version includes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>All column values at that point in time</li>
              <li>Version number (auto-incremented)</li>
              <li>Timestamp of when the version was created</li>
              <li>Operation type (INSERT, UPDATE, DELETE)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Time Travel Queries</h2>
            <p className="text-muted-foreground mb-4">
              Query the state of your data at any point in time using the <code>asOf</code> method:
            </p>
            <CodeBlock
              code={`const repo = orm.getRepository(Product);

// Get product state as of a specific date
const product = await repo.asOf(new Date("2025-10-01")).findById(1);

// Get all products as they were yesterday
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const products = await repo.asOf(yesterday).findAll();

// Query with conditions at a specific time
const expensiveProducts = await repo
  .asOf(new Date("2025-10-01"))
  .query()
  .where("price", ">", 100)
  .findAll();`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Version History</h2>
            <p className="text-muted-foreground mb-4">Retrieve the complete history of changes for a record:</p>
            <CodeBlock
              code={`const repo = orm.getRepository(Product);

// Get all versions of a product
const history = await repo.history(1);

// Returns array of versions:
// [
//   { id: 1, name: "Widget", price: 19.99, version: 1, timestamp: "2025-01-01T10:00:00Z" },
//   { id: 1, name: "Widget Pro", price: 24.99, version: 2, timestamp: "2025-02-15T14:30:00Z" },
//   { id: 1, name: "Widget Pro", price: 29.99, version: 3, timestamp: "2025-03-20T09:15:00Z" },
// ]

// Get history with filters
const recentHistory = await repo.history(1, {
  since: new Date("2025-02-01"),
  until: new Date("2025-03-01"),
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Rollback</h2>
            <p className="text-muted-foreground mb-4">Restore a record to a previous version:</p>
            <CodeBlock
              code={`const repo = orm.getRepository(Product);

// Rollback to a specific version
await repo.rollback(1, 2); // Rollback product #1 to version 2

// Rollback to a specific date
await repo.rollback(1, new Date("2025-10-01"));

// Rollback creates a new version with the old data
const product = await repo.findById(1);
console.log(product.version); // Will be the latest version number`}
            />
          </section>

        

          <section>
            <h2 className="text-2xl font-bold mb-4">Performance Considerations</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Versioning adds storage overhead as all versions are retained</li>
              <li>Write operations are slightly slower due to history table inserts</li>
              <li>Consider archiving old versions for long-running applications</li>
              <li>Use indexes on the history table's timestamp column for faster queries</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
