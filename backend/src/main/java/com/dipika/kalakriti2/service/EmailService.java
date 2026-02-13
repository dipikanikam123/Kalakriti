package com.dipika.kalakriti2.service;

import com.dipika.kalakriti2.entity.Order;
import com.dipika.kalakriti2.entity.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class EmailService {

	@Autowired
    private JavaMailSender mailSender;

    // Existing method for contact form replies
    public void sendReplyMail(String toEmail, String message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toEmail);
        mail.setSubject("Reply from Kalakriti");
        mail.setText(message);
        mail.setFrom("nikamdipika115@gmail.com");
        mailSender.send(mail);
    }

    /**
     * Send Order Confirmation Email
     */
    public void sendOrderConfirmationEmail(Order order, String toEmail) {
        log.info("Attempting to send order confirmation email to: {}", toEmail);
        try {
            String subject = "Order Confirmation - Kalakriti #" + order.getId();
            String htmlContent = buildOrderConfirmationHtml(order);
            
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Order confirmation email successfully sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email to: {}", toEmail, e);
        }
    }

    /**
     * Send Shipping Update Email
     */
    public void sendShippingUpdateEmail(Order order, String toEmail) {
        try {
            String subject = "Your Order Has Been Shipped - Kalakriti #" + order.getId();
            String htmlContent = buildShippingUpdateHtml(order);
            
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Shipping update email sent to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send shipping email to: {}", toEmail, e);
        }
    }

    /**
     * Send Delivery Confirmation Email
     */
    public void sendDeliveryConfirmationEmail(Order order, String toEmail) {
        try {
            String subject = "Order Delivered - Kalakriti #" + order.getId();
            String htmlContent = buildDeliveryConfirmationHtml(order);
            
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Delivery confirmation email sent to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send delivery email to: {}", toEmail, e);
        }
    }

    /**
     * Core method to send HTML email
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom("Kalakriti <nikamdipika115@gmail.com>");
        
        mailSender.send(message);
    }

    /**
     * Build Order Confirmation HTML Email
     */
    private String buildOrderConfirmationHtml(Order order) {
        StringBuilder itemsHtml = new StringBuilder();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                String itemName = "Art Piece";
                if (item.getName() != null) {
                    itemName = item.getName();
                }
                
                itemsHtml.append(String.format("""
                    <tr>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                            <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">%s</div>
                            <div style="font-size: 14px; color: #6b7280;">Qty: %d × ₹%.2f</div>
                        </td>
                        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
                            ₹%.2f
                        </td>
                    </tr>
                    """,
                    itemName,
                    item.getQuantity(),
                    item.getPrice(),
                    item.getPrice() * item.getQuantity()
                ));
            }
        }

        String orderDate = "Today";
        if (order.getCreatedAt() != null) {
            orderDate = order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        }

        String paymentMethod = "Cash on Delivery";
        if (order.getPaymentMethod() != null) {
            if (order.getPaymentMethod().equalsIgnoreCase("cod")) {
                paymentMethod = "💵 Cash on Delivery";
            } else if (order.getPaymentMethod().equalsIgnoreCase("ONLINE")) {
                paymentMethod = "💳 Online Payment";
            } else {
                paymentMethod = order.getPaymentMethod();
            }
        }

        return String.format("""
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
<div style="max-width:600px;margin:0 auto;background-color:#fff;">
<div style="background:linear-gradient(135deg,#7c3aed 0%%,#9333ea 100%%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:32px;font-weight:800;"><span style="color:#fb923c;">Kala</span>kriti</h1>
<p style="color:#e9d5ff;margin:10px 0 0 0;font-size:14px;">Art & Creativity Hub</p></div>
<div style="padding:40px 30px;text-align:center;">
<div style="width:80px;height:80px;background-color:#10b981;border-radius:50%%;margin:0 auto 20px;">
<span style="font-size:40px;color:#fff;line-height:80px;">✓</span></div>
<h2 style="color:#111827;margin:0 0 10px 0;font-size:28px;font-weight:700;">Order is successfully confirmed</h2>
<p style="color:#6b7280;margin:0;font-size:16px;">Your order has been successfully placed. Thank you for shopping with us.</p></div>
<div style="padding:0 30px 30px 30px;">
<div style="background-color:#f9fafb;border-radius:12px;padding:20px;margin-bottom:30px;">
<p style="color:#6b7280;margin:0 0 5px 0;font-size:12px;text-transform:uppercase;">Order ID</p>
<p style="color:#111827;margin:0 0 15px 0;font-size:20px;font-weight:700;">#%s</p>
<p style="color:#6b7280;margin:0 0 5px 0;font-size:12px;text-transform:uppercase;">Order Date</p>
<p style="color:#111827;margin:0;font-size:16px;font-weight:600;">%s</p></div>
<h3 style="color:#111827;margin:0 0 15px 0;font-size:18px;font-weight:700;">Order Items</h3>
<table style="width:100%%;border-collapse:collapse;margin-bottom:30px;">
%s
<tr><td style="padding:20px 15px;text-align:right;font-weight:700;font-size:18px;color:#7c3aed;">Total:</td>
<td style="padding:20px 15px;text-align:right;font-weight:700;font-size:20px;color:#7c3aed;">₹%.2f</td></tr></table>
<div style="background-color:#f9fafb;border-radius:12px;padding:20px;margin-bottom:20px;">
<h4 style="color:#111827;margin:0 0 15px 0;font-size:14px;font-weight:700;text-transform:uppercase;">Delivery Address</h4>
<p style="color:#374151;margin:0 0 5px 0;font-weight:600;">%s</p>
<p style="color:#6b7280;margin:0 0 5px 0;">%s</p>
<p style="color:#6b7280;margin:0;">📞 %s</p></div>
<div style="background-color:#fef3c7;border-radius:12px;padding:20px;margin-bottom:30px;">
<p style="color:#92400e;margin:0;font-size:14px;"><strong>Payment Method:</strong> %s</p></div>
<div style="text-align:center;margin-bottom:30px;">
<a href="http://localhost:5173/userdashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed 0%%,#9333ea 100%%);color:#fff;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:700;font-size:16px;">View Order Details</a></div>
<div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;">
<p style="color:#6b7280;margin:0 0 10px 0;font-size:14px;">Need help? Contact us at</p>
<p style="color:#7c3aed;margin:0;font-weight:600;">info@kalakriti.com | +91 9657141183</p></div></div>
<div style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;margin:0 0 10px 0;font-size:12px;">© 2026 Kalakriti. All rights reserved.</p>
<p style="color:#9ca3af;margin:0;font-size:12px;">Mumbai, India</p></div></div></body></html>
            """,
            order.getId(),
            orderDate,
            itemsHtml.toString(),
            order.getTotalPrice(),
            order.getCustomerName(),
            order.getAddress(),
            order.getPhone(),
            paymentMethod
        );
    }

    /**
     * Build Shipping Update HTML Email
     */
    private String buildShippingUpdateHtml(Order order) {
        return String.format("""
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
<div style="max-width:600px;margin:0 auto;background-color:#fff;">
<div style="background:linear-gradient(135deg,#7c3aed 0%%,#9333ea 100%%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:32px;font-weight:800;"><span style="color:#fb923c;">Kala</span>kriti</h1></div>
<div style="padding:40px 30px;text-align:center;">
<div style="font-size:60px;margin-bottom:20px;">🚚</div>
<h2 style="color:#111827;margin:0 0 10px 0;font-size:28px;font-weight:700;">Your Order is On Its Way!</h2>
<p style="color:#6b7280;margin:0;font-size:16px;">Order #%s has been shipped and will reach you soon.</p></div>
<div style="padding:0 30px 30px 30px;">
<div style="background-color:#f9fafb;border-radius:12px;padding:20px;margin-bottom:20px;">
<h4 style="color:#111827;margin:0 0 15px 0;font-size:14px;font-weight:700;">Delivery Address</h4>
<p style="color:#374151;margin:0 0 5px 0;font-weight:600;">%s</p>
<p style="color:#6b7280;margin:0;">%s</p></div>
<div style="text-align:center;margin:30px 0;">
<a href="http://localhost:5173/userdashboard" style="display:inline-block;background:linear-gradient(135deg,#7c3aed 0%%,#9333ea 100%%);color:#fff;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:700;font-size:16px;">Track Order</a></div>
<div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;">
<p style="color:#6b7280;margin:0 0 10px 0;font-size:14px;">Questions? Contact us</p>
<p style="color:#7c3aed;margin:0;font-weight:600;">info@kalakriti.com | +91 9657141183</p></div></div>
<div style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;margin:0;font-size:12px;">© 2026 Kalakriti. All rights reserved.</p></div></div></body></html>
            """,
            order.getId(),
            order.getCustomerName(),
            order.getAddress()
        );
    }

    /**
     * Build Delivery Confirmation HTML Email
     */
    private String buildDeliveryConfirmationHtml(Order order) {
        return String.format("""
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6;">
<div style="max-width:600px;margin:0 auto;background-color:#fff;">
<div style="background:linear-gradient(135deg,#7c3aed 0%%,#9333ea 100%%);padding:40px 30px;text-align:center;">
<h1 style="color:#fff;margin:0;font-size:32px;font-weight:800;"><span style="color:#fb923c;">Kala</span>kriti</h1></div>
<div style="padding:40px 30px;text-align:center;">
<div style="font-size:60px;margin-bottom:20px;">🎉</div>
<h2 style="color:#111827;margin:0 0 10px 0;font-size:28px;font-weight:700;">Order Delivered!</h2>
<p style="color:#6b7280;margin:0;font-size:16px;">Your order #%s has been successfully delivered.</p></div>
<div style="padding:0 30px 30px 30px;">
<div style="background-color:#fef3c7;border-radius:12px;padding:30px;margin-bottom:30px;text-align:center;">
<h3 style="color:#92400e;margin:0 0 15px 0;font-size:20px;font-weight:700;">Thank You for Choosing Kalakriti!</h3>
<p style="color:#92400e;margin:0;font-size:14px;">We hope you love your purchase. Your support means the world to us!</p></div>
<div style="background-color:#f0fdf4;border-radius:12px;padding:25px;margin-bottom:30px;text-align:center;">
<p style="color:#166534;margin:0 0 15px 0;font-size:16px;font-weight:600;">How was your experience?</p>
<p style="color:#16a34a;margin:0 0 20px 0;font-size:14px;">We'd love to hear your feedback!</p>
<div style="font-size:30px;">⭐⭐⭐⭐⭐</div></div>
<div style="text-align:center;margin:30px 0;">
<a href="http://localhost:5173/explore" style="display:inline-block;background:linear-gradient(135deg,#7c3aed 0%%,#9333ea 100%%);color:#fff;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:700;font-size:16px;">Continue Shopping</a></div>
<div style="text-align:center;padding:20px 0;border-top:1px solid #e5e7eb;">
<p style="color:#6b7280;margin:0 0 10px 0;font-size:14px;">Need assistance? We're here to help!</p>
<p style="color:#7c3aed;margin:0;font-weight:600;">info@kalakriti.com | +91 9657141183</p></div></div>
<div style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
<p style="color:#9ca3af;margin:0;font-size:12px;">© 2026 Kalakriti. All rights reserved.</p></div></div></body></html>
            """,
            order.getId()
        );
    }
}
