"use client";

export default function AutoMigratePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-4">AutoMigrate</h1>
        <p className="text-lg text-muted-foreground mb-8">
          GORM-style automatic schema migration. Creates tables, adds missing
          columns and indexes. Never deletes or changes existing data.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-4">
              AutoMigrate inspects your model definitions and the database
              schema, then:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong>Creates table</strong> if it doesn&apos;t exist
              </li>
              <li>
                <strong>Adds missing columns</strong> (never deletes or changes
                types)
              </li>
              <li>
                <strong>Creates missing indexes</strong> for <code>unique</code>{" "}
                and <code>index</code> columns
              </li>
              <li>
                <strong>Creates history table</strong> if model has{" "}
                <code>versioned: true</code>
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This is safe for development and production. You can also use{" "}
              <code>migrate:auto</code> as a CLI command.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Primary Keys</h2>
            <p className="text-muted-foreground mb-4">
              The column you declare as <code>id</code> becomes the table&apos;s
              primary key, and its declared type is honoured:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <code>INTEGER</code> or <code>BIGINT</code> gets the database&apos;s
                auto-increment key (<code>AUTOINCREMENT</code>,{" "}
                <code>AUTO_INCREMENT</code> or <code>SERIAL</code>), and the
                database assigns it.
              </li>
              <li>
                Anything else — <code>STRING</code>, <code>UUID</code> — is
                created as a <code>NOT NULL PRIMARY KEY</code> of that type, for
                you to supply. This is the pattern{" "}
                <code>generate:model</code> scaffolds.
              </li>
            </ul>
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
              <p className="text-sm font-semibold mb-2">A string id must stay a string</p>
              <p className="text-sm text-muted-foreground">
                A UUID column quietly created as an integer would reject every{" "}
                <code>create({"{ id: generateUUID() }"})</code> with{" "}
                <em>datatype mismatch</em>, so the declared type wins. Since
                AutoMigrate only ever adds, a table created before this rule
                existed keeps its old key — drop it (or write a migration) to
                pick up the new definition.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Usage</h2>
            <div className="relative group my-4 rounded-xl overflow-hidden border border-border/60">
              <div className="flex items-center gap-2 px-5 py-3 bg-[#f5f0eb] dark:bg-[#2d2d2d] border-b border-border/60 dark:border-white/5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-mono text-[#999] dark:text-white/30 ml-3">
                  app.ts
                </span>
              </div>
              <div className="bg-[#faf8f5] dark:bg-[#1e1e1e] p-5 font-mono text-[13px] leading-[1.75]">
                <div className="text-[#3d3428] dark:text-[#e8dcc8]">
                  <div>
                    <span className="text-[#8a5e20] dark:text-[#d4a76a]">
                      import
                    </span>{" "}
                    {"{"} Stabilize {"}"}{" "}
                    <span className="text-[#8a5e20] dark:text-[#d4a76a]">
                      from
                    </span>{" "}
                    <span className="text-[#4a7c30] dark:text-[#a8c686]">
                      &quot;stabilize-orm&quot;
                    </span>
                    ;
                  </div>
                  <div>
                    <span className="text-[#8a5e20] dark:text-[#d4a76a]">
                      import
                    </span>{" "}
                    {"{"} User, Post, Comment {"}"}{" "}
                    <span className="text-[#8a5e20] dark:text-[#d4a76a]">
                      from
                    </span>{" "}
                    <span className="text-[#4a7c30] dark:text-[#a8c686]">
                      &quot;./models&quot;
                    </span>
                    ;
                  </div>
                  <div className="h-4" />
                  <div>
                    <span className="text-[#9e9590] dark:text-[#6b6560] italic">
                      {"// Single model"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8a5e20] dark:text-[#d4a76a]">
                      await
                    </span>{" "}
                    orm.
                    <span className="text-[#7a5e1a] dark:text-[#e8c88a]">
                      autoMigrate
                    </span>
                    (User);
                  </div>
                  <div className="h-4" />
                  <div>
                    <span className="text-[#9e9590] dark:text-[#6b6560] italic">
                      {"// Multiple models (like GORM)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8a5e20] dark:text-[#d4a76a]">
                      await
                    </span>{" "}
                    orm.
                    <span className="text-[#7a5e1a] dark:text-[#e8c88a]">
                      autoMigrate
                    </span>
                    ([User, Post, Comment]);
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">CLI Command</h2>
            <div className="relative group my-4 rounded-xl overflow-hidden border border-border/60 bg-[#1e1e1e]">
              <div className="flex items-center gap-2 px-5 py-3 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-mono text-white/30 ml-3">
                  terminal
                </span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-[1.75]">
                <div className="flex items-start gap-2">
                  <span className="text-[#28c840] select-none shrink-0">❯</span>
                  <span className="text-white/90">
                    stabilize-cli migrate:auto
                  </span>
                </div>
                <div className="text-white/50 ml-4 mt-1">
                  Auto-migrating models...
                </div>
                <div className="text-[#28c840] ml-4">
                  ✔ Auto-migrate complete: 3 model(s) processed.
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Scans <code>models/</code> directory and auto-migrates all found
              models.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              AutoMigrate vs Migrations
            </h2>
            <div className="rounded-xl border border-border/40 bg-card/40 p-6 mb-4">
              <h3 className="font-semibold mb-3">
                You don&apos;t need to disable migrations.
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                AutoMigrate and manual migrations can coexist. They serve
                different purposes:
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 font-semibold">Feature</th>
                    <th className="text-left py-2 font-semibold">
                      AutoMigrate
                    </th>
                    <th className="text-left py-2 font-semibold">Migrations</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/20">
                    <td className="py-2">Use case</td>
                    <td className="py-2">Development, prototyping</td>
                    <td className="py-2">Production, version control</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2">Direction</td>
                    <td className="py-2">Forward only (add columns)</td>
                    <td className="py-2">Up and down (rollback)</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2">Tracked</td>
                    <td className="py-2">No tracking table</td>
                    <td className="py-2">stabilize_migrations table</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2">Rollback</td>
                    <td className="py-2">Not supported</td>
                    <td className="py-2">Full rollback support</td>
                  </tr>
                  <tr>
                    <td className="py-2">Safe for prod</td>
                    <td className="py-2">Yes (never deletes)</td>
                    <td className="py-2">Yes (reviewed SQL)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
              <p className="text-sm font-semibold mb-2">
                Recommended approach:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  Use <code>autoMigrate</code> during{" "}
                  <strong>development</strong> for rapid iteration
                </li>
                <li>
                  Use <code>generate:migration</code> + <code>migrate</code> for{" "}
                  <strong>production</strong> deployments
                </li>
                <li>
                  Both work together — AutoMigrate adds columns, migrations
                  track history
                </li>
                <li>
                  AutoMigrate is <strong>safe</strong> — it never deletes data
                  or drops columns
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              What AutoMigrate Does NOT Do
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Does NOT delete columns</li>
              <li>Does NOT change column types</li>
              <li>Does NOT rename columns</li>
              <li>Does NOT drop tables</li>
              <li>Does NOT create a rollback mechanism</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              For destructive changes, use manual migrations with explicit{" "}
              <code>up</code> and <code>down</code> SQL.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Example: Development Workflow
            </h2>
            <div className="relative group my-4 rounded-xl overflow-hidden border border-border/60 bg-[#1e1e1e]">
              <div className="flex items-center gap-2 px-5 py-3 bg-[#2d2d2d] border-b border-white/5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-mono text-white/30 ml-3">
                  workflow
                </span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-[1.75]">
                <div className="flex items-start gap-2">
                  <span className="text-[#28c840] select-none shrink-0">❯</span>
                  <span className="text-white/90"># 1. Edit your model</span>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-[#28c840] select-none shrink-0">❯</span>
                  <span className="text-white/90">
                    # 2. Auto-migrate picks up changes
                  </span>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-[#28c840] select-none shrink-0">❯</span>
                  <span className="text-white/90">
                    stabilize-cli migrate:auto
                  </span>
                </div>
                <div className="text-[#28c840] ml-4">
                  ✔ Auto-migrate complete: 1 model(s) processed.
                </div>
                <div className="h-4" />
                <div className="flex items-start gap-2">
                  <span className="text-[#28c840] select-none shrink-0">❯</span>
                  <span className="text-white/90">
                    # 3. Ready for production? Generate migration
                  </span>
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-[#28c840] select-none shrink-0">❯</span>
                  <span className="text-white/90">
                    stabilize-cli generate:migration User
                  </span>
                </div>
                <div className="text-[#28c840] ml-4">
                  ✔ Migration generated:
                  migrations/20260402170000_create_user_table.json
                </div>
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}
