import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

/**
 * This project's own ESLint setup.
 *
 * Without this file, `eslint` run from here walked up to the parent ORM repo and
 * picked up its `.eslintrc.json` — so the docs site was being linted with the
 * library's rules, from a config that lives outside this repo and cannot be
 * seen or changed from it. This file keeps the standard local.
 *
 * Loaded via FlatCompat because `eslint-config-next` 15 still ships eslintrc
 * format. Version-matched to next 15.3.2.
 */
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-verify/**",
      "node_modules/**",
      "next-env.d.ts",
      "**/*.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
