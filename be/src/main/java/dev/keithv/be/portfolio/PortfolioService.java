package dev.keithv.be.portfolio;

import dev.keithv.be.common.ResourceNotFoundException;
import dev.keithv.be.portfolio.PortfolioResponse.CapabilityResponse;
import dev.keithv.be.portfolio.PortfolioResponse.EducationResponse;
import dev.keithv.be.portfolio.PortfolioResponse.ExperienceResponse;
import dev.keithv.be.portfolio.PortfolioResponse.NavigationLinkResponse;
import dev.keithv.be.portfolio.PortfolioResponse.ProfileResponse;
import dev.keithv.be.portfolio.PortfolioResponse.ProjectResponse;
import dev.keithv.be.portfolio.PortfolioResponse.SocialLinkResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PortfolioService {
	private static final String MAIN_PROFILE_KEY = "main";

	private final PortfolioProfileRepository profileRepository;
	private final NavigationLinkRepository navigationLinkRepository;
	private final SocialLinkRepository socialLinkRepository;
	private final HeroPrincipleRepository heroPrincipleRepository;
	private final CapabilityRepository capabilityRepository;
	private final WorkExperienceRepository workExperienceRepository;
	private final EducationRepository educationRepository;
	private final ProjectRepository projectRepository;

	public PortfolioService(
		PortfolioProfileRepository profileRepository,
		NavigationLinkRepository navigationLinkRepository,
		SocialLinkRepository socialLinkRepository,
		HeroPrincipleRepository heroPrincipleRepository,
		CapabilityRepository capabilityRepository,
		WorkExperienceRepository workExperienceRepository,
		EducationRepository educationRepository,
		ProjectRepository projectRepository
	) {
		this.profileRepository = profileRepository;
		this.navigationLinkRepository = navigationLinkRepository;
		this.socialLinkRepository = socialLinkRepository;
		this.heroPrincipleRepository = heroPrincipleRepository;
		this.capabilityRepository = capabilityRepository;
		this.workExperienceRepository = workExperienceRepository;
		this.educationRepository = educationRepository;
		this.projectRepository = projectRepository;
	}

	public PortfolioResponse getPortfolio() {
		return new PortfolioResponse(
			getProfile(),
			getNavigationLinks(),
			getSocialLinks(),
			getPrinciples(),
			getCapabilities(),
			getExperiences(),
			getEducations(),
			getProjects()
		);
	}

	public ProfileResponse getProfile() {
		PortfolioProfile profile = profileRepository.findByProfileKey(MAIN_PROFILE_KEY)
			.orElseThrow(() -> new ResourceNotFoundException("Portfolio profile not found"));
		return toProfile(profile);
	}

	public List<NavigationLinkResponse> getNavigationLinks() {
		return navigationLinkRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map((link) -> new NavigationLinkResponse(link.getId(), link.getLabel(), link.getTargetId()))
			.toList();
	}

	public List<SocialLinkResponse> getSocialLinks() {
		return socialLinkRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map((link) -> new SocialLinkResponse(link.getId(), link.getLabel(), link.getUrl()))
			.toList();
	}

	public List<String> getPrinciples() {
		return heroPrincipleRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map(HeroPrinciple::getText)
			.toList();
	}

	public List<CapabilityResponse> getCapabilities() {
		return capabilityRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map((capability) -> new CapabilityResponse(
				capability.getId(),
				capability.getItemIndex(),
				capability.getTitle(),
				capability.getDetail()
			))
			.toList();
	}

	public List<ExperienceResponse> getExperiences() {
		return workExperienceRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map((experience) -> new ExperienceResponse(
				experience.getId(),
				experience.getRole(),
				experience.getCompany(),
				experience.getLocation(),
				experience.getPeriod(),
				experience.getDetailLinkLabel(),
				experience.getDetailLinkUrl(),
				experience.getHighlights().stream().map(WorkExperienceHighlight::getText).toList()
			))
			.toList();
	}

	public List<EducationResponse> getEducations() {
		return educationRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map((education) -> new EducationResponse(
				education.getId(),
				education.getDegree(),
				education.getInstitution(),
				education.getFocus()
			))
			.toList();
	}

	public List<ProjectResponse> getProjects() {
		return projectRepository.findAllByOrderByDisplayOrderAsc().stream()
			.map(this::toProject)
			.toList();
	}

	public List<ProjectResponse> getFeaturedProjects() {
		return projectRepository.findAllByIsFeaturedTrueOrderByDisplayOrderAsc().stream()
			.map(this::toProject)
			.toList();
	}

	private ProfileResponse toProfile(PortfolioProfile profile) {
		return new ProfileResponse(
			profile.getId(),
			profile.getName(),
			profile.getRole(),
			profile.getEmail(),
			profile.getLocation(),
			profile.getAvailabilityText(),
			profile.getHeroKicker(),
			profile.getHeroHeadline(),
			profile.getHeroIntro(),
			profile.getCurrentRoleLabel(),
			profile.getCurrentRole(),
			profile.getCurrentCompanyPeriod(),
			profile.getCoreStackLabel(),
			profile.getCoreStack(),
			profile.getAboutSectionIndex(),
			profile.getAboutTitle(),
			profile.getAboutLead(),
			profile.getAboutSummary(),
			profile.getAboutBody(),
			profile.getExperienceSectionLabel(),
			profile.getEducationSectionLabel(),
			profile.getContactSectionIndex(),
			profile.getContactHeadline(),
			profile.getContactIntro(),
			profile.getContactEmailLabel(),
			profile.getContactLocationLabel(),
			profile.getContactFormButtonLabel(),
			profile.getContactPrivacyNote(),
			profile.getFooterText(),
			profile.getFooterBuiltWith(),
			profile.getLogoPath(),
			profile.getLogoAlt()
		);
	}

	private ProjectResponse toProject(Project project) {
		return new ProjectResponse(
			project.getId(),
			project.getNumber(),
			project.getTitle(),
			project.getLabel(),
			project.getDescription(),
			project.getHighlights().stream().map(ProjectHighlight::getText).toList(),
			project.getTechnologies().stream().map(ProjectTechnology::getName).toList(),
			project.getGithubUrl(),
			project.getVisualKey(),
			project.getIconKey(),
			project.isFeatured()
		);
	}
}
