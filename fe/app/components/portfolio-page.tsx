"use client";

import Navbar from "./navbar";
import InteractiveHero from "./interactive";
import AboutSection from "./section/about";
import ProjectFeed from "./section/project-feed";
import ContactSection from "./section/contact";
import Footer from "./footer";
import BackToTop from "./back-to-top";
import { usePortfolio } from "@/lib/portfolio-queries";

function PortfolioLoadingState() {
  return (
    <main
      className="grid min-h-[100dvh] place-items-center bg-white px-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
      aria-busy="true"
    >
      <div className="w-full max-w-3xl animate-pulse border-t border-zinc-300 pt-8 dark:border-zinc-700">
        <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-8 h-16 w-4/5 bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-5 h-5 w-3/5 bg-zinc-100 dark:bg-zinc-900" />
        <p className="sr-only">Loading portfolio</p>
      </div>
    </main>
  );
}

function PortfolioErrorState({ retry }: { retry: () => void }) {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-white px-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-2xl border-t border-zinc-900 pt-8 dark:border-zinc-100">
        <p className="section-index">Service unavailable</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-.045em] sm:text-6xl">
          The portfolio could not be loaded.
        </h1>
        <p className="mt-5 max-w-lg leading-7 text-zinc-600 dark:text-zinc-400">
          Check that the portfolio API is running, then try again.
        </p>
        <button type="button" onClick={retry} className="button-primary mt-8">
          Try again
        </button>
      </div>
    </main>
  );
}

export default function PortfolioPage() {
  const { data: portfolio, isPending, isError, refetch } = usePortfolio();

  if (isPending) return <PortfolioLoadingState />;
  if (isError) return <PortfolioErrorState retry={() => void refetch()} />;

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar profile={portfolio.profile} links={portfolio.navigationLinks} />

      <main id="main-content">
        <section id="home" className="scroll-mt-20 bg-white dark:bg-zinc-950">
          <InteractiveHero
            profile={portfolio.profile}
            principles={portfolio.principles}
          />
        </section>

        <AboutSection
          profile={portfolio.profile}
          capabilities={portfolio.capabilities}
          experiences={portfolio.experiences}
          educations={portfolio.educations}
        />
        <ProjectFeed />
        <ContactSection
          profile={portfolio.profile}
          socialLinks={portfolio.socialLinks}
        />
      </main>

      <Footer profile={portfolio.profile} socialLinks={portfolio.socialLinks} />
      <BackToTop />
    </div>
  );
}
