import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const clean = (value, fallback = "") =>
  !value || value.startsWith("[") ? fallback : value;

/**
 * Social share card.
 *
 * Generated at build time from the same content as the page, so it can never
 * drift out of sync with the headline. Uses only system-safe fonts and flat
 * colour — no remote font fetch, which keeps generation fast and offline-safe.
 *
 * Satori (the renderer behind ImageResponse) supports a subset of CSS: flex
 * only, no grid, and every element with multiple children needs an explicit
 * `display: flex`.
 */
export default function OpengraphImage() {
  const name = clean(site.name, "Frontend Developer");
  const location = clean(site.location);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f9ebd7",
          padding: "72px",
          fontFamily: "sans-serif",
          // The hero's vermilion sun, rising off the right edge.
          backgroundImage:
            "radial-gradient(320px circle at 1080px 150px, #e34222 99%, transparent 100%)",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              background: "#e34222",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              letterSpacing: "0.16em",
              color: "#3e5547",
            }}
          >
            {site.eyebrow}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "68px",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              fontWeight: 400,
              color: "#0b2a1b",
              maxWidth: "900px",
            }}
          >
            {site.headline}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "26px",
              color: "#3e5547",
              maxWidth: "760px",
            }}
          >
            React · Next.js · TypeScript · Accessibility · Performance
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(11,42,27,0.25)",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              fontWeight: 600,
              color: "#0b2a1b",
            }}
          >
            {name}
          </div>

          {location ? (
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                color: "#046a38",
              }}
            >
              {location}
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
