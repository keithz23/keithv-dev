"use client";

import { useEffect, useState } from "react";
import { CircleHalf, List, X } from "@phosphor-icons/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import type { NavigationLink, Profile } from "@/lib/portfolio-api";

export default function Navbar({
  profile,
  links,
}: {
  profile: Profile;
  links: NavigationLink[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const sections = ["home", ...links.map((link) => link.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="h-20 border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav
        className="fixed inset-x-0 top-0 z-40 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.65)] dark:border-zinc-800 dark:bg-zinc-950/75 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.05)]"
        aria-label="Primary navigation"
      >
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto] items-center px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-10">
          <button
            type="button"
            onClick={() => go("home")}
            className="group flex w-fit items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="grid h-9 w-9 place-items-center bg-zinc-900 font-mono text-xs font-semibold text-white transition-transform duration-300 group-hover:-rotate-3 group-active:scale-[.98] dark:bg-zinc-100 dark:text-zinc-950">
              <Image
                src={profile.logoPath}
                alt={profile.logoAlt}
                width={36}
                height={36}
                priority
              />
            </span>
            <span className="block text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {profile.name}
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">
              {profile.role}
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                aria-current={active === link.id ? "location" : undefined}
                className="nav-link"
              >
                {link.label}
                <span />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle color theme"
              className="icon-button"
            >
              <CircleHalf size={18} weight="regular" />
            </button>
            <button
              type="button"
              onClick={() => go("contact")}
              className="hidden h-10 items-center border border-zinc-900 px-4 text-xs font-semibold transition-all duration-300 hover:bg-zinc-900 hover:text-white active:translate-y-px sm:inline-flex dark:border-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-950"
            >
              Start a conversation
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle navigation"
              aria-expanded={open}
              className="icon-button md:hidden"
            >
              {open ? (
                <X size={18} weight="regular" />
              ) : (
                <List size={19} weight="regular" />
              )}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                className="flex w-full items-center justify-between border-b border-zinc-100 px-1 py-4 text-left text-sm font-medium last:border-0 dark:border-zinc-900"
              >
                <span>{link.label}</span>
                <span className="font-mono text-[10px] text-zinc-400">
                  0{links.indexOf(link) + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
