"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, LockKey, ShieldCheck } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/components/auth-provider";
import { useLogin } from "@/lib/auth-queries";
import type { ApiError } from "@/lib/auth-api";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const mutation = useLogin();
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const submit = (data: LoginFormValues) => mutation.mutate(data, { onSuccess: () => { login(); router.replace("/admin"); } });
  const error = axios.isAxiosError<ApiError>(mutation.error) ? mutation.error.response?.data : null;
  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

  return (
    <main className="grid min-h-[100dvh] bg-[#f7f6f3] text-zinc-950 lg:grid-cols-[minmax(0,1.1fr)_minmax(28rem,.9fr)] dark:bg-zinc-950 dark:text-zinc-100">
      <section className="hidden border-r border-black/[.08] p-12 lg:flex lg:flex-col lg:justify-between dark:border-white/10">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-zinc-950 font-mono text-[10px] font-semibold tracking-wider text-white dark:bg-zinc-100 dark:text-zinc-950">KV</span><span><strong className="block text-sm">Portfolio Admin</strong><small className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Private workspace</small></span></div>
        <div className="max-w-2xl"><p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Content control / 2026</p><h1 className="mt-7 text-5xl font-semibold leading-[.97] tracking-[-.06em] xl:text-6xl">A quiet workspace for the work behind the work.</h1><p className="mt-6 max-w-lg text-sm leading-7 text-zinc-500">Maintain projects, experience and public contact channels through one secured editorial system.</p></div>
        <div className="flex items-center gap-3 border-t border-black/[.08] pt-5 text-xs text-zinc-400 dark:border-white/10"><ShieldCheck size={17} weight="duotone" /> JWT protected · ADMIN access only</div>
      </section>
      <section className="grid place-items-center px-5 py-12 sm:px-10">
        <form onSubmit={form.handleSubmit(submit)} noValidate className="w-full max-w-sm">
          <div className="mb-12 flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center bg-zinc-950 font-mono text-[10px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">KV</span><span className="text-sm font-semibold">Portfolio Admin</span></div>
          <span className="grid size-10 place-items-center border border-black/[.08] bg-white text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"><LockKey size={18} weight="duotone" /></span>
          <p className="mt-8 font-mono text-[9px] uppercase tracking-[.2em] text-zinc-400">Authorized access</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.045em]">Sign in to continue</h2><p className="mt-3 text-sm leading-6 text-zinc-500">Use the local admin account configured for this environment.</p>
          <div className="mt-8 space-y-5"><label className="block text-xs font-medium">Email<input {...form.register("email")} type="email" autoComplete="username" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "login-email-error" : undefined} className="admin-field" placeholder="admin@example.com" />{emailError && <span id="login-email-error" className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{emailError}</span>}</label><label className="block text-xs font-medium">Password<input {...form.register("password")} type="password" autoComplete="current-password" aria-invalid={Boolean(passwordError)} aria-describedby={passwordError ? "login-password-error" : undefined} className="admin-field" placeholder="Enter your password" />{passwordError && <span id="login-password-error" className="mt-1.5 block text-[11px] text-red-600 dark:text-red-400">{passwordError}</span>}</label></div>
          {error && <p className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">{error.message}</p>}
          <button disabled={mutation.isPending} className="mt-7 inline-flex h-11 w-full items-center justify-between bg-zinc-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:translate-y-px disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950"><span>{mutation.isPending ? "Signing in…" : "Sign in"}</span><ArrowRight size={15} weight="bold" /></button>
        </form>
      </section>
    </main>
  );
}
