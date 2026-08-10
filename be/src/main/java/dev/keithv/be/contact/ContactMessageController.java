package dev.keithv.be.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact-messages")
public class ContactMessageController {
	private final ContactMessageService contactMessageService;

	public ContactMessageController(ContactMessageService contactMessageService) {
		this.contactMessageService = contactMessageService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ContactMessageResponse create(@Valid @RequestBody ContactMessageRequest request) {
		return contactMessageService.create(request);
	}
}
