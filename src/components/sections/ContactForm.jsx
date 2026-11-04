"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

import { submitContact } from "@/app/actions";
import { validateField, FIELD_LIMITS } from "@/lib/validation";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { EmailLink } from "@/components/contact/EmailLink";

const INITIAL_STATE ={ status: "idle", message: "", errors: {}, values: {} };

/**
 * Contact form.
 *
 * Built on React 19's `useActionState`, so it works as a plain HTML form
 * before hydration and progressively upgrades to inline validation and a
 * pending state once JavaScript loads.
 *
 * Error handling follows the accessible-forms rules rather than the pretty
 * ones: every input has a real <label>, errors are linked with
 * aria-describedby, invalid fields are marked aria-invalid, the summary is
 * announced through a live region, and focus moves to the first invalid field
 * on a failed submit.
 */
export function ContactForm({ email }) {
  const [state, formAction] = useActionState(submitContact, INITIAL_STATE);
  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [lastStatus, setLastStatus] = useState(state.status);
  const formRef = useRef(null);

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const errors = { ...clientErrors, ...state.errors };

  /* Move focus to the first field the server rejected. Without this a
     keyboard or screen-reader user has to hunt for what went wrong. */
  useEffect(() => {
    const firstInvalid = Object.keys(state.errors ?? {})[0];
    if (!firstInvalid) return;
    formRef.current?.elements?.[firstInvalid]?.focus();
  }, [state]);

  /* Clear validation state after a confirmed send. Adjusted during render
     rather than in an effect, so React corrects the state in the same pass
     instead of scheduling a second one. */
  if (lastStatus !== state.status) {
    setLastStatus(state.status);
    if (state.status === "success") {
      setClientErrors({});
      setTouched({});
    }
  }

  /* Resetting the <form> element itself is a DOM side effect, so it does
     belong in an effect. */
  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
  }, [state.status]);

  const handleBlur = (field) => (event) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setClientErrors((current) => ({
      ...current,
      [field]: validateField(field, event.target.value),
    }));
  };

  const handleChange = (field) => (event) => {
    // Only re-validate on change once the field has been visited, so the user
    // is not told they are wrong while still typing their first character.
    if (!touched[field]) return;
    setClientErrors((current) => ({
      ...current,
      [field]: validateField(field, event.target.value),
    }));
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col gap-5"
    >
      <Field
        id={nameId}
        name="name"
        label="Name"
        placeholder="Your name"
        autoComplete="name"
        maxLength={FIELD_LIMITS.name.max}
        error={errors.name}
        defaultValue={state.values?.name}
        onBlur={handleBlur("name")}
        onChange={handleChange("name")}
      />

      <Field
        id={emailId}
        name="email"
        type="email"
        label="Email"
        placeholder="you@company.com"
        autoComplete="email"
        inputMode="email"
        maxLength={FIELD_LIMITS.email.max}
        error={errors.email}
        defaultValue={state.values?.email}
        onBlur={handleBlur("email")}
        onChange={handleChange("email")}
      />

      <Field
        id={messageId}
        name="message"
        label="Message"
        placeholder="What are you building?"
        multiline
        maxLength={FIELD_LIMITS.message.max}
        error={errors.message}
        defaultValue={state.values?.message}
        onBlur={handleBlur("message")}
        onChange={handleChange("message")}
      />

      {/* Honeypot. Hidden from sight and from assistive tech, and skipped in
          the tab order — only a bot will ever fill it. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="company-field">Company (leave blank)</label>
        <input
          id="company-field"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <SubmitButton />

      {/* Status. `role="status"` announces changes without stealing focus. */}
      <div role="status" aria-live="polite" className="min-h-6">
        <AnimatePresence mode="wait" initial={false}>
          {state.status !== "idle" && state.message && (
            <StatusMessage
              key={state.status + state.message}
              status={state.status}
              message={state.message}
              email={email}
              /* Offer the direct route whenever the message did not get
                 through — but not for a validation error, where the fix is
                 in the form the visitor is already looking at. */
              showFallback={Object.keys(state.errors ?? {}).length === 0}
            />
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function SubmitButton() {
  // Reads the parent form's pending state — no prop drilling, and it stays
  // correct even if the action is swapped out.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "relative mt-1 flex h-12 cursor-pointer items-center justify-center gap-2 self-start rounded-full px-7",
        "bg-accent text-[0.9375rem] font-medium text-accent-fg",
        "transition-[background-color,opacity] duration-200",
        "hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)]",
        "disabled:cursor-wait disabled:opacity-80",
      )}
    >
      <span className={cn("flex items-center gap-2", pending && "opacity-0")}>
        Send message
        <Icon name="Send" size={15} />
      </span>
      {pending && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <Icon name="LoaderCircle" size={16} className="animate-spin" />
          Sending
        </span>
      )}
    </button>
  );
}

function StatusMessage({ status, message, email, showFallback }) {
  const reduceMotion = useReducedMotion();
  const isSuccess = status === "success";
  const isUndelivered =
    showFallback && (status === "unconfigured" || status === "error");

  return (
    <m.p
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-wrap items-start gap-2 rounded-md border p-3.5 text-sm",
        isSuccess
          ? "border-positive/40 bg-positive/10 text-text"
          : "border-line bg-surface-2 text-muted",
      )}
    >
      <Icon
        name={isSuccess ? "CircleCheck" : "CircleAlert"}
        size={16}
        className={cn(
          "mt-0.5 shrink-0",
          isSuccess ? "text-positive" : "text-accent-ink",
        )}
      />
      <span>
        {message}
        {isUndelivered && email && (
          <>
            {" "}
            <EmailLink className="cursor-pointer text-accent-ink underline decoration-1 underline-offset-4">
              {email}
            </EmailLink>
          </>
        )}
      </span>
    </m.p>
  );
}

function Field({
  id,
  name,
  label,
  error,
  multiline = false,
  ...props
}) {
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  const shared = {
    id,
    name,
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? errorId : undefined,
    className: cn(
      "w-full rounded-md border bg-surface-1 px-4 text-[0.9375rem] text-text",
      "transition-colors duration-200 outline-none",
      "placeholder:text-faint",
      invalid
        ? "border-negative"
        : "border-line hover:border-line-strong focus:border-line-accent",
      multiline ? "min-h-36 resize-y py-3.5 leading-relaxed" : "h-12",
    ),
    ...props,
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-text"
      >
        {label}
      </label>

      {multiline ? <textarea {...shared} rows={5} /> : <input {...shared} />}

      {/* Space is not reserved here on purpose: the error appears below the
          last field in a vertical stack, so it pushes nothing but itself. */}
      {invalid && (
        <p
          id={errorId}
          className="mt-2 flex items-center gap-1.5 text-sm text-negative"
        >
          <Icon name="CircleAlert" size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
