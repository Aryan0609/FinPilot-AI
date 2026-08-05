package com.finpilot.banking.controller;

import com.finpilot.banking.dto.InvestmentResponse;
import com.finpilot.banking.dto.MutualFundRequest;
import com.finpilot.banking.dto.MutualFundResponse;
import com.finpilot.banking.service.MutualFundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mutual-funds")
public class MutualFundController {

    @Autowired
    private MutualFundService mutualFundService;

    @GetMapping
    public List<MutualFundResponse> getAllFunds() {

        return mutualFundService.getAllFunds();

    }

    @PostMapping("/buy/{accountId}")
    public InvestmentResponse buyFund(
            @PathVariable Long accountId,
            @RequestBody MutualFundRequest request) {

        return mutualFundService.buyFund(accountId, request);

    }

    @PostMapping("/sell/{investmentId}")
    public InvestmentResponse sellFund(
            @PathVariable Long investmentId,
            @RequestBody Map<String, Double> body) {

        Double units = body.get("units");

        return mutualFundService.sellFund(
                investmentId,
                units
        );

    }

    @GetMapping("/portfolio/{accountId}")
    public List<InvestmentResponse> portfolio(
            @PathVariable Long accountId) {

        return mutualFundService.getPortfolio(accountId);

    }

}