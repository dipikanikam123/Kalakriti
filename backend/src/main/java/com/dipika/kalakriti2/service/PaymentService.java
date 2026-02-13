package com.dipika.kalakriti2.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    /**
     * Create a Razorpay Order
     * This should be called before opening the payment modal
     */
    public Order createRazorpayOrder(Double amount) throws RazorpayException {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Amount in paise (1 INR = 100 paise)
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            log.info("Razorpay order created: {}", order.get("id").toString());
            
            return order;
        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw e;
        }
    }

    /**
     * Verify payment signature to ensure payment is genuine
     * This MUST be called on backend after payment success
     */
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            
            if (isValid) {
                log.info("Payment signature verified successfully for order: {}", orderId);
            } else {
                log.warn("Payment signature verification failed for order: {}", orderId);
            }
            
            return isValid;
        } catch (RazorpayException e) {
            log.error("Error verifying payment signature", e);
            return false;
        }
    }

    /**
     * Get Razorpay Key ID for frontend
     * Only Key ID is safe to expose, NEVER expose Key Secret
     */
    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }
}
