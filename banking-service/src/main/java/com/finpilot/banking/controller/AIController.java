package com.finpilot.banking.controller;

import com.finpilot.banking.dto.PredictionRequest;
import com.finpilot.banking.dto.PredictionResponse;
import com.finpilot.banking.service.AIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/predict")
    public PredictionResponse predict(@RequestBody PredictionRequest request) {
        return aiService.predict(request);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "Online");
    }
}