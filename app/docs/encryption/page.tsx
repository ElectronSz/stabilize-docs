import { CodeBlock } from "@/components/code-block";

export default function EncryptionPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold mb-4">Column Encryption</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Encrypt individual columns at rest, transparently on the way in and out
        — so a database dump, a backup, or a replica does not expose them.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Enabling It</h2>
          <p className="text-muted-foreground mb-4">
            Mark a column <code>encrypted: true</code>. Nothing else changes:
            reads and writes take the plain value and the ORM encrypts on save
            and decrypts on load.
          </p>
          <CodeBlock
            filename="models/user.ts"
            language="typescript"
            code={`import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.INTEGER, required: true, unique: true },
    email: { type: DataTypes.STRING, length: 255, required: true },
    // Stored as ciphertext; you only ever handle the plaintext.
    nationalId: { type: DataTypes.STRING, length: 512, encrypted: true },
  },
});

const user = await userRepo.create({
  email: "ada@example.com",
  nationalId: "AB123456C",
});
// user.nationalId === "AB123456C" - decrypted for you
// In the table it is "v3:9f2b7c1e:F3k...==:9dQ...==:Xm1...=="`}
          />
          <p className="text-muted-foreground mt-4">
            Size the column for the ciphertext, not the plaintext. The value is
            stored as{" "}
            <code>
              v3:&lt;keyId&gt;:&lt;iv&gt;:&lt;tag&gt;:&lt;ciphertext&gt;
            </code>{" "}
            — the id in hex, the other three parts Base64 — so the stored string
            is roughly <strong>1.4× the plaintext plus about 55 characters</strong>{" "}
            of framing. A <code>STRING</code> default of 255 is not enough for a
            long secret — raise <code>length</code>.
          </p>
          <p className="text-muted-foreground mt-4">
            A column can be encrypted <em>and</em> renamed.{" "}
            <code>{`{ name: "diagnosis_code", encrypted: true }`}</code> stores
            ciphertext in <code>diagnosis_code</code> and decrypts it on the way
            back — as with any renamed column, the value reads back under the
            column name, not the property name.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The Key</h2>
          <p className="text-muted-foreground mb-4">
            A key is looked for in two places, and the first one that yields an
            <em> active</em> key wins:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mb-4">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">Source</th>
                  <th className="text-left py-2 font-semibold">Behaviour</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4 align-top">
                    <code>ORM_ENCRYPTION_KEY</code>
                  </td>
                  <td className="py-2">
                    Read first. 32 bytes, as 64 hex characters or as raw UTF-8.
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4 align-top">
                    <code>ORM_ENCRYPTION_KEY_FILE</code>
                  </td>
                  <td className="py-2">
                    A path, or <code>.stabilize/encryption.key</code> when the
                    variable is unset. <strong>Generated if missing.</strong>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 align-top">
                    <code>ORM_ENCRYPTION_KEYS_OLD</code>
                  </td>
                  <td className="py-2">
                    Comma-separated retired keys. They decrypt; they never
                    encrypt. See{" "}
                    <a href="#rotating-a-key" className="text-accent underline">
                      Rotating a key
                    </a>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mb-4">
            Supplying the key yourself is the option that travels — it survives a
            redeploy, a container replacement and a fresh filesystem, because it
            lives in the place you already keep secrets:
          </p>
          <CodeBlock
            filename=".env"
            language="dotenv"
            code={`# 64 hex characters = 32 bytes. Generate with: openssl rand -hex 32
ORM_ENCRYPTION_KEY=9f2b7c1e4a8d3f605b1c9e2a7d4f8b3c6e0a5d1f7b2c8e4a9d3f6b0c1e5a72d4`}
          />
          <p className="text-muted-foreground my-4">
            If nothing is supplied, the ORM does not fail — it generates a key and
            writes it to the key file at mode <code>0600</code>, then warns with
            code <code>STABILIZE_ENCRYPTION_KEY_GENERATED</code>. That makes a
            first run work with no configuration at all:
          </p>
          <CodeBlock
            filename=".stabilize/encryption.key"
            language="json"
            code={`{
  "active": "9f2b7c1e4a8d3f605b1c9e2a7d4f8b3c6e0a5d1f7b2c8e4a9d3f6b0c1e5a72d4",
  "retired": []
}`}
          />
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              A generated key is only as durable as the file it lands in
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              A key held in memory alone would orphan every value it encrypted the
              moment the process restarts — the ciphertext stays in the database
              and nothing can ever read it again. So the generated key is written
              to disk <em>before</em> it is used, and a path that cannot be
              written is fatal rather than silent: you get{" "}
              <code>Cannot write the encryption key file …</code> instead of a
              key you cannot keep.
            </p>
            <p className="text-sm text-muted-foreground">
              That leaves one question the library cannot answer for you — whether
              that path survives a redeploy. On a host with an ephemeral
              filesystem it does not, and the first deploy after the key was
              generated is the one that loses the data. Set{" "}
              <code>ORM_ENCRYPTION_KEY</code> wherever that is true.
            </p>
          </div>
          <p className="text-muted-foreground mt-4">
            A file may also hold the key on its own, without the JSON envelope,
            since that is the obvious thing to write by hand:
          </p>
          <CodeBlock
            filename=".stabilize/encryption.key"
            language="bash"
            code={`9f2b7c1e4a8d3f605b1c9e2a7d4f8b3c6e0a5d1f7b2c8e4a9d3f6b0c1e5a72d4`}
          />
          <p className="text-muted-foreground mt-4">
            Keys are read <strong>on every call</strong>, not captured once when
            the module loads, so an application that sets the variable after
            importing the ORM still works — and changing the environment at
            runtime changes which key is used. Only the key file is cached, and
            only until its mtime and size change, so editing it also takes effect
            without a restart.
          </p>
          <p className="text-muted-foreground mt-4">
            A key of the wrong size is rejected with the byte length it found:
            anything that is not exactly 32 bytes or 64 hex characters is an
            error. Add <code>.stabilize/</code> to your{" "}
            <code>.gitignore</code> — committing that file hands every encrypted
            column to anyone who can read the repository.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How Values Are Stored</h2>
          <p className="text-muted-foreground mb-4">
            Encryption is AES-256-GCM, and the stored format carries everything
            needed to decrypt — including which key to use:
          </p>
          <CodeBlock
            filename="format.txt"
            language="bash"
            code={`v3 : <key id> : <iv> : <auth tag> : <ciphertext>
 |       |        |        |             |
 |       |        |        |             +-- AES-GCM ciphertext, Base64
 |       |        |        +---------------- 16-byte authentication tag, Base64
 |       |        +------------------------- 12-byte random IV, Base64, new on every write
 |       +---------------------------------- sha256(key), first 8 hex characters
 +------------------------------------------ format marker`}
          />
          <p className="text-muted-foreground mt-4">
            GCM rather than CBC because it <em>authenticates</em> the
            ciphertext: a value that was truncated or edited in the database
            fails to decrypt instead of silently returning corrupted plaintext.
          </p>
          <p className="text-muted-foreground mt-4">
            The key id is a <strong>digest of the key, not a label assigned to
            it</strong> — so the same key has the same id whether it arrived
            through the environment or through a file, and moving a key between
            the two does not orphan the rows it wrote. Being one-way, the id can
            sit in plaintext beside the ciphertext without narrowing a search for
            the key itself.
          </p>
          <p className="text-muted-foreground mt-4">
            The IV is random per write, so encrypting the same plaintext twice
            produces two different stored strings. That is what you want
            cryptographically, and it has a consequence you must design around —
            see below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            You Cannot Query an Encrypted Column
          </h2>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              Equality and uniqueness do not work on encrypted columns
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Because a fresh IV is used each time, the ciphertext for a given
              value is different on every write. A{" "}
              <code>WHERE nationalId = ?</code> compares the bound parameter
              against a column of unrelated ciphertexts and matches nothing —
              and does so <em>silently</em>, returning zero rows rather than
              raising. A <code>unique</code> constraint on the column is
              likewise no protection: two rows with the same national id carry
              different ciphertexts and both insert.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Both of these find nothing, even though the row exists:
