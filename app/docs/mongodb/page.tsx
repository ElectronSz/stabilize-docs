import { CodeBlock } from "@/components/code-block";

export default function MongoDBPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">MongoDB</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <code>DBType.MongoDB</code> runs the same models and repositories
        against a document store. Relations, hooks, versioning, caching,
        encryption and migrations behave as they do on the SQL backends, and
        clauses MongoDB cannot answer are refused rather than approximated.
        Start with the server: MongoDB supports transactions only on a replica
        set, and every repository write uses one.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Install the Driver</h2>
          <p className="text-muted-foreground mb-4">
            The <code>mongodb</code> package is an optional dependency of the
            ORM, so it is installed alongside rather than delivered by it.
          </p>
          <CodeBlock language="bash" filename="terminal" code={`bun add mongodb`} />
          <p className="text-muted-foreground mt-4">
            Nothing fails at import time while it is absent. The driver is
            loaded on the first MongoDB statement, and a missing one throws{" "}
            <code>MONGO_DRIVER_MISSING</code> there.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
          <p className="text-muted-foreground mb-4">
            Set <code>type</code> to <code>DBType.MongoDB</code> and supply a
            standard MongoDB connection string.
          </p>
          <CodeBlock
            filename="config/database.ts"
            language="typescript"
            code={`import { DBType, type DBConfig } from "stabilize-orm";

const dbConfig: DBConfig = {
  type: DBType.MongoDB,
  // Both query parameters on this string are load-bearing. See below.
  connectionString:
    "mongodb://127.0.0.1:27017/mydb?directConnection=true&replicaSet=rs0",
  retryAttempts: 3,
  retryDelay: 1000,
};

export default dbConfig;`}
          />
          <p className="text-muted-foreground mt-4">
            <code>mongoOptions</code> passes driver settings to{" "}
            <code>MongoClient</code> unchanged. Keys are the driver&apos;s own
            option names; the ORM does not rename, filter or validate them.
          </p>
          <CodeBlock
            filename="config/database.ts"
            language="typescript"
            code={`const dbConfig: DBConfig = {
  type: DBType.MongoDB,
  connectionString:
    "mongodb://127.0.0.1:27017/mydb?directConnection=true&replicaSet=rs0",
  mongoOptions: {
    tls: true,
    authSource: "admin",
    maxPoolSize: 20,
  },
};`}
          />
          <p className="text-muted-foreground mt-4">
            <code>database</code> selects the database when the connection
            string has no path. When the string has one, that path is used and{" "}
            <code>database</code> is ignored.
          </p>
          <p className="text-muted-foreground mt-4">
            The connection opens on the first statement rather than in the{" "}
            <code>DBClient</code> constructor, so an unreachable server surfaces
            on your first query. Concurrent first queries share a single
            connection attempt.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Replica Set Requirement
          </h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              A standalone <code>mongod</code> can read but not write
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Transactions require a replica set or a sharded cluster, and every
              repository write runs inside one. On a standalone server every
              write therefore fails, not only code that opened a transaction by
              hand. The connection succeeds and reads answer normally, which is
              what makes this easy to misread as a query problem. The client
              logs a warning at connect time, and the write itself fails with{" "}
              <code>TX_ERROR</code>.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Against a standalone mongod, with no replica set:
await userRepo.create({ email: "ada@example.com" });

