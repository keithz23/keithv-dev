package dev.keithv.be.contact;

import dev.keithv.be.blog.PageResponse;
import dev.keithv.be.common.ResourceNotFoundException;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactMessageService {
	private final ContactMessageRepository contactMessageRepository;

	public ContactMessageService(ContactMessageRepository contactMessageRepository) {
		this.contactMessageRepository = contactMessageRepository;
	}

	@Transactional
	public ContactMessageResponse create(ContactMessageRequest request) {
		ContactMessage saved = contactMessageRepository.save(
			new ContactMessage(request.name().trim(), request.email().trim(), request.message().trim())
		);
		return new ContactMessageResponse(saved.getId(), saved.getStatus(), saved.getCreatedAt());
	}

	@Transactional(readOnly=true)
	public PageResponse<AdminContactMessageResponse> list(int page, int size) {
		if(page<0 || size<1) throw new dev.keithv.be.common.BadRequestException("Invalid pagination");
		var result=contactMessageRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page,Math.min(size,50)));
		return new PageResponse<>(result.getContent().stream().map(this::admin).toList(),result.getNumber(),result.getSize(),result.getTotalElements(),result.getTotalPages());
	}
	@Transactional(readOnly=true) public AdminContactMessageResponse get(UUID id){return admin(find(id));}
	@Transactional public AdminContactMessageResponse update(UUID id,ContactMessageStatus status){var message=find(id);message.updateStatus(status);return admin(message);}
	@Transactional public void delete(UUID id){if(!contactMessageRepository.existsById(id))throw new ResourceNotFoundException("Contact message not found");contactMessageRepository.deleteById(id);}
	private ContactMessage find(UUID id){return contactMessageRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Contact message not found"));}
	private AdminContactMessageResponse admin(ContactMessage m){return new AdminContactMessageResponse(m.getId(),m.getName(),m.getEmail(),m.getMessage(),m.getStatus(),m.getCreatedAt());}
}
