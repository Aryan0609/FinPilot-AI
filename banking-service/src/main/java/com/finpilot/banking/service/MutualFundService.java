package com.finpilot.banking.service;

import com.finpilot.banking.dto.InvestmentResponse;
import com.finpilot.banking.dto.MutualFundRequest;
import com.finpilot.banking.dto.MutualFundResponse;

import java.util.List;

public interface MutualFundService {

    List<MutualFundResponse> getAllFunds();

    InvestmentResponse buyFund(Long accountId,
                               MutualFundRequest request);

    InvestmentResponse sellFund(Long investmentId,
                                Double units);

    List<InvestmentResponse> getPortfolio(Long accountId);

}