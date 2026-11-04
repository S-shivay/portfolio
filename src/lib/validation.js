/**
 * Contact form validation.
 *
 * Shared between the client (for instant feedback) and the server action (as
 * the authority). Client-side validation is a convenience; it is re-run on the
 * server because anything that only runs in the browser can be bypassed.
 */

export const FIELD_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 20, max: 2000 },
};

/* Deliberately permissive. Over-strict email regexes reject valid addresses
   (new TLDs, plus-addressing, unicode locals) far more often than they catch
   typos — the real check is whether the message arrives. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(name, rawValue) {
  const value = (rawValue ?? "").trim();

  switch (name) {
    case "name":
      if (!value) return "Please tell me your name.";
      if (value.length < FIELD_LIMITS.name.min)
        return "That looks a little short.";
      if (value.length > FIELD_LIMITS.name.max)
        return `Please keep this under ${FIELD_LIMITS.name.max} characters.`;
      return null;

    case "email":
      if (!value) return "An email address is needed to reply.";
      if (value.length > FIELD_LIMITS.email.max) return "That address is too long.";
      if (!EMAIL_PATTERN.test(value))
        return "That does not look like a valid email address.";
      return null;

    case "message":
      if (!value) return "Please add a message.";
      if (value.length < FIELD_LIMITS.message.min)
        return `A little more detail helps — at least ${FIELD_LIMITS.message.min} characters.`;
      if (value.length > FIELD_LIMITS.message.max)
        return `Please keep this under ${FIELD_LIMITS.message.max} characters.`;
      return null;

    default:
      return null;
  }
}

export function validateForm(values) {
  const errors = {};

  for (const field of ["name", "email", "message"]) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }

  return errors;
}
