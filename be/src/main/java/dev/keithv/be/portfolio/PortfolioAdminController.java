package dev.keithv.be.portfolio;

import dev.keithv.be.portfolio.PortfolioAdminDtos.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@SecurityRequirement(name="bearerAuth")
public class PortfolioAdminController {
	private final PortfolioAdminService service;
	public PortfolioAdminController(PortfolioAdminService service){this.service=service;}

	@GetMapping("/capabilities") public List<CapabilityResponse> capabilities(){return service.capabilities();}
	@PostMapping("/capabilities") @ResponseStatus(HttpStatus.CREATED) public CapabilityResponse create(@Valid @RequestBody CapabilityRequest r){return service.create(r);}
	@PatchMapping("/capabilities/{id}") public CapabilityResponse patch(@PathVariable UUID id,@Valid @RequestBody CapabilityPatch r){return service.patch(id,r);}
	@DeleteMapping("/capabilities/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteCapability(@PathVariable UUID id){service.deleteCapability(id);}

	@GetMapping("/educations") public List<EducationResponse> educations(){return service.educations();}
	@PostMapping("/educations") @ResponseStatus(HttpStatus.CREATED) public EducationResponse create(@Valid @RequestBody EducationRequest r){return service.create(r);}
	@PatchMapping("/educations/{id}") public EducationResponse patch(@PathVariable UUID id,@Valid @RequestBody EducationPatch r){return service.patch(id,r);}
	@DeleteMapping("/educations/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteEducation(@PathVariable UUID id){service.deleteEducation(id);}

	@GetMapping("/social-links") public List<SocialLinkResponse> socialLinks(){return service.socialLinks();}
	@PostMapping("/social-links") @ResponseStatus(HttpStatus.CREATED) public SocialLinkResponse create(@Valid @RequestBody SocialLinkRequest r){return service.create(r);}
	@PatchMapping("/social-links/{id}") public SocialLinkResponse patch(@PathVariable UUID id,@Valid @RequestBody SocialLinkPatch r){return service.patch(id,r);}
	@DeleteMapping("/social-links/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteSocialLink(@PathVariable UUID id){service.deleteSocialLink(id);}

	@GetMapping("/experiences") public List<ExperienceResponse> experiences(){return service.experiences();}
	@PostMapping("/experiences") @ResponseStatus(HttpStatus.CREATED) public ExperienceResponse create(@Valid @RequestBody ExperienceRequest r){return service.create(r);}
	@PatchMapping("/experiences/{id}") public ExperienceResponse patch(@PathVariable UUID id,@Valid @RequestBody ExperiencePatch r){return service.patch(id,r);}
	@DeleteMapping("/experiences/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void deleteExperience(@PathVariable UUID id){service.deleteExperience(id);}
}
