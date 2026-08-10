"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  MapPin,
  TerminalWindow,
} from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import type { Profile } from "@/lib/portfolio-api";

function MagneticButton({
  children,
  onClick,
  secondary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  secondary?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 18 });
  const springY = useSpring(y, { stiffness: 160, damping: 18 });
  const visualX = useTransform(springX, (value) => value);
  const visualY = useTransform(springY, (value) => value);

  const move = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={reset}
      style={{ x: visualX, y: visualY }}
      className={secondary ? "button-secondary" : "button-primary"}
    >
      {children}
    </motion.button>
  );
}

export default function InteractiveHero({
  profile,
  principles,
}: {
  profile: Profile;
  principles: string[];
}) {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero-surface relative min-h-[calc(100dvh-5rem)] overflow-hidden pb-24 pt-16 md:pb-28 md:pt-20">
      <div className="mx-auto grid w-full max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)] lg:items-end lg:px-10">
        <div className="relative">
          <div className="stagger-item mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="status-line">
              <span className="status-dot" /> {profile.availabilityText}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} weight="regular" /> {profile.location}
            </span>
          </div>

          <p className="stagger-item section-index">
            {profile.heroKicker}
          </p>
          <h1 className="stagger-item mt-5 max-w-[13ch] text-balance text-5xl font-semibold leading-[.94] tracking-[-0.065em] text-zinc-950 sm:text-6xl md:text-7xl dark:text-zinc-50">
            {profile.heroHeadline}
          </h1>
          <p className="stagger-item mt-8 max-w-[61ch] text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            {profile.heroIntro}
          </p>

          <div className="stagger-item mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MagneticButton onClick={() => go("projects")}>
              View selected work <ArrowDownRight size={17} weight="regular" />
            </MagneticButton>
            <button
              type="button"
              onClick={() => go("contact")}
              className="hero-text-link"
            >
              Discuss a project <ArrowUpRight size={17} weight="regular" />
            </button>
          </div>
        </div>

        <aside
          className="stagger-item lg:mb-2 lg:border-l lg:border-zinc-200 lg:pl-8 dark:lg:border-zinc-800"
          aria-label="Engineering profile"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <span className="section-index">Working profile</span>
            <TerminalWindow
              size={21}
              weight="regular"
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="py-6">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-zinc-400">
                {profile.currentRoleLabel}
              </p>
              <p className="mt-2 font-medium text-zinc-900 dark:text-zinc-100">
                {profile.currentRole}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {profile.currentCompanyPeriod}
              </p>
            </div>
            <div className="py-6">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-zinc-400">
                {profile.coreStackLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {profile.coreStack}
              </p>
            </div>
            <div className="py-6">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-zinc-400">
                Build principles
              </p>
              <ul className="mt-3 space-y-2.5">
                {principles.map((principle, index) => (
                  <li
                    key={principle}
                    className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                      0{index + 1}
                    </span>
                    {principle}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div
        className="marquee mt-20 border-y border-zinc-200 bg-white/55 py-3 dark:border-zinc-800 dark:bg-zinc-950/40"
        aria-hidden="true"
      >
        <div className="marquee-track font-mono text-[10px] uppercase tracking-[.24em] text-zinc-400">
          <span>Next.js</span>
          <span>API design</span>
          <span>Real-time systems</span>
          <span>Redis</span>
          <span>AWS delivery</span>
          <span>Next.js</span>
          <span>API design</span>
          <span>Real-time systems</span>
          <span>Redis</span>
          <span>AWS delivery</span>
        </div>
      </div>
    </section>
  );
}
