package com.dipika.kalakriti2.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dipika.kalakriti2.dto.DashboardDto;
import com.dipika.kalakriti2.entity.Order;
import com.dipika.kalakriti2.repository.OrderRepository;
import com.dipika.kalakriti2.repository.UserRepository;

@Service
public class AdminDashboardService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;

    public DashboardDto getDashboardStats() {

        long totalOrders = orderRepo.count();
        double totalRevenue = orderRepo.getTotalRevenue();
        long totalUsers = userRepo.count();

        List<Order> recentOrders =
            orderRepo.findTop5ByOrderByCreatedAtDesc();

        return new DashboardDto(
            totalOrders,
            totalRevenue,
            totalUsers,
            recentOrders
        );
    }
}
