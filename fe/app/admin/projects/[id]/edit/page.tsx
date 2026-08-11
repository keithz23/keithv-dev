"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import ProjectForm from "../../project-form";
import { useAdminProject, useUpdateProject } from "@/lib/project-queries";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useAdminProject(id);
  const mutation = useUpdateProject(id);
  const router = useRouter();
  if (query.isPending) return <div className="w-full"><div className="h-4 w-24 animate-pulse bg-zinc-200 dark:bg-zinc-800" /><div className="mt-8 h-12 max-w-lg animate-pulse bg-zinc-200 dark:bg-zinc-800" /><div className="mt-10 h-96 animate-pulse border border-black/[.06] bg-white/50 dark:border-white/10 dark:bg-white/[.02]" /></div>;
  if (query.isError) return <div className="w-full border-l-2 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">Project could not be loaded.</div>;
  return <div className="w-full"><Link href="/admin/projects" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white"><ArrowLeft size={14} weight="bold" /> Projects</Link><header className="mt-7 border-b border-black/[.08] pb-8 dark:border-white/10"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Projects / Edit</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">{query.data.title}</h1><p className="mt-3 font-mono text-[10px] text-zinc-400">/{query.data.slug}</p></header><ProjectForm project={query.data} pending={mutation.isPending} error={mutation.error} onSubmit={(input) => mutation.mutate(input, { onSuccess: () => router.push("/admin/projects") })} /></div>;
}
