"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Article, Check, Eye, FloppyDisk, PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import BlogVisual from "@/app/blog/blog-visual";
import type { ApiError } from "@/lib/auth-api";
import { getAdminPost, type BlogPostInput } from "@/lib/blog-api";
import { useAdminPosts, useBlogTags, useCreateBlogPost, useCreateBlogTag, useDeleteBlogPost, useDeleteBlogTag, useUpdateBlogPost } from "@/lib/blog-queries";
import type { BlogPost, BlogTag } from "@/lib/blog-data";

const composerSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Use 200 characters or fewer"),
  slug: z.string().trim().min(1, "Slug is required").max(220, "Use 220 characters or fewer").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(500, "Use 500 characters or fewer"),
  content: z.string().trim().min(1, "Content is required").refine((value) => value.length >= 50, "Add at least 50 characters"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  publishedAt: z.string(),
  tagSlugs: z.array(z.string()),
}).superRefine((data, context) => {
  if (data.status === "PUBLISHED" && !data.publishedAt) context.addIssue({ code: "custom", path: ["publishedAt"], message: "Published posts need a publication date" });
});

const tagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required").max(120, "Use 120 characters or fewer"),
  slug: z.string().trim().min(1, "Tag slug is required").max(140, "Use 140 characters or fewer").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
});

type ComposerValues = z.infer<typeof composerSchema>;
type TagFormValues = z.infer<typeof tagSchema>;

const emptyValues: ComposerValues = { title: "", slug: "", excerpt: "", content: "", status: "DRAFT", publishedAt: "", tagSlugs: [] };
const emptyTagValues: TagFormValues = { name: "", slug: "" };

function postToValues(post: BlogPost): ComposerValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content.flatMap((section) => [section.heading, ...section.paragraphs].filter(Boolean)).join("\n\n"),
    status: post.status,
    publishedAt: post.publishedAt.slice(0, 10),
    tagSlugs: post.tags.map((tag) => tag.slug),
  };
}

