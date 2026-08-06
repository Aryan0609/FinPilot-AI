package com.finpilot.banking.controller;

import com.finpilot.banking.dto.CreateFDRequest;
import com.finpilot.banking.dto.FDResponse;
import com.finpilot.banking.service.FixedDepositService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fd")
@CrossOrigin(origins = "http://localhost:5173")
public class FixedDepositController {


    private final FixedDepositService fixedDepositService;


    public FixedDepositController(
            FixedDepositService fixedDepositService) {

        this.fixedDepositService = fixedDepositService;
    }



    @PostMapping("/create")
    public ResponseEntity<FDResponse> createFD(
            @RequestBody CreateFDRequest request) {


        return ResponseEntity.ok(

                fixedDepositService.createFD(

                        request.getAccountId(),

                        request.getAmount(),

                        request.getTenureMonths()
                )
        );
    }



    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FDResponse>> getUserFDs(

            @PathVariable Long userId) {


        return ResponseEntity.ok(

                fixedDepositService.getUserFDs(userId)

        );
    }



    @PostMapping("/close/{fdId}")
    public ResponseEntity<FDResponse> closeFD(

            @PathVariable Long fdId) {


        return ResponseEntity.ok(

                fixedDepositService.closeFD(fdId)

        );
    }

}