await userRepo.findBy({ nationalId: "AB123456C" });   // []
await userRepo.findOneBy({ nationalId: "AB123456C" }); // null

// And this does NOT prevent a duplicate:
//   nationalId: { ..., encrypted: true, unique: true }`}
            />
          </div>
          <p className="text-muted-foreground mb-4">
            The workable patterns, in order of preference:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>
              Keep a <strong>separate deterministic digest column</strong> — for
              example a SHA-256 HMAC of the value under a second key — and query
              that. It is not reversible, so it does not undo the encryption, and
              it is stable, so equality and uniqueness both work.
            </li>
            <li>
              Store the value in an{" "}
              <strong>unencrypted column you accept is public</strong> and
              encrypt only the part that must stay secret.
            </li>
            <li>
              Decrypt in application code and filter there. Only viable on small
              tables — it reads every row.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Where It Applies</h2>
          <p className="text-muted-foreground mb-4">
            Decryption is applied by a row transform attached to the read
            builders, which means coverage is not uniform across the API. This
            table is worth knowing before you reach for a helper:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-accent/30">
                  <th className="text-left py-2 pr-4 font-semibold">Method</th>
                  <th className="text-left py-2 font-semibold">
                    Encrypted columns
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>find()</code>, <code>findOne()</code>,{" "}
                    <code>findOneBy()</code>, <code>findBy()</code>,{" "}
                    <code>findOrFail()</code>, <code>first()</code>,{" "}
                    <code>last()</code>
                  </td>
                  <td className="py-2">decrypted</td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>create()</code>, <code>update()</code>,{" "}
                    <code>upsert()</code>
                  </td>
                  <td className="py-2">
                    encrypted on write, decrypted on the returned row
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>findDeleted()</code>, <code>withTrashed()</code>,{" "}
                    <code>selectColumns()</code>
                  </td>
                  <td className="py-2">decrypted</td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>pluck()</code>
                  </td>
                  <td className="py-2">
                    <strong>raw ciphertext</strong> — no transform is applied
                  </td>
                </tr>
                <tr className="border-b border-accent/10">
                  <td className="py-2 pr-4">
                    <code>aggregate()</code>, <code>sum()</code>,{" "}
                    <code>avg()</code>, <code>min()</code>, <code>max()</code>
                  </td>
                  <td className="py-2">
                    meaningless — SQL aggregates over ciphertext, not plaintext
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code>rawQuery()</code>, <code>QueryBuilder</code> with{" "}
                    <code>.selectRaw()</code>
                  </td>
                  <td className="py-2">
                    raw ciphertext — bypasses the repository entirely
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            What Happens When Decryption Fails
          </h2>
          <p className="text-muted-foreground mb-4">
            A failure means the key is wrong, was rotated away, or the ciphertext
            was altered. Because GCM authenticates, all three are detected.
            Rather than returning <code>null</code> — which would make a tampered
            value look like an empty field — the read throws:
          </p>
          <CodeBlock
            filename="decrypt-error.ts"
            language="typescript"
            code={`import { StabilizeError } from "stabilize-orm";

try {
  await userRepo.findOne(id);
} catch (error) {
  if (error instanceof StabilizeError && error.code === "DECRYPTION_ERROR") {
    // The message names the offending column.
    // Usually: the key is missing, wrong, or was rotated without being
    // kept in the ring -- or the row was never re-saved after the rotation.
  }
  throw error;
}`}
          />
          <p className="text-muted-foreground mt-4">
            The two failures read differently, which is worth knowing before you
            go looking in the wrong place. A <code>v3:</code> value names its
            key, so a key that is simply not configured says so and tells you
            where to add it. Only the older formats — which do not name a key —
            fall back to trying every key in the ring, and report that none of
            them worked.
          </p>
        </section>

        <section id="rotating-a-key">
          <h2 className="text-2xl font-semibold mb-4">Rotating a Key</h2>
          <p className="text-muted-foreground mb-4">
            Because every value names the key that wrote it, a new key can be
            introduced without re-encrypting the whole table at once. Retired keys
            keep decrypting; only the active key encrypts. Add the old key to the
            file&apos;s <code>retired</code> list and put the new one in{" "}
            <code>active</code>:
          </p>
          <CodeBlock
            filename=".stabilize/encryption.key"
            language="json"
            code={`{
  "active": "<the new 64-hex key>",
  "retired": ["<the previous 64-hex key>"]
}`}
          />
          <p className="text-muted-foreground my-4">
            A deployment that keeps its secrets in the environment and has no
            file can pass them the other way instead:
          </p>
          <CodeBlock
            filename=".env"
            language="dotenv"
            code={`ORM_ENCRYPTION_KEY=<new key>
ORM_ENCRYPTION_KEYS_OLD=<previous key>`}
          />
          <p className="text-muted-foreground mb-4">
            A row still encrypted under a retired key reads normally. Re-save it
            to move it onto the active key:
          </p>
          <CodeBlock
            filename="rotate.ts"
            language="typescript"
            code={`import { activeKeyId } from "stabilize-orm/utils/encryption";

// Before the rotation, note which key new writes use:
const before = activeKeyId();

// With the old key in "retired", every row still reads. Each write
// moves it onto the active key.
await userRepo.each(userRepo.find(), async (user) => {
  await userRepo.update(user.id, { nationalId: user.nationalId });
});

console.log(activeKeyId() === before ? "still the same key" : "rotated");`}
          />
          <p className="text-muted-foreground mt-4">
            Then drop the retired key once nothing refers to it. A value whose key
            is missing fails with an error naming the id, so you can tell whether
            anything is still using it rather than guessing.
          </p>
          <p className="text-muted-foreground mt-4">
            <code>activeKeyId()</code> returns the digest of the key new values
            are being written with — which is also the id sitting in the third
            field of every <code>v3:</code> value, so you can check a rotation
            against the data rather than trusting that it finished.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Data Written by Earlier Versions
          </h2>
          <p className="text-muted-foreground mb-4">
            Two older formats are still read, and nothing writes them any more.
            Rows written before key ids existed carry a <code>v2:</code> prefix.
            Rows written before that used unauthenticated AES-256-CBC, in the
            shape <code>iv:ciphertext</code>.
          </p>
          <p className="text-muted-foreground mb-4">
            Neither names a key, so there is nothing to look up — each is tried
            against every key in the ring until one works. That is reliable rather
            than a guess: GCM&apos;s authentication tag makes a wrong key fail
            loudly, and CBC at least fails its padding.
          </p>
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mb-4">
            <p className="text-sm font-semibold mb-2">
              The oldest format offers no real protection
            </p>
            <p className="text-sm text-muted-foreground">
              That CBC era used a key compiled into the published package, so
              anyone who read the source had it. Those rows look confidential and
              are not — treat them as plaintext that happens to be encoded, and
              re-save them under a key of your own as soon as you can.
            </p>
          </div>
          <p className="text-muted-foreground mb-4">
            To read them, put the built-in key in the ring and re-save:
          </p>
          <CodeBlock
            filename=".stabilize/encryption.key"
            language="json"
            code={`{
  "active": "<your own key>",
  "retired": ["f71a3c8e9b12d5a49c0a3f98b1f2e46d"]
}`}
          />
          <CodeBlock
            filename="re-encrypt.ts"
            language="typescript"
            code={`// Reads now understand both old formats and the new one. Each write
// uses the active key and the current v3 format.
await userRepo.each(userRepo.find(), async (user) => {
  await userRepo.update(user.id, { nationalId: user.nationalId });
});`}
          />
          <p className="text-muted-foreground mt-4">
            This is a real cost, not a formality: reads have to run under the old
            key for the whole duration of the re-save, so schedule it as a
            migration rather than flipping a variable in place. Rows that are never
            re-saved stay in the old format and stop being readable the moment the
            old key leaves the ring.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Caching</h2>
          <p className="text-muted-foreground mb-4">
            Decryption happens before a row is written to the cache, so a cached
            entity holds plaintext and is served decrypted. That makes the cache
            itself a place where the value is not encrypted — if the cache
            backend is Redis, secure the connection and treat the cache as
            sensitive, or leave caching off for models with encrypted columns.
          </p>
        </section>
      </div>
    </div>
  );
}
