package dev.keithv.be.portfolio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.hibernate.validator.constraints.URL;

public final class PortfolioAdminDtos {
	private PortfolioAdminDtos() { }
	public record CapabilityRequest(@NotBlank @Size(max=10) String index, @NotBlank @Size(max=160) String title, @NotBlank String detail, @NotNull @PositiveOrZero Integer displayOrder) { }
	public record CapabilityPatch(@Size(min=1,max=10) String index, @Size(min=1,max=160) String title, @Size(min=1) String detail, @PositiveOrZero Integer displayOrder) { }
	public record CapabilityResponse(UUID id, String index, String title, String detail, int displayOrder) { }
	public record EducationRequest(@NotBlank @Size(max=180) String degree, @NotBlank @Size(max=220) String institution, @NotBlank @Size(max=160) String focus, @NotNull @PositiveOrZero Integer displayOrder) { }
	public record EducationPatch(@Size(min=1,max=180) String degree, @Size(min=1,max=220) String institution, @Size(min=1,max=160) String focus, @PositiveOrZero Integer displayOrder) { }
	public record EducationResponse(UUID id, String degree, String institution, String focus, int displayOrder) { }
	public record SocialLinkRequest(@NotBlank @Size(max=80) String label, @NotBlank @Size(max=500) @URL(protocol="https") String url, @NotNull @PositiveOrZero Integer displayOrder) { }
	public record SocialLinkPatch(@Size(min=1,max=80) String label, @Size(min=1,max=500) @URL(protocol="https") String url, @PositiveOrZero Integer displayOrder) { }
	public record SocialLinkResponse(UUID id, String label, String url, int displayOrder) { }
	public record ExperienceRequest(@NotBlank @Size(max=160) String role, @NotBlank @Size(max=180) String company, @NotBlank @Size(max=160) String location, @NotBlank @Size(max=120) String period, @NotBlank @Size(max=120) String detailLinkLabel, @NotBlank @Size(max=500) @URL String detailLinkUrl, @NotNull @PositiveOrZero Integer displayOrder, @NotEmpty List<@NotBlank String> highlights) { }
	public record ExperiencePatch(@Size(min=1,max=160) String role, @Size(min=1,max=180) String company, @Size(min=1,max=160) String location, @Size(min=1,max=120) String period, @Size(min=1,max=120) String detailLinkLabel, @Size(min=1,max=500) @URL String detailLinkUrl, @PositiveOrZero Integer displayOrder, @Size(min=1) List<@NotBlank String> highlights) { }
	public record ExperienceResponse(UUID id, String role, String company, String location, String period, String detailLinkLabel, String detailLinkUrl, int displayOrder, List<String> highlights) { }
}
