package dev.keithv.be.portfolio;

import java.util.List;
import java.util.UUID;

public record PortfolioResponse(
	ProfileResponse profile,
	List<NavigationLinkResponse> navigationLinks,
	List<SocialLinkResponse> socialLinks,
	List<String> principles,
	List<CapabilityResponse> capabilities,
	List<ExperienceResponse> experiences,
	List<EducationResponse> educations,
	List<ProjectResponse> projects
) {
	public record ProfileResponse(
		UUID id,
		String name,
		String role,
		String email,
		String location,
		String availabilityText,
		String heroKicker,
		String heroHeadline,
		String heroIntro,
		String currentRoleLabel,
		String currentRole,
		String currentCompanyPeriod,
		String coreStackLabel,
		String coreStack,
		String aboutSectionIndex,
		String aboutTitle,
		String aboutLead,
		String aboutSummary,
		String aboutBody,
		String experienceSectionLabel,
		String educationSectionLabel,
		String contactSectionIndex,
		String contactHeadline,
		String contactIntro,
		String contactEmailLabel,
		String contactLocationLabel,
		String contactFormButtonLabel,
		String contactPrivacyNote,
		String footerText,
		String footerBuiltWith,
		String logoPath,
		String logoAlt
	) {
	}

	public record NavigationLinkResponse(UUID uid, String label, String id) {
	}

	public record SocialLinkResponse(UUID id, String label, String url) {
	}

	public record CapabilityResponse(UUID id, String index, String title, String detail) {
	}

	public record ExperienceResponse(
		UUID id,
		String role,
		String company,
		String location,
		String period,
		String detailLinkLabel,
		String detailLinkUrl,
		List<String> highlights
	) {
	}

	public record EducationResponse(UUID id, String degree, String institution, String focus) {
	}

	public record ProjectResponse(
		UUID id,
		String number,
		String title,
		String label,
		String description,
		List<String> highlights,
		List<String> tech,
		String github,
		String visualKey,
		String iconKey,
		boolean isFeatured
	) {
	}
}
