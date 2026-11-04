/**
 * Compose-link builders.
 *
 * `mailto:` is the correct link for an email address, but it only does anything
 * if the visitor's device has a mail client registered as its handler. A large
 * share of people read mail in a browser tab and have never set one — for them
 * a bare mailto: link is a click that visibly does nothing, which on a contact
 * page is the worst possible outcome.
 *
 * So every place the address is offered also offers a webmail compose URL. The
 * mailto: stays the primary action, and stays a real href, so it still works
 * with JavaScript disabled and can be copied or middle-clicked.
 */

export const DEFAULT_SUBJECT = "Hello Sarang";

/* Percent-encoding for a query value. encodeURIComponent leaves a handful of
   sub-delimiters alone that some mail clients mis-parse inside a mailto:. */
const encode = (value) =>
  encodeURIComponent(value ?? "").replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );

/**
 * Builds one compose URL per route to a mail client.
 *
 * @param {object} options
 * @param {string} options.to      Recipient address.
 * @param {string} [options.subject]
 * @param {string} [options.body]
 */
export function buildComposeLinks({ to, subject = DEFAULT_SUBJECT, body = "" }) {
  const address = encode(to);
  const su = encode(subject);
  const text = encode(body);

  const query = [subject && `subject=${su}`, body && `body=${text}`]
    .filter(Boolean)
    .join("&");

  return {
    /* Handled by whatever the OS has registered — Outlook, Mail, Thunderbird. */
    mailto: `mailto:${to}${query ? `?${query}` : ""}`,

    /* `view=cm&fs=1` is Gmail's compose deep link. It works for personal and
       Workspace accounts, and prompts a sign-in if there is no active session. */
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${address}&su=${su}&body=${text}`,

    /* Covers outlook.com, hotmail and live.com in one URL. */
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${address}&subject=${su}&body=${text}`,

    yahoo: `https://compose.mail.yahoo.com/?to=${address}&subject=${su}&body=${text}`,
  };
}
