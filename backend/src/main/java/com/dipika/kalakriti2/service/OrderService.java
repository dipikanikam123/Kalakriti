package com.dipika.kalakriti2.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.dipika.kalakriti2.entity.Order;
import com.dipika.kalakriti2.entity.OrderItem;
import com.dipika.kalakriti2.repository.OrderRepository;
import com.google.common.base.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private  OrderRepository orderrepository;
    
 // ✅ Fetch all orders (for admin)
    public List<Order> getAllOrders() {
        return orderrepository.findAll();
    }

    // ✅ Fetch a single order by ID
    public java.util.Optional<Order> getOrderById(Long id) {
        return orderrepository.findById(id);
    }

    public Order placeOrder(Order order) {

        // ✅ link items to parent order
        if (order.getItems() != null) {
            for (OrderItem	 item : order.getItems()) {
                item.setOrder(order);
            }
        }

        return orderrepository.save(order);
    }
    
 // Get all orders for a user
    public List<Order> getOrdersByUserId(Long userId) {
        return orderrepository.findAll()
                .stream()
                .filter(o -> o.getUserId() != null && o.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    // Update order status
    public Order updateStatus(Long orderId, String status) {
        Order order = orderrepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderrepository.save(order);
    }
    // ✅ Save a new order
    public Order saveOrder(Order order) {
        return orderrepository.save(order);
    }

    // ✅ Delete an order
    public boolean deleteOrder(Long id) {
        if (orderrepository.existsById(id)) {
            orderrepository.deleteById(id);
            return true;
        }
        return false;
    }
}
