import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlogPost,
  createBlogTag,
  deleteBlogPost,
  deleteBlogTag,
  getAdminPost,
  getAdminPosts,
  getBlogPost,
  getBlogPosts,
  getBlogTags,
  updateBlogPost,
  type BlogPostInput,
  type BlogPostStatus,
  type BlogTagInput,
} from "./blog-api";

export const blogKeys = {
  all: ["blog"] as const,
  publicPosts: (tag?: string) => [...blogKeys.all, "posts", tag ?? "all"] as const,
  publicPost: (slug: string) => [...blogKeys.all, "post", slug] as const,
  tags: () => [...blogKeys.all, "tags"] as const,
  adminPosts: (status?: BlogPostStatus) => [...blogKeys.all, "admin-posts", status ?? "all"] as const,
  adminPost: (id: string) => [...blogKeys.all, "admin-post", id] as const,
};

export function useBlogPosts(params: { tag?: string; page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: blogKeys.publicPosts(params.tag),
    queryFn: () => getBlogPosts(params),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.publicPost(slug),
    queryFn: () => getBlogPost(slug),
    enabled: slug.length > 0,
  });
}

export function useBlogTags() {
  return useQuery({ queryKey: blogKeys.tags(), queryFn: getBlogTags });
}

export function useAdminPosts(status?: BlogPostStatus) {
  return useQuery({
    queryKey: blogKeys.adminPosts(status),
    queryFn: () => getAdminPosts({ status }),
  });
}

export function useAdminPost(id: string) {
  return useQuery({
    queryKey: blogKeys.adminPost(id),
    queryFn: () => getAdminPost(id),
    enabled: id.length > 0,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BlogPostInput) => updateBlogPost(id, input),
    onSuccess: (post) => {
      queryClient.setQueryData(blogKeys.adminPost(id), post);
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.all }),
  });
}

export function useCreateBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.tags() }),
  });
}

export function useDeleteBlogTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.tags() }),
  });
}

export type { BlogPostInput, BlogPostStatus, BlogTagInput };
