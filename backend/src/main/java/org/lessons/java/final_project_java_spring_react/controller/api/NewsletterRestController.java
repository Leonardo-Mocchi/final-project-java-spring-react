package org.lessons.java.final_project_java_spring_react.controller.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.lessons.java.final_project_java_spring_react.model.NewsletterSubscriber;
import org.lessons.java.final_project_java_spring_react.repository.NewsletterSubscriberRepository;
import org.lessons.java.final_project_java_spring_react.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsletterRestController {

    @Autowired
    private NewsletterSubscriberRepository subscriberRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Subscribe to newsletter
     */
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody NewsletterSubscriber subscriber) {
        if (subscriberRepository.existsByEmail(subscriber.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already subscribed to newsletter"));
        }

        NewsletterSubscriber saved = subscriberRepository.save(subscriber);

        // Send formatted welcome email
        emailService.sendNewsletterWelcomeEmail(saved.getEmail());

        return ResponseEntity.ok(Map.of("message", "Successfully subscribed to newsletter!"));
    }

    /**
     * Unsubscribe from newsletter
     */
    @DeleteMapping("/unsubscribe/{email}")
    public ResponseEntity<?> unsubscribe(@PathVariable String email) {
        return subscriberRepository.findByEmail(email)
                .map(subscriber -> {
                    subscriber.setActive(false);
                    subscriberRepository.save(subscriber);
                    return ResponseEntity.ok(Map.of("message", "Successfully unsubscribed"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all active subscribers (ADMIN only - add security later)
     */
    @GetMapping("/subscribers")
    public ResponseEntity<List<NewsletterSubscriber>> getAllSubscribers() {
        return ResponseEntity.ok(subscriberRepository.findByActiveTrue());
    }

    /**
     * Send newsletter to all subscribers (ADMIN only - add security later)
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendNewsletter(
            @RequestParam String subject,
            @RequestBody String htmlContent) {

        List<String> emails = subscriberRepository.findByActiveTrue()
                .stream()
                .map(NewsletterSubscriber::getEmail)
                .collect(Collectors.toList());

        emailService.sendNewsletterEmail(subject, htmlContent, emails);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Newsletter sent successfully");
        response.put("recipientsCount", emails.size());

        return ResponseEntity.ok(response);
    }
}
