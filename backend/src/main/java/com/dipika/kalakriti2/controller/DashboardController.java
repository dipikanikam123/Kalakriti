package com.dipika.kalakriti2.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dipika.kalakriti2.dto.ActivityDto;
import com.dipika.kalakriti2.dto.DashboardDto;
import com.dipika.kalakriti2.entity.ContactMessage;
import com.dipika.kalakriti2.entity.Order;
import com.dipika.kalakriti2.entity.ServiceItem;
import com.dipika.kalakriti2.entity.UserEntity;
import com.dipika.kalakriti2.repository.ContactRepository;
import com.dipika.kalakriti2.repository.OrderRepository;
import com.dipika.kalakriti2.repository.ServiceItemRepository;
import com.dipika.kalakriti2.repository.UserRepository;
import com.dipika.kalakriti2.service.AdminDashboardService;


@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class DashboardController {

	@Autowired
    private OrderRepository orderRepository;
	
	@Autowired
    private AdminDashboardService dashboardService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ContactRepository contactRepository;

	@Autowired
	private ServiceItemRepository serviceItemRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> dashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping
    public Map<String, Object> dashboardData() {

        List<Order> orders = orderRepository.findAll();

        double revenue = orders.stream()
                .mapToDouble(o -> o.getTotalPrice() != null ? o.getTotalPrice() : 0)
                .sum();

        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", orders.size());
        data.put("totalRevenue", revenue);
        data.put("totalUsers", userRepository.count());
        data.put("recentOrders", orders.stream().limit(5).toList());
        
        return data;
    }

    @GetMapping("/activities")
    public List<ActivityDto> getRecentActivities() {
        List<ActivityDto> activities = new ArrayList<>();

        // Get recent orders
        List<Order> recentOrders = orderRepository.findAll().stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .limit(3)
                .toList();
        for (Order order : recentOrders) {
            activities.add(new ActivityDto(
                "ORDER",
                "New order #" + order.getId() + " placed - ₹" + order.getTotalPrice(),
                order.getCreatedAt(),
                "📦"
            ));
        }

        // Get recent users
        List<UserEntity> recentUsers = userRepository.findAll().stream()
                .filter(u -> "USER".equals(u.getRole()))
                .sorted((u1, u2) -> Long.compare(u2.getId(), u1.getId()))
                .limit(3)
                .toList();
        for (UserEntity user : recentUsers) {
            activities.add(new ActivityDto(
                "USER",
                "New user registered: " + user.getName(),
                LocalDateTime.now().minusHours(user.getId()),
                "👤"
            ));
        }

        // Get recent contacts
        List<ContactMessage> recentContacts = contactRepository.findAll().stream()
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .limit(2)
                .toList();
        for (ContactMessage contact : recentContacts) {
            activities.add(new ActivityDto(
                "CONTACT",
                "New message from " + contact.getName(),
                contact.getCreatedAt(),
                "✉️"
            ));
        }

        // Get recent services
        List<ServiceItem> recentServices = serviceItemRepository.findAll().stream()
                .filter(s -> s.getCreatedAt() != null)
                .sorted((s1, s2) -> s2.getCreatedAt().compareTo(s1.getCreatedAt()))
                .limit(2)
                .toList();
        for (ServiceItem service : recentServices) {
            activities.add(new ActivityDto(
                "SERVICE",
                "New artwork added: " + service.getName(),
                service.getCreatedAt(),
                "🎨"
            ));
        }

        // Sort all activities by timestamp and return top 10
        return activities.stream()
                .sorted((a1, a2) -> a2.getTimestamp().compareTo(a1.getTimestamp()))
                .limit(10)
                .toList();
    }
}
