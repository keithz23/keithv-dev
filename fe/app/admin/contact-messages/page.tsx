"use client";

import { EnvelopeSimple, Trash } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { adminResourceKeys, useContactMessages, useDeleteAdminResource } from "@/lib/portfolio-admin-queries";

const statusStyle = { NEW: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300", READ: "bg-[#edf3ec] text-[#346538] dark:bg-emerald-950/30 dark:text-emerald-300", ARCHIVED: "bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300" };

export default function ContactMessagesPage() {
  const query = useContactMessages();
  const remove = useDeleteAdminResource("contact-messages");
  const client = useQueryClient();
  const updateStatus = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => apiClient.patch(`/admin/contact-messages/${id}`, { status }), onSuccess: () => client.invalidateQueries({ queryKey: adminResourceKeys.resource("contact-messages") }) });

  return (
    <div className="w-full">
      <header className="grid gap-5 border-b border-black/[.08] pb-8 md:grid-cols-[1fr_auto] md:items-end dark:border-white/10"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Inbox / Messages</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em]">Contact messages</h1><p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">Review portfolio enquiries and keep the inbox status current.</p></div>{query.data && <p className="font-mono text-[10px] uppercase tracking-[.16em] text-zinc-400">{query.data.totalElements} total</p>}</header>
      {query.isPending && <div className="mt-8 space-y-3">{[0, 1, 2].map((item) => <div key={item} className="h-36 animate-pulse border border-black/[.06] bg-white/50 dark:border-white/10 dark:bg-white/[.02]" />)}</div>}
      {query.isError && <div className="mt-8 border-l-2 border-red-500 bg-red-50 px-5 py-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-300">Messages could not be loaded.</div>}
      {query.data?.content.length === 0 && <div className="mt-8 grid place-items-center border-y border-black/[.08] py-20 text-center dark:border-white/10"><span className="grid size-11 place-items-center border border-black/[.08] bg-white text-zinc-400 dark:border-white/10 dark:bg-zinc-900"><EnvelopeSimple size={20} weight="duotone" /></span><p className="mt-5 text-lg font-semibold">Inbox is clear</p><p className="mt-2 text-sm text-zinc-500">New portfolio enquiries will appear here.</p></div>}
      {query.data && query.data.content.length > 0 && <div className="mt-8 border-t border-black/[.08] dark:border-white/10">{query.data.content.map((message) => <article key={message.id} className="grid gap-5 border-b border-black/[.08] py-7 lg:grid-cols-[12rem_minmax(0,1fr)_9rem] dark:border-white/10"><div><p className="font-semibold tracking-[-.015em]">{message.name}</p><a href={`mailto:${message.email}`} className="mt-1 block break-all text-xs text-blue-600 hover:underline dark:text-blue-400">{message.email}</a><time className="mt-3 block font-mono text-[9px] uppercase tracking-[.1em] text-zinc-400">{new Date(message.createdAt).toLocaleString()}</time></div><p className="whitespace-pre-wrap text-sm leading-7 text-zinc-600 dark:text-zinc-300">{message.message}</p><div className="flex items-start gap-2 lg:justify-end"><select aria-label={`Status for message from ${message.name}`} value={message.status} disabled={updateStatus.isPending} onChange={(event) => updateStatus.mutate({ id: message.id, status: event.target.value })} className={`h-9 border-0 px-2 font-mono text-[9px] uppercase tracking-[.1em] outline-none ${statusStyle[message.status]}`}><option>NEW</option><option>READ</option><option>ARCHIVED</option></select><button type="button" aria-label={`Delete message from ${message.name}`} disabled={remove.isPending} onClick={() => { if (window.confirm(`Delete message from ${message.name}?`)) remove.mutate(message.id); }} className="grid size-9 place-items-center text-zinc-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-300"><Trash size={16} weight="bold" /></button></div></article>)}</div>}
    </div>
  );
}
