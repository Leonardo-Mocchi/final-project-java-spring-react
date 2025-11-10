package org.lessons.java.final_project_java_spring_react.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.lessons.java.final_project_java_spring_react.model.Game;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class StripeService {

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    public Session createCheckoutSession(List<Game> games) throws StripeException {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (Game game : games) {
            // Calculate final price with discount
            BigDecimal price = BigDecimal.valueOf(game.getPrice());
            if (game.getDiscountPercentage() != null && game.getDiscountPercentage() > 0) {
                BigDecimal discount = BigDecimal.valueOf(game.getDiscountPercentage())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                price = price.subtract(price.multiply(discount));
            }

            // Stripe expects amount in cents
            long amountInCents = price.multiply(BigDecimal.valueOf(100)).longValue();

            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(game.getTitle())
                                                    .setDescription(game.getDescription() != null && game.getDescription().length() > 100
                                                            ? game.getDescription().substring(0, 100) + "..."
                                                            : game.getDescription())
                                                    .addImage(game.getImageUrl())
                                                    .build())
                                    .setUnitAmount(amountInCents)
                                    .build())
                    .setQuantity(1L)
                    .build();

            lineItems.add(lineItem);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .addAllLineItem(lineItems)
                .build();

        return Session.create(params);
    }

    public Session retrieveSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }
}
