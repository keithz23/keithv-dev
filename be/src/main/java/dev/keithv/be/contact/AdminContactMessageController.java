package dev.keithv.be.contact;

import dev.keithv.be.blog.PageResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/contact-messages")
@SecurityRequirement(name="bearerAuth")
public class AdminContactMessageController {
	private final ContactMessageService service;
	public AdminContactMessageController(ContactMessageService service){this.service=service;}
	@GetMapping public PageResponse<AdminContactMessageResponse> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){return service.list(page,size);}
	@GetMapping("/{id}") public AdminContactMessageResponse get(@PathVariable UUID id){return service.get(id);}
	@PatchMapping("/{id}") public AdminContactMessageResponse patch(@PathVariable UUID id,@Valid @RequestBody ContactStatusPatchRequest request){return service.update(id,request.status());}
	@DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id){service.delete(id);}
}
