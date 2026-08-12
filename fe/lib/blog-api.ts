import { apiClient } from "./api-client";
import type { BlogPost, BlogTag } from "./blog-data";

export type BlogPostStatus = "DRAFT" | "PUBLISHED";

export type BlogPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: BlogPostStatus;
  publishedAt: string;
  tagSlugs: string[];
};

export type BlogTagInput = {
  name: string;
  slug: string;
};

type ApiTag = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

type ApiPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  status: BlogPostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: ApiTag[];
};

function toSections(content: string) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return [{ paragraphs }];
}

function readTime(content: string | undefined) {
  const wordCount = content?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
}

function visualFor(slug: string): BlogPost["visual"] {
  if (slug.includes("auth") || slug.includes("security")) return "signal";
  if (slug.includes("workflow") || slug.includes("admin")) return "ledger";
  return "blueprint";
}

export function mapTag(response: ApiTag): BlogTag {
  return { id: response.id, name: response.name, slug: response.slug };
}

export function mapPost(response: ApiPost): BlogPost {
  return {
    id: response.id,
    title: response.title,
    slug: response.slug,
    excerpt: response.excerpt,
    content: toSections(response.content ?? ""),
    status: response.status,
    publishedAt: response.publishedAt ?? "",
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    tags: response.tags.map(mapTag),
    readTime: readTime(response.content),
    visual: visualFor(response.slug),
  };
}

function toTimestamp(value: string) {
  return value ? `${value}T08:30:00Z` : null;
}

function toPostPayload(input: BlogPostInput) {
  return {
    ...input,
    publishedAt: input.status === "PUBLISHED" ? toTimestamp(input.publishedAt) : null,
  };
}

export async function getBlogPosts(params: { page?: number; size?: number; tag?: string } = {}) {
  const { data } = await apiClient.get<BlogPage<ApiPost>>("/posts", {
    params: { page: params.page ?? 0, size: params.size ?? 10, tag: params.tag || undefined },
  });
  return { ...data, content: data.content.map(mapPost) };
}

export async function getBlogPost(slug: string) {
  const { data } = await apiClient.get<ApiPost>(`/posts/${encodeURIComponent(slug)}`);
  return mapPost(data);
}

export async function getBlogTags() {
  const { data } = await apiClient.get<ApiTag[]>("/tags");
  return data.map(mapTag);
}

export async function getAdminPosts(params: { page?: number; size?: number; status?: BlogPostStatus } = {}) {
  const { data } = await apiClient.get<BlogPage<ApiPost>>("/admin/posts", {
    params: { page: params.page ?? 0, size: params.size ?? 50, status: params.status },
  });
  return { ...data, content: data.content.map(mapPost) };
}

export async function getAdminPost(id: string) {
  const { data } = await apiClient.get<ApiPost>(`/admin/posts/${id}`);
  return mapPost(data);
}

export async function createBlogPost(input: BlogPostInput) {
  const { data } = await apiClient.post<ApiPost>("/admin/posts", toPostPayload(input));
  return mapPost(data);
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const { data } = await apiClient.patch<ApiPost>(`/admin/posts/${id}`, toPostPayload(input));
  return mapPost(data);
}

export async function deleteBlogPost(id: string) {
  await apiClient.delete(`/admin/posts/${id}`);
}

export async function createBlogTag(input: BlogTagInput) {
  const { data } = await apiClient.post<ApiTag>("/admin/tags", input);
  return mapTag(data);
}

export async function deleteBlogTag(id: string) {
  await apiClient.delete(`/admin/tags/${id}`);
}
