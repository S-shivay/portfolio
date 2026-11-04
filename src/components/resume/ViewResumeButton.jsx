"use client";

import { openResumeViewer } from "@/components/resume/ResumeViewer";
import { Icon } from "@/components/ui/Icon";

/**
 * The trigger for the in-page resume viewer.
 *
 * A tiny client island so the sections that use it — Contact, Footer — can stay
 * server components. It is a real <button> rather than a styled link: it opens
 * a dialog, it does not navigate anywhere.
 */
export function ViewResumeButton({
  children = "View Resume",
  icon = "Eye",
  className,
}) {
  return (
    <button type="button" onClick={openResumeViewer} className={className}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}
