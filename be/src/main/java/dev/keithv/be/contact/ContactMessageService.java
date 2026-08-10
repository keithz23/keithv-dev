package dev.keithv.be.contact;

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
}
