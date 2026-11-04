"use client";

import { site } from "@/data/site";
import { buildComposeLinks, DEFAULT_SUBJECT } from "@/lib/mailto";
import { openCompose } from "@/components/contact/ComposeDialog";

/**
 * An email address that always leads somewhere.
 *
 * Rendered as a real `<a href="mailto:">`, so the address is visible in the
 * status bar, can be copied from the context menu, and still works with
 * JavaScript disabled. When JavaScript is available the click is intercepted
 * and the compose chooser opens instead — because `mailto:` alone silently
 * does nothing for anyone without a mail client registered on their device.
 *
 * Modifier-clicks are left alone so the browser's own behaviour wins.
 */
export function EmailLink({
  subject = DEFAULT_SUBJECT,
  className,
  children,
  ...props
}) {
  const { mailto } = buildComposeLinks({ to: site.email, subject });

  const onClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openCompose({ subject });
  };

  return (
    <a href={mailto} onClick={onClick} className={className} {...props}>
      {children ?? site.email}
    </a>
  );
}
