package dev.keithv.be.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "portfolio_profiles")
public class PortfolioProfile {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false, unique = true)
	private String profileKey;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String role;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String location;

	@Column(nullable = false)
	private String availabilityText;

	@Column(nullable = false)
	private String heroKicker;

	@Column(nullable = false)
	private String heroHeadline;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String heroIntro;

	@Column(nullable = false)
	private String currentRoleLabel;

	@Column(name = "current_role_name", nullable = false)
	private String currentRole;

	@Column(nullable = false)
	private String currentCompanyPeriod;

	@Column(nullable = false)
	private String coreStackLabel;

	@Column(nullable = false)
	private String coreStack;

	@Column(nullable = false)
	private String aboutSectionIndex;

	@Column(nullable = false)
	private String aboutTitle;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String aboutLead;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String aboutSummary;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String aboutBody;

	@Column(nullable = false)
	private String experienceSectionLabel;

	@Column(nullable = false)
	private String educationSectionLabel;

	@Column(nullable = false)
	private String contactSectionIndex;

	@Column(nullable = false)
	private String contactHeadline;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String contactIntro;

	@Column(nullable = false)
	private String contactEmailLabel;

	@Column(nullable = false)
	private String contactLocationLabel;

	@Column(nullable = false)
	private String contactFormButtonLabel;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String contactPrivacyNote;

	@Column(nullable = false)
	private String footerText;

	@Column(nullable = false)
	private String footerBuiltWith;

	@Column(nullable = false)
	private String logoPath;

	@Column(nullable = false)
	private String logoAlt;

	protected PortfolioProfile() {
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getRole() {
		return role;
	}

	public String getEmail() {
		return email;
	}

	public String getLocation() {
		return location;
	}

	public String getAvailabilityText() {
		return availabilityText;
	}

	public String getHeroKicker() {
		return heroKicker;
	}

	public String getHeroHeadline() {
		return heroHeadline;
	}

	public String getHeroIntro() {
		return heroIntro;
	}

	public String getCurrentRoleLabel() {
		return currentRoleLabel;
	}

	public String getCurrentRole() {
		return currentRole;
	}

	public String getCurrentCompanyPeriod() {
		return currentCompanyPeriod;
	}

	public String getCoreStackLabel() {
		return coreStackLabel;
	}

	public String getCoreStack() {
		return coreStack;
	}

	public String getAboutSectionIndex() {
		return aboutSectionIndex;
	}

	public String getAboutTitle() {
		return aboutTitle;
	}

	public String getAboutLead() {
		return aboutLead;
	}

	public String getAboutSummary() {
		return aboutSummary;
	}

	public String getAboutBody() {
		return aboutBody;
	}

	public String getExperienceSectionLabel() {
		return experienceSectionLabel;
	}

	public String getEducationSectionLabel() {
		return educationSectionLabel;
	}

	public String getContactSectionIndex() {
		return contactSectionIndex;
	}

	public String getContactHeadline() {
		return contactHeadline;
	}

	public String getContactIntro() {
		return contactIntro;
	}

	public String getContactEmailLabel() {
		return contactEmailLabel;
	}

	public String getContactLocationLabel() {
		return contactLocationLabel;
	}

	public String getContactFormButtonLabel() {
		return contactFormButtonLabel;
	}

	public String getContactPrivacyNote() {
		return contactPrivacyNote;
	}

	public String getFooterText() {
		return footerText;
	}

	public String getFooterBuiltWith() {
		return footerBuiltWith;
	}

	public String getLogoPath() {
		return logoPath;
	}

	public String getLogoAlt() {
		return logoAlt;
	}
}
