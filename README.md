# Stabilize ORM

**Modern TypeScript ORM for Postgres, MySQL & SQLite**

[![NPM Version](https://img.shields.io/npm/v/stabilize-orm.svg)](https://npmjs.com/package/stabilize-orm)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/ElectronSz/stabilize.svg?style=social)](https://github.com/ElectronSz/stabilize)
[![Twitter](https://img.shields.io/twitter/follow/th3b0tk1ll3r?style=social)](https://twitter.com/th3b0tk1ll3r)

> **Stabilize ORM** is a next-generation, type-safe, and feature-rich ORM for modern Node.js and Bun applications. It provides a unified API for PostgreSQL, MySQL, and SQLite, offering powerful features like versioning, time-travel queries, advanced relationships, transactions, caching, lifecycle hooks, and a beautiful CLI—all designed for developer productivity and performance.

---

## Features

- ⚡ **Unified API**: Write code once, run on any supported database.
- 🗃️ **Type-Safe Models**: Define models programmatically with the `DataTypes` enum.
- 🔥 **Query Builder**: Chainable, fluent API for complex queries.
- 🔄 **Advanced Relationships**: OneToOne, OneToMany, ManyToOne, ManyToMany.
- ⏳ **Versioning & Time-Travel**: Automatic history tracking, rollbacks, snapshot queries.
- 🛡️ **Transactional Integrity**: Built-in atomic transactions with rollback.
- 🕊️ **Soft Deletes**: Transparent deleted flags.
- 🚀 **Caching**: Built-in cache layer for blazing performance.
- 🤖 **CLI**: Generate models, run migrations, seed/reset your database.
- 🧩 **Lifecycle Hooks**: Custom logic before/after create, update, delete, save.
- 🔐 **Query Scopes**: Reusable filters and conditions.
- 🌍 **Made in Eswatini** with ❤️ by [ElectronSz](https://github.com/ElectronSz)

---

## Installation

```bash
bun add stabilize-orm
# or
npm install stabilize-orm
```

---

## Quick Start

### 1. Define a Model

```typescript
import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  columns: {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, length: 100, required: true, unique: true },
    name: { type: DataTypes.STRING, length: 255, required: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
});
```

### 2. Configure & Initialize

```typescript
import { Stabilize, DBType } from "stabilize-orm";

const orm = new Stabilize({
  type: DBType.Postgres,
  connectionString: process.env.DATABASE_URL!,
});
```

### 3. CRUD Example

```typescript
const userRepository = orm.getRepository(User);

// Create
const user = await userRepository.create({
  email: "lwazicd@icloud.com",
  name: "Lwazi Dlamini",
  isActive: true,
});

// Read
const allUsers = await userRepository.find().where("isActive = ?", true).execute();

// Update
await userRepository.update(user.id, { name: "Lwazi Smith" });

// Delete
await userRepository.delete(user.id);
```

---

## CLI Usage

Generate models, migrations, seeds, and manage your database with:

```bash
bunx stabilize-cli generate model User name:string email:string
bunx stabilize-cli generate migration User
bunx stabilize-cli migrate
bunx stabilize-cli seed
bunx stabilize-cli db:drop
bunx stabilize-cli status
```

See [CLI Documentation](./docs/cli.md) for all commands.

---

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Model Definition](./docs/model.md)
- [Query Builder](./docs/query-builder.md)
- [Relationships](./docs/relationships.md)
- [Versioning & Time-Travel](./docs/versioning.md)
- [Data Types](./docs/data-types.md)
- [CLI Reference](./docs/cli.md)
- [Examples](./docs/examples.md)
- [API Reference](./docs/api.md)

---

## Contributing

We welcome issues, PRs, and suggestions! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT © [ElectronSz](https://github.com/ElectronSz)