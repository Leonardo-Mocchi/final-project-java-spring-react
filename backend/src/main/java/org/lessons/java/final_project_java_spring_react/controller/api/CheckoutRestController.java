package org.lessons.java.final_project_java_spring_react.controller.api;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.lessons.java.final_project_java_spring_react.model.Game;
import org.lessons.java.final_project_java_spring_react.model.GameKey;
import org.lessons.java.final_project_java_spring_react.model.Order;
import org.lessons.java.final_project_java_spring_react.model.User;
import org.lessons.java.final_project_java_spring_react.service.GameKeyService;
import org.lessons.java.final_project_java_spring_react.service.GameService;
import org.lessons.java.final_project_java_spring_react.service.OrderService;
import org.lessons.java.final_project_java_spring_react.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173")
public class CheckoutRestController {

    // Nested request class - only used for Stripe checkout
    public static class CheckoutRequest {
        @NotEmpty(message = "Cart items cannot be empty")
        private List<CartItem> items;

        public static class CartItem {
            @NotNull(message = "Game ID is required")
            private Long gameId;

            @NotNull(message = "Platform ID is required")
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

        public List<CartItem> getItems() {
            return items;
        }

        public void setItems(List<CartItem> items) {
            this.items = items;
        }
    }

    @Autowired
    private StripeService stripeService;

    @Autowired
    private GameService gameService;

    @Autowired
    private GameKeyService gameKeyService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-session")
    public ResponseEntity<?> createCheckoutSession(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal User user) {

        try {
            // Validate all games exist and have available keys
            List<Game> games = new ArrayList<>();
            Map<Long, Long> gamePlatformMap = new HashMap<>();

            for (CheckoutRequest.CartItem item : request.getItems()) {
                Game game = gameService.findById(item.getGameId())
                        .orElseThrow(() -> new RuntimeException("Game not found: " + item.getGameId()));

                // Check if there's an available key for this game/platform combination
                GameKey availableKey = gameKeyService.findFirstAvailableKey(item.getGameId(), item.getPlatformId());
                if (availableKey == null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "No available keys for " + game.getTitle()));
                }

                games.add(game);
                gamePlatformMap.put(item.getGameId(), item.getPlatformId());
            }

            // Create Stripe checkout session
            Session session = stripeService.createCheckoutSession(games);

            // Create pending order
            Order order = new Order();
            order.setUser(user);
            order.setPaymentStatus("PENDING");
            order.setStripePaymentIntentId(session.getId());

            // Reserve the keys (don't mark as sold yet)
            List<GameKey> reservedKeys = new ArrayList<>();
            for (CheckoutRequest.CartItem item : request.getItems()) {
                GameKey key = gameKeyService.findFirstAvailableKey(item.getGameId(), item.getPlatformId());
                key.setOrder(order);
                reservedKeys.add(key);
            }
            order.setGameKeys(reservedKeys);
            order.calculateTotalPrice();

            orderService.save(order);

            return ResponseEntity.ok(Map.of(
                    "sessionId", session.getId(),
                    "url", session.getUrl(),
                    "orderId", order.getId()));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/success")
    public ResponseEntity<?> handleSuccess(@RequestParam("session_id") String sessionId) {
        try {
            Session session = stripeService.retrieveSession(sessionId);

            // Find order by stripe session ID
            Order order = orderService.findByStripePaymentIntentId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            if ("paid".equals(session.getPaymentStatus())) {
                // Mark order as completed and keys as sold
                order.setPaymentStatus("COMPLETED");
                order.setPaymentMethod(session.getPaymentMethodTypes().get(0));

                for (GameKey key : order.getGameKeys()) {
                    key.setSold(true);
                }

                orderService.save(order);
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "order", order));
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Payment not completed"));

        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<?> handleCancel(@RequestParam(value = "order_id", required = false) Long orderId) {
        if (orderId != null) {
            // Release reserved keys
            Order order = orderService.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            order.setPaymentStatus("FAILED");
            for (GameKey key : order.getGameKeys()) {
                key.setOrder(null);
            }
            orderService.save(order);
        }

        return ResponseEntity.ok(Map.of("cancelled", true));
    }
}
