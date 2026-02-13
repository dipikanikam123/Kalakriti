package com.dipika.kalakriti2.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dipika.kalakriti2.entity.ServiceItem;
import com.dipika.kalakriti2.repository.ServiceItemRepository;

@Service
public class ServiceItemService {

    private final ServiceItemRepository repo;

    public ServiceItemService(ServiceItemRepository repo) {
        this.repo = repo;
    }

    public List<ServiceItem> getByCategory(String category) {
        return repo.findByCategory(category); // ✅ works now
    }

    public ServiceItem save(ServiceItem serviceItem) {
        return repo.save(serviceItem);
    }

    public List<ServiceItem> getAllServices() {
        return repo.findAll();
    }
    
    public ServiceItem getServiceById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    public void deleteService(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        repo.deleteById(id);
    }

}
