import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getAdminProject,
  getAdminProjects,
  getProjectBySlug,
  getProjects,
  updateProject,
} from "./project-api";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: () => [...projectKeys.lists()] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (slug: string) => [...projectKeys.details(), slug] as const,
  admin: () => [...projectKeys.all, "admin"] as const,
  adminDetail: (id: string) => [...projectKeys.admin(), id] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: getProjects,
  });
}

export function useAdminProjects() {
  return useQuery({ queryKey: projectKeys.admin(), queryFn: getAdminProjects });
}

export function useAdminProject(id: string) {
  return useQuery({
    queryKey: projectKeys.adminDetail(id),
    queryFn: () => getAdminProject(id),
    enabled: id.length > 0,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof updateProject>[1]) => updateProject(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: () => getProjectBySlug(slug),
    enabled: slug.length > 0,
  });
}
