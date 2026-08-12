"use client";

import {ArrowLeft} from "@phosphor-icons/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import ProjectForm from "../project-form";
import {useCreateProject} from "@/lib/project-queries";

export default function NewProjectPage() {
    const mutation = useCreateProject();
    const router = useRouter();
    return <div className="w-full"><Link href="/admin/projects"
                                         className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white"><ArrowLeft
        size={14} weight="bold"/> Projects</Link>
        <header className="mt-7 border-b border-black/[.08] pb-8 dark:border-white/10"><p
            className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Projects /
            New</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">Create project</h1><p
            className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Add a new case study to the public portfolio
            collection.</p></header>
        <ProjectForm pending={mutation.isPending} error={mutation.error}
                     onSubmit={(input) => mutation.mutate(input, {onSuccess: () => router.push("/admin/projects")})}/>
    </div>;
}
