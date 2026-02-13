package com.dipika.kalakriti2.controller;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import com.dipika.kalakriti2.dto.ContactAdminDto;
import com.dipika.kalakriti2.dto.ReplyDto;
import com.dipika.kalakriti2.entity.ContactMessage;
import com.dipika.kalakriti2.repository.ContactRepository;
import com.dipika.kalakriti2.service.ContactService;
import com.dipika.kalakriti2.service.EmailService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactService contactService;
    
    @Autowired
    private EmailService emailService;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/contact/";


    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> submitContact(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String message,
            @RequestParam(required = false) List<MultipartFile> images
    ) {
        try {
            System.out.println("🔍 Contact form submission received");
            System.out.println("Name: " + name);
            System.out.println("Email: " + email);
            System.out.println("Phone: " + phone);
            System.out.println("Address: " + address);
            System.out.println("Message: " + message);
            System.out.println("Images count: " + (images != null ? images.size() : 0));
            
            ContactMessage contact = new ContactMessage();
            contact.setName(name);
            contact.setEmail(email);
            contact.setPhone(phone);
            contact.setAddress(address);
            contact.setMessage(message);

            List<String> imagePaths = new ArrayList<>();
            if (images != null && !images.isEmpty()) {
                System.out.println("📸 Processing " + images.size() + " images");
            	File uploadDir = new File(UPLOAD_DIR);
            	if (!uploadDir.exists()) {
            	    System.out.println("📁 Creating upload directory: " + UPLOAD_DIR);
            	    uploadDir.mkdirs();
            	}

            	for (MultipartFile file : images) {
            	    System.out.println("Processing file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
            	    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            	    File dest = new File(uploadDir, fileName);
            	    file.transferTo(dest);
            	    imagePaths.add(fileName);
            	    System.out.println("✅ Saved: " + fileName);
            	}
            } else {
                System.out.println("No images to process");
            }

            contact.setImages(imagePaths);
            System.out.println("💾 Saving contact message to database");
            contactRepository.save(contact);
            System.out.println("✅ Contact message saved successfully");

            return ResponseEntity.ok("Message sent successfully ✅");

        } catch (IOException e) {
            System.err.println("❌ IOException occurred: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload images ❌");
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing request: " + e.getMessage());
        }
      
    }
   
 // ✅ PUBLIC / USER CONTACTS
    @GetMapping
    public List<ContactMessage> getAllContacts() {
        return contactService.getAllContacts();
    }

    // ✅ ADMIN CONTACTS (WITH IMAGE)
    @GetMapping("/contacts")
    public List<ContactAdminDto> getAdminContacts() {
        return contactService.getAdminContacts();
    }
 // 🖼️ STATIC IMAGE SERVING (🔥 THIS FIXES IMAGE ISSUE)
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String uploadPath = "file:" + System.getProperty("user.dir") + "/uploads/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
    
    @PostMapping("/reply")
    public ResponseEntity<?> replyToContact(@RequestBody ReplyDto dto) {
        try {
            emailService.sendReplyMail(dto.getEmail(), dto.getMessage());
            return ResponseEntity.ok("Reply mail sent successfully ✅");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send mail ❌");
        }
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.ok("Contact message deleted successfully 🗑️");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete contact ❌");
        }
    }

    // 🎨 Get commissions for a specific user (by email)
    @GetMapping("/my-commissions")
    public List<ContactMessage> getMyCommissions(@RequestParam String email) {
        return contactService.getUserCommissions(email);
    }
    

    
    
}