// StabilizeError (TX_ERROR): MongoDB transactions require a replica set or
// sharded cluster, and this server is a standalone. Every write goes through
// a transaction, so start the server with --replSet and run rs.initiate()
// (or point the connection at an existing replica set).`}
            />
          </div>
          <p className="text-muted-foreground mb-4">
            For local development a single node is enough. Start it as a replica
            set and initiate it once:
          </p>
          <CodeBlock
            filename="terminal"
            language="bash"
            code={`# Start a single node that calls itself a replica set:
mongod --replSet rs0 --dbpath ./data/db --bind_ip_all

# Then, once, against that server:
mongosh --eval 'rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] })'`}
          />
          <p className="text-muted-foreground mt-4">
            The connection string must then carry{" "}
            <code>directConnection=true</code>. <code>rs.initiate</code> records
            the member by the address you give it, which inside a container is
            the <em>container&apos;s</em> host and port rather than the one your
            process dialled. A driver performing topology discovery reads that
            address out of the set configuration and reconnects to it, and from
            the host there is nothing listening there.{" "}
            <code>directConnection=true</code> keeps the driver on the
            connection it already has and skips discovery.
          </p>
          <CodeBlock
            filename="config/database.ts"
            language="typescript"
            code={`const dbConfig: DBConfig = {
  type: DBType.MongoDB,
  // replicaSet names the set; directConnection skips topology discovery, which
  // would otherwise be handed the member's container address and fail.
  connectionString:
    "mongodb://127.0.0.1:27017/mydb?directConnection=true&replicaSet=rs0",
};`}
          />
          <p className="text-muted-foreground mt-4">
            Reads work on a standalone, so the connection is not refused. A
            read-only deployment against a standalone server is valid.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground mb-4">
            A MongoDB transaction is a session. The ORM opens one on the client
            and attaches it to every statement made through the transaction
            client, which keeps the parent <code>MongoClient</code> and adds the
            session. The callback is the same as on any other backend.
          </p>
          <CodeBlock
            filename="transaction.ts"
            language="typescript"
            code={`await orm.transaction(async (txClient) => {
  const userRepo = orm.getRepository(User);
  const profileRepo = orm.getRepository(Profile);

  const user = await userRepo.create({ email: "ada@example.com" }, {}, txClient);
  await profileRepo.create({ userId: user.id }, {}, txClient);
});`}
          />
          <p className="text-muted-foreground mt-4">
            Pass <code>txClient</code> to every call inside the callback. A call
            that uses the ORM client instead takes a different session and runs
            outside the transaction.
          </p>
          <p className="text-muted-foreground mt-4">
            The driver&apos;s <code>withTransaction</code> handles commit and
            rollback under <code>readConcern: snapshot</code> and{" "}
            <code>writeConcern: majority</code>, and ends the session whether
            the transaction committed or rolled back. It also replays the
            callback when the server reports a transient error, which is how two
            concurrent creates allocating ids from the same counter document
            both succeed. The callback is therefore not guaranteed to run
            exactly once, so an <code>after*</code> hook that sends an email,
            publishes to a queue or calls a webhook can fire twice. Make those
            idempotent, or move them outside the transaction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What Works Unchanged</h2>
          <p className="text-muted-foreground mb-4">
            These use the same methods, the same options and the same return
            values as the SQL backends.
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              The whole <code>Repository</code> API — <code>create</code>,{" "}
              <code>find</code>, <code>update</code>, <code>delete</code>,{" "}
              <code>findMany</code>, <code>paginate</code> and the rest.
            </li>
            <li>
              All four relation kinds, including many-to-many link management
              through <code>attach</code>, <code>detach</code> and{" "}
              <code>sync</code>.
            </li>
            <li>
              Versioning and time travel — <code>asOf</code>,{" "}
              <code>history</code> and <code>rollback</code>, against a history
              collection the migration creates alongside the model.
            </li>
            <li>
              Optimistic locking, soft delete and <code>recover</code>, and
              query scopes.
            </li>
            <li>
              Every lifecycle hook, and validation — the same rules, promoted to
              server-enforced <code>$jsonSchema</code> validators as well.
            </li>
            <li>
              Caching, both cache-aside and write-through, over the same cache
              configuration.
            </li>
            <li>
              AES-GCM column encryption for <code>encrypted: true</code>{" "}
              columns, decoded on read exactly as on the SQL backends.
            </li>
            <li>
              Aggregates — <code>count</code>, <code>sum</code>, <code>avg</code>
              , <code>min</code>, <code>max</code> and{" "}
              <code>countDistinct</code>.
            </li>
            <li>
              Cursor pagination through <code>findMany</code>, which renders as a{" "}
              <code>$gt</code> / <code>$lt</code> filter rather than an offset.
            </li>
            <li>
              <code>bulkCreate</code> and <code>bulkUpsert</code>,{" "}
              <code>firstOrCreate</code> and <code>updateOrCreate</code>, and{" "}
              <code>increment</code> / <code>decrement</code>.
            </li>
            <li>Transactions, subject to the replica set above.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Unsupported Query Clauses
          </h2>
          <p className="text-muted-foreground mb-4">
            MongoDB has no joins and no SQL text, and none of it is emulated. A
            clause with no equivalent is recorded when you write it and the
            query throws when it executes, naming every offending method at
            once. Twenty-two query-builder methods are refused this way, along
            with the client&apos;s <code>rawQuery</code> and <code>rawExec</code>
            :
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">Method</th>
                  <th className="text-left py-2 font-semibold">
                    Replacement
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  [
                    "rawQuery, rawExec",
                    "There is no statement to send. Use the repository API, or the client's mongoFind / mongoUpdateOne / mongoCommand methods, which take documents rather than SQL.",
                  ],
                  [
                    "join, innerJoin, leftJoin, rightJoin, fullJoin, crossJoin",
                    "withRelations(), which loads related documents with batched reads instead of a join.",
                  ],
                  [
                    "union, unionAll",
                    "Two queries, or a single $or filter.",
                  ],
                  [
                    "with, withRecursive",
                    "Nothing — MongoDB has no common table expressions.",
                  ],
                  [
                    "whereRaw, whereNot, whereRef",
                    "The structured condition methods — whereEq, whereCompare, whereIn, whereLike — or updateBy() and deleteBy() for a bulk write.",
                  ],
                  [
                    "where, orWhere",
                    "The same structured condition methods. Both take raw SQL text, and none of it is parsed.",
                  ],
                  [
                    "whereExists, whereNotExists",
                    "withRelations(), or a second query.",
                  ],
                  [
                    "selectRaw, orderByRaw, groupByRaw, having",
                    "select(), orderBy() and the aggregate helpers.",
                  ],
                  [
                    "distinct",
                    "countDistinct() for a count. There is no DISTINCT over a projection.",
                  ],
                ].map(([method, replacement]) => (
                  <tr key={method} className="border-b border-accent/10">
                    <td className="py-2 pr-4">
                      <code>{method}</code>
                    </td>
                    <td className="py-2">{replacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CodeBlock
            filename="blocked-query.ts"
            language="typescript"
            code={`await userRepo
  .find()
  .innerJoin("posts", "posts.user_id = users.id")
  .whereRaw("LOWER(name) = 'ada'")
  .execute(orm.client);

// StabilizeError (MONGO_UNSUPPORTED): This query cannot be translated to
// MongoDB: innerJoin, whereRaw have no MongoDB equivalent. MongoDB is a
// document store — it has no joins, no set operations and no SQL text. Use
// withRelations() for related documents, or run this query against a SQL backend.
//   innerJoin: INNER JOIN posts ON posts.user_id = users.id
//   whereRaw: LOWER(name) = 'ada'`}
          />
          <p className="text-muted-foreground mt-4">
            The message quotes the fragment that could not be translated, under
            the method that produced it, so a blocked query reports the join
            condition and the raw SQL rather than method names alone.
          </p>
          <p className="text-muted-foreground mt-4">
            The error is raised at execution rather than at the call. The builder
            stays dialect-agnostic until a client is supplied, which is what lets
            one builder render for both a SQL backend and MongoDB.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Locking</h2>
          <p className="text-muted-foreground mb-4">
            MongoDB has no <code>SELECT … FOR UPDATE</code> and nothing that
            stands in for it: a document read cannot be held against a
            concurrent writer. <code>lock()</code> and <code>forUpdate()</code>{" "}
            are skipped and the query still answers correctly, matching how the
            SQL Server path already treats an untranslatable{" "}
            <code>FOR UPDATE</code>.
          </p>
          <p className="text-muted-foreground mb-4">
            A locked read and an unlocked read are indistinguishable, so a
            read-modify-write built on <code>lockForUpdate()</code> produces a
            lost update with nothing to observe.{" "}
            <code>Repository.lockForUpdate()</code> logs a warning for that
            reason.
          </p>
          <CodeBlock
            language="typescript"
            code={`const user = await userRepo.lockForUpdate(1);

// log warn: lockForUpdate on users takes no lock on MongoDB: use a transaction
// or an atomic update for read-modify-write`}
          />
          <p className="text-muted-foreground mt-4">
            A <code>lock()</code> called on the builder by hand and passed
            straight to <code>execute()</code> is skipped without a warning; the
            builder holds no logger.
          </p>
          <p className="text-muted-foreground mt-4">
            For a read-modify-write that has to be safe, use a transaction or an
            atomic update — <code>increment()</code> with a condition, or an
            optimistic-locking column.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Behaviour Differences
          </h2>
          <p className="text-muted-foreground mb-4">
            These do not throw. They behave differently, and the difference shows
            up in the data rather than in an error.
          </p>
          <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
            <li>
              <strong>
                <code>DECIMAL</code> is stored as a <code>double</code>.
              </strong>{" "}
              MongoDB has no exact decimal unless the caller supplies a{" "}
              <code>Decimal128</code>, so a <code>DECIMAL</code> column loses
              precision the way any binary float does. Store money as an{" "}
              <code>INTEGER</code> or <code>BIGINT</code> in the smallest unit,
              or as a <code>STRING</code>.
            </li>
            <li>
              <strong>
                Auto-increment ids come from a counter that rolls back.
              </strong>{" "}
              Ids are reserved with a <code>$inc</code> against a{" "}
              <code>stabilize_counters</code> collection keyed by collection
              name, inside the same transaction as the write. An aborted
              transaction returns its ids and the next insert reuses them. MySQL
              behaves the other way round: InnoDB&apos;s auto-increment counter
              is not transactional, so an aborted insert leaks the gap. Code
              that assumes an id is never issued twice has to account for this.
            </li>
            <li>
              <strong>
                <code>$inc</code> initialises an absent field.
              </strong>{" "}
              <code>increment()</code> is emitted as <code>$inc</code>, so it
              runs server-side and is as safe under concurrency as SQL&apos;s{" "}
              <code>col = col + ?</code>. Applied to a field that does not exist
              it writes the increment, where SQL computes <code>NULL + n</code>{" "}
              and leaves the column <code>NULL</code>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Type Mapping</h2>
          <p className="text-muted-foreground mb-4">
            There is no SQL type to map onto, so each <code>DataTypes</code>{" "}
            member becomes the list of BSON types the collection&apos;s validator
            accepts. Several members accept more than one: a JavaScript integer
            arrives as an <code>int</code> inside 32-bit range and a{" "}
            <code>double</code> beyond it, so accepting only <code>int</code>{" "}
            would reject every id past two billion.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">
                    DataTypes
                  </th>
                  <th className="text-left py-2 font-semibold">
                    BSON types
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["STRING", "string"],
                  ["TEXT", "string"],
                  ["INTEGER", "int | long | double"],
                  ["BIGINT", "int | long | double"],
                  ["FLOAT", "double | int | long | decimal"],
                  ["DOUBLE", "double | int | long | decimal"],
                  ["DECIMAL", "double | int | long | decimal"],
                  ["BOOLEAN", "bool"],
                  ["DATE", "date | string"],
                  ["DATETIME", "date | string"],
                  ["JSON", "object | array | string"],
                  ["UUID", "string"],
                  ["BLOB", "binData | string"],
                ].map(([dt, bson]) => (
                  <tr key={dt} className="border-b border-accent/10">
                    <td className="py-2 pr-4">
                      <code>DataTypes.{dt}</code>
                    </td>
                    <td className="py-2">
                      <code>{bson}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            An unrecognised type falls back to <code>string</code> rather than
            failing, as it falls back on every other backend, and an{" "}
            <code>encrypted: true</code> column is always a <code>string</code>{" "}
            whatever it was declared as, because the ciphertext is what is
            stored.
          </p>
          <p className="text-muted-foreground mt-4">
            The column named <code>id</code> is stored as the document&apos;s{" "}
            <code>_id</code>. An integer <code>id</code> is generated by the
            counters collection described above; a <code>STRING</code> or{" "}
            <code>UUID</code> <code>id</code> is supplied by the caller and stays
            required.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Collections, Validators and Indexes
          </h2>
          <p className="text-muted-foreground mb-4">
            A migration against MongoDB creates collections, indexes and{" "}
            <code>$jsonSchema</code> validators. The generated <code>up</code> is
            a <code>createCollection</code> carrying the validator, followed by
            the collection&apos;s <code>createIndex</code> steps; the{" "}
            <code>down</code> is a <code>dropCollection</code>, since the indexes
            and the validator go with it. Migrations are recorded in a{" "}
            <code>stabilize_migrations</code> collection, where the
            migration&apos;s name is the <code>_id</code>.
          </p>
          <p className="text-muted-foreground mb-4">
            Adding a column is therefore a validator and index change only. A
            document either carries a field or it does not, so there is nothing
            to backfill: a new optional column widens the validator, and every
            existing document already satisfies it.
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold mb-2">
              Two rules the generated schema always follows
            </p>
            <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
              <li>
                <strong>
                  <code>validationLevel</code> is{" "}
                  <code>&quot;moderate&quot;</code>, never{" "}
                  <code>&quot;strict&quot;</code>.
                </strong>{" "}
                Under <code>strict</code>, an update to a document that lacks a
                newly declared required field is rejected, so{" "}
                <code>update()</code> would fail on exactly the documents the
                migration declared the field for. <code>moderate</code> applies
                the validator only where it already holds.
              </li>
              <li>
                <strong>
                  Every unique index is <code>sparse: true</code>.
                </strong>{" "}
                MongoDB treats two documents that both <em>lack</em> a field as
                both <code>null</code> and collides them, where SQL treats two
                NULLs as distinct. Without <code>sparse</code>,{" "}
                <code>email: {`{ unique: true }`}</code> would reject the second
                document that simply omits <code>email</code>, where the same
                model on any SQL backend accepts it.
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground mt-4">
            <code>createIndex</code> is idempotent in MongoDB: asking for an
            index that already exists with the same spec and options is a no-op,
            so a second <code>autoMigrate</code> run is safe. Asking for the same
            index <em>name</em> with different options raises{" "}
            <code>IndexOptionsConflict</code>, which needs a drop first. An
            existing collection is not re-validated either: changing a validator
            is what <code>collMod</code> does, and applying that on every{" "}
            <code>autoMigrate</code> would replace a validator a DBA had
            tightened by hand.
          </p>
          <p className="text-muted-foreground mt-4">
            Migration steps are <strong>not</strong> wrapped in a transaction.{" "}
            <code>createIndex</code> is not permitted inside one, and DDL is not
            transactional in MongoDB at all, so a transaction would either fail
            on the first index or imply an atomicity that is not there. A
            migration that fails halfway leaves a partially migrated collection
            and no ledger entry, so re-running it applies it again from the
            start. MySQL&apos;s auto-committing DDL behaves the same way.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
          <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
            <li>
              <strong>No raw SQL.</strong> <code>rawQuery</code>,{" "}
              <code>rawExec</code> and every clause that carries SQL text throw{" "}
              <code>MONGO_UNSUPPORTED</code>; see{" "}
              <em>Unsupported Query Clauses</em> above for the replacements. The
              escape hatch is at the driver level: the client exposes the
              commands the ORM does not model — <code>mongoFind</code>,{" "}
              <code>mongoUpdateOne</code>, <code>mongoAggregate</code>,{" "}
              <code>mongoCommand</code> and the rest — which take and return
              documents directly.
            </li>
            <li>
              <strong>
                <code>lockForUpdate()</code> returns the document without
                protecting it.
              </strong>{" "}
              It warns rather than throwing, because the query itself is
              answerable.
            </li>
            <li>
              <strong>No savepoints.</strong> Nested <code>transaction()</code>{" "}
              calls reuse the outer transaction on every backend, so an inner
              failure rolls back the whole thing.
            </li>
            <li>
              <strong>
                <code>poolStats()</code> is SQL Server only.
              </strong>{" "}
              It reads <code>size</code>, <code>borrowed</code> and{" "}
              <code>available</code> off the <code>mssql</code> pool. For any
              other driver it returns{" "}
              <code>{`{ active: -1, idle: -1, total: -1 }`}</code>, MongoDB
              included.
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            <code>whereILike</code> is not among the limitations. It emits{" "}
            <code>ILIKE</code> on the other backends, which only Postgres
            understands, so the same call does nothing useful on MySQL, SQLite or
            SQL Server. MongoDB has a case-insensitive regular expression, so it
            renders as{" "}
            <code>{`{ name: { $regex: pattern, $options: "is" } }`}</code> and
            answers. Postgres and MongoDB are the two backends where this call
            does something. The <code>s</code> alongside the <code>i</code> is
            the dotall flag, since SQL&apos;s <code>%</code> has to match a
            newline the way <code>.*</code> otherwise would not.
          </p>
        </section>
      </div>
    </div>
  );
}
