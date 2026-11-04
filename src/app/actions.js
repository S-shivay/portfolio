"use server";

import { validateForm } from "@/lib/validation";
import { getTransport, sendContactEmail } from "@/lib/email";

/**
 * Contact form submission.
 *
 * Runs on the server, so validation cannot be bypassed and no delivery
 * credentials ever reach the browser.
 *
 * Delivery goes through `src/lib/email.js`, which picks the best transport
 * available from the environment and falls back to a keyless one, so the form
 * delivers with an empty .env and improves as you configure it. See
 * `.env.example`.
 *
 * The only `unconfigured` case left is a placeholder recipient address — there
 * is genuinely nowhere to send. Even then it says so rather than swallowing the
 * message, because silently losing a hiring enquiry is the worst failure this
 * form can have.
 */

const MIN_SUBMIT_MS = 400;

export async function submitContact(_previousState, formData) {
  const values = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  };

  // Honeypot: a field hidden from humans. Bots fill it in; real users cannot
  // see it. Silently report success so the bot does not learn it was caught.
  if (formData.get("company")) {
    return { status: "success", values: {}, errors: {} };
  }

  const errors = validateForm(values);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
      values,
    };
  }

  if (!getTransport()) {
    return {
      status: "unconfigured",
      message: "Please email me directly — I read every one.",
      errors: {},
      values,
    };
  }

  try {
    // A small floor on perceived duration: an instant response to a form
    // submission reads as "nothing happened" rather than "sent".
    await Promise.all([
      sendContactEmail({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      }),
      new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_MS)),
    ]);

    return {
      status: "success",
      message: "Message sent. I'll get back to you shortly.",
      errors: {},
      values: {},
    };
  } catch (error) {
    console.error("[contact] delivery failed:", error);

    return {
      status: "error",
      // The visitor gets a route that works right now; the reason lives in the
      // server log, where it is useful and not a leak.
      message:
        "Something went wrong sending that. Please email me directly instead.",
      errors: {},
      values,
    };
  }
}
