package dev.keithv.be.portfolio;

import dev.keithv.be.common.ResourceNotFoundException;
import dev.keithv.be.portfolio.PortfolioAdminDtos.*;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortfolioAdminService {
	private final CapabilityRepository capabilities;
	private final EducationRepository educations;
	private final SocialLinkRepository socialLinks;
	private final WorkExperienceRepository experiences;
	public PortfolioAdminService(CapabilityRepository capabilities, EducationRepository educations, SocialLinkRepository socialLinks, WorkExperienceRepository experiences) {
		this.capabilities = capabilities; this.educations = educations; this.socialLinks = socialLinks; this.experiences = experiences;
	}

	@Transactional(readOnly=true) public List<CapabilityResponse> capabilities() { return capabilities.findAllByOrderByDisplayOrderAsc().stream().map(this::capability).toList(); }
	@Transactional public CapabilityResponse create(CapabilityRequest r) { return capability(capabilities.save(new Capability(r.index().trim(), r.title().trim(), r.detail().trim(), r.displayOrder()))); }
	@Transactional public CapabilityResponse patch(UUID id, CapabilityPatch r) { Capability e=capabilities.findById(id).orElseThrow(()->new ResourceNotFoundException("Capability not found")); e.update(n(r.index()),n(r.title()),n(r.detail()),r.displayOrder()); return capability(e); }
	@Transactional public void deleteCapability(UUID id) { if(!capabilities.existsById(id)) throw new ResourceNotFoundException("Capability not found"); capabilities.deleteById(id); }

	@Transactional(readOnly=true) public List<EducationResponse> educations() { return educations.findAllByOrderByDisplayOrderAsc().stream().map(this::education).toList(); }
	@Transactional public EducationResponse create(EducationRequest r) { return education(educations.save(new Education(r.degree().trim(),r.institution().trim(),r.focus().trim(),r.displayOrder()))); }
	@Transactional public EducationResponse patch(UUID id, EducationPatch r) { Education e=educations.findById(id).orElseThrow(()->new ResourceNotFoundException("Education not found")); e.update(n(r.degree()),n(r.institution()),n(r.focus()),r.displayOrder()); return education(e); }
	@Transactional public void deleteEducation(UUID id) { if(!educations.existsById(id)) throw new ResourceNotFoundException("Education not found"); educations.deleteById(id); }

	@Transactional(readOnly=true) public List<SocialLinkResponse> socialLinks() { return socialLinks.findAllByOrderByDisplayOrderAsc().stream().map(this::social).toList(); }
	@Transactional public SocialLinkResponse create(SocialLinkRequest r) { return social(socialLinks.save(new SocialLink(r.label().trim(),r.url().trim(),r.displayOrder()))); }
	@Transactional public SocialLinkResponse patch(UUID id, SocialLinkPatch r) { SocialLink e=socialLinks.findById(id).orElseThrow(()->new ResourceNotFoundException("Social link not found")); e.update(n(r.label()),n(r.url()),r.displayOrder()); return social(e); }
	@Transactional public void deleteSocialLink(UUID id) { if(!socialLinks.existsById(id)) throw new ResourceNotFoundException("Social link not found"); socialLinks.deleteById(id); }

	@Transactional(readOnly=true) public List<ExperienceResponse> experiences() { return experiences.findAllByOrderByDisplayOrderAsc().stream().map(this::experience).toList(); }
	@Transactional public ExperienceResponse create(ExperienceRequest r) { return experience(experiences.save(new WorkExperience(r.role().trim(),r.company().trim(),r.location().trim(),r.period().trim(),r.detailLinkLabel().trim(),r.detailLinkUrl().trim(),r.displayOrder(),nl(r.highlights())))); }
	@Transactional public ExperienceResponse patch(UUID id, ExperiencePatch r) { WorkExperience e=experiences.findById(id).orElseThrow(()->new ResourceNotFoundException("Experience not found")); e.update(n(r.role()),n(r.company()),n(r.location()),n(r.period()),n(r.detailLinkLabel()),n(r.detailLinkUrl()),r.displayOrder(),r.highlights()==null?null:nl(r.highlights())); return experience(e); }
	@Transactional public void deleteExperience(UUID id) { if(!experiences.existsById(id)) throw new ResourceNotFoundException("Experience not found"); experiences.deleteById(id); }

	private String n(String v){return v==null?null:v.trim();} private List<String> nl(List<String> v){return v.stream().map(String::trim).toList();}
	private CapabilityResponse capability(Capability e){return new CapabilityResponse(e.getId(),e.getItemIndex(),e.getTitle(),e.getDetail(),e.getDisplayOrder());}
	private EducationResponse education(Education e){return new EducationResponse(e.getId(),e.getDegree(),e.getInstitution(),e.getFocus(),e.getDisplayOrder());}
	private SocialLinkResponse social(SocialLink e){return new SocialLinkResponse(e.getId(),e.getLabel(),e.getUrl(),e.getDisplayOrder());}
	private ExperienceResponse experience(WorkExperience e){return new ExperienceResponse(e.getId(),e.getRole(),e.getCompany(),e.getLocation(),e.getPeriod(),e.getDetailLinkLabel(),e.getDetailLinkUrl(),e.getDisplayOrder(),e.getHighlights().stream().map(WorkExperienceHighlight::getText).toList());}
}
