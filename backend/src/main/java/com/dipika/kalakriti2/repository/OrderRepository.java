package com.dipika.kalakriti2.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dipika.kalakriti2.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
List<Order>findByUserId(Long userId);

@Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o")
double getTotalRevenue();

List<Order> findTop5ByOrderByCreatedAtDesc();
    

}
