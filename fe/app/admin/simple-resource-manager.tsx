"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
import { PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import type { ApiError } from "@/lib/auth-api";
import { useAdminResource, useCreateAdminResource, useDeleteAdminResource, usePatchAdminResource } from "@/lib/portfolio-admin-queries";
import type { AdminRecord } from "@/lib/portfolio-admin-api";

export type Field = { name: string; label: string; type?: "text" | "number" | "url" | "textarea" | "lines"; helper?: string };

function schemaFor(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((field) => {
    if (field.type === "number") return [field.name, z.number().int("Use a whole number").min(0, "Cannot be negative")];
    if (field.type === "url") return [field.name, z.string().trim().min(1, "This field is required").url("Enter a valid URL")];
    if (field.type === "lines") return [field.name, z.string().trim().refine((value) => value.split("\n").some((line) => line.trim()), "Add at least one item")];
    return [field.name, z.string().trim().min(1, "This field is required")];
  })));
}

function recordTitle(item: AdminRecord) {
  return String(item.title ?? item.degree ?? item.label ?? item.role ?? "Untitled record");
}

export default function SimpleResourceManager({ resource, title, description, fields }: { resource: string; title: string; description?: string; fields: Field[] }) {
  const query = useAdminResource<AdminRecord>(resource);
  const create = useCreateAdminResource<AdminRecord>(resource);
  const patch = usePatchAdminResource<AdminRecord>(resource);
  const remove = useDeleteAdminResource(resource);
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const mutation = editing ? patch : create;
  const apiError = axios.isAxiosError<ApiError>(mutation.error) ? mutation.error.response?.data : null;
  const form = useForm({
    resolver: zodResolver(schemaFor(fields)),
  });

  const closeForm = () => { setEditing(null); setShowForm(false); mutation.reset(); };
  const submit = (values: Record<string, unknown>) => {
    const input = Object.fromEntries(fields.map((field) => {
      const value = values[field.name];
      return [field.name, field.type === "lines" && typeof value === "string" ? value.split("\n").map((line) => line.trim()).filter(Boolean) : value];
    }));
    if (editing) patch.mutate({ id: editing.id, input }, { onSuccess: closeForm });
    else create.mutate(input, { onSuccess: closeForm });
  };

  return (
    <div className="w-full">
      <header className="flex flex-col gap-6 border-b border-black/[.08] pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
        <div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Content / {title}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">{title}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">{description ?? `Create, order and maintain ${title.toLowerCase()} shown on the public portfolio.`}</p></div>
        <button type="button" onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:translate-y-px dark:bg-zinc-100 dark:text-zinc-950"><Plus size={15} weight="bold" /> New record</button>
      </header>

      {(showForm || editing) && (
        <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-8 border border-black/[.08] bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-zinc-900/40">
          <div className="flex items-start justify-between gap-5 border-b border-black/[.07] pb-5 dark:border-white/10"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">{editing ? "Edit record" : "New record"}</p><h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">{editing ? recordTitle(editing) : `Add ${title.toLowerCase()}`}</h2></div><button type="button" onClick={closeForm} aria-label="Close form" className="grid size-9 place-items-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"><X size={16} weight="bold" /></button></div>
          <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {fields.map((field) => {
              const wide = field.type === "textarea" || field.type === "lines";
              const value = Array.isArray(editing?.[field.name]) ? (editing?.[field.name] as string[]).join("\n") : String(editing?.[field.name] ?? "");
              const clientError = form.formState.errors[field.name]?.message;
              const error = typeof clientError === "string" ? clientError : apiError?.fieldErrors[field.name];
              return <label key={field.name} className={`block text-xs font-medium text-zinc-700 dark:text-zinc-300 ${wide ? "sm:col-span-2" : ""}`}><span>{field.label}</span>{wide ? <textarea {...form.register(field.name)} rows={field.type === "lines" ? 6 : 4} defaultValue={value} aria-invalid={Boolean(error)} className="admin-field resize-y" /> : <input {...form.register(field.name, field.type === "number" ? { valueAsNumber: true } : undefined)} type={field.type ?? "text"} defaultValue={value} aria-invalid={Boolean(error)} className="admin-field" />}{field.helper && <span className="mt-1.5 block text-[11px] leading-5 text-zinc-400">{field.helper}</span>}{error && <span className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{error}</span>}</label>;
            })}
          </div>
          {apiError && <p className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">{apiError.message}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-black/[.07] pt-5 dark:border-white/10"><button disabled={mutation.isPending} className="h-10 bg-zinc-950 px-5 text-xs font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950">{mutation.isPending ? "Saving…" : "Save changes"}</button><button type="button" onClick={closeForm} className="h-10 px-4 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white">Cancel</button></div>
        </form>
      )}

      {query.isPending && <div className="mt-8 space-y-px border-y border-black/[.08] dark:border-white/10">{[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse border-b border-black/[.05] bg-white/40 last:border-0 dark:border-white/5 dark:bg-white/[.02]" />)}</div>}
      {query.isError && <div className="mt-8 border-l-2 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">Could not load {title.toLowerCase()}.</div>}
      {query.data?.length === 0 && <div className="mt-8 border-y border-black/[.08] py-16 text-center dark:border-white/10"><p className="text-lg font-semibold">No records yet</p><p className="mt-2 text-sm text-zinc-500">Use “New record” to populate this collection.</p></div>}
      {query.data && query.data.length > 0 && <div className="mt-8 border-t border-black/[.08] dark:border-white/10">{query.data.map((item, index) => <article key={item.id} className="grid gap-4 border-b border-black/[.08] py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_6rem_auto] sm:items-center dark:border-white/10"><span className="font-mono text-[10px] text-zinc-400">{String(index + 1).padStart(2, "0")}</span><div><p className="font-semibold tracking-[-.015em]">{recordTitle(item)}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-zinc-400">Display order {String(item.displayOrder ?? "—")}</p></div><span className="hidden text-right font-mono text-[10px] text-zinc-400 sm:block">{String(item.index ?? "")}</span><div className="flex gap-1 sm:justify-end"><button type="button" onClick={() => { setEditing(item); setShowForm(true); }} aria-label={`Edit ${recordTitle(item)}`} className="grid size-9 place-items-center text-zinc-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"><PencilSimple size={16} weight="bold" /></button><button type="button" disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete ${recordTitle(item)}?`)) remove.mutate(item.id); }} aria-label={`Delete ${recordTitle(item)}`} className="grid size-9 place-items-center text-zinc-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 dark:hover:bg-red-950/30 dark:hover:text-red-300"><Trash size={16} weight="bold" /></button></div></article>)}</div>}
    </div>
  );
}
