/**
 * ProgressiveBlur — Skiper UI 41, kept as the registry wrote it apart from
 * the demo page it shipped with (a full-screen lorem-ipsum scroller) and a
 * `style` pass-through.
 *
 * A strip of backdrop blur whose strength fades out along its height, with the
 * page colour washed over it. Content scrolling underneath softens into the
 * edge instead of being cut off by a hard line. Used under the nav.
 *
 * `backgroundColor` takes any CSS colour, including `var(--bg)`, so it follows
 * the theme switch on its own.
 *
 * Skiper 41 Canvas_Landing_004 — React + framer motion
 * Inspired by and adapted from https://devouringdetails.com/
 * We respect the original creators. This is an inspired rebuild with our own
 * taste and does not claim any ownership.
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Author: @gurvinder-singh02 — https://gxuri.me
 */
const ProgressiveBlur = ({
  className = "",
  backgroundColor = "#f5f4f3",
  position = "top",
  height = "150px",
  blurAmount = "4px",
  style,
}) => {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 w-full select-none ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? "linear-gradient(to bottom, #000 50%, transparent)"
          : "linear-gradient(to top, #000 50%, transparent)",
        WebkitMaskImage: isTop
          ? "linear-gradient(to bottom, #000 50%, transparent)"
          : "linear-gradient(to top, #000 50%, transparent)",
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
        ...style,
      }}
    />
  );
};

export { ProgressiveBlur };
