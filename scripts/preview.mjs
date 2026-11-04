/**
 * Builds the site and serves the real production output on the local network.
 *
 *   npm run preview        → http://localhost:3100 and http://<your-ip>:3100
 *
 * Why this exists rather than just using `next dev`: the development server is
 * not a slower version of the site, it is a different program. It ships an
 * unminified bundle with a devtools chunk larger than the entire production
 * bundle, compiles each route the first time it is requested, and runs React in
 * development mode. Judging performance — especially on a phone, over wi-fi —
 * against that measures the toolchain, not the site.
 *
 * It binds 0.0.0.0 so a phone on the same network can reach it, and writes to
 * its own output directory (NEXT_DIST_DIR) so a `next dev` you already have
 * running keeps working untouched.
 *
 * Written as a script rather than an npm one-liner because setting an
 * environment variable inline is not portable between cmd.exe and a POSIX
 * shell, and this project is developed on Windows.
 */
import { spawn } from "node:child_process";
import { networkInterfaces } from "node:os";

const PORT = process.env.PORT || "3100";
const DIST = ".next-preview";

/** Every non-internal IPv4 address, so the phone URL can be printed. */
const addresses = () =>
  Object.values(networkInterfaces())
    .flat()
    .filter((net) => net && net.family === "IPv4" && !net.internal)
    .map((net) => net.address);

/** Runs a Next.js subcommand, inheriting stdio, resolving on clean exit. */
const next = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn("npx", ["next", ...args], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, NEXT_DIST_DIR: DIST },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`next ${args[0]} exited ${code}`)),
    );
  });

await next(["build"]);

console.log("\n  Production build. Open on your phone at:");
for (const address of addresses()) console.log(`    http://${address}:${PORT}`);
console.log("");

await next(["start", "-p", PORT, "-H", "0.0.0.0"]);
