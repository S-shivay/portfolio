import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  /**
   * Lets a production build be made and served without disturbing a running
   * `next dev`.
   *
   * Both share `.next` by default, so building while the dev server is up
   * replaces the files it is serving from and breaks it until it recompiles.
   * `npm run preview` sets this variable (see scripts/preview.mjs) so the two
   * keep separate output directories and can run side by side — which is the
   * only way to compare them, and comparing them is the point: `next dev` ships
   * an unminified bundle roughly four times the size of the real one, so it is
   * not a valid basis for judging how the site performs.
   *
   * Unset everywhere else, including on Vercel, which gets the normal `.next`.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /**
   * Hides the floating dev-tools badge in the bottom-left corner. It only ever
   * renders during `next dev`, but it sits on top of the page while the design
   * is being reviewed and screenshotted, which is exactly when it is in the
   * way. Compile and runtime error overlays are unaffected.
   */
  devIndicators: false,

  images: {
    /**
     * Next 16 requires every `quality` value a component may request to be
     * declared here — the allowlist defaults to `[75]`, and anything outside it
     * is silently served at 75 rather than erroring. Without this entry the
     * `quality={92}` on the project screenshots does nothing at all.
     *
     * 92 exists for interface screenshots specifically: small UI text on flat
     * fills is the worst case for lossy compression, and the photo-tuned
     * default smears it. 75 stays for everything else.
     */
    qualities: [75, 92],
  },
};

/**
 * No gzip from `next dev`, which only ever talks to this machine and its LAN.
 *
 * It gets a large response through a pile-up that ends in a
 * MaxListenersExceededWarning: Next adds a `once("drain")` for each backpressured
 * write (server/pipe-readable.js), and the compression middleware moves `drain`
 * listeners onto its Gzip stream but not their removal, so they stay until that
 * response ends. Harmless, but it reads like a leak in the terminal. Production
 * keeps the default, so `npm run preview` still measures compressed sizes.
 */
export default function config(phase) {
  return { ...nextConfig, compress: phase !== PHASE_DEVELOPMENT_SERVER };
}
