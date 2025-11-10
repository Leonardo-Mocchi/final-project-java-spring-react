package org.lessons.java.final_project_java_spring_react.service;

import org.lessons.java.final_project_java_spring_react.model.Order;
import org.lessons.java.final_project_java_spring_react.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByPaymentStatus(String status) {
        return orderRepository.findByPaymentStatus(status);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order saveOrder(Order order) {
        // Always calculate total price from game keys before saving
        order.calculateTotalPrice();
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // Alias methods for REST API
    public Order save(Order order) {
        return saveOrder(order);
    }

    public Optional<Order> findById(Long id) {
        return getOrderById(id);
    }

    public Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId) {
        return orderRepository.findByStripePaymentIntentId(stripePaymentIntentId);
    }

    public List<Order> searchOrders(String search) {
        return orderRepository.searchByUserEmailOrUsername(search);
    }
}
