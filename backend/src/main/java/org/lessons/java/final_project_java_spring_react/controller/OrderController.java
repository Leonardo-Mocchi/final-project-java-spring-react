package org.lessons.java.final_project_java_spring_react.controller;

import org.lessons.java.final_project_java_spring_react.model.Order;
import org.lessons.java.final_project_java_spring_react.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // List all orders
    @GetMapping
    public String index(Model model,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Order> orders;
        if (search != null && !search.trim().isEmpty()) {
            orders = orderService.searchOrders(search);
        } else if (status != null && !status.isEmpty()) {
            orders = orderService.getOrdersByPaymentStatus(status);
        } else {
            orders = orderService.getAllOrders();
        }
        model.addAttribute("orders", orders);
        model.addAttribute("status", status);
        model.addAttribute("search", search);
        return "orders/index";
    }

    // Show single order details
    @GetMapping("/{id}")
    public String show(@PathVariable Long id, Model model) {
        Order order = orderService.getOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        model.addAttribute("order", order);
        return "orders/show";
    }

    // Update order status
    @PostMapping("/update-status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String paymentStatus) {
        Order order = orderService.getOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPaymentStatus(paymentStatus);
        orderService.saveOrder(order);
        return "redirect:/admin/orders";
    }

    // Delete order
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return "redirect:/admin/orders";
    }
}
