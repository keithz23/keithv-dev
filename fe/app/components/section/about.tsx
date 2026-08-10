import {
  ArrowUpRight,
  Check,
  GraduationCap,
  Stack,
  SuitcaseSimple,
} from "@phosphor-icons/react/dist/ssr";
import type {
  Capability,
  Education,
  Experience,
  Profile,
} from "@/lib/portfolio-api";

export default function AboutSection({
  profile,
  capabilities,
  experiences,
  educations,
}: {
  profile: Profile;
  capabilities: Capability[];
  experiences: Experience[];
  educations: Education[];
}) {
  return (
    <section
      id="about"
      className="section-shell border-t border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.58fr_1.42fr] lg:gap-20">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-index">{profile.aboutSectionIndex}</p>
            <h2 className="section-title mt-5 max-w-[8ch]">
              {profile.aboutTitle}
            </h2>
            <p className="mt-6 max-w-sm text-pretty leading-7 text-zinc-600 dark:text-zinc-400">
              {profile.aboutLead}
            </p>
          </header>

          <div>
            <p className="max-w-[38ch] text-pretty text-2xl font-medium leading-[1.45] tracking-[-.025em] text-zinc-900 sm:text-3xl dark:text-zinc-100">
              {profile.aboutSummary}
            </p>
            <p className="mt-7 max-w-[65ch] leading-8 text-zinc-600 dark:text-zinc-400">
              {profile.aboutBody}
            </p>

            <div className="mt-14 border-t border-zinc-300 dark:border-zinc-700">
              {capabilities.map((item) => (
                <article
                  key={item.index}
                  className="group grid gap-3 border-b border-zinc-200 py-7 sm:grid-cols-[3rem_13rem_1fr] sm:items-start dark:border-zinc-800"
                >
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                    {item.index}
                  </span>
                  <h3 className="font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {item.title}
                  </h3>
                  <p className="max-w-[48ch] text-sm leading-6 text-zinc-500 transition-colors duration-300 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-28 grid gap-10 border-t border-zinc-300 pt-10 lg:grid-cols-[.58fr_1.42fr] lg:gap-20 dark:border-zinc-700">
          <div>
            <p className="section-index">{profile.experienceSectionLabel}</p>
            {experiences[0] && (
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <SuitcaseSimple
                  size={19}
                  weight="regular"
                  className="text-blue-600 dark:text-blue-400"
                />{" "}
                {experiences[0].period}
              </div>
            )}
          </div>
          {experiences.map((experience) => (
            <article key={experience.id}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-.03em] text-zinc-950 dark:text-zinc-50">
                    {experience.role}
                  </h3>
                  <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                    {experience.company} · {experience.location}
                  </p>
                </div>
                <a href={experience.detailLinkUrl} className="text-link">
                  {experience.detailLinkLabel}{" "}
                  <ArrowUpRight size={15} weight="regular" />
                </a>
              </div>
              <ul className="mt-8 grid gap-4">
                {experience.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 border-l border-zinc-300 pl-4 text-sm leading-6 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <Check
                      size={15}
                      weight="regular"
                      className="mt-1 shrink-0 text-blue-600 dark:text-blue-400"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-10 border-t border-zinc-200 pt-10 lg:grid-cols-[.58fr_1.42fr] lg:gap-20 dark:border-zinc-800">
          <div>
            <p className="section-index">{profile.educationSectionLabel}</p>
          </div>
          {educations.map((education) => (
            <article
              key={education.id}
              className="grid gap-5 sm:grid-cols-[auto_1fr]"
            >
              <GraduationCap
                size={25}
                weight="regular"
                className="text-blue-600 dark:text-blue-400"
              />
              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {education.degree}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {education.institution}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-zinc-400">
                  <Stack size={15} weight="regular" /> {education.focus}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
