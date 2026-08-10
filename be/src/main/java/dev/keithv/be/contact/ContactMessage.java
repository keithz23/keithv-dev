package dev.keithv.be.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String message;

	@Column(nullable = false)
	private String status = "NEW";

	@Column(nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	protected ContactMessage() {
	}

	public ContactMessage(String name, String email, String message) {
		this.name = name;
		this.email = email;
		this.message = message;
		this.createdAt = OffsetDateTime.now(Clock.systemUTC());
	}

	public UUID getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getEmail() {
		return email;
	}

	public String getMessage() {
		return message;
	}

	public String getStatus() {
		return status;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}
}
