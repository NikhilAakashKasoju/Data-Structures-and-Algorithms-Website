"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { CONTACT, CONTACT_PLACEHOLDERS } from "@/lib/contact";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/**
 * CONTACT.
 *
 * Copy and the WhatsApp hand-off on the left, form panel on the right —
 * matching the Data Engineering site.
 *
 * PROGRESSIVE ENHANCEMENT. The form carries a real `action` and
 * `method="post"`, so with JavaScript disabled it submits normally and the
 * browser navigates to whatever the backend returns. With JavaScript it is
 * intercepted and posted with fetch so the reader stays put and the result
 * appears inline. Both paths hit the same endpoint.
 *
 * WHILE THE ENDPOINT IS UNSET the form renders in its real layout but submit
 * is disabled and says why. It does not pretend to send. A form that reports
 * success into nothing is the worst outcome here: the sender believes they
 * have been in touch and simply never hears back.
 *
 * STATUS uses role="status" + aria-live="polite" so the result is announced
 * without stealing focus from whatever the user is typing.
 */
export function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 mx-auto max-w-[1300px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20"
      >
        {/* ── Left: the ask ── */}
        <div>
          <motion.p variants={fadeUp} className="eyebrow">
            / Ready to start?
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
          >
            Start solving, not
            <br className="hidden sm:inline" /> memorising.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-muted"
          >
            Leave your details and we&apos;ll reply about the course — what it
            covers, how it is taught, and where to start
            {CONTACT.whatsappUrl
              ? " — or join the WhatsApp channel for announcements."
              : "."}
          </motion.p>

          {/* Rendered only when there is a real channel to join. */}
          {CONTACT.whatsappUrl && (
            <motion.div variants={fadeUp} className="mt-8">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-[44px] gap-2.5"
              >
                <WhatsAppGlyph />
                Join the WhatsApp channel
              </a>
            </motion.div>
          )}
        </div>

        {/* ── Right: the form ── */}
        <motion.div variants={fadeUp} className="relative">
          {/* Halo as a blurred sibling, not a box-shadow. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[40px] bg-purple/15 blur-3xl"
          />
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

function ContactForm() {
  const endpoint = CONTACT.formEndpoint;
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) return;

    const form = e.currentTarget;
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        /* Asks the backend for JSON. The same endpoint answers a plain form
           post with HTML, which is what the no-JS path relies on. */
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (res.ok && data?.ok !== false) {
        setStatus("sent");
        setMessage("Thanks — we'll reply by email.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <form
      {...(endpoint ? { action: endpoint, method: "post" } : {})}
      onSubmit={onSubmit}
      noValidate={false}
      className="rounded-3xl border border-line bg-surface p-6 backdrop-blur-sm sm:p-8 md:p-10"
    >
      {/* Honeypot — off-screen and out of the accessibility tree. A bot that
          fills it should be rejected server-side. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id="name"
        label="Name"
        autoComplete="name"
        placeholder={CONTACT_PLACEHOLDERS.name}
        required
      />
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder={CONTACT_PLACEHOLDERS.email}
        required
      />
      <Field
        id="message"
        label="Message"
        optional
        textarea
        placeholder={CONTACT_PLACEHOLDERS.message}
      />

      <button
        type="submit"
        disabled={!endpoint || status === "sending"}
        className="btn-primary mt-7 min-h-[48px] w-full disabled:cursor-not-allowed disabled:opacity-55"
      >
        {status === "sending" ? "Sending…" : "Submit"}
        {status !== "sending" && <SendGlyph />}
      </button>

      {/* Always present so a screen reader has a live region to watch before
          the first message ever arrives. */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-[1.5em] text-center text-[14px] ${
          status === "error" ? "text-magenta" : "text-muted"
        }`}
      >
        {message ||
          (!endpoint ? "Form endpoint not connected yet." : "")}
      </p>

      <p className="mt-1 text-center text-[13px] leading-relaxed text-muted">
        {CONTACT.privacyNote}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  textarea = false,
  required = false,
  optional = false,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  /* A real <label for>, above the field. The placeholder is an example, not a
     label: it vanishes the moment someone types, which strands anyone who is
     interrupted mid-form with an unlabelled box. */
  /* Full-strength `muted` on the placeholder, not a faded version of it. At
     70% alpha it measured 2.36:1 on the dark theme — placeholders are exempt
     from the 4.5:1 rule because the visible label carries the meaning, but an
     example nobody can read is not an example. */
  const cls =
    "mt-2 w-full rounded-xl border border-line bg-chip/30 px-4 py-3 text-[15.5px] " +
    "transition-colors placeholder:text-muted hover:border-line-strong " +
    "focus:border-purple-2 focus:outline-none";

  return (
    <p className="mt-6 first:mt-0">
      <label htmlFor={id} className="label">
        {label}
        {/* Leading space is inside the string, not just visual margin — without
            it the accessible name reads "Messageoptional". */}
        {optional && <span className="ml-1.5">{" (optional)"}</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={id}
          rows={4}
          placeholder={placeholder}
          className={`${cls} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </p>
  );
}

function SendGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 1.5 7.5 8.5M14.5 1.5l-4.5 13-2.5-6-6-2.5 13-4.5Z" />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[17px] w-[17px] shrink-0"
      fill="currentColor"
      style={{ color: "#25D366" }}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
