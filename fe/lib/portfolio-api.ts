import { connection } from "next/server";

export type Profile = {
  id: string;
  name: string;
  role: string;
  email: string;
  location: string;
  availabilityText: string;
  heroKicker: string;
  heroHeadline: string;
  heroIntro: string;
  currentRoleLabel: string;
  currentRole: string;
  currentCompanyPeriod: string;
  coreStackLabel: string;
  coreStack: string;
  aboutSectionIndex: string;
  aboutTitle: string;
  aboutLead: string;
  aboutSummary: string;
  aboutBody: string;
  experienceSectionLabel: string;
  educationSectionLabel: string;
  contactSectionIndex: string;
  contactHeadline: string;
  contactIntro: string;
  contactEmailLabel: string;
  contactLocationLabel: string;
  contactFormButtonLabel: string;
  contactPrivacyNote: string;
  footerText: string;
  footerBuiltWith: string;
  logoPath: string;
  logoAlt: string;
};

export type NavigationLink = {
  uid: string;
  label: string;
  id: string;
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
};

export type Capability = {
  id: string;
  index: string;
  title: string;
  detail: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  detailLinkLabel: string;
  detailLinkUrl: string;
  highlights: string[];
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  focus: string;
};

export type Project = {
  id: string;
  number: string;
  title: string;
  label: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string | null;
  visualKey: string | null;
  iconKey: string;
  isFeatured: boolean;
};

export type PortfolioData = {
  profile: Profile;
  navigationLinks: NavigationLink[];
  socialLinks: SocialLink[];
  principles: string[];
  capabilities: Capability[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
};

export function getPortfolioApiBaseUrl() {
  return process.env.PORTFOLIO_API_BASE_URL ?? "http://localhost:8080/api/v1";
}

export function getPublicPortfolioApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_PORTFOLIO_API_BASE_URL ??
    "http://localhost:8080/api/v1"
  );
}

export async function getPortfolioData(): Promise<PortfolioData> {
  await connection();

  const response = await fetch(`${getPortfolioApiBaseUrl()}/portfolio`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Portfolio API request failed: ${response.status}`);
  }

  return response.json();
}
