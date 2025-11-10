package org.lessons.java.final_project_java_spring_react.repository;

import java.util.List;
import java.util.Optional;

import org.lessons.java.final_project_java_spring_react.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    Optional<NewsletterSubscriber> findByEmail(String email);

    List<NewsletterSubscriber> findByActiveTrue(); // Only active subscribers

    boolean existsByEmail(String email);
}
