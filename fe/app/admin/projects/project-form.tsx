"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Check, FloppyDisk } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ApiError } from "@/lib/auth-api";
import type { Project, ProjectInput } from "@/lib/project-api";

type ProjectField = {
  name: "number" | "slug" | "title" | "label" | "github" | "visualKey" | "iconKey" | "displayOrder";
  label: string;
  helper?: string;
  optional?: boolean;
  type?: "text" | "number";
};

const fields: ProjectField[] = [
  { name: "number", label: "Project number", helper: "Short display index, for example 01." },
  { name: "slug", label: "URL slug", helper: "Stable public identifier; use lowercase words and hyphens." },
  { name: "title", label: "Project title" },
  { name: "label", label: "Short label" },
  { name: "github", label: "GitHub URL", optional: true },
  { name: "visualKey", label: "Visual key", optional: true },
  { name: "iconKey", label: "Icon key" },
  { name: "displayOrder", label: "Display order", type: "number" },
];

const httpsUrl = z.string().refine(
  (value) => {
    if (value === "") return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  },
  "Use a valid HTTPS URL",
);

const projectSchema = z.object({
  number: z.string().trim().min(1, "Project number is required").max(10, "Use 10 characters or fewer"),
  slug: z.string().trim().min(1, "Project slug is required").max(180, "Use 180 characters or fewer").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  title: z.string().trim().min(1, "Project title is required").max(160, "Use 160 characters or fewer"),
  label: z.string().trim().min(1, "Project label is required").max(160, "Use 160 characters or fewer"),
  description: z.string().trim().min(1, "Project description is required"),
  github: httpsUrl.max(500, "Use 500 characters or fewer"),
  visualKey: z.string().trim().max(80, "Use 80 characters or fewer"),
  iconKey: z.string().trim().min(1, "Icon key is required").max(80, "Use 80 characters or fewer"),
  isFeatured: z.boolean(),
  displayOrder: z.preprocess((value) => value === "" ? Number.NaN : Number(value), z.number().int("Use a whole number").min(0, "Display order cannot be negative")),
  highlights: z.string().trim().refine((value) => value.split("\n").some((line) => line.trim()), "Add at least one highlight"),
  tech: z.string().trim().refine((value) => value.split("\n").some((line) => line.trim()), "Add at least one technology").refine((value) => value.split("\n").every((line) => line.trim().length <= 120), "Each technology must be 120 characters or fewer"),
});

type ProjectFormInput = z.input<typeof projectSchema>;
type ProjectFormValues = z.output<typeof projectSchema>;

function lines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function defaults(project?: Project): ProjectFormInput {
  return {
    number: project?.number ?? "",
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    label: project?.label ?? "",
    description: project?.description ?? "",
    github: project?.github ?? "",
    visualKey: project?.visualKey ?? "",
    iconKey: project?.iconKey ?? "",
    isFeatured: project?.isFeatured ?? false,
    displayOrder: project?.displayOrder ?? 0,
    highlights: project?.highlights.join("\n") ?? "",
    tech: project?.tech.join("\n") ?? "",
  };
}

export default function ProjectForm({ project, pending, error, onSubmit }: {
  project?: Project;
  pending: boolean;
  error: unknown;
  onSubmit: (input: ProjectInput) => void;
}) {
  const apiError = axios.isAxiosError<ApiError>(error) ? error.response?.data : null;
  const form = useForm<ProjectFormInput, unknown, ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaults(project),
  });
  const { register, handleSubmit, formState: { errors } } = form;
  const fieldError = (name: keyof ProjectFormValues) => errors[name]?.message ?? apiError?.fieldErrors[name];
  const submit = (data: ProjectFormValues) => onSubmit({
    ...data,
    github: data.github.trim() || null,
    visualKey: data.visualKey.trim() || null,
    highlights: lines(data.highlights),
    tech: lines(data.tech),
  });

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="mt-8 w-full">
      <section className="border border-black/[.08] bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-zinc-900/40">
        <div className="border-b border-black/[.07] pb-5 dark:border-white/10"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Core information</p><h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">Identity and presentation</h2></div>
        <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {fields.map(({ name, label, ...field }) => {
            const message = fieldError(name);
            return <label key={name} className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"><span>{label}{field.optional && <span className="ml-1 font-normal text-zinc-400">Optional</span>}</span><input {...register(name)} type={field.type ?? "text"} aria-invalid={Boolean(message)} className="admin-field" />{field.helper && <span className="mt-1.5 block text-[11px] leading-5 text-zinc-400">{field.helper}</span>}{message && <span className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{message}</span>}</label>;
          })}
          <label className="block text-xs font-medium text-zinc-700 sm:col-span-2 dark:text-zinc-300">Description<textarea {...register("description")} rows={5} aria-invalid={Boolean(fieldError("description"))} className="admin-field resize-y" />{fieldError("description") && <span className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{fieldError("description")}</span>}</label>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        {(["highlights", "tech"] as const).map((name) => <label key={name} className="border border-black/[.08] bg-white p-5 text-xs font-medium text-zinc-700 sm:p-7 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300"><span className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">{name === "highlights" ? "Project highlights" : "Technology stack"}</span><textarea {...register(name)} rows={8} aria-invalid={Boolean(fieldError(name))} className="admin-field resize-y" /><span className="mt-1.5 block text-[11px] font-normal leading-5 text-zinc-400">One {name === "highlights" ? "outcome or implementation detail" : "technology label"} per line.</span>{fieldError(name) && <span className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{fieldError(name)}</span>}</label>)}
      </section>

      <label className="mt-5 flex cursor-pointer items-center gap-3 border border-black/[.08] bg-white p-5 text-sm dark:border-white/10 dark:bg-zinc-900/40"><input {...register("isFeatured")} type="checkbox" className="peer sr-only" /><span className="grid size-5 place-items-center border border-zinc-300 text-transparent peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white dark:border-zinc-700"><Check size={13} weight="bold" /></span><span><strong className="block text-xs">Featured project</strong><span className="mt-1 block text-[11px] text-zinc-400">Give this project stronger emphasis on the public portfolio.</span></span></label>
      {apiError && <p className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">{apiError.message}</p>}
      <div className="sticky bottom-0 mt-7 flex items-center justify-between gap-4 border-t border-black/[.08] bg-[#f7f6f3]/95 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"><p className="hidden text-xs text-zinc-400 sm:block">Required fields must be completed before saving.</p><button disabled={pending} className="ml-auto inline-flex h-11 items-center gap-2 bg-zinc-950 px-5 text-xs font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"><FloppyDisk size={15} weight="bold" />{pending ? "Saving…" : "Save project"}</button></div>
    </form>
  );
}
