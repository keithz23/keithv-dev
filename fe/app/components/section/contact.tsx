"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  Briefcase,
  Code,
  EnvelopeSimple,
  MapPin,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Profile, SocialLink } from "@/lib/portfolio-api";
import { useSendContactMessage } from "@/lib/contact-queries";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter at least two characters.").max(120, "Use 120 characters or fewer."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address.").max(254, "Use 254 characters or fewer."),
  message: z.string().trim().min(20, "Add a little more context—at least 20 characters.").max(5000, "Use 5000 characters or fewer."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  const mutation = useSendContactMessage();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  const github = socialLinks.find((link) => link.label === "GitHub");
  const linkedIn = socialLinks.find((link) => link.label === "LinkedIn");

  const submit = (data: ContactFormValues) => mutation.mutate(data, { onSuccess: () => form.reset() });
  const fieldError = (name: keyof ContactFormValues) => form.formState.errors[name]?.message;

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
            onSubmit={form.handleSubmit(submit)}
            noValidate
            className="border-t border-zinc-900 pt-7 dark:border-zinc-100"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <label className="field-label">
                Your name
                <input
                  {...form.register("name")}
                  autoComplete="name"
                  placeholder="How should I address you?"
                  aria-invalid={Boolean(fieldError("name"))}
                  aria-describedby={fieldError("name") ? "name-error" : undefined}
                  className="field-input"
                />
                {fieldError("name") && (
                  <span
                    id="name-error"
                    className="field-error"
                    aria-live="polite"
                  >
                    {fieldError("name")}
                  </span>
                )}
              </label>
              <label className="field-label">
                Email address
                <input
                  {...form.register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={Boolean(fieldError("email"))}
                  aria-describedby={fieldError("email") ? "email-error" : undefined}
                  className="field-input"
                />
                {fieldError("email") && (
                  <span
                    id="email-error"
                    className="field-error"
                    aria-live="polite"
                  >
                    {fieldError("email")}
                  </span>
                )}
              </label>
            </div>
            <label className="field-label mt-7">
              Project or opportunity
              <textarea
                {...form.register("message")}
                rows={6}
                placeholder="A little context goes a long way..."
                aria-invalid={Boolean(fieldError("message"))}
                aria-describedby={
                  fieldError("message") ? "message-error" : "message-help"
                }
                className="field-input resize-none"
              />
              {fieldError("message") ? (
                <span
                  id="message-error"
                  className="field-error"
                  aria-live="polite"
                >
                    {fieldError("message")}
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
