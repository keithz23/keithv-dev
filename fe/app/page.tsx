import Navbar from "./components/navbar";
import InteractiveHero from "./components/interactive";
import AboutSection from "./components/section/about";
import ProjectsSection from "./components/section/project";
import ContactSection from "./components/section/contact";
import Footer from "./components/footer";
import BackToTop from "./components/back-to-top";
import {
  getPortfolioData,
  getPublicPortfolioApiBaseUrl,
} from "@/lib/portfolio-api";

export default async function Home() {
  const portfolio = await getPortfolioData();
  const publicApiBaseUrl = getPublicPortfolioApiBaseUrl();

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
        <ProjectsSection projects={portfolio.projects} />
        <ContactSection
          profile={portfolio.profile}
          socialLinks={portfolio.socialLinks}
          apiBaseUrl={publicApiBaseUrl}
        />
      </main>

      <Footer profile={portfolio.profile} socialLinks={portfolio.socialLinks} />
      <BackToTop />
    </div>
  );
}
