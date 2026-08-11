"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Code,
  EnvelopeSimple,
  MapPin,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import type { Profile, SocialLink } from "@/lib/portfolio-api";
import { useSendContactMessage } from "@/lib/contact-queries";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactSection({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
	const [errors, setErrors] = useState<FieldErrors>({});
  const mutation = useSendContactMessage();
  const github = socialLinks.find((link) => link.label === "GitHub");
  const linkedIn = socialLinks.find((link) => link.label === "LinkedIn");

  const clearError = (field: keyof FieldErrors) => {
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
		mutation.reset();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const nextErrors: FieldErrors = {};

    if (name.length < 2)
      nextErrors.name = "Please enter at least two characters.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Enter a valid email address.";
    if (message.length < 20)
      nextErrors.message = "Add a little more context—at least 20 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

		mutation.mutate({ name, email, message }, { onSuccess: () => formElement.reset() });
  };

  return (
    <section
      id="contact"
      className="section-shell border-t border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <header className="grid gap-8 lg:grid-cols-[.58fr_1.42fr] lg:gap-20">
          <p className="section-index">{profile.contactSectionIndex}</p>
          <h2 className="section-title max-w-[13ch]">
            {profile.contactHeadline}
          </h2>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[.58fr_1.42fr] lg:gap-20">
          <aside>
            <p className="max-w-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {profile.contactIntro}
            </p>
            <div className="mt-9 divide-y divide-zinc-300 border-y border-zinc-300 dark:divide-zinc-700 dark:border-zinc-700">
              <a href={`mailto:${profile.email}`} className="contact-row">
                <EnvelopeSimple size={19} weight="regular" />
                <span>
                  <small>{profile.contactEmailLabel}</small>
                  {profile.email}
                </span>
                <ArrowUpRight size={15} weight="regular" className="ml-auto" />
              </a>
              <div className="contact-row">
                <MapPin size={19} weight="regular" />
                <span>
                  <small>{profile.contactLocationLabel}</small>
                  {profile.location}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={github.label}
                  className="icon-button"
                >
                  <Code size={18} weight="regular" />
                </a>
              )}
              {linkedIn && (
                <a
                  href={linkedIn.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={linkedIn.label}
                  className="icon-button"
                >
                  <Briefcase size={18} weight="regular" />
                </a>
              )}
            </div>
          </aside>

          <form
            onSubmit={submit}
            noValidate
            className="border-t border-zinc-900 pt-7 dark:border-zinc-100"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <label className="field-label">
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  onChange={() => clearError("name")}
                  placeholder="How should I address you?"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="field-input"
                />
                {errors.name && (
                  <span
                    id="name-error"
                    className="field-error"
                    aria-live="polite"
                  >
                    {errors.name}
                  </span>
                )}
              </label>
              <label className="field-label">
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={() => clearError("email")}
                  placeholder="you@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="field-input"
                />
                {errors.email && (
                  <span
                    id="email-error"
                    className="field-error"
                    aria-live="polite"
                  >
                    {errors.email}
                  </span>
                )}
              </label>
            </div>
            <label className="field-label mt-7">
              Project or opportunity
              <textarea
                name="message"
                rows={6}
                onChange={() => clearError("message")}
                placeholder="A little context goes a long way..."
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "message-error" : "message-help"
                }
                className="field-input resize-none"
              />
              {errors.message ? (
                <span
                  id="message-error"
                  className="field-error"
                  aria-live="polite"
                >
                  {errors.message}
                </span>
              ) : (
                <span id="message-help" className="field-helper">
                  Include the goal, current stage, and any technical
                  constraints.
                </span>
              )}
            </label>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
				disabled={mutation.isPending}
                className="button-primary"
              >
				{mutation.isPending
                  ? "Sending..."
                  : profile.contactFormButtonLabel}{" "}
                <PaperPlaneTilt size={17} weight="regular" />
              </button>
              <p className="max-w-xs text-xs leading-5 text-zinc-500 dark:text-zinc-400">
				{mutation.isSuccess
                  ? "Message received. I will follow up soon."
					: mutation.isError
                    ? "Something went wrong. Please try again."
                    : profile.contactPrivacyNote}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
