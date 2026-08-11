import { apiClient } from "./api-client";

export type AdminRecord = { id: string; displayOrder?: number } & Record<string, unknown>;
export type PageResponse<T> = { content: T[]; page: number; size: number; totalElements: number; totalPages: number };

export async function listAdminResource<T>(resource: string): Promise<T[]> {
  const { data } = await apiClient.get<T[]>(`/admin/${resource}`);
  return data;
}
export async function createAdminResource<T>(resource: string, input: Record<string, unknown>): Promise<T> {
  return (await apiClient.post<T>(`/admin/${resource}`, input)).data;
}
export async function patchAdminResource<T>(resource: string, id: string, input: Record<string, unknown>): Promise<T> {
  return (await apiClient.patch<T>(`/admin/${resource}/${id}`, input)).data;
}
export async function deleteAdminResource(resource: string, id: string): Promise<void> {
  await apiClient.delete(`/admin/${resource}/${id}`);
}
export async function listContactMessages(page = 0) {
  return (await apiClient.get<PageResponse<ContactMessage>>(`/admin/contact-messages?page=${page}&size=20`)).data;
}
export type ContactMessage = { id: string; name: string; email: string; message: string; status: "NEW"|"READ"|"ARCHIVED"; createdAt: string };
