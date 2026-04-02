"use client";

import { CodeBlock } from "@/components/code-block";

export default function RestApiExamplePage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">REST API with Express</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Build a complete REST API with pagination, filtering, optimistic
          locking, and bulk operations
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Setup</h2>
            <p className="text-muted-foreground mb-4">
              Initialize the ORM and Express app:
            </p>
            <CodeBlock
              filename="server.ts"
              language="typescript"
              code={`import express from "express";
import { Stabilize, defineModel, DataTypes, DBType, generateUUID } from "stabilize-orm";

const dbConfig = {
  type: DBType.SQLite,
  connectionString: "./data/api.db",
};

const orm = new Stabilize(dbConfig);
const app = express();
app.use(express.json());`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Paginated List Endpoint
            </h2>
            <p className="text-muted-foreground mb-4">
              List tasks with filtering, search, and pagination:
            </p>
            <CodeBlock
              filename="routes/tasks.ts"
              language="typescript"
              code={`app.get("/api/tasks", async (req, res) => {
  try {
    const { status, priority, assigneeId, page = "1", pageSize = "20", search } = req.query;
    const qb = taskRepo.find();

    if (status) qb.where("status = ?", status);
    if (priority) qb.where("priority = ?", priority);
    if (assigneeId) qb.where("assigneeId = ?", assigneeId);
    if (search) qb.whereLike("title", \`%\${search}%\`);

    qb.orderBy("createdAt", "DESC");

    const data = await qb.paginate(Number(page), Number(pageSize)).execute(orm.client);
    const total = await qb.clone().countExec(orm.client);

    res.json({ data, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Optimistic Locking</h2>
            <p className="text-muted-foreground mb-4">
              Handle concurrent updates with optimistic locking:
            </p>
            <CodeBlock
              filename="routes/tasks-patch.ts"
              language="typescript"
              code={`app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await taskRepo.findOneBy({ id: req.params.id });
    if (!task) return res.status(404).json({ error: "Not found" });

    const version = req.body.version;
    if (version !== undefined) {
      try {
        const updated = await taskRepo.update(req.params.id, {
          ...req.body,
          version: version,
        });
        res.json(updated);
      } catch (err: any) {
        if (err.code === "CONCURRENT_MODIFICATION") {
          return res.status(409).json({ error: "Conflict: record was modified" });
        }
        throw err;
      }
    } else {
      const updated = await taskRepo.update(req.params.id, req.body);
      res.json(updated);
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Bulk Operations</h2>
            <p className="text-muted-foreground mb-4">
              Bulk create and delete endpoints:
            </p>
            <CodeBlock
              filename="routes/tasks-bulk.ts"
              language="typescript"
              code={`app.post("/api/tasks/bulk", async (req, res) => {
  try {
    const tasks = req.body.map((t: any) => ({ id: generateUUID(), ...t }));
    const created = await taskRepo.bulkCreate(tasks);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/tasks/bulk-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    await taskRepo.bulkDelete(ids);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});`}
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Stats & Health Endpoints
            </h2>
            <p className="text-muted-foreground mb-4">
              Aggregate stats and health check endpoints:
            </p>
            <CodeBlock
              filename="routes/stats.ts"
              language="typescript"
              code={`app.get("/api/stats", async (req, res) => {
  try {
    const stats = await taskRepo.aggregate({ count: "*" });
    const byStatus = await taskRepo.rawQuery(
      "SELECT status, COUNT(*) as count FROM tasks WHERE deletedAt IS NULL GROUP BY status"
    );
    res.json({ total: stats.count_all, byStatus });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const health = await orm.healthCheck();
    res.status(health.status === "healthy" ? 200 : 503).json(health);
  } catch (err: any) {
    res.status(503).json({ status: "unhealthy", error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
