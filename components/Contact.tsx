"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { CONTACT, CONTACT_CHANNELS, type ContactChannel } from "@/lib/contact";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/**
 * CONTACT.
 *
 * Renders the form only when `CONTACT.formEndpoint` exists; otherwise it hands
 * off to real channels. Same shape as the live-class panel, and for the same
 * reason: a form that posts nowhere tells the sender they have been in touch
 * when they have not.
 *
 * PROGRESSIVE ENHANCEMENT. The form has a real `action` and `method="post"`,
 * so with JavaScript disabled it submits to the PHP endpoint and the browser
 * navigates to its response. With JavaScript it is intercepted and posted with
 * fetch, so the reader stays on the page and the result appears inline. The
 * endpoint answers both — HTML for a normal post, JSON when asked for it.
 *
 * STATUS MESSAGES use role="status" + aria-live="polite", so a screen reader
 * announces "Thanks — we'll reply by email" without stealing focus mid-typing.
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
        className="max-w-[62ch]"
      >
        <motion.p variants={fadeUp} className="eyebrow">
          / Get in touch
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-4 font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight"
        >
          Questions about the course?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[16.5px] leading-relaxed text-muted"
        >
          {CONTACT.formEndpoint
            ? "Send a message and we'll reply by email."
            : "The quickest routes to a real answer, in order."}
        </motion.p>
      </motion.div>

      {CONTACT.formEndpoint ? (
        <ContactForm endpoint={CONTACT.formEndpoint} />
      ) : (
        <ChannelHandoff />
      )}
    </section>
  );
}

function ChannelHandoff() {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger}
      className="mt-12 grid gap-4 md:grid-cols-3"
    >
      {CONTACT_CHANNELS.map((c) => (
        <ChannelCard key={c.href} channel={c} />
      ))}
    </motion.ul>
  );
}

function ChannelCard({ channel }: { channel: ContactChannel }) {
  return (
    <motion.li variants={fadeUp}>
      <a
        href={channel.href}
        {...(channel.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-purple/35 hover:bg-surface-2"
      >
        <h3 className="flex items-center gap-2 font-display text-[19px] font-semibold leading-snug">
          {channel.label}
          {channel.external && <ExternalGlyph />}
        </h3>
        <p className="mt-2 text-[15.5px] leading-relaxed text-muted">
          {channel.description}
        </p>
      </a>
    </motion.li>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

function ContactForm({ endpoint }: { endpoint: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        /* Tells the PHP endpoint to answer with JSON instead of an HTML
           page — the same handler serves both the JS and no-JS paths. */
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (res.ok && data?.ok) {
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
    <motion.form
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      action={endpoint}
      method="post"
      onSubmit={onSubmit}
      className="mt-12 max-w-[560px]"
    >
      {/* Honeypot. Hidden from sight AND from screen readers, and labelled so
          a password manager does not try to fill it. A bot that fills it is
          rejected server-side. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="name" label="Name" autoComplete="name" required />
      <Field id="email" label="Email" type="email" autoComplete="email" required />
      <Field id="message" label="Message" textarea />

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary mt-6 min-h-[44px] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {/* Always in the DOM, so a screen reader has a live region to watch
          before the first message ever arrives. */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.5em] text-[15px] ${
          status === "error" ? "text-magenta" : "text-muted"
        }`}
      >
        {message}
      </p>

      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
        {CONTACT.privacyNote}
      </p>
    </motion.form>
  );
}

function Field({
  id,
  label,
  type = "text",
  textarea = false,
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  /* A real <label htmlFor>, not a placeholder standing in for one. A
     placeholder disappears the moment someone types, which leaves anyone who
     is interrupted mid-form with an unlabelled box. */
  const cls =
    "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15.5px] transition-colors placeholder:text-muted hover:border-line-strong focus:border-purple-2 focus:outline-none";

  return (
    <p className="mt-5 first:mt-0">
      <label htmlFor={id} className="label">
        {label}
        {!required && <span className="ml-1.5 normal-case">(optional)</span>}
      </label>
      {textarea ? (
        <textarea id={id} name={id} rows={4} className={cls} />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
        />
      )}
    </p>
  );
}

function ExternalGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-[12px] w-[12px] shrink-0 text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h7v7M13 3 4 12" />
    </svg>
  );
}
