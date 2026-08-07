package com.finpilot.banking.dto;

import java.time.LocalDateTime;

public class AdminNotificationResponse {

    private Long id;

    private String message;

    private LocalDateTime time;

    public AdminNotificationResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }
}