package org.lessons.java.final_project_java_spring_react.controller;

import org.lessons.java.final_project_java_spring_react.model.Review;
import org.lessons.java.final_project_java_spring_react.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/reviews")
public class AdminReviewController {

    @Autowired
    private ReviewService reviewService;

    // List all reviews
    @GetMapping
    public String index(@RequestParam(required = false) String filter,
            @RequestParam(required = false) String search,
            Model model) {
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("reviews", reviewService.searchReviews(search));
        } else {
            model.addAttribute("reviews", reviewService.getAllReviews());
        }
        model.addAttribute("filter", filter != null ? filter : "all");
        model.addAttribute("search", search);
        return "reviews/index";
    }

    // Toggle blur status
    @PostMapping("/{id}/blur")
    public String toggleBlur(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Review review = reviewService.getReviewById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setIsBlurred(!review.getIsBlurred());
        reviewService.saveReview(review);

        redirectAttributes.addFlashAttribute("successMessage",
                review.getIsBlurred() ? "Review blurred!" : "Review unblurred!");
        return "redirect:/admin/reviews";
    }

    // Show edit form
    @GetMapping("/{id}/edit")
    public String edit(@PathVariable Long id, Model model) {
        Review review = reviewService.getReviewById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        model.addAttribute("review", review);
        return "reviews/form";
    }

    // Update review
    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id, @ModelAttribute Review review, RedirectAttributes redirectAttributes) {
        Review existingReview = reviewService.getReviewById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Update fields
        existingReview.setRating(review.getRating());
        existingReview.setComment(review.getComment());
        existingReview.setIsBlurred(review.getIsBlurred());

        reviewService.saveReview(existingReview);
        redirectAttributes.addFlashAttribute("successMessage", "Review updated successfully!");
        return "redirect:/admin/reviews";
    }

    // Delete review
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        reviewService.deleteReview(id);
        redirectAttributes.addFlashAttribute("successMessage", "Review deleted!");
        return "redirect:/admin/reviews";
    }
}
