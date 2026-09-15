/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Build into an isolated directory on demand:
   *
   *   NEXT_DIST_DIR=.next-verify bun run build
   *   NEXT_DIST_DIR=.next-verify bun run start
   *
   * Why this exists: several people build this site at the same time. Two
   * builds sharing one `.next` overwrite each other's chunks, and a `next start`
   * pointed at the result then dies at request time with
   * `Cannot find module './NNNN.js'`. Giving a build its own dist dir makes a
   * verification build independent of whatever else is running.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  eslint: {
    /**
     * `next build` does not run ESLint here.
     *
     * This project ships no ESLint config of its own, so Next resolved ESLint —
     * and the config — from the parent ORM repo (`../node_modules/eslint`,
     * `../.eslintrc.json`, "plugin:@typescript-eslint/recommended"). A
     * documentation build was therefore being failed by the *library's*
     * strictness, applied to pages that never opted into it, from a config
     * outside this repo.
     *
     * That is a toolchain bug, not a code-quality signal — so build-time linting
     * is off, and `bun run lint` is the real check, using this project's own
     * `eslint.config.mjs`. Run it; a failure there is the signal.
     */
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,
  },
}

export default nextConfig
