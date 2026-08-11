import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdminResource, deleteAdminResource, listAdminResource, listContactMessages, patchAdminResource } from "./portfolio-admin-api";

export const adminResourceKeys = { all: ["admin-resources"] as const, resource: (name: string) => ["admin-resources", name] as const };
export function useAdminResource<T>(resource: string) { return useQuery({ queryKey: adminResourceKeys.resource(resource), queryFn: () => listAdminResource<T>(resource) }); }
export function useCreateAdminResource<T>(resource: string) { const q=useQueryClient(); return useMutation({ mutationFn:(input:Record<string,unknown>)=>createAdminResource<T>(resource,input), onSuccess:()=>q.invalidateQueries({queryKey:adminResourceKeys.resource(resource)}) }); }
export function usePatchAdminResource<T>(resource: string) { const q=useQueryClient(); return useMutation({ mutationFn:({id,input}:{id:string;input:Record<string,unknown>})=>patchAdminResource<T>(resource,id,input), onSuccess:()=>q.invalidateQueries({queryKey:adminResourceKeys.resource(resource)}) }); }
export function useDeleteAdminResource(resource: string) { const q=useQueryClient(); return useMutation({ mutationFn:(id:string)=>deleteAdminResource(resource,id), onSuccess:()=>q.invalidateQueries({queryKey:adminResourceKeys.resource(resource)}) }); }
export function useContactMessages(page=0){return useQuery({queryKey:[...adminResourceKeys.resource("contact-messages"),page],queryFn:()=>listContactMessages(page)});}
