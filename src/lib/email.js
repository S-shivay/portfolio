/**
 * ============================================================================
 * OUTBOUND EMAIL — server only. Never import this from a client component.
 * ============================================================================
 *
 * Nothing can send mail without *some* credential or activation — that is what
 * stops anyone sending as anyone. So the aim here is not "no setup", it is
 * "works out of the box, and gets better as you configure it".
 *
 * Transports, in priority order:
 *
 *   1. RESEND_API_KEY         Best. https://resend.com — you own the account,
 *                             the mail comes from your sender, and nobody else
 *                             holds your visitors' messages. Plain HTTP, so no
 *                             SMTP socket to keep alive on a serverless host.
 *
 *   2. WEB3FORMS_ACCESS_KEY   https://web3forms.com — a key arrives by email,
 *                             no password or account needed.
 *
 *   3. CONTACT_WEBHOOK_URL    Any endpoint taking a JSON POST — Slack, Discord,
 *                             Zapier, your own route.
 *
 *   4. FormSubmit (default)   Needs no key at all: the recipient address IS the
 *                             endpoint. The first submission triggers a
 *                             one-click "Activate Form" email to that address;
 *                             after that it relays straight to the inbox.
 *
 * Because (4) always applies, the form is functional with an empty .env — and
 * every option above it is a straight upgrade, switched by setting one variable.
 *
 * None of these carry the NEXT_PUBLIC_ prefix, so Next.js keeps them all
 * server-side and no key ever reaches the browser.
 */

import { site } from "@/data/site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

/**
 * Resend needs a verified domain to send *from*. Until you own one, their
 * shared sender works — with the restriction that it may only deliver to the
 * address that owns the Resend account, which is exactly what a contact form
 * does anyway.
 */
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

const isPlaceholder = (value) =>
  !value || typeof value !== "string" || value.startsWith("[");

export function getRecipient() {
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  return isPlaceholder(to) ? null : to;
}

/** Which transport a submission will take. Null only if there is no recipient. */
export function getTransport() {
  if (!getRecipient()) return null;
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.WEB3FORMS_ACCESS_KEY) return "web3forms";
  if (process.env.CONTACT_WEBHOOK_URL) return "webhook";
  return "formsubmit";
}

/* Header fields are single-line by definition; a newline smuggled into a name
   is the classic header-injection vector. Strip rather than reject, so a stray
   paste never costs someone their message. */
const singleLine = (value) => (value ?? "").replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

/**
 * Sends one contact enquiry. Throws on failure so the caller can report it —
 * a silent failure here means a lost opportunity.
 *
 * @param {{ name: string, email: string, message: string }} enquiry
 */
export async function sendContactEmail({ name, email, message }) {
  const to = getRecipient();
  if (!to) throw new Error("No recipient address configured");

  const transport = getTransport();
  const from = singleLine(name);
  const replyTo = singleLine(email);
  const subject = `Portfolio enquiry from ${from}`;
  const submittedAt = new Date().toISOString();

  switch (transport) {
    case "resend":
      return sendViaResend({ to, from, replyTo, subject, message, submittedAt });
    case "web3forms":
      return sendViaWeb3Forms({ from, replyTo, subject, message });
    case "webhook":
      return sendViaWebhook({ name: from, email: replyTo, message, submittedAt });
    default:
      return sendViaFormSubmit({ to, from, replyTo, subject, message });
  }
}

/* -------------------------------------------------------------------------- */

async function sendViaResend({ to, from, replyTo, subject, message, submittedAt }) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [to],
      subject,
      /* The whole point of the form is that you can answer it. Reply-to means
         hitting Reply in your inbox goes to them, not to the address the
         message was technically sent from. */
      reply_to: replyTo,
      text: plainText({ from, replyTo, message, submittedAt }),
      html: renderHtml({ from, replyTo, message }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await readBody(response)}`);
  }
}

async function sendViaWeb3Forms({ from, replyTo, subject, message }) {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      from_name: "Portfolio contact form",
      subject,
      name: from,
      email: replyTo,
      reply_to: replyTo,
      message,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new Error(
      `Web3Forms responded ${response.status}: ${payload?.message ?? "unknown error"}`,
    );
  }
}

async function sendViaWebhook({ name, email, message, submittedAt }) {
  const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message, submittedAt }),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded ${response.status}`);
  }
}

async function sendViaFormSubmit({ to, from, replyTo, subject, message }) {
  const response = await fetch(`${FORMSUBMIT_ENDPOINT}/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      /* FormSubmit refuses requests with no origin — it is guarding against
         forms opened as local files. A server action has no Origin of its own,
         so one is supplied explicitly. */
      Origin: originHeader(),
      Referer: `${originHeader()}/`,
    },
    body: JSON.stringify({
      name: from,
      email: replyTo,
      message,
      _subject: subject,
      _replyto: replyTo,
      _template: "box",
      _captcha: "false",
    }),
  });

  /* FormSubmit answers 200 even when it has refused the submission, so the
     body is the only reliable signal. */
  const payload = await response.json().catch(() => null);
  const succeeded =
    response.ok && String(payload?.success ?? "false").toLowerCase() === "true";

  if (succeeded) return;

  const detail = payload?.message ?? `HTTP ${response.status}`;

  if (/activat/i.test(detail)) {
    throw new Error(
      "FormSubmit needs one-time activation. ACTION REQUIRED: open the " +
        `"Activate Form" email FormSubmit just sent to ${to} and click the ` +
        "link. Submissions deliver immediately afterwards.",
    );
  }

  throw new Error(`FormSubmit refused the submission: ${detail}`);
}

/* -------------------------------------------------------------------------- */

function originHeader() {
  const url = site.seo?.url;
  if (!isPlaceholder(url)) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

async function readBody(response) {
  try {
    return JSON.stringify(await response.json());
  } catch {
    return await response.text().catch(() => "");
  }
}

function plainText({ from, replyTo, message, submittedAt }) {
  return [`From: ${from} <${replyTo}>`, `Sent: ${submittedAt}`, "", message].join(
    "\n",
  );
}

/* Deliberately table-and-inline-styles plain. Mail clients strip <style> blocks,
   ignore flexbox and rewrite classes; anything more elaborate renders worse. */
function renderHtml({ from, replyTo, message }) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#1a1c1e;max-width:600px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7075">Portfolio enquiry</p>
  <h2 style="margin:0 0 20px;font-size:19px;font-weight:600">${escapeHtml(from)}</h2>
  <p style="margin:0 0 20px;font-size:14px;color:#55595e">
    <a href="mailto:${escapeHtml(replyTo)}" style="color:#2f63c4">${escapeHtml(replyTo)}</a>
  </p>
  <div style="padding:16px 18px;border-left:3px solid #5b8def;background:#f5f6f7;border-radius:4px">
    <div style="white-space:pre-wrap;font-size:15px">${escapeHtml(message)}</div>
  </div>
  <p style="margin:24px 0 0;font-size:12px;color:#8b9096">Sent from the contact form on your portfolio. Reply directly to answer.</p>
</div>`;
}
