package com.dipika.kalakriti2.dto;

public class ContactAdminDto {

	
	private Long id;
    private String name;
    private String email;
    private String phone;
    private String address; // Added
    private String message;
    private java.util.List<String> images; // Changed to List
    private java.time.LocalDateTime createdAt; // Added
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
    public java.util.List<String> getImages() {
        return images;
    }
    public void setImages(java.util.List<String> images) {
        this.images = images;
    }
    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    
}
