package org.lessons.java.final_project_java_spring_react.repository;

import org.lessons.java.final_project_java_spring_react.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Integer userId);

    List<Order> findByPaymentStatus(String paymentStatus);

    Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);

    @Query("SELECT o FROM Order o WHERE LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(o.user.username) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Order> searchByUserEmailOrUsername(@Param("search") String search);
}
