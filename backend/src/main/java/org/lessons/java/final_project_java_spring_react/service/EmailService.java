package org.lessons.java.final_project_java_spring_react.service;

import java.util.List;

import org.lessons.java.final_project_java_spring_react.model.GameKey;
import org.lessons.java.final_project_java_spring_react.model.Order;
import org.lessons.java.final_project_java_spring_react.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send welcome email on registration
     */
    public void sendWelcomeEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("username", user.getUsername());
            context.setVariable("email", user.getEmail());

            String htmlContent = templateEngine.process("email/welcome", context);

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to Game Store! 🎮");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Welcome email sent to: " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send welcome email: " + e.getMessage());
        }
    }

    /**
     * Send order confirmation with game keys
     */
    public void sendOrderConfirmationEmail(Order order, List<GameKey> gameKeys) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("username", order.getUser().getUsername());
            context.setVariable("orderId", order.getId());
            context.setVariable("totalPrice", order.getTotalPrice());
            context.setVariable("orderDate", order.getOrderDate());
            context.setVariable("gameKeys", gameKeys);

            String htmlContent = templateEngine.process("email/order-confirmation", context);

            helper.setFrom(fromEmail);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Your Game Keys Are Ready! 🎮 Order #" + order.getId());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Order confirmation sent to: " + order.getUser().getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send order confirmation: " + e.getMessage());
        }
    }

    /**
     * Send newsletter welcome email
     */
    public void sendNewsletterWelcomeEmail(String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("email", email);

            String htmlContent = templateEngine.process("email/newsletter-welcome", context);

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Welcome to Game Store Newsletter! 📬");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Newsletter welcome email sent to: " + email);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send newsletter welcome email: " + e.getMessage());
        }
    }

    /**
     * Send newsletter to all active subscribers
     */
    public void sendNewsletterEmail(String subject, String htmlContent, List<String> recipients) {
        for (String email : recipients) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(email);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                System.out.println("✅ Newsletter sent to: " + email);
            } catch (MessagingException e) {
                System.err.println("❌ Failed to send newsletter to " + email + ": " + e.getMessage());
            }
        }
    }

    /**
     * Send simple text email (fallback)
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
