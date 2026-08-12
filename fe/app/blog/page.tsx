"use client";

import { ArrowRight, Check, MagnifyingGlass } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import BlogFooter from "./blog-footer";
import BlogHeader from "./blog-header";
import BlogVisual from "./blog-visual";
import { useBlogPosts, useBlogTags } from "@/lib/blog-queries";

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState("all");
  const [query, setQuery] = useState("");
  const postsQuery = useBlogPosts({
    page: 0,
    size: 50,
    tag: activeTag === "all" ? undefined : activeTag,
  });
  const tagsQuery = useBlogTags();
  const tags = tagsQuery.data ?? [];
  const filteredPosts = useMemo(() => (postsQuery.data?.content ?? []).filter((post) => {
    const searchable = `${post.title} ${post.excerpt} ${post.tags.map((tag) => tag.name).join(" ")}`.toLowerCase();
    return searchable.includes(query.toLowerCase().trim());
  }), [postsQuery.data?.content, query]);
  const featured = filteredPosts[0];

  return <div className="min-h-[100dvh] overflow-x-clip bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    <BlogHeader />
    <main id="main-content">
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div><p className="section-index">Technical blog / 2026</p><h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[.96] tracking-[-.06em] text-zinc-950 sm:text-7xl dark:text-zinc-50">Notes from the systems behind the screen.</h1></div>
            <p className="max-w-md pb-1 text-sm leading-7 text-zinc-500 dark:text-zinc-400">Practical writing on backend architecture, security, and the small decisions that make software easier to trust.</p>
          </div>
          {postsQuery.isPending && <div className="mt-16 h-72 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/70" />}
          {postsQuery.isError && <div className="mt-16 border-l-2 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">Notes could not be loaded. Check that the API is running.</div>}
          {featured && <div className="mt-16 grid gap-6 lg:grid-cols-[1.35fr_.65fr] lg:gap-10"><Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden border border-zinc-200 bg-zinc-50 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:border-zinc-500 sm:grid-cols-[.9fr_1.1fr]"><BlogVisual post={featured} /><div className="flex flex-col justify-between p-6 sm:p-8"><div><div className="flex flex-wrap gap-2">{featured.tags.map((tag) => <span key={tag.id} className="blog-tag">{tag.name}</span>)}</div><p className="mt-7 font-mono text-[10px] uppercase tracking-[.16em] text-zinc-400">Featured / {featured.readTime}</p><h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-.035em] text-zinc-950 transition-colors group-hover:text-blue-600 sm:text-3xl dark:text-zinc-50 dark:group-hover:text-blue-400">{featured.title}</h2><p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{featured.excerpt}</p></div><span className="mt-9 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">Read feature <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-1" /></span></div></Link><aside className="border-t border-zinc-200 pt-6 dark:border-zinc-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="section-index">The editorial line</p><p className="mt-6 text-lg font-medium leading-7 tracking-[-.02em] text-zinc-800 dark:text-zinc-200">Build the thing that makes the next decision clearer.</p><p className="mt-5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">Short field notes from shipping portfolio systems, APIs, and the workflows around them.</p><div className="mt-8 border-t border-zinc-200 pt-5 dark:border-zinc-800"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center overflow-hidden border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"><span className="font-mono text-[10px] font-semibold">KV</span></span><span><strong className="block text-xs text-zinc-800 dark:text-zinc-200">Keith Vuong</strong><small className="font-mono text-[9px] uppercase tracking-[.15em] text-zinc-400">Full-stack developer</small></span></div></div></aside></div>}
          {!postsQuery.isPending && !postsQuery.isError && !featured && <div className="mt-16 border-y border-zinc-200 py-16 text-center dark:border-zinc-800"><p className="text-lg font-semibold">No published notes yet.</p></div>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-zinc-200 pb-7 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800"><div><p className="section-index">Archive / {filteredPosts.length.toString().padStart(2, "0")} notes</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Browse the notes</h2></div><label className="relative block w-full sm:max-w-xs"><span className="sr-only">Search notes</span><MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" className="h-10 w-full border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-blue-400" /></label></div>
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 py-5 dark:border-zinc-800" role="group" aria-label="Filter notes by tag"><button type="button" aria-pressed={activeTag === "all"} onClick={() => setActiveTag("all")} className={`blog-filter ${activeTag === "all" ? "blog-filter-active" : ""}`}>{activeTag === "all" && <Check size={13} weight="bold" />}All notes</button>{tags.map((tag) => <button type="button" key={tag.id} aria-pressed={activeTag === tag.slug} onClick={() => setActiveTag(tag.slug)} className={`blog-filter ${activeTag === tag.slug ? "blog-filter-active" : ""}`}>{activeTag === tag.slug && <Check size={13} weight="bold" />}{tag.name}</button>)}</div>
        {filteredPosts.length > 0 ? <div className="grid gap-x-7 gap-y-0 md:grid-cols-2">{filteredPosts.map((post, index) => <Link key={post.id} href={`/blog/${post.slug}`} className="group grid gap-5 border-b border-zinc-200 py-8 sm:grid-cols-[8rem_1fr] dark:border-zinc-800"><BlogVisual post={post} compact /><div><div className="flex flex-wrap items-center gap-2">{post.tags.map((tag) => <span key={tag.id} className="blog-tag">{tag.name}</span>)}<span className="font-mono text-[9px] uppercase tracking-[.12em] text-zinc-400">{post.readTime}</span></div><h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-.03em] text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">{post.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{post.excerpt}</p><span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">Read note <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span><span className="sr-only">Note {index + 1}</span></div></Link>)}</div> : !postsQuery.isPending && <div className="border-b border-zinc-200 py-20 text-center dark:border-zinc-800"><p className="text-lg font-semibold">No notes match that filter.</p><button type="button" onClick={() => { setActiveTag("all"); setQuery(""); }} className="mt-4 text-xs font-semibold text-blue-600 underline underline-offset-4 dark:text-blue-400">Clear filters</button></div>}
      </section>
    </main>
    <BlogFooter />
  </div>;
}
