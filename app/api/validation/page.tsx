"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";

export default function ValidationApiPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-4">Validation API</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Column validation rules and how write paths enforce them
          </p>

          <div className="space-y-8">
            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Validation Column Options
              </h2>
              <CodeBlock
                language="typescript"
                code={`interface ColumnConfig {
  required?: boolean;        // Value must be present
  minLength?: number;        // Min string length (validation)
  maxLength?: number;        // Max string length (validation)
  pattern?: RegExp;          // Regex validation
  customValidator?: (val: any) => boolean | string;  // Custom validation
  unique?: boolean;          // UNIQUE constraint
}`}
              />
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    required
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Value must be present on the entity
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    minLength
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Minimum string length
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    maxLength
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Maximum string length
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    pattern
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    A RegExp the value must match
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    customValidator
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Caller-supplied predicate
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    unique
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Enforced by the database index, not the runtime validator
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                There is no numeric <code>min</code> or <code>max</code>{" "}
                option. <code>minLength</code> and <code>maxLength</code>{" "}
                measure string length only.
              </p>
              <p className="text-muted-foreground mb-4">
                At most <strong>one message per column</strong> is reported: each
                rule that fails ends that column&apos;s checks, so a value that
                is both too short and fails its pattern reports only the length
                failure.
              </p>
              <p className="text-muted-foreground">
                <code>required</code> is <em>not</em> enforced on the
                auto-increment primary key. When the <code>id</code> column has a
                numeric type, that column is skipped by the required check — so a
                missing id is left for the database to generate rather than
                rejected.
              </p>
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">customValidator</h2>
              <CodeBlock
                language="typescript"
                code={`customValidator(val: any): boolean | string`}
              />
              <p className="text-muted-foreground mb-4">
                Return <code>true</code> to pass, or a <code>string</code> to
                fail with that message. The returned string is used verbatim as
                the validation message.
              </p>
              <CodeBlock
                filename="models/User.ts"
                language="typescript"
                code={`const User = defineModel({
  tableName: "users",
  columns: {
    id: { type: DataTypes.STRING, required: true, unique: true },
    email: {
      type: DataTypes.STRING,
      length: 255,
      required: true,
      customValidator: (val) =>
        val.includes("@") ? true : "email must contain @",
    },
  },
});`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">validateAll()</h2>
              <CodeBlock
                language="typescript"
                code={`validateAll(entity: Partial<T>, skipRequired?: boolean): string[]`}
              />
              <p className="text-muted-foreground mb-4">
                Returns one message per invalid column. Empty array when valid.
                Never throws.
              </p>
              <h3 className="font-semibold mb-2">Parameters:</h3>
              <ul className="space-y-2 mb-4">
                <li>
                  <Badge variant="outline" className="mr-2">
                    entity
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Partial entity to check
                  </span>
                </li>
                <li>
                  <Badge variant="outline" className="mr-2">
                    skipRequired
                  </Badge>{" "}
                  <span className="text-muted-foreground">
                    Defaults to false. When true, only the required rule is
                    skipped
                  </span>
                </li>
              </ul>
              <CodeBlock
                filename="example/validate.ts"
                language="typescript"
                code={`const errors = userRepo.validateAll({ email: "nope" });
// ["email must contain @", "Field name is required"]

const partialErrors = userRepo.validateAll(
  { email: "nope" },
  true,
);
// ["email must contain @"] - required rule skipped`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Write-Path Enforcement
              </h2>
              <CodeBlock
                language="typescript"
                code={`validate(entity: Partial<T>, skipRequired?: boolean)   // private`}
              />
              <p className="text-muted-foreground mb-4">
                Write paths run the private <code>validate()</code>, which
                throws on the FIRST failure only. It does not collect every
                message the way <code>validateAll()</code> does.
              </p>
              <CodeBlock
                filename="example/errors.ts"
                language="typescript"
                code={`import { StabilizeError, generateUUID } from "stabilize-orm";

try {
  await userRepo.create({ id: generateUUID(), email: "nope" });
} catch (err) {
  if (err instanceof StabilizeError && err.code === "VALIDATION_ERROR") {
    console.log(err.name); // "StabilizeError"
  }
}`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">VALIDATION_ERROR</h2>
              <CodeBlock
                language="typescript"
                code={`class StabilizeError extends Error {
  code: string;
  originalError?: unknown;
}`}
              />
              <p className="text-muted-foreground mb-4">
                Validation failures are thrown as <code>StabilizeError</code>{" "}
                with <code>name === &quot;StabilizeError&quot;</code>, a{" "}
                <code>.code</code>, and a <code>.originalError</code>. The code
                for a failed rule is <code>&quot;VALIDATION_ERROR&quot;</code>.
              </p>
              <h3 className="font-semibold mb-2">Message strings:</h3>
              <CodeBlock
                language="typescript"
                code={`Field \${key} is required
Field \${key} too short
Field \${key} too long
Field \${key} does not match pattern
// or the string returned by customValidator, verbatim`}
              />
            </Card>

            <Card className="border-accent/20 bg-card/50 backdrop-blur-sm p-6">
              <h2 className="text-2xl font-semibold mb-4">unique</h2>
              <p className="text-muted-foreground mb-4">
                <code>unique</code> exists on the column interface but is NOT
                enforced by the runtime validator. It is enforced by the
                database index, so a duplicate raises a constraint error, not a{" "}
                <code>VALIDATION_ERROR</code>.
              </p>
              <CodeBlock
                filename="example/unique.ts"
                language="typescript"
                code={`const User = defineModel({
  tableName: "users",
  columns: {
    email: { type: DataTypes.STRING, required: true, unique: true },
  },
});

// A duplicate insert fails at the database index,
// not as a StabilizeError with code "VALIDATION_ERROR".`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
