"use client"

import { CodeBlock } from "@/components/code-block"

export default function ValidationPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 md:py-16">
          <h1 className="text-4xl font-bold mb-4">Validation</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Declare rules on your columns and Stabilize enforces them on every
            write. <br />
            Rules live next to the column they guard, so the model stays the
            single source of truth.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Declaring Rules</h2>
              <p className="text-muted-foreground mb-4">
                Four column options drive validation —{" "}
                <code className="text-accent">required</code>,{" "}
                <code className="text-accent">minLength</code>,{" "}
                <code className="text-accent">maxLength</code>,{" "}
                <code className="text-accent">pattern</code> — plus{" "}
                <code className="text-accent">customValidator</code> for
                anything else.
              </p>
              <CodeBlock
                filename="models/user.ts"
                language="typescript"
                code={`import { defineModel, DataTypes } from "stabilize-orm";

export const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      pattern: /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    age: {
      type: DataTypes.INTEGER,
      customValidator: (val) =>
        val >= 18 || "Signups must be 18 or over",
    },
  },
});`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Checking Without Writing</h2>
              <p className="text-muted-foreground mb-4">
                <code className="text-accent">validateAll()</code> runs every
                rule and returns <strong>one message per invalid column</strong>{" "}
                — an empty array means valid. It never throws, which makes it
                the right call for form handling where you want to show all
                errors at once.
              </p>
              <CodeBlock
                filename="validate.ts"
                language="typescript"
                code={`const errors = repo.validateAll({
  email: "nope",
  name: "ab",
  age: 12,
});

// [
//   "Field email does not match pattern",
//   "Field name too short",
//   "Signups must be 18 or over"
// ]

if (errors.length > 0) {
  return renderForm(errors);
}

// A valid payload returns an empty array
repo.validateAll({ email: "ada@example.com", name: "Ada", age: 30 });
// => []`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Skipping Required Fields
              </h2>
              <p className="text-muted-foreground mb-4">
                Partial updates often legitimately omit required columns. Pass{" "}
                <code className="text-accent">true</code> as the second argument
                to skip only the <code className="text-accent">required</code>{" "}
                rule — length, pattern and custom rules still run against
                whatever you did supply.
              </p>
              <CodeBlock
                filename="validate-partial.ts"
                language="typescript"
                code={`// Only updating age, so "email" and "name" being absent is fine
const errors = repo.validateAll({ age: 30 }, true);
// => []`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">On Write</h2>
              <p className="text-muted-foreground mb-4">
                You do not call validation yourself on the write path.{" "}
                <code className="text-accent">create()</code>,{" "}
                <code className="text-accent">update()</code> and{" "}
                <code className="text-accent">upsert()</code> validate first and
                throw a <code className="text-accent">StabilizeError</code> with
                code <code className="text-accent">VALIDATION_ERROR</code>. The
                write path reports the <strong>first</strong> failure, not all
                of them — use <code className="text-accent">validateAll()</code>{" "}
                when you need the complete list.
              </p>
              <CodeBlock
                filename="create.ts"
                language="typescript"
                code={`import { StabilizeError } from "stabilize-orm";

try {
  await repo.create({ email: "nope", name: "ab" });
} catch (error) {
  if (error instanceof StabilizeError && error.code === "VALIDATION_ERROR") {
    console.error(error.message);
    // "Field email does not match pattern"
  }
}`}
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Rule Reference</h2>
              <CodeBlock
                filename="rules.ts"
                language="typescript"
                code={`required: true              // "Field <key> is required"
minLength: 3                // "Field <key> too short"
maxLength: 50               // "Field <key> too long"
pattern: /^\\d{5}$/           // "Field <key> does not match pattern"
customValidator: (val) =>   // return true to pass,
  val > 0 || "Must be positive"  // or a string to fail with it`}
              />
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  No numeric range rule
                </p>
                <p className="text-sm text-muted-foreground">
                  There is no <code>min</code>/<code>max</code> for numbers —{" "}
                  <code>minLength</code> and <code>maxLength</code> measure
                  string length. For a numeric bound, use{" "}
                  <code>customValidator</code>, as the{" "}
                  <code>age</code> column above does. Note also that{" "}
                  <code>unique</code> is declared on the column but is{" "}
                  <strong>not</strong> checked by the validator — it is enforced
                  by the database index, so a duplicate surfaces as a constraint
                  error rather than a <code>VALIDATION_ERROR</code>.
                </p>
              </div>
            </section>
          </div>
    </div>
  )
}
