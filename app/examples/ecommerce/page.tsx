"use client";

import { CodeBlock } from "@/components/code-block";

export default function EcommerceExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">E-Commerce Store</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build a complete e-commerce backend with products, categories,
          customers, and orders using transactions
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Models</h2>
            <p className="text-muted-foreground mb-4">
              Define the core e-commerce models with relationships:
            </p>
            <CodeBlock
              filename="models/Product.ts"
              language="typescript"
              code={`import { defineModel, DataTypes, RelationType } from "stabilize-orm";

export const Product = defineModel({
  tableName: "products",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 200, required: true },
    slug: { type: DataTypes.STRING, length: 200, required: true, unique: true },
    price: { type: DataTypes.DECIMAL, required: true },
    stock: { type: DataTypes.INTEGER, required: true, defaultValue: 0 },
    categoryId: { type: DataTypes.STRING, required: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    deletedAt: { type: DataTypes.DATETIME, softDelete: true },
    version: { type: DataTypes.INTEGER, optimisticLock: true },
  },
  relations: [
    {
      type: RelationType.ManyToOne,
      target: () => Category,
      property: "category",
      foreignKey: "categoryId",
    },
  ],
  scopes: {
    inStock: (qb) => qb.where("stock > ?", 0),
    active: (qb) => qb.where("isActive = ?", true),
    cheap: (qb, maxPrice: number) => qb.where("price <= ?", maxPrice),
  },
});

export const Category = defineModel({
  tableName: "categories",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 100, required: true, unique: true },
    slug: { type: DataTypes.STRING, length: 100, required: true, unique: true },
  },
  relations: [
    {
      type: RelationType.OneToMany,
      target: () => Product,
      property: "products",
      foreignKey: "categoryId",
    },
  ],
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Transactional Order Creation
            </h2>
            <p className="text-muted-foreground mb-4">
              Create orders with items in a single atomic transaction:
            </p>
            <CodeBlock
              filename="examples/create-order.ts"
              language="typescript"
              code={`const orderResult = await orm.transaction(async (txClient) => {
  const order = await orderRepo.create({
    id: generateUUID(),
    customerId: customer.id,
    status: "pending",
    totalAmount: 0,
  });

  const item1 = await orderItemRepo.create({
    id: generateUUID(),
    orderId: order.id,
    productId: laptop.id,
    quantity: 1,
    unitPrice: laptop.price,
  });

  const item2 = await orderItemRepo.create({
    id: generateUUID(),
    orderId: order.id,
    productId: phone.id,
    quantity: 2,
    unitPrice: phone.price,
  });

  const total = Number(laptop.price) * 1 + Number(phone.price) * 2;
  const updatedOrder = await orderRepo.update(order.id, {
    totalAmount: total,
  });

  return { order: updatedOrder, items: [item1, item2] };
});

console.log("Order total:", orderResult.order.totalAmount);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Product Scopes & Filtering
            </h2>
            <p className="text-muted-foreground mb-4">
              Use scopes and query builder for product filtering:
            </p>
            <CodeBlock
              filename="examples/product-filter.ts"
              language="typescript"
              code={`// In stock + active products, sorted by price
const inStock = await productRepo
  .scope("inStock")
  .scope("active")
  .orderBy("price", "DESC")
  .execute(orm.client);

// Cheap products under a max price
const cheap = await productRepo
  .scope("cheap", 1500)
  .execute(orm.client);

// Search with LIKE
const searchResults = await productRepo
  .find()
  .where("name LIKE ?", "%Mac%")
  .execute(orm.client);

// Complex query builder
const expensiveInStock = await productRepo
  .find()
  .where("price > ?", 1000)
  .where("stock > ?", 0)
  .whereNotNull("categoryId")
  .orderBy("price", "DESC")
  .limit(5)
  .execute(orm.client);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Aggregate Statistics
            </h2>
            <p className="text-muted-foreground mb-4">
              Get product statistics using aggregates:
            </p>
            <CodeBlock
              filename="examples/product-stats.ts"
              language="typescript"
              code={`const productStats = await productRepo.aggregate({
  count: "*",
  avg: ["price"],
  min: ["price"],
  max: ["price"],
  sum: ["stock"],
});
console.log("Stats:", productStats);
// { count_all: 5, avg_price: 1200, min_price: 249, max_price: 2499, sum_stock: 850 }

// Pluck product names
const productNames = await productRepo.pluck("name");
console.log("Names:", productNames);

// Count distinct categories
const distinctCats = await productRepo.countDistinct("categoryId");
console.log("Distinct categories:", distinctCats);`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Bulk Upsert</h2>
            <p className="text-muted-foreground mb-4">
              Upsert multiple products at once:
            </p>
            <CodeBlock
              filename="examples/bulk-upsert.ts"
              language="typescript"
              code={`const bulkProducts = await productRepo.bulkUpsert(
  [
    {
      id: generateUUID(),
      name: "iPad Air",
      slug: "ipad-air",
      price: 599.99,
      stock: 100,
      categoryId: electronicsId,
    },
    {
      id: generateUUID(),
      name: "AirPods Pro",
      slug: "airpods-pro",
      price: 249.99,
      stock: 500,
      categoryId: electronicsId,
    },
  ],
  ["slug"], // unique key for upsert matching
);
console.log("Upserted:", bulkProducts.length, "products");`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
