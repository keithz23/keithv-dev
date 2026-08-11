"use client";

import axios from "axios";
import { Check, FloppyDisk } from "@phosphor-icons/react";
import { FormEvent } from "react";
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

export default function ProjectForm({ project, pending, error, onSubmit }: { project?: Project; pending: boolean; error: unknown; onSubmit: (input: ProjectInput) => void }) {
  const apiError = axios.isAxiosError<ApiError>(error) ? error.response?.data : null;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = (name: string) => String(data.get(name) ?? "").split("\n").map((value) => value.trim()).filter(Boolean);
    onSubmit({ number: String(data.get("number") ?? "").trim(), slug: String(data.get("slug") ?? "").trim(), title: String(data.get("title") ?? "").trim(), label: String(data.get("label") ?? "").trim(), description: String(data.get("description") ?? "").trim(), github: String(data.get("github") ?? "").trim() || null, visualKey: String(data.get("visualKey") ?? "").trim() || null, iconKey: String(data.get("iconKey") ?? "").trim(), isFeatured: data.get("isFeatured") === "on", displayOrder: Number(data.get("displayOrder")), highlights: lines("highlights"), tech: lines("tech") });
  };
  const fieldError = (name: string) => apiError?.fieldErrors[name];

  return (
    <form onSubmit={submit} className="mt-8 w-full">
      <section className="border border-black/[.08] bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-zinc-900/40">
        <div className="border-b border-black/[.07] pb-5 dark:border-white/10"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Core information</p><h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">Identity and presentation</h2></div>
        <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {fields.map(({ name, label, ...field }) => <label key={name} className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"><span>{label}{field.optional && <span className="ml-1 font-normal text-zinc-400">Optional</span>}</span><input name={name} type={field.type ?? "text"} required={!field.optional} defaultValue={project?.[name] ?? ""} aria-invalid={Boolean(fieldError(name))} className="admin-field" />{field.helper && <span className="mt-1.5 block text-[11px] leading-5 text-zinc-400">{field.helper}</span>}{fieldError(name) && <span className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{fieldError(name)}</span>}</label>)}
          <label className="block text-xs font-medium text-zinc-700 sm:col-span-2 dark:text-zinc-300">Description<textarea name="description" required rows={5} defaultValue={project?.description} aria-invalid={Boolean(fieldError("description"))} className="admin-field resize-y" />{fieldError("description") && <span className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{fieldError("description")}</span>}</label>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <label className="border border-black/[.08] bg-white p-5 text-xs font-medium text-zinc-700 sm:p-7 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300"><span className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Project highlights</span><textarea name="highlights" required rows={8} defaultValue={project?.highlights.join("\n")} className="admin-field resize-y" /><span className="mt-1.5 block text-[11px] font-normal leading-5 text-zinc-400">One outcome or implementation detail per line.</span></label>
        <label className="border border-black/[.08] bg-white p-5 text-xs font-medium text-zinc-700 sm:p-7 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-300"><span className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Technology stack</span><textarea name="tech" required rows={8} defaultValue={project?.tech.join("\n")} className="admin-field resize-y" /><span className="mt-1.5 block text-[11px] font-normal leading-5 text-zinc-400">One technology label per line.</span></label>
      </section>

      <label className="mt-5 flex cursor-pointer items-center gap-3 border border-black/[.08] bg-white p-5 text-sm dark:border-white/10 dark:bg-zinc-900/40"><input name="isFeatured" type="checkbox" defaultChecked={project?.isFeatured} className="peer sr-only" /><span className="grid size-5 place-items-center border border-zinc-300 text-transparent peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:text-white dark:border-zinc-700"><Check size={13} weight="bold" /></span><span><strong className="block text-xs">Featured project</strong><span className="mt-1 block text-[11px] text-zinc-400">Give this project stronger emphasis on the public portfolio.</span></span></label>
      {apiError && <p className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">{apiError.message}</p>}
      <div className="sticky bottom-0 mt-7 flex items-center justify-between gap-4 border-t border-black/[.08] bg-[#f7f6f3]/95 py-4 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"><p className="hidden text-xs text-zinc-400 sm:block">Required fields must be completed before saving.</p><button disabled={pending} className="ml-auto inline-flex h-11 items-center gap-2 bg-zinc-950 px-5 text-xs font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"><FloppyDisk size={15} weight="bold" />{pending ? "Saving…" : "Save project"}</button></div>
    </form>
  );
}
