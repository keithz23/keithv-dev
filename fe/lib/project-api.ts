export type Project = {
  id: string;
  slug: string;
  number: string;
  title: string;
  label: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string | null;
  visualKey: string | null;
  iconKey: string;
  isFeatured: boolean;
  displayOrder: number;
};

export type ProjectInput = {
  number: string;
  slug: string;
  title: string;
  label: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string | null;
  visualKey: string | null;
  iconKey: string;
  isFeatured: boolean;
  displayOrder: number;
};

type ProjectApiResponse = {
  id: string;
  slug: string;
  number: string;
  title: string;
  label: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string | null;
  visualKey: string | null;
  iconKey: string;
  isFeatured: boolean;
  displayOrder: number;
};

function mapProject(response: ProjectApiResponse): Project {
  return {
    id: response.id,
    slug: response.slug,
    number: response.number,
    title: response.title,
    label: response.label,
    description: response.description,
    highlights: response.highlights,
    tech: response.tech,
    github: response.github,
    visualKey: response.visualKey,
    iconKey: response.iconKey,
    isFeatured: response.isFeatured,
    displayOrder: response.displayOrder,
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ProjectApiResponse[]>("/projects");
  return data.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const { data } = await apiClient.get<ProjectApiResponse>(
    `/projects/${encodeURIComponent(slug)}`,
  );
  return mapProject(data);
}

export async function getAdminProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ProjectApiResponse[]>("/admin/projects");
  return data.map(mapProject);
}

export async function getAdminProject(id: string): Promise<Project> {
  const { data } = await apiClient.get<ProjectApiResponse>(`/admin/projects/${id}`);
  return mapProject(data);
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await apiClient.post<ProjectApiResponse>("/admin/projects", input);
  return mapProject(data);
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<Project> {
  const { data } = await apiClient.patch<ProjectApiResponse>(`/admin/projects/${id}`, input);
  return mapProject(data);
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}`);
}
import { apiClient } from "./api-client";
