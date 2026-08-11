import { ArrowUpRight, Briefcase, ChatCircleText, CirclesFour, GraduationCap, LinkSimple, Stack } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const resources = [
  { href: "/admin/projects", label: "Projects", description: "Case studies, technologies and featured work.", icon: Stack, index: "01" },
  { href: "/admin/capabilities", label: "Capabilities", description: "The services and technical strengths on your profile.", icon: CirclesFour, index: "02" },
  { href: "/admin/experiences", label: "Experience", description: "Roles, companies, timelines and role highlights.", icon: Briefcase, index: "03" },
  { href: "/admin/educations", label: "Education", description: "Degrees, institutions and areas of focus.", icon: GraduationCap, index: "04" },
  { href: "/admin/social-links", label: "Social links", description: "Public destinations shown in contact and footer areas.", icon: LinkSimple, index: "05" },
  { href: "/admin/contact-messages", label: "Messages", description: "Review and archive incoming portfolio enquiries.", icon: ChatCircleText, index: "06" },
];

export default function AdminDashboardPage() {
  return (
    <div className="w-full">
      <header className="grid gap-8 border-b border-black/[.08] pb-10 md:grid-cols-[minmax(0,1.4fr)_minmax(15rem,.6fr)] md:items-end dark:border-white/10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.22em] text-blue-600 dark:text-blue-400">Workspace / Overview</p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[.98] tracking-[-.055em] sm:text-5xl">Keep the portfolio current, without touching the code.</h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-zinc-500">Manage every public content collection from one protected workspace. Changes are reflected through the portfolio API.</p>
      </header>

      <section className="mt-10" aria-labelledby="content-heading">
        <div className="flex items-end justify-between gap-5">
          <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-zinc-400">Content directory</p><h2 id="content-heading" className="mt-2 text-xl font-semibold tracking-[-.025em]">Choose a collection</h2></div>
          <Link href="/admin/projects/new" className="hidden items-center gap-2 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:translate-y-px sm:inline-flex dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white">New project <ArrowUpRight size={14} weight="bold" /></Link>
        </div>

        <div className="mt-6 grid border-t border-black/[.08] md:grid-cols-2 dark:border-white/10">
          {resources.map(({ href, label, description, icon: Icon, index }) => (
            <Link key={href} href={href} className="group grid min-h-44 grid-cols-[auto_1fr_auto] gap-5 border-b border-black/[.08] py-7 transition-colors hover:bg-white/65 active:translate-y-px md:odd:border-r md:odd:pr-7 md:even:pl-7 dark:border-white/10 dark:hover:bg-white/[.035]">
              <span className="grid size-10 place-items-center border border-black/[.08] bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300"><Icon size={19} weight="duotone" /></span>
              <span><span className="block text-base font-semibold tracking-[-.02em]">{label}</span><span className="mt-2 block max-w-xs text-sm leading-6 text-zinc-500">{description}</span></span>
              <span className="flex flex-col items-end justify-between"><span className="font-mono text-[10px] text-zinc-400">{index}</span><ArrowUpRight size={17} className="text-zinc-300 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
