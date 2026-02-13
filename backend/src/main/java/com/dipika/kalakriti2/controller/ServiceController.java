
package com.dipika.kalakriti2.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.dipika.kalakriti2.entity.ServiceItem;
import com.dipika.kalakriti2.service.ServiceItemService;
import com.dipika.kalakriti2.utils.UploadToCloud;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    @Autowired
    private ServiceItemService service;

    @Autowired
    private UploadToCloud uploadToCloud;

    // GET all services
    @GetMapping
    public List<ServiceItem> getAllServices() {
        return service.getAllServices();
    }

    // GET services by category
    @GetMapping("/category/{category}")
    public List<ServiceItem> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }

    // GET service by ID
    @GetMapping("/{id}")
    public ServiceItem getServiceById(@PathVariable Long id) {
        return service.getServiceById(id);
    }

    // DELETE service by ID
    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        service.deleteService(id);
    }

    // ================= File Upload Endpoint =================
    // Upload file separately, return URL
    @PostMapping("/upload")
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file) {
        String imageUrl = uploadToCloud.uploadToCloud(file);
        return Map.of("url", imageUrl);
    }

    // ================= Add Service (JSON) =================
    // Accept JSON with image URL already uploaded
    // ================= Add Service (Multipart) =================
    @PostMapping("/addservice")
    public ServiceItem addService(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") String price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        ServiceItem item = new ServiceItem();
        item.setName(name);
        item.setCategory(category);
        item.setPrice(price);
        if(description != null) {
            // Assuming ServiceItem has a description field. If not, ignore or add it.
             // item.setDescription(description); 
        }

        if (image != null && !image.isEmpty()) {
            String imageUrl = uploadToCloud.uploadToCloud(image);
            item.setImage(imageUrl);
        }

        return service.save(item);
    }
}