function previewParagraphs(content: string) {
  return content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function textError(message: unknown) {
  return typeof message === "string" ? message : undefined;
}

function apiMessage(error: unknown) {
  if (axios.isAxiosError<ApiError>(error)) return error.response?.data?.message ?? "The request could not be completed.";
  return error instanceof Error ? error.message : "The request could not be completed.";
}

export default function AdminBlogPage() {
  const postsQuery = useAdminPosts();
  const tagsQuery = useBlogTags();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [view, setView] = useState<"compose" | "preview">("compose");
  const [notice, setNotice] = useState("");
  const [tagNotice, setTagNotice] = useState("");
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost(editing?.id ?? "");
  const removePost = useDeleteBlogPost();
  const createTag = useCreateBlogTag();
  const removeTag = useDeleteBlogTag();
  const form = useForm<ComposerValues>({ resolver: zodResolver(composerSchema), defaultValues: emptyValues });
  const tagForm = useForm<TagFormValues>({ resolver: zodResolver(tagSchema), defaultValues: emptyTagValues });
  const draft = useWatch({ control: form.control });
  const status = draft.status ?? "DRAFT";
  const selectedTagSlugs = draft.tagSlugs ?? [];
  const posts = postsQuery.data?.content ?? [];
  const tags = tagsQuery.data ?? [];
  const pending = createPost.isPending || updatePost.isPending;
  const mutationError = createPost.error ?? updatePost.error;

  const startNew = () => {
    setEditing(null);
    setNotice("");
    createPost.reset();
    updatePost.reset();
    setView("compose");
    form.reset(emptyValues);
  };

  const editPost = async (post: BlogPost) => {
    setNotice("Loading post…");
    try {
      const detail = await getAdminPost(post.id);
      setEditing(detail);
      form.reset(postToValues(detail));
      setView("compose");
      setNotice("");
    } catch (error) {
      setNotice(apiMessage(error));
    }
  };

  const toInput = (values: ComposerValues): BlogPostInput => ({
    ...values,
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: values.excerpt.trim(),
    content: values.content.trim(),
    publishedAt: values.publishedAt,
    tagSlugs: values.tagSlugs,
  });

  const handleSaved = (post: BlogPost) => {
    setEditing(post);
    form.reset(postToValues(post));
    setNotice("Saved to the Blog API.");
    setView("preview");
  };

  const submit = (values: ComposerValues) => {
    const input = toInput(values);
    if (editing) updatePost.mutate(input, { onSuccess: handleSaved, onError: (error) => setNotice(apiMessage(error)) });
    else createPost.mutate(input, { onSuccess: handleSaved, onError: (error) => setNotice(apiMessage(error)) });
  };

  const deletePost = (post: BlogPost) => {
    if (!window.confirm(`Delete ${post.title}?`)) return;
    removePost.mutate(post.id, {
      onSuccess: () => {
        if (editing?.id === post.id) startNew();
        setNotice("Post deleted from the Blog API.");
      },
      onError: (error) => setNotice(apiMessage(error)),
    });
  };

  const addTag = (values: TagFormValues) => {
    createTag.mutate({ name: values.name.trim(), slug: values.slug.trim() }, {
      onSuccess: () => {
        tagForm.reset(emptyTagValues);
        setTagNotice("Tag saved to the Blog API.");
      },
      onError: (error) => setTagNotice(apiMessage(error)),
    });
  };

  const deleteTag = (tag: BlogTag) => {
    if (posts.some((post) => post.tags.some((postTag) => postTag.slug === tag.slug))) {
      setTagNotice("This tag is still attached to one or more posts and cannot be deleted.");
      return;
    }
    removeTag.mutate(tag.id, { onSuccess: () => setTagNotice(`Deleted ${tag.name} from the Blog API.`), onError: (error) => setTagNotice(apiMessage(error)) });
  };

  const error = (name: keyof ComposerValues) => textError(form.formState.errors[name]?.message);
  const tagError = (name: keyof TagFormValues) => textError(tagForm.formState.errors[name]?.message);
  const previewPost: BlogPost = { id: editing?.id ?? "preview-1", title: draft.title || "Untitled note", slug: draft.slug || "untitled-note", excerpt: draft.excerpt || "Add an excerpt to see the archive preview.", content: [{ paragraphs: previewParagraphs(draft.content || "Write some content to preview the article.") }], status: draft.status ?? "DRAFT", publishedAt: draft.publishedAt ? `${draft.publishedAt}T08:30:00Z` : "", createdAt: editing?.createdAt ?? "", updatedAt: editing?.updatedAt ?? "", tags, readTime: "5 min read", visual: editing?.visual ?? "blueprint" };

  return <div className="w-full">
    <header className="flex flex-col gap-6 border-b border-black/[.08] pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-white/10"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Content / Technical blog</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">Write a note</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Compose, preview and manage persisted technical articles and tags.</p></div><button type="button" onClick={startNew} className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950"><Plus size={15} weight="bold" /> New post</button></header>

    <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="min-w-0 border border-black/[.08] bg-white dark:border-white/10 dark:bg-zinc-900/40"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[.07] px-5 py-4 sm:px-7 dark:border-white/10"><div className="flex items-center gap-2"><Article size={17} className="text-blue-600 dark:text-blue-400" /><span className="font-mono text-[10px] uppercase tracking-[.18em] text-zinc-400">{editing ? "Editing post" : "New draft"}</span></div><div className="flex border border-black/[.08] p-0.5 dark:border-white/10"><button type="button" onClick={() => setView("compose")} className={`inline-flex h-8 items-center gap-1.5 px-3 text-xs font-medium ${view === "compose" ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950" : "text-zinc-500"}`}><PencilSimple size={13} /> Compose</button><button type="button" onClick={() => setView("preview")} className={`inline-flex h-8 items-center gap-1.5 px-3 text-xs font-medium ${view === "preview" ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950" : "text-zinc-500"}`}><Eye size={13} /> Preview</button></div></div>
        {view === "compose" ? <form onSubmit={form.handleSubmit(submit)} noValidate className="p-5 sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><label className="block text-xs font-medium sm:col-span-2">Title<input {...form.register("title")} className="admin-field text-lg font-semibold" placeholder="A clear, useful title" aria-invalid={Boolean(error("title"))} />{error("title") && <span className="admin-form-error">{error("title")}</span>}</label><label className="block text-xs font-medium">Slug<input {...form.register("slug")} className="admin-field font-mono text-xs" placeholder="my-technical-note" aria-invalid={Boolean(error("slug"))} />{error("slug") && <span className="admin-form-error">{error("slug")}</span>}</label><label className="block text-xs font-medium">Status<select {...form.register("status")} className="admin-field" aria-invalid={Boolean(error("status"))}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select>{error("status") && <span className="admin-form-error">{error("status")}</span>}</label><label className="block text-xs font-medium sm:col-span-2">Excerpt<textarea {...form.register("excerpt")} rows={3} className="admin-field resize-y" placeholder="A short summary for the archive and search results." aria-invalid={Boolean(error("excerpt"))} />{error("excerpt") && <span className="admin-form-error">{error("excerpt")}</span>}</label><label className="block text-xs font-medium">Published date<input {...form.register("publishedAt")} type="date" disabled={status === "DRAFT"} className="admin-field" aria-invalid={Boolean(error("publishedAt"))} />{error("publishedAt") && <span className="admin-form-error">{error("publishedAt")}</span>}</label></div><fieldset className="mt-7"><legend className="text-xs font-medium">Tags</legend><div className="mt-3 flex flex-wrap gap-2">{tagsQuery.isPending && <span className="text-xs text-zinc-400">Loading tags…</span>}{tags.map((tag) => { const selected = selectedTagSlugs.includes(tag.slug); return <button key={tag.id} type="button" aria-pressed={selected} onClick={() => { const next = selected ? selectedTagSlugs.filter((slug) => slug !== tag.slug) : [...selectedTagSlugs, tag.slug]; form.setValue("tagSlugs", next, { shouldDirty: true, shouldValidate: true }); }} className={`blog-filter ${selected ? "blog-filter-active" : ""}`}>{selected && <Check size={13} weight="bold" />}{tag.name}</button>; })}</div>{error("tagSlugs") && <span className="admin-form-error">{error("tagSlugs")}</span>}</fieldset><label className="mt-7 block text-xs font-medium">Content<textarea {...form.register("content")} rows={18} className="admin-field resize-y font-mono text-xs leading-6" placeholder="Write the article content here. Separate paragraphs with a blank line." aria-invalid={Boolean(error("content"))} />{error("content") && <span className="admin-form-error">{error("content")}</span>}<span className="mt-2 block text-[11px] font-normal text-zinc-400">Plain text content is stored by the API and rendered as paragraphs.</span></label>{mutationError && <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">{apiMessage(mutationError)}</p>}<div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-black/[.07] pt-5 dark:border-white/10"><p className="text-xs text-zinc-400">{notice || "Changes are saved to PostgreSQL through the Blog API."}</p><div className="flex gap-2"><button type="button" onClick={() => setView("preview")} className="inline-flex h-10 items-center gap-2 border border-black/[.1] px-4 text-xs font-semibold text-zinc-700 dark:border-white/10 dark:text-zinc-200"><Eye size={15} /> Preview</button><button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-xs font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"><FloppyDisk size={15} /> {pending ? "Saving…" : editing ? "Save changes" : "Save post"}</button></div></div></form> : <article className="min-w-0 overflow-hidden p-5 sm:p-10"><div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start"><div className="blog-safe-wrap min-w-0"><div className="flex flex-wrap gap-2">{selectedTagSlugs.map((slug) => <span key={slug} className="blog-tag">{tags.find((tag) => tag.slug === slug)?.name ?? slug}</span>)}</div><p className="mt-6 font-mono text-[10px] uppercase tracking-[.15em] text-zinc-400">{draft.status === "PUBLISHED" ? "Published" : "Draft"}{draft.publishedAt ? ` / ${draft.publishedAt}` : ""}</p><h2 className="mt-4 text-4xl font-semibold leading-[.98] tracking-[-.055em]">{previewPost.title}</h2><p className="mt-5 text-base leading-7 text-zinc-500 dark:text-zinc-400">{previewPost.excerpt}</p><div className="mt-10 border-t border-black/[.08] pt-8 dark:border-white/10">{previewPost.content[0].paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-zinc-600 first:mt-0 dark:text-zinc-300">{paragraph}</p>)}</div></div><BlogVisual post={previewPost} /></div><button type="button" onClick={() => setView("compose")} className="mt-10 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400"><PencilSimple size={14} /> Continue editing</button></article>}
      </section>

      <aside className="min-w-0 h-fit border-t border-black/[.08] pt-5 dark:border-white/10 xl:sticky xl:top-8"><div className="flex items-center justify-between"><div className="min-w-0"><p className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">API archive</p><h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">Your posts</h2></div><span className="font-mono text-[10px] text-zinc-400">{posts.length.toString().padStart(2, "0")}</span></div>{postsQuery.isPending && <div className="mt-5 space-y-px border-y border-black/[.08] dark:border-white/10"><div className="h-20 animate-pulse bg-zinc-100 dark:bg-zinc-800" /><div className="h-20 animate-pulse bg-zinc-100 dark:bg-zinc-800" /></div>}{postsQuery.isError && <p className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">{apiMessage(postsQuery.error)}</p>}<div className="mt-5 divide-y divide-black/[.08] border-y border-black/[.08] dark:divide-white/10 dark:border-white/10">{posts.map((post) => <div key={post.id} className="group min-w-0 py-4"><div className="flex min-w-0 items-start justify-between gap-3"><div className="min-w-0 blog-safe-wrap"><span className={`font-mono text-[9px] uppercase tracking-[.15em] ${post.status === "PUBLISHED" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{post.status}</span><h3 className="mt-2 text-sm font-semibold leading-5">{post.title}</h3></div><div className="flex shrink-0"><button type="button" onClick={() => void editPost(post)} aria-label={`Edit ${post.title}`} className="grid size-8 place-items-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"><PencilSimple size={14} /></button><button type="button" disabled={removePost.isPending} onClick={() => deletePost(post)} aria-label={`Delete ${post.title}`} className="grid size-8 place-items-center text-zinc-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 dark:hover:bg-red-950/20 dark:hover:text-red-400"><Trash size={14} /></button></div></div><p className="blog-safe-wrap mt-2 font-mono text-[9px] text-zinc-400">/{post.slug}</p></div>)}</div><button type="button" onClick={startNew} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400"><Plus size={14} weight="bold" /> New draft</button></aside>
    </div>

    <section className="mt-8 border border-black/[.08] bg-white dark:border-white/10 dark:bg-zinc-900/40"><div className="flex flex-col gap-4 border-b border-black/[.07] px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7 dark:border-white/10"><div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Taxonomy / {tags.length.toString().padStart(2, "0")} tags</p><h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">Manage tags</h2></div><p className="max-w-md text-xs leading-5 text-zinc-500">Tags must have unique names and slugs. The API rejects deleting a tag attached to a post.</p></div><div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,.7fr)]"><form onSubmit={tagForm.handleSubmit(addTag)} noValidate className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><label className="block text-xs font-medium">Name<input {...tagForm.register("name")} className="admin-field" placeholder="Architecture" aria-invalid={Boolean(tagError("name"))} />{tagError("name") && <span className="admin-form-error">{tagError("name")}</span>}</label><label className="block text-xs font-medium">Slug<input {...tagForm.register("slug")} className="admin-field font-mono text-xs" placeholder="architecture" aria-invalid={Boolean(tagError("slug"))} />{tagError("slug") && <span className="admin-form-error">{tagError("slug")}</span>}</label><button type="submit" disabled={createTag.isPending} className="inline-flex h-10 items-center justify-center gap-2 bg-zinc-950 px-4 text-xs font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"><Plus size={15} weight="bold" /> {createTag.isPending ? "Adding…" : "Add tag"}</button></form><div className="border-t border-black/[.07] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-white/10"><div className="flex flex-wrap gap-2">{tags.map((tag) => { const usage = posts.filter((post) => post.tags.some((postTag) => postTag.slug === tag.slug)).length; return <span key={tag.id} className="group inline-flex items-center gap-2 border border-zinc-200 px-2.5 py-2 dark:border-zinc-700"><span><strong className="block text-xs font-medium">{tag.name}</strong><small className="font-mono text-[9px] text-zinc-400">/{tag.slug} / {usage} {usage === 1 ? "post" : "posts"}</small></span><button type="button" disabled={removeTag.isPending} onClick={() => deleteTag(tag)} aria-label={`Delete ${tag.name}`} className="grid size-6 place-items-center text-zinc-400 hover:text-red-600 disabled:opacity-40 dark:hover:text-red-400"><Trash size={13} /></button></span>; })}</div>{tagNotice && <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">{tagNotice}</p>}</div></div></section>
  </div>;
}
