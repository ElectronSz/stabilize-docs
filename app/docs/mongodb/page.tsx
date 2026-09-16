import { CodeBlock } from "@/components/code-block";

export default function MongoDBPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">MongoDB</h1>
      <p className="text-lg text-muted-foreground mb-8">
        <code>DBType.MongoDB</code> is the fifth backend and the first that is
        not a SQL dialect. The models, repositories, relations and hooks are the
        same ones the other four backends use, and the whole{" "}
        <code>Repository</code> API is available through them — but MongoDB is a
        document store, and the boundary is real. The query-builder clauses with
        no document equivalent throw rather than return something narrower than
        what was asked for, so it is worth reading{" "}
        <em>What MongoDB Cannot Do</em> before porting a SQL application across.
        The first thing to get right is the server rather than the code: MongoDB
        supports transactions only on a replica set, and every repository write
        goes through one.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Connecting</h2>
          <p className="text-muted-foreground mb-4">
            Set <code>type</code> to <code>DBType.MongoDB</code> and supply a
            standard MongoDB connection string. The driver is the difference
            from the other four: <code>pg</code>, <code>mysql2</code>,{" "}
            <code>mssql</code> and <code>bun:sqlite</code> are dependencies of
            the ORM, while <code>mongodb</code> is an{" "}
            <strong>optional</strong> one, so it is installed alongside the ORM
            rather than delivered by it.
          </p>
          <CodeBlock language="bash" filename="terminal" code={`bun add mongodb`} />
          <p className="text-muted-foreground mt-4">
            Nothing fails at import time when it is absent — the driver is
            loaded with a dynamic <code>import()</code> the first time a MongoDB
            client is used, and a missing one surfaces there as{" "}
            <code>MONGO_DRIVER_MISSING</code>.
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
            <code>mongoOptions</code> is the escape hatch for driver settings
            the ORM has no opinion about. What you put here is handed{" "}
            <strong>verbatim</strong> to the driver&apos;s{" "}
            <code>MongoClient</code> — it is not modelled, filtered or validated
            on the way through — so the driver&apos;s own option names apply.
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
            <code>database</code> is accepted as a config field of its own, for
            a URI with no path. When the connection string has one — as the
            string above does — that path wins and <code>database</code> is
            ignored.
          </p>
          <p className="text-muted-foreground mt-4">
            As on SQL Server, the connection is not opened in the{" "}
            <code>DBClient</code> constructor: the driver is imported and{" "}
            <code>connect()</code> awaited on the first statement, and
            concurrent first queries share that one attempt. A bad connection
            string therefore surfaces on the first query rather than at
            construction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Transactions Need a Replica Set
          </h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              A standalone <code>mongod</code> cannot write
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              MongoDB supports transactions only on a replica set or a sharded
              cluster. <code>create()</code> always wraps its write in a
              transaction, so against a standalone server{" "}
              <strong>every write fails</strong> — not only code that opened a
              transaction by hand. This is easy to misdiagnose, because the
              connection succeeds and every read answers; it is the writes, and
              only the writes, that break. The client warns once at connect time
              and the failure itself is reported as a <code>TX_ERROR</code> that
              names the cause.
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
            For local development a single node is a replica set as far as the
            server and the driver are concerned, so the fix is a command-line
            flag and a one-off initiation rather than a second server.
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
            The connection string then has to carry{" "}
            <code>directConnection=true</code>, and that parameter is
            load-bearing rather than a convenience. <code>rs.initiate</code>{" "}
            records the member by the address you handed it, which inside a
            container is the <em>container&apos;s</em> address and port rather
            than the one your process dialled. A driver performing topology
            discovery reads that address out of the set configuration and
            reconnects to it, and from the host there is nothing listening
            there. <code>directConnection=true</code> tells the driver to stay
            on the connection it already has and skip discovery entirely.
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
            Reads work fine on a standalone, which is why the warning is
            deliberately not fatal: a read-only use of the ORM against a
            standalone server is legitimate, and refusing to connect would break
            it. Anything that writes needs the replica set.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What Works at Parity</h2>
          <p className="text-muted-foreground mb-4">
            The <code>Repository</code> is one class with a MongoDB branch
            inside it rather than a second implementation of the API, so the
            features below behave as they do on the SQL backends — same method
            names, same options, same return shapes:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              The whole <code>Repository</code> API —{" "}
              <code>create</code>, <code>find</code>, <code>update</code>,{" "}
              <code>delete</code>, <code>findMany</code>, <code>paginate</code>{" "}
              and the rest.
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
              Aggregates — <code>count</code>, <code>sum</code>,{" "}
              <code>avg</code>, <code>min</code>, <code>max</code> and{" "}
              <code>countDistinct</code>.
            </li>
            <li>
              Cursor pagination through <code>findMany({`{ cursor }`})</code>,
              which renders as a <code>$gt</code> / <code>$lt</code> filter
              rather than an offset.
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
            What MongoDB Cannot Do
          </h2>
          <p className="text-muted-foreground mb-4">
            A document store has no joins, no set operations and no SQL text.
            None of that is emulated, and nothing is quietly widened either —
            the clause is recorded when you write it and the query throws when
            it executes, naming every offending method at once. Twenty-two
            query-builder methods are refused this way, and the client&apos;s{" "}
            <code>rawQuery</code> and <code>rawExec</code> are refused with the
            same code:
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
                    "There is no statement to send. Use the repository API, or the client's own mongoFind / mongoUpdateOne / mongoCommand methods, which take documents rather than SQL.",
                  ],
                  [
                    "join, innerJoin, leftJoin, rightJoin, fullJoin, crossJoin",
                    "withRelations(), which loads related documents with batched reads rather than one statement.",
                  ],
                  [
                    "union, unionAll",
                    "Two queries, or a single $or filter.",
                  ],
                  [
                    "with, withRecursive",
                    "Nothing — there are no common table expressions to render.",
                  ],
                  [
                    "whereRaw, whereNot, whereRef",
                    "The structured condition methods — whereEq, whereCompare, whereIn, whereLike — or updateBy() and deleteBy() for a bulk write.",
                  ],
                  [
                    "where, orWhere",
                    "The same structured condition methods. Both take raw SQL text, and there is no parser here that could be trusted with it.",
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
            The message quotes the fragment that could not be translated under
            the method that produced it, so a blocked query reports the join
            condition and the raw text rather than only the method names. The
            error is raised at execution rather than at the call, because the
            builder is dialect-agnostic right up until a client appears — which
            is what lets one builder render for both a SQL backend and MongoDB.
          </p>
          <p className="text-muted-foreground mt-4">
            For a join the replacement is <code>withRelations()</code>. For a
            raw <code>WHERE</code> it is the structured condition methods, or{" "}
            <code>updateBy()</code> / <code>deleteBy()</code> when the point was
            a bulk write rather than a read.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            <code>lock()</code> and <code>forUpdate()</code> Take No Lock
          </h2>
          <p className="text-muted-foreground mb-4">
            MongoDB has no <code>SELECT … FOR UPDATE</code> and nothing that
            stands in for it: a document read cannot be held against a
            concurrent writer. The clause is simply not rendered and the query
            answers correctly, so unlike the clauses above this is not an error
            — refusing the query would refuse one that has a perfectly good
            answer, and the SQL Server path already walks past an untranslatable{" "}
            <code>FOR UPDATE</code> in the same way.
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              The result is indistinguishable from a locked read
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              That is what makes this dangerous rather than merely absent. A
              caller doing read-modify-write on the strength of{" "}
              <code>lockForUpdate()</code> has a lost update with nothing to
              notice: the read returns, nothing throws, and the other
              writer&apos;s change is gone. So{" "}
              <code>Repository.lockForUpdate()</code> warns on its own behalf,
              because it is the path that added the clause for a caller who
              asked for a lock by name.
            </p>
            <CodeBlock
              language="typescript"
              code={`const user = await userRepo.lockForUpdate(1);

// log warn: lockForUpdate on users takes no lock on MongoDB: use a transaction
// or an atomic update for read-modify-write`}
            />
            <p className="text-sm text-muted-foreground mt-3">
              A <code>lock()</code> called on the query builder by hand and
              handed straight to <code>execute()</code> is still walked past in
              silence. The builder holds no logger, and it is dialect-agnostic
              right up until it executes — by which point there is nobody left
              to warn.
            </p>
          </div>
          <p className="text-muted-foreground">
            Use a transaction, or an atomic update — <code>increment()</code>{" "}
            with a condition, or an optimistic-locking column — for a
            read-modify-write that has to be safe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Other Documented Divergences
          </h2>
          <p className="text-muted-foreground mb-4">
            These behave differently from the SQL backends rather than failing,
            so each one is a difference you have to know about rather than an
            error you will be told about:
          </p>
          <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
            <li>
              <strong>
                <code>DECIMAL</code> is stored as a <code>double</code>.
              </strong>{" "}
              MongoDB has no exact decimal unless the caller supplies a{" "}
              <code>Decimal128</code>, so a <code>DECIMAL</code> column loses
              precision the way any binary float does. For money, store the
              smallest unit as an <code>INTEGER</code>/<code>BIGINT</code>, or
              the value as a <code>STRING</code>.
            </li>
            <li>
              <strong>Auto-increment ids come from a counter, and the counter
              rolls back.</strong>{" "}
              Ids are reserved by a <code>$inc</code> against a{" "}
              <code>stabilize_counters</code> collection keyed by collection
              name, rather than by the server, and that reservation runs inside
              the same transaction as the write. An aborted transaction
              therefore gives its ids back and the next insert re-uses them.
              MySQL is the opposite — InnoDB&apos;s auto-increment counter is
              not transactional, so an aborted insert leaks the gap. Handing the
              ids back is arguably the better behaviour, but it is a difference,
              and code that assumed an id is never issued twice has to know.
            </li>
            <li>
              <strong>
                <code>$inc</code> against a field that does not exist
                initialises it.
              </strong>{" "}
              <code>increment()</code> is emitted as <code>$inc</code>, which is
              server-side and so as safe under concurrency as SQL&apos;s{" "}
              <code>col = col + ?</code>. Applied to an <em>absent</em> field it
              writes the increment, where SQL computes <code>NULL + n</code> and
              leaves the column <code>NULL</code>. On SQL the caller gets a null
              back; here it gets the amount.
            </li>
            <li>
              <strong>The transaction callback can run more than once.</strong>{" "}
              The transaction is driven by the driver&apos;s{" "}
              <code>withTransaction</code>, which replays the callback when the
              server reports a transient error — that is what lets two
              concurrent creates allocating ids from the same counter document
              both succeed. The cost is that the callback is not guaranteed to
              run exactly once, so an <code>after*</code> hook with an external
              side effect — an email, a queue publish, a webhook — can fire
              twice. Make those idempotent, or move them outside the
              transaction.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Type Mapping</h2>
          <p className="text-muted-foreground mb-4">
            There is no SQL type to map onto, so each <code>DataTypes</code>{" "}
            member becomes the list of BSON types the collection&apos;s
            validator accepts. Several members accept more than one, which is
            deliberate: a JavaScript integer arrives as an <code>int</code>{" "}
            inside 32-bit range and a <code>double</code> beyond it, so
            accepting only <code>int</code> would reject every id past two
            billion.
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
            <code>encrypted: true</code> column is always a{" "}
            <code>string</code> whatever it was declared as, because the
            ciphertext is what is stored.
          </p>
          <p className="text-muted-foreground mt-4">
            The column named <code>id</code> is special here too, and differently
            from the SQL backends: it is stored as the document&apos;s{" "}
            <code>_id</code>. An integer <code>id</code> is generated by the
            counters collection described above; a <code>STRING</code> or{" "}
            <code>UUID</code> <code>id</code> is supplied by the caller and stays
            required.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <p className="text-muted-foreground mb-4">
            A MongoDB transaction is a session rather than a text command: the
            ORM opens one on the client, and every statement inside it is sent
            with that session attached. The transaction-bound client keeps the
            parent&apos;s <code>MongoClient</code> and adds the session, because
            a mongo command carries a session rather than being sent down a
            different connection. The callback looks the same as on every other
            backend.
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
            The driver&apos;s <code>withTransaction</code> drives the commit and
            the rollback rather than an explicit start/commit pair, and it runs
            under <code>readConcern: snapshot</code> and{" "}
            <code>writeConcern: majority</code>. The session is a server-side
            resource, so it is ended for you whether the transaction committed
            or rolled back — and, as above, the callback may be replayed.
          </p>
          <p className="text-muted-foreground mt-4">
            Pass the <code>txClient</code> to every call inside the callback. A
            repository call that falls back to the ORM client takes a different
            session and runs outside the transaction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Collections, Validators and Indexes
          </h2>
          <p className="text-muted-foreground mb-4">
            A migration against MongoDB creates collections, indexes and{" "}
            <code>$jsonSchema</code> validators. It is add-only: the generated{" "}
            <code>up</code> is a <code>createCollection</code> carrying the
            validator followed by the collection&apos;s{" "}
            <code>createIndex</code> steps, and the <code>down</code> is a{" "}
            <code>dropCollection</code> — the only inverse that is actually
            total, since the indexes and the validator go with it. Migrations
            like these are recorded in a <code>stabilize_migrations</code>{" "}
            collection, where the migration&apos;s name is the{" "}
            <code>_id</code>.
          </p>
          <p className="text-muted-foreground mb-4">
            &quot;Adding a column&quot; is therefore validator-and-index-only.
            A document either carries a field or it does not, so there is
            nothing to backfill and no table rewrite: a new optional column is a
            widened validator and nothing else, and every existing document
            already satisfies it.
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <p className="text-sm font-semibold mb-2">
              Two rules the generated schema always follows
            </p>
            <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
              <li>
                <strong>
                  <code>validationLevel</code> is <code>&quot;moderate&quot;</code>,
                  never <code>&quot;strict&quot;</code>.
                </strong>{" "}
                Under <code>strict</code>, an update to a document that lacks a
                newly declared required field is <em>rejected</em> — so{" "}
                <code>update()</code> would fail on exactly the documents the
                migration just declared the field for. <code>moderate</code>{" "}
                applies the validator only where it already holds.
              </li>
              <li>
                <strong>
                  Every unique index is <code>sparse: true</code>.
                </strong>{" "}
                MongoDB treats two documents that both <em>lack</em> a field as
                both <code>null</code>, and collides them; SQL treats two NULLs
                as distinct. Without <code>sparse</code>,{" "}
                <code>email: {`{ unique: true }`}</code> would reject the second
                document that simply omits <code>email</code>, where the same
                model on any SQL backend accepts it.
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground mt-4">
            Two further notes on <code>autoMigrate</code>.{" "}
            <code>createIndex</code> is idempotent in MongoDB — asking for an
            index that already exists with the same spec and options is a no-op —
            so a second run is safe; asking for the same index <em>name</em>{" "}
            with different options is an <code>IndexOptionsConflict</code>{" "}
            error, which is the honest outcome, since the change needs a drop
            first. And a collection that already exists is not re-validated:
            changing a validator is what <code>collMod</code> does, and running
            that on every <code>autoMigrate</code> would replace a validator a
            DBA had tightened by hand.
          </p>
          <p className="text-muted-foreground mt-4">
            One divergence from the SQL side is worth stating: the steps of a
            migration are <strong>not</strong> wrapped in a transaction.{" "}
            <code>createIndex</code> is not permitted inside one, and DDL is not
            transactional in MongoDB at all, so a transaction here would either
            fail on the first index or give a false impression of atomicity. The
            consequence is that a migration which fails halfway leaves a
            partially migrated collection and no ledger entry, so re-running it
            applies it again from the start — the same failure mode
            MySQL&apos;s auto-committing DDL already has.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
            <ul className="text-sm text-muted-foreground space-y-3 list-disc list-inside">
              <li>
                <strong>No raw SQL at all.</strong> <code>rawQuery</code>,{" "}
                <code>rawExec</code> and every clause that carries SQL text
                throw <code>MONGO_UNSUPPORTED</code>; see{" "}
                <em>What MongoDB Cannot Do</em> above for the replacements. The
                escape hatch is a driver-level one rather than a SQL one: the
                client exposes the commands the ORM does not model —{" "}
                <code>mongoFind</code>, <code>mongoUpdateOne</code>,{" "}
                <code>mongoAggregate</code>, <code>mongoCommand</code> and the
                rest — which take and return documents directly.
              </li>
              <li>
                <strong>A standalone server cannot write.</strong> Transactions
                need a replica set, and every write is wrapped in one. Reads
                work standalone.
              </li>
              <li>
                <strong>
                  <code>lockForUpdate()</code> returns the document without
                  protecting it.
                </strong>{" "}
                It warns rather than throwing, because the query itself is
                answerable — use a transaction or an atomic update instead.
              </li>
              <li>
                <strong>No savepoints.</strong> Nested{" "}
                <code>transaction()</code> calls reuse the outer transaction on
                every backend, so an inner failure rolls back the whole thing.
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
          </div>
          <p className="text-muted-foreground mt-4">
            One thing that is <em>not</em> a limitation here:{" "}
            <code>whereILike</code> works. It emits <code>ILIKE</code> on the
            other backends, which only Postgres understands, so the same call
            does not work on MySQL, SQLite or SQL Server. MongoDB has a
            case-insensitive regular expression, so it renders as{" "}
            <code>{`{ name: { $regex: pattern, $options: "is" } }`}</code> and
            answers — Postgres and MongoDB are the two backends where this call
            does something. (The <code>s</code> alongside the <code>i</code> is
            the dotall flag, since SQL&apos;s <code>%</code> has to match a
            newline the way <code>.*</code> otherwise would not.)
          </p>
        </section>
      </div>
    </div>
  );
}
