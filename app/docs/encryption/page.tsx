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
// In the table it is "v2:F3k...==:9dQ...==:Xm1...=="`}
          />
          <p className="text-muted-foreground mt-4">
            Size the column for the ciphertext, not the plaintext. The value is
            stored as <code>v2:&lt;iv&gt;:&lt;tag&gt;:&lt;ciphertext&gt;</code>{" "}
            with each part Base64, so the stored string is roughly{" "}
            <strong>1.4× the plaintext plus about 40 characters</strong> of
            overhead (two Base64 parts and the separators). A{" "}
            <code>STRING</code> default of 255 is not enough for a long secret —
            raise <code>length</code>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The Key</h2>
          <p className="text-muted-foreground mb-4">
            The key comes from the <code>ORM_ENCRYPTION_KEY</code> environment
            variable. It may be either 32 raw bytes read as UTF-8, or 64 hex
            characters — the hex form is detected by pattern and decoded, which
            is usually easier to generate and store.
          </p>
          <CodeBlock
            filename=".env"
            language="dotenv"
            code={`# 64 hex characters = 32 bytes. Generate with: openssl rand -hex 32
ORM_ENCRYPTION_KEY=9f2b7c1e4a8d3f605b1c9e2a7d4f8b3c6e0a5d1f7b2c8e4a9d3f6b0c1e5a72d4`}
          />
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-5 mt-4">
            <p className="text-sm font-semibold mb-2">
              A missing key is an error, not a fallback
            </p>
            <p className="text-sm text-muted-foreground">
              There is no default key. If the variable is unset, every encrypted
              read and write throws rather than proceeding — a deployment that
              forgot to set it fails loudly instead of quietly writing
              unprotected data. The same applies to a key of the wrong size:
              anything that is not exactly 32 bytes or 64 hex characters is
              rejected with the byte length it found.
            </p>
          </div>
          <p className="text-muted-foreground mt-4">
            The variable is read <strong>on every call</strong>, not captured
            once when the module loads, so an application that sets it after
            importing the ORM still works — and changing the environment at
            runtime changes which key is used.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How Values Are Stored</h2>
          <p className="text-muted-foreground mb-4">
            Encryption is AES-256-GCM, and the stored format carries everything
            needed to decrypt:
          </p>
          <CodeBlock
            filename="format.txt"
            language="bash"
            code={`v2 : <iv> : <auth tag> : <ciphertext>
 |     |        |             |
 |     |        |             +-- AES-GCM ciphertext, Base64
 |     |        +---------------- 16-byte authentication tag, Base64
 |     +------------------------- 12-byte random IV, Base64, new on every write
 +------------------------------- format marker`}
          />
          <p className="text-muted-foreground mt-4">
            GCM rather than CBC because it <em>authenticates</em> the
            ciphertext: a value that was truncated or edited in the database
            fails to decrypt instead of silently returning corrupted plaintext.
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
            A failure means the key is wrong, or the ciphertext was altered.
            Because GCM authenticates, both are detected. Rather than returning{" "}
            <code>null</code> — which would make a tampered value look like an
            empty field — the read throws:
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
    // Usually: ORM_ENCRYPTION_KEY is missing, wrong, or was rotated
    // without re-saving the rows.
  }
  throw error;
}`}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Migrating Legacy Data</h2>
          <p className="text-muted-foreground mb-4">
            Earlier versions used AES-256-CBC with a key compiled into the
            package — meaning anything written then is readable by anyone who
            read the published source, so data from that era offers no real
            protection. Reads still understand the old{" "}
            <code>iv:ciphertext</code> format so nothing breaks, and{" "}
            <code>decrypt()</code> tells the two apart by the{" "}
            <code>v2:</code> marker.
          </p>
          <p className="text-muted-foreground mb-4">
            To move off it, set the variable to the old key first so existing
            rows keep reading, then re-save them under a key of your own:
          </p>
          <CodeBlock
            filename=".env"
            language="dotenv"
            code={`# 1. Temporarily, to keep reading legacy rows:
ORM_ENCRYPTION_KEY=f71a3c8e9b12d5a49c0a3f98b1f2e46d

# 2. Then rotate to a key you generated:
#    openssl rand -hex 32`}
          />
          <CodeBlock
            filename="re-encrypt.ts"
            language="typescript"
            code={`// With the legacy key set, read and re-save. Each write uses the
// current GCM format and the current key.
const users = await userRepo.find().execute(orm.client);
for (const user of users) {
  await userRepo.update(user.id, { nationalId: user.nationalId });
}

// On a large table, page instead of loading every row at once:
await userRepo.each(userRepo.find(), async (user) => {
  await userRepo.update(user.id, { nationalId: user.nationalId });
});`}
          />
          <p className="text-muted-foreground mt-4">
            This is a real cost, not a formality: reads must run under the old
            key while the re-save happens, so schedule it as a migration rather
            than flipping the variable in place. Rows not re-saved stay in the
            legacy format and stop being readable the moment the key changes.
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
