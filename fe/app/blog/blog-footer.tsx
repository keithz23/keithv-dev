import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function BlogFooter() {
  return <footer className="border-t border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/40"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 text-xs text-zinc-500 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-10"><p>Notes on building useful software.</p><div className="flex gap-5"><Link href="/" className="footer-link">Portfolio <ArrowUpRight size={12} /></Link><a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub <ArrowUpRight size={12} /></a></div><p className="font-mono uppercase tracking-[.14em] md:text-right">Built with Next.js</p></div></footer>;
}
