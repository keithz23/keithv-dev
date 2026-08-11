"use client";

import {
  ArrowSquareOut,
  Briefcase,
  ChatCircleText,
  CirclesFour,
  GraduationCap,
  House,
  LinkSimple,
  SignOut,
  Stack,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

const links = [
  { href: "/admin", label: "Overview", icon: House },
  { href: "/admin/projects", label: "Projects", icon: Stack },
  { href: "/admin/capabilities", label: "Capabilities", icon: CirclesFour },
  { href: "/admin/experiences", label: "Experience", icon: Briefcase },
  { href: "/admin/educations", label: "Education", icon: GraduationCap },
  { href: "/admin/social-links", label: "Social links", icon: LinkSimple },
  { href: "/admin/contact-messages", label: "Messages", icon: ChatCircleText },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, logout } = useAuth();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (status === "loading") return;
    if (!isLogin && status === "unauthenticated") router.replace("/admin/login");
    if (isLogin && status === "authenticated") router.replace("/admin");
  }, [isLogin, router, status]);

  if (isLogin) return children;
  if (status !== "authenticated") return <div className="min-h-[100dvh] bg-[#f7f6f3]" />;

  return (
    <div className="min-h-[100dvh] bg-[#f7f6f3] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-black/[.07] bg-[#f7f6f3]/95 backdrop-blur md:hidden dark:border-white/10 dark:bg-zinc-950/95">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid size-8 place-items-center bg-zinc-950 font-mono text-[10px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950">KV</span>
            <span className="text-sm font-semibold tracking-[-.02em]">Portfolio Admin</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white">
            View site <ArrowSquareOut size={14} weight="bold" />
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Admin navigation">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`inline-flex shrink-0 items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${isActive(pathname, href) ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950" : "text-zinc-500 hover:bg-black/[.04] hover:text-zinc-950 dark:hover:bg-white/[.06] dark:hover:text-white"}`}>
              <Icon size={15} weight={isActive(pathname, href) ? "fill" : "regular"} />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="grid w-full md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-[100dvh] border-r border-black/[.07] bg-[#fbfbfa] p-5 md:flex md:flex-col dark:border-white/10 dark:bg-zinc-950">
          <Link href="/admin" className="flex items-center gap-3 px-2 py-2">
            <span className="grid size-9 place-items-center bg-zinc-950 font-mono text-[10px] font-semibold tracking-wider text-white dark:bg-zinc-100 dark:text-zinc-950">KV</span>
            <span><strong className="block text-sm tracking-[-.02em]">Portfolio Admin</strong><small className="mt-0.5 block font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">Content system</small></span>
          </Link>

          <div className="my-6 border-t border-black/[.07] dark:border-white/10" />
          <p className="px-3 font-mono text-[9px] uppercase tracking-[.2em] text-zinc-400">Workspace</p>
          <nav className="mt-3 space-y-1" aria-label="Admin navigation">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link key={href} href={href} className={`group flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-all duration-200 active:translate-y-px ${active ? "border-blue-600 bg-blue-50 text-zinc-950 dark:bg-blue-950/30 dark:text-white" : "border-transparent text-zinc-500 hover:border-zinc-300 hover:bg-black/[.025] hover:text-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-white/[.04] dark:hover:text-white"}`}>
                  <Icon size={17} weight={active ? "fill" : "regular"} className={active ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-black/[.07] pt-4 dark:border-white/10">
            <Link href="/" className="flex items-center justify-between px-3 py-2 text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-white">
              Public portfolio <ArrowSquareOut size={14} weight="bold" />
            </Link>
            <button type="button" onClick={() => { void logout().finally(() => router.replace("/admin/login")); }} className="mt-1 flex w-full items-center gap-3 px-3 py-2 text-left text-xs text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-700 active:translate-y-px dark:hover:bg-red-950/20 dark:hover:text-red-400">
              <SignOut size={16} weight="bold" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-8 sm:px-7 md:px-10 md:py-12 lg:px-14">{children}</main>
      </div>
    </div>
  );
}
