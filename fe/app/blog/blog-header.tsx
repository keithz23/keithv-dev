"use client";

import { ArrowUpRight, CircleHalf, List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

export default function BlogHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const blogActive = pathname.startsWith("/blog");

  return (
    <header className="h-20 border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/75" aria-label="Blog navigation">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-10">
          <Link href="/" className="group flex w-fit items-center gap-3">
            <span className="grid h-9 w-9 place-items-center bg-zinc-900 transition-transform duration-300 group-hover:-rotate-3 dark:bg-zinc-100"><Image src="/logo.png" alt="Keith Vuong" width={36} height={36} priority /></span>
            <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Keith Vuong</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400 sm:block">Technical blog</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className="nav-link">Portfolio<span /></Link>
            <Link href="/blog" aria-current={blogActive ? "page" : undefined} className="nav-link">Writing<span /></Link>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle color theme" className="icon-button"><CircleHalf size={18} weight="regular" /></button>
            <Link href="/#contact" className="hidden h-10 items-center gap-1.5 border border-zinc-900 px-4 text-xs font-semibold transition-all hover:bg-zinc-900 hover:text-white sm:inline-flex dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-950">Start a conversation <ArrowUpRight size={14} /></Link>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open} className="icon-button md:hidden">{open ? <X size={18} /> : <List size={19} />}</button>
          </div>
        </div>
        {open && <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950"><Link href="/" onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-zinc-100 px-1 py-4 text-sm font-medium dark:border-zinc-900">Portfolio<span className="font-mono text-[10px] text-zinc-400">01</span></Link><Link href="/blog" onClick={() => setOpen(false)} className="flex items-center justify-between px-1 py-4 text-sm font-medium">Writing<span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">02</span></Link></div>}
      </nav>
    </header>
  );
}
