package org.lessons.java.final_project_java_spring_react.controller.api;

import org.lessons.java.final_project_java_spring_react.model.GameKey;
import org.lessons.java.final_project_java_spring_react.model.Order;
import org.lessons.java.final_project_java_spring_react.security.DatabaseUserDetails;
import org.lessons.java.final_project_java_spring_react.service.GameKeyService;
import org.lessons.java.final_project_java_spring_react.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderRestController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private GameKeyService gameKeyService;

    //> INDEX
    @GetMapping
    public List<Order> index(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return orderService.getOrdersByUserId(userId);
        }
        return orderService.getAllOrders();
    }

    //> MY ORDERS - Get orders for currently authenticated user
    @GetMapping("/my-orders")
    public ResponseEntity<?> myOrders(@AuthenticationPrincipal DatabaseUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        List<Order> orders = orderService.getOrdersByUserId(userDetails.getId());

        // Transform orders to include game keys info
        List<Map<String, Object>> orderData = orders.stream()
                .filter(order -> "COMPLETED".equals(order.getPaymentStatus()))
                .map(order -> {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("id", order.getId());
                    orderMap.put("orderDate", order.getOrderDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                    orderMap.put("totalPrice", order.getTotalPrice());
                    orderMap.put("paymentStatus", order.getPaymentStatus());
                    orderMap.put("paymentMethod", order.getPaymentMethod());

                    // Include items with keys
                    List<Map<String, Object>> items = order.getGameKeys().stream()
                            .map(key -> {
                                Map<String, Object> item = new HashMap<>();
                                item.put("gameName", key.getGame().getTitle());
                                item.put("platformName", key.getPlatform().getName());
                                item.put("keyCode", key.getKeyCode());
                                return item;
                            })
                            .collect(Collectors.toList());

                    orderMap.put("items", items);
                    return orderMap;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderData);
    }

    //> SHOW
    @GetMapping("/{id}")
    public ResponseEntity<Order> show(@PathVariable Long id) {
        Optional<Order> orderAttempt = orderService.getOrderById(id);

        if (orderAttempt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(orderAttempt.get(), HttpStatus.OK);
    }

    //> STORE
    /**
     * Expected JSON format:
     * {
     *   "userId": 2,
     *   "totalPrice": 59.99,
     *   "paymentMethod": "STRIPE",
     *   "gameKeys": [
     *     { "gameId": 1, "platformId": 4 },
     *     { "gameId": 3, "platformId": 1 }
     *   ]
     * }
     */
    @PostMapping
    public ResponseEntity<?> store(@RequestBody OrderRequest orderRequest) {
        // Create order (orderDate auto-set by @PrePersist, totalPrice calculated automatically)
        Order order = new Order();
        order.setUser(orderRequest.getUser());
        // totalPrice will be calculated from game keys automatically
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentStatus("PENDING");
        // orderDate will be set automatically by @PrePersist

        // Save order first to get ID
        Order savedOrder = orderService.saveOrder(order);

        // Assign game keys to order
        List<GameKey> purchasedKeys = new ArrayList<>();
        for (OrderRequest.GameKeyRequest keyRequest : orderRequest.getGameKeys()) {
            Optional<GameKey> keyAttempt = gameKeyService.getFirstAvailableKey(
                    keyRequest.getGameId(),
                    keyRequest.getPlatformId());

            if (keyAttempt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("No available key for game " + keyRequest.getGameId());
            }

            GameKey key = keyAttempt.get();
            key.setSold(true);
            key.setSoldAt(LocalDateTime.now());
            key.setOrder(savedOrder);
            gameKeyService.saveGameKey(key);
            purchasedKeys.add(key);
        }

        savedOrder.setGameKeys(purchasedKeys);
        savedOrder.setPaymentStatus("COMPLETED");
        orderService.saveOrder(savedOrder);

        return new ResponseEntity<>(savedOrder, HttpStatus.OK);
    }

    //> UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order order) {
        if (orderService.getOrderById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        order.setId(id);
        return new ResponseEntity<>(orderService.saveOrder(order), HttpStatus.OK);
    }

    // Inner class for request body
    public static class OrderRequest {
        private org.lessons.java.final_project_java_spring_react.model.User user;
        private java.math.BigDecimal totalPrice;
        private String paymentMethod;
        private List<GameKeyRequest> gameKeys;

        public static class GameKeyRequest {
            private Long gameId;
            private Long platformId;

            public Long getGameId() {
                return gameId;
            }

            public void setGameId(Long gameId) {
                this.gameId = gameId;
            }

            public Long getPlatformId() {
                return platformId;
            }

            public void setPlatformId(Long platformId) {
                this.platformId = platformId;
            }
        }

        public org.lessons.java.final_project_java_spring_react.model.User getUser() {
            return user;
        }

        public void setUser(org.lessons.java.final_project_java_spring_react.model.User user) {
            this.user = user;
        }

        public java.math.BigDecimal getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(java.math.BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public List<GameKeyRequest> getGameKeys() {
            return gameKeys;
        }

        public void setGameKeys(List<GameKeyRequest> gameKeys) {
            this.gameKeys = gameKeys;
        }
    }
}
