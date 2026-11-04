import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    /* `npm run preview` builds here instead of `.next` so it can run beside a
       live dev server. It is build output like any other and must not be
       linted — without this, `npm run lint` reports dozens of errors from
       Next.js's own compiled chunks. */
    ".next-preview/**",
  ]),
]);

export default eslintConfig;
