import {
  ArrowUpRight,
  BookOpenText,
  ChatCircleDots,
  Check,
  Code,
  Kanban,
  ShoppingBagOpen,
  Warehouse,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import type { Project } from "@/lib/portfolio-api";

const projectIcons: Record<string, Icon> = {
  book: BookOpenText,
  chat: ChatCircleDots,
  kanban: Kanban,
  shopping: ShoppingBagOpen,
  warehouse: Warehouse,
};

function BlueskyVisual() {
  return (
    <div className="system-canvas" aria-hidden="true">
      <div className="system-toolbar">
        <div>
          <span />
          <span />
          <span />
        </div>
        <p>feed.pipeline</p>
      </div>
      <div className="grid grow grid-cols-[4rem_1fr]">
        <div className="system-rail">
          <ChatCircleDots size={22} weight="regular" />
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <p className="system-label">Realtime feed</p>
            <span className="status-dot" />
          </div>
          <div className="mt-7 space-y-3">
            {[
              "Fan-out event",
              "Redis cache",
              "Rekognition scan",
              "Socket delivery",
            ].map((item, index) => (
              <div key={item} className="feed-row">
                <span className="font-mono text-[9px] text-blue-600 dark:text-blue-400">
                  0{index + 1}
                </span>
                <span>{item}</span>
                <span className="ml-auto h-1.5 w-12 bg-zinc-200 dark:bg-zinc-700" />
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-[1.4fr_.6fr] gap-3">
            <div className="h-20 border border-zinc-200 p-3 dark:border-zinc-700">
              <span className="block h-1.5 w-3/5 bg-blue-600/25" />
              <span className="mt-3 block h-1.5 w-4/5 bg-zinc-200 dark:bg-zinc-700" />
              <span className="mt-2 block h-1.5 w-2/5 bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="grid place-items-center bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">
              LIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommerceVisual() {
  return (
    <div className="system-canvas" aria-hidden="true">
      <div className="system-toolbar">
        <div>
          <span />
          <span />
          <span />
        </div>
        <p>commerce.flow</p>
      </div>
      <div className="p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="system-label">Storefront / Admin</p>
            <p className="mt-2 text-xl font-semibold tracking-[-.04em] text-zinc-900 dark:text-zinc-100">
              One typed data flow
            </p>
          </div>
          <ShoppingBagOpen
            size={25}
            weight="regular"
            className="text-blue-600 dark:text-blue-400"
          />
        </div>
        <div className="mt-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="commerce-node">
            <span>01</span>
            <p>Next.js SSR</p>
          </div>
          <ArrowUpRight
            size={16}
            weight="regular"
            className="rotate-45 text-zinc-400"
          />
          <div className="commerce-node">
            <span>02</span>
            <p>NestJS API</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="commerce-node">
            <span>03</span>
            <p>Payment webhook</p>
          </div>
          <ArrowUpRight
            size={16}
            weight="regular"
            className="rotate-45 text-zinc-400"
          />
          <div className="commerce-node border-blue-600/50 dark:border-blue-400/50">
            <span>04</span>
            <p>Order state</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className={`project-case sticky ${index === 0 ? "project-stack-first" : "project-stack-second"}`}
    >
      <div className="grid gap-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-14">
        {project.visualKey === "bluesky" ? (
          <BlueskyVisual />
        ) : (
          <CommerceVisual />
        )}
        <div className="flex flex-col py-1 lg:py-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
            <div>
              <p className="section-index">Case {project.number}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-zinc-950 sm:text-4xl dark:text-zinc-50">
                {project.title}
              </h3>
            </div>
            <span className="project-type">{project.label}</span>
          </div>
          <p className="mt-6 max-w-[58ch] leading-7 text-zinc-600 dark:text-zinc-300">
            {project.description}
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="project-highlight">
                <Check size={14} weight="regular" />
                {highlight}
              </li>
            ))}
          </ul>
          <div className="tech-ledger">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="mt-auto pt-8">
            <a
              href={project.github ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <Code size={16} weight="regular" /> Explore source{" "}
              <ArrowUpRight size={15} weight="regular" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const featuredProjects = projects.filter((project) => project.isFeatured);
  const archiveProjects = projects.filter((project) => !project.isFeatured);

  return (
    <section
      id="projects"
      className="section-shell border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <header className="grid gap-8 lg:grid-cols-[.58fr_1.42fr] lg:gap-20">
          <p className="section-index">02 / Selected work</p>
          <div>
            <h2 className="section-title max-w-[13ch]">
              Systems explained through decisions, not decoration.
            </h2>
            <p className="mt-7 max-w-[61ch] leading-7 text-zinc-600 dark:text-zinc-400">
              Two deeper case studies show how product behavior connects to
              access control, data flow, caching, real-time delivery, and
              infrastructure. The remaining work stays concise below.
            </p>
          </div>
        </header>

        <div className="mt-20 space-y-8">
          {featuredProjects.map((project, index) => (
            <FeaturedProject
              key={project.title}
              project={project}
              index={index}
            />
          ))}
        </div>

        <div className="mt-28 grid gap-10 border-t border-zinc-300 pt-10 lg:grid-cols-[.58fr_1.42fr] lg:gap-20 dark:border-zinc-700">
          <div>
            <p className="section-index">Project archive</p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Smaller systems that broaden the range across cloud delivery, team
              workflows, and business operations.
            </p>
          </div>
          <div className="border-t border-zinc-300 dark:border-zinc-700">
            {archiveProjects.map((project) => {
              const Icon = projectIcons[project.iconKey] ?? Code;
              return (
                <article key={project.title} className="archive-row group">
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                    {project.number}
                  </span>
                  <div>
                    <div className="flex items-center gap-3">
                      <Icon
                        size={19}
                        weight="regular"
                        className="text-zinc-400 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      />
                      <h3 className="font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                        {project.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-[55ch] text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] uppercase tracking-[.13em] text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="project-type hidden sm:block">
                    {project.label}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
