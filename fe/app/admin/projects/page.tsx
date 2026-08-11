"use client";

import { ArrowRight, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import { useAdminProjects, useDeleteProject } from "@/lib/project-queries";

function ProjectsSkeleton() {
  return <div className="mt-8 space-y-px border-y border-black/[.08] dark:border-white/10">{[0, 1, 2].map((item) => <div key={item} className="grid grid-cols-[3rem_1fr] gap-4 py-6"><span className="h-3 animate-pulse bg-zinc-200 dark:bg-zinc-800" /><span className="h-5 max-w-sm animate-pulse bg-zinc-200 dark:bg-zinc-800" /></div>)}</div>;
}

export default function AdminProjectsPage() {
  const query = useAdminProjects();
  const remove = useDeleteProject();

  return (
    <div className="w-full">
      <header className="flex flex-col gap-6 border-b border-black/[.08] pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
        <div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Content / Projects</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">Selected work</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Manage public case studies, presentation order and featured status.</p></div>
        <Link href="/admin/projects/new" className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:translate-y-px dark:bg-zinc-100 dark:text-zinc-950"><Plus size={15} weight="bold" /> New project</Link>
      </header>

      {query.isPending && <ProjectsSkeleton />}
      {query.isError && <div className="mt-8 border-l-2 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">Projects could not be loaded. Check the API connection and try again.</div>}
      {query.data?.length === 0 && <div className="mt-8 border-y border-black/[.08] py-16 text-center dark:border-white/10"><p className="text-lg font-semibold">No projects yet</p><p className="mt-2 text-sm text-zinc-500">Create the first case study for the public portfolio.</p><Link href="/admin/projects/new" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">Create project <ArrowRight size={15} weight="bold" /></Link></div>}

      {query.data && query.data.length > 0 && (
        <div className="mt-8 border-t border-black/[.08] dark:border-white/10">
          <div className="hidden grid-cols-[3.5rem_minmax(0,1fr)_8rem_7rem_7rem] gap-4 border-b border-black/[.08] py-3 font-mono text-[9px] uppercase tracking-[.16em] text-zinc-400 md:grid dark:border-white/10"><span>No.</span><span>Project</span><span>Status</span><span>Order</span><span className="text-right">Actions</span></div>
          {query.data.map((project) => (
            <article key={project.id} className="group grid gap-5 border-b border-black/[.08] py-6 transition-colors hover:bg-white/60 md:grid-cols-[3.5rem_minmax(0,1fr)_8rem_7rem_7rem] md:items-center dark:border-white/10 dark:hover:bg-white/[.025]">
              <span className="font-mono text-xs text-zinc-400">{project.number}</span>
              <div className="min-w-0"><p className="font-semibold tracking-[-.02em]">{project.title}</p><p className="mt-1 truncate font-mono text-[11px] text-zinc-400">/{project.slug}</p><div className="mt-3 flex flex-wrap gap-1.5 md:hidden">{project.tech.slice(0, 3).map((tech) => <span key={tech} className="bg-zinc-200/70 px-2 py-1 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{tech}</span>)}</div></div>
              <span className={`w-fit px-2 py-1 font-mono text-[9px] uppercase tracking-[.12em] ${project.isFeatured ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800"}`}>{project.isFeatured ? "Featured" : "Archive"}</span>
              <span className="font-mono text-xs text-zinc-500"><span className="md:hidden">Display order </span>{project.displayOrder}</span>
              <div className="flex items-center gap-1 md:justify-end">
                <Link href={`/admin/projects/${project.id}/edit`} aria-label={`Edit ${project.title}`} className="grid size-9 place-items-center text-zinc-500 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"><PencilSimple size={16} weight="bold" /></Link>
                <button type="button" disabled={remove.isPending} aria-label={`Delete ${project.title}`} onClick={() => { if (window.confirm(`Delete ${project.title}?`)) remove.mutate(project.id); }} className="grid size-9 place-items-center text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-40 dark:hover:bg-red-950/30 dark:hover:text-red-300"><Trash size={16} weight="bold" /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
