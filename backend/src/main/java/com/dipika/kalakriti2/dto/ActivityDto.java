package com.dipika.kalakriti2.dto;

import java.time.LocalDateTime;

public class ActivityDto {
    private String type;
    private String message;
    private LocalDateTime timestamp;
    private String icon;

    public ActivityDto() {}

    public ActivityDto(String type, String message, LocalDateTime timestamp, String icon) {
        this.type = type;
        this.message = message;
        this.timestamp = timestamp;
        this.icon = icon;
    }

    // Getters and Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
