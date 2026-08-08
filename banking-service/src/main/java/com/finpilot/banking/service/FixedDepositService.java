package com.finpilot.banking.service;


import com.finpilot.banking.dto.FDResponse;

import java.math.BigDecimal;
import java.util.List;


public interface FixedDepositService {


    FDResponse createFD(
            Long accountId,
            BigDecimal amount,
            Integer tenureMonths
    );


    List<FDResponse> getUserFDs(
            Long userId
    );


    FDResponse closeFD(
            Long fdId
    );

}