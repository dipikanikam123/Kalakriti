package com.dipika.kalakriti2.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
	
@Entity
@Table(name = "contact_messages")
public class ContactMessage {

	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String address;
    private String message;
    


    @ElementCollection
    @CollectionTable(name = "contact_images", joinColumns = @JoinColumn(name = "contact_id"))
    @Column(name = "image_path")
    private List<String> images;

    private LocalDateTime createdAt;
    
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'PENDING'")
    private String status = "PENDING";

    public ContactMessage() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	
	

    // getters & setters
    
}
