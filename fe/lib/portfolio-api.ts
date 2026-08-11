import { apiClient } from "./api-client";
import type { Project } from "./project-api";

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

export async function getPortfolioData(): Promise<PortfolioData> {
  const { data } = await apiClient.get<PortfolioData>("/portfolio");
  return data;
}
