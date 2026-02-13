package com.dipika.kalakriti2.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.dipika.kalakriti2.entity.Order;
import com.dipika.kalakriti2.service.OrderService;
import com.dipika.kalakriti2.service.EmailService;
import com.dipika.kalakriti2.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final EmailService emailService;
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        Order savedOrder = orderService.placeOrder(order);
        
        // Send order confirmation email
        String userEmail = savedOrder.getUserEmail();
        
        if (userEmail != null && !userEmail.isEmpty() && !userEmail.equals("customer@example.com")) {
            try {
                System.out.println("✅ Sending order confirmation email to: " + userEmail);
                emailService.sendOrderConfirmationEmail(savedOrder, userEmail);
                System.out.println("✅ Order confirmation email sent successfully to: " + userEmail);
            } catch (Exception e) {
                // Log error but don't fail the order
                System.err.println("❌ Failed to send order confirmation email to " + userEmail + ": " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.err.println("⚠️ No valid email address found for order #" + savedOrder.getId() + ". Email not sent.");
        }
        
        return ResponseEntity.ok(savedOrder);
    }
    
 // 🔹 Get orders for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // 🔹 Update order status (cancel)
    @PutMapping("/user/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        Order updatedOrder = orderService.updateStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
    @GetMapping("/admin")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    @GetMapping("/admin/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                           .map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }
 
 // ✅ Update order status (Admin)
    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        Order updatedOrder = orderService.updateStatus(orderId, status);
        
        // Send appropriate email based on status change
        String userEmail = "customer@example.com"; // TODO: Get actual user email
        try {
            if ("SHIPPED".equalsIgnoreCase(status)) {
                emailService.sendShippingUpdateEmail(updatedOrder, updatedOrder.getUserEmail() != null ? updatedOrder.getUserEmail() : "customer@example.com");
            } else if ("DELIVERED".equalsIgnoreCase(status)) {
                emailService.sendDeliveryConfirmationEmail(updatedOrder, updatedOrder.getUserEmail() != null ? updatedOrder.getUserEmail() : "customer@example.com");
            }
        } catch (Exception e) {
            // Log error but don't fail the status update
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
        
        return ResponseEntity.ok(updatedOrder);
    }

    // 💳 Create Razorpay Order (before payment)
    @PostMapping("/create-razorpay-order")
    public ResponseEntity<?> createRazorpayOrder(@RequestBody Map<String, Object> data) {
        try {
            Double amount = Double.parseDouble(data.get("amount").toString());
            com.razorpay.Order razorpayOrder = paymentService.createRazorpayOrder(amount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            response.put("keyId", paymentService.getRazorpayKeyId());
            
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create payment order: " + e.getMessage()));
        }
    }

    // 💳 Verify Payment and Save Order
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPaymentAndSaveOrder(@RequestBody Map<String, Object> data) {
        try {
            // Extract payment details
            String razorpayOrderId = data.get("razorpayOrderId").toString();
            String paymentId = data.get("paymentId").toString();
            String signature = data.get("signature").toString();
            
            // Verify payment signature
            boolean isValid = paymentService.verifyPaymentSignature(razorpayOrderId, paymentId, signature);
            
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Payment verification failed"));
            }
            
            // Create order object from request data
            @SuppressWarnings("unchecked")
            Map<String, Object> orderData = (Map<String, Object>) data.get("orderData");
            
            Order order = new Order();
            order.setUserId(orderData.get("userId") != null ? Long.parseLong(orderData.get("userId").toString()) : null);
            order.setCustomerName(orderData.get("customerName").toString());
            order.setPhone(orderData.get("phone").toString());
            order.setAddress(orderData.get("address").toString());
            order.setUserEmail(orderData.get("userEmail") != null ? orderData.get("userEmail").toString() : "customer@example.com");
            order.setTotalPrice(Double.parseDouble(orderData.get("totalPrice").toString()));
            order.setPaymentMethod("ONLINE");
            order.setRazorpayOrderId(razorpayOrderId);
            order.setPaymentId(paymentId);
            order.setPaymentStatus("PAID");
            order.setStatus("PLACED");
            
            // Extract items
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderData.get("items");
            java.util.List<com.dipika.kalakriti2.entity.OrderItem> orderItems = new java.util.ArrayList<>();
            
            if (itemsData != null) {
                for (Map<String, Object> itemData : itemsData) {
                    com.dipika.kalakriti2.entity.OrderItem orderItem = new com.dipika.kalakriti2.entity.OrderItem();
                    // serviceId can be integer or string in JSON
                    orderItem.setServiceId(Long.parseLong(itemData.get("serviceId").toString()));
                    orderItem.setName(itemData.get("name") != null ? itemData.get("name").toString() : "Unknown");
                    orderItem.setQuantity(Integer.parseInt(itemData.get("quantity").toString()));
                    orderItem.setPrice(Double.parseDouble(itemData.get("price").toString()));
                    orderItem.setImage(itemData.get("image") != null ? itemData.get("image").toString() : null);
                    orderItem.setOrder(order); // Link to parent order
                    orderItems.add(orderItem);
                }
            }
            order.setItems(orderItems);
            
            // Save order
            Order savedOrder = orderService.placeOrder(order);
            
            // Send confirmation email
            String userEmail = savedOrder.getUserEmail();
            if (userEmail != null && !userEmail.isEmpty() && !userEmail.equals("customer@example.com")) {
                try {
                    System.out.println("✅ Sending order confirmation email to: " + userEmail);
                    emailService.sendOrderConfirmationEmail(savedOrder, userEmail);
                    System.out.println("✅ Order confirmation email sent successfully to: " + userEmail);
                } catch (Exception e) {
                    System.err.println("❌ Failed to send order confirmation email to " + userEmail + ": " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.err.println("⚠️ No valid email address found for order #" + savedOrder.getId() + ". Email not sent.");
            }
            
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save order: " + e.getMessage()));
        }
    }
   
 
}
