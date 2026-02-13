package com.dipika.kalakriti2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.dipika.kalakriti2.entity.ServiceItem;
import java.util.List;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {

    // ✅ Add this method for category search
    List<ServiceItem> findByCategory(String category);
}
