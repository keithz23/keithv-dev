package dev.keithv.be.portfolio;

import dev.keithv.be.portfolio.PortfolioResponse.CapabilityResponse;
import dev.keithv.be.portfolio.PortfolioResponse.EducationResponse;
import dev.keithv.be.portfolio.PortfolioResponse.ExperienceResponse;
import dev.keithv.be.portfolio.PortfolioResponse.NavigationLinkResponse;
import dev.keithv.be.portfolio.PortfolioResponse.ProfileResponse;
import dev.keithv.be.portfolio.PortfolioResponse.ProjectResponse;
import dev.keithv.be.portfolio.PortfolioResponse.SocialLinkResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class PortfolioController {
	private final PortfolioService portfolioService;

	public PortfolioController(PortfolioService portfolioService) {
		this.portfolioService = portfolioService;
	}

	@GetMapping("/portfolio")
	public PortfolioResponse portfolio() {
		return portfolioService.getPortfolio();
	}

	@GetMapping("/profile")
	public ProfileResponse profile() {
		return portfolioService.getProfile();
	}

	@GetMapping("/navigation-links")
	public List<NavigationLinkResponse> navigationLinks() {
		return portfolioService.getNavigationLinks();
	}

	@GetMapping("/social-links")
	public List<SocialLinkResponse> socialLinks() {
		return portfolioService.getSocialLinks();
	}

	@GetMapping("/capabilities")
	public List<CapabilityResponse> capabilities() {
		return portfolioService.getCapabilities();
	}

	@GetMapping("/experiences")
	public List<ExperienceResponse> experiences() {
		return portfolioService.getExperiences();
	}

	@GetMapping("/educations")
	public List<EducationResponse> educations() {
		return portfolioService.getEducations();
	}

	@GetMapping("/projects")
	public List<ProjectResponse> projects() {
		return portfolioService.getProjects();
	}

	@GetMapping("/projects/featured")
	public List<ProjectResponse> featuredProjects() {
		return portfolioService.getFeaturedProjects();
	}
}
