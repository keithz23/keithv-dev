import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Profile, SocialLink } from "@/lib/portfolio-api";

export default function Footer({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 text-xs text-zinc-500 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:items-center lg:px-10 dark:text-zinc-400">
        <p>{profile.footerText}</p>
        <div className="flex gap-5">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              className="footer-link"
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label} <ArrowUpRight size={12} weight="regular" />
            </a>
          ))}
        </div>
        <p className="font-mono uppercase tracking-[.14em] md:text-right">
          {profile.footerBuiltWith}
        </p>
      </div>
    </footer>
  );
}
