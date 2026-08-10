package com.finpilot.banking.service;

import com.finpilot.banking.exception.ResourceNotFoundException;
import com.finpilot.banking.exception.BadRequestException;
import com.finpilot.banking.dto.InvestmentResponse;
import com.finpilot.banking.dto.MutualFundRequest;
import com.finpilot.banking.dto.MutualFundResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Investment;
import com.finpilot.banking.entity.MutualFund;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.InvestmentRepository;
import com.finpilot.banking.repository.MutualFundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MutualFundServiceImpl implements MutualFundService {

    @Autowired
    private MutualFundRepository mutualFundRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private AccountRepository accountRepository;

    private void updateNavs() {

        List<MutualFund> funds = mutualFundRepository.findAll();

        for (MutualFund fund : funds) {

            double percentage =
                    ThreadLocalRandom.current()
                            .nextDouble(-2.0, 2.0);

            double change =
                    fund.getNav().doubleValue()
                            * percentage / 100.0;

            double newNav =
                    Math.max(
                            10,
                            fund.getNav().doubleValue() + change
                    );

            fund.setNav(BigDecimal.valueOf(newNav));

        }

        mutualFundRepository.saveAll(funds);

    }

    @Override
    public List<MutualFundResponse> getAllFunds() {

        updateNavs();

        List<MutualFundResponse> response = new ArrayList<>();

        for (MutualFund fund : mutualFundRepository.findAll()) {

            MutualFundResponse dto =
                    new MutualFundResponse();

            dto.setId(fund.getId());
            dto.setFundName(fund.getFundName());
            dto.setFundType(fund.getFundType());
            dto.setNav(fund.getNav());
            dto.setRiskLevel(fund.getRiskLevel());
            dto.setAnnualReturn(fund.getAnnualReturn());

            response.add(dto);

        }

        return response;

    }

    @Override
    @Transactional
    public InvestmentResponse buyFund(Long accountId,
                                      MutualFundRequest request) {

        updateNavs();

        System.out.println("=========== BUY REQUEST ===========");
System.out.println("Received Account ID = " + accountId);

System.out.println("Accounts in DB:");

accountRepository.findAll().forEach(a ->
        System.out.println(
                a.getId() + "  "
                        + a.getAccountNumber()
        )
);

Account account =
        accountRepository.findById(accountId)
                .orElse(null);

System.out.println("Account Object = " + account);

if (account == null) {
    throw new ResourceNotFoundException("Account not found");
}

        MutualFund fund =
                mutualFundRepository.findById(request.getFundId())
                        .orElseThrow(() ->
                                new RuntimeException("Fund not found"));

        if (request.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException("Invalid amount");

        }

        if (account.getBalance()
                .compareTo(request.getAmount()) < 0) {

            throw new BadRequestException("Insufficient balance");

        }

        account.setBalance(
                account.getBalance()
                        .subtract(request.getAmount())
        );

        accountRepository.save(account);

        BigDecimal units =
                request.getAmount()
                        .divide(
                                fund.getNav(),
                                4,
                                RoundingMode.HALF_UP
                        );

        Investment investment =
                new Investment();

        investment.setAccount(account);
        investment.setMutualFund(fund);
        investment.setInvestmentAmount(request.getAmount());
        investment.setUnitsPurchased(units);
        investment.setPurchaseNav(fund.getNav());

        investmentRepository.save(investment);

        return mapInvestment(investment);

    }
        @Override
    @Transactional
    public InvestmentResponse sellFund(Long investmentId,
                                       Double units) {

        updateNavs();

        Investment investment =
                investmentRepository.findById(investmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Investment not found"));

        BigDecimal sellUnits =
                BigDecimal.valueOf(units);

        if (sellUnits.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException("Invalid units");

        }

        if (investment.getUnitsPurchased()
                .compareTo(sellUnits) < 0) {

            throw new RuntimeException("Not enough units");

        }

        MutualFund fund =
                investment.getMutualFund();

        Account account =
                investment.getAccount();

        BigDecimal sellAmount =
                sellUnits.multiply(fund.getNav());

        account.setBalance(
                account.getBalance().add(sellAmount)
        );

        accountRepository.save(account);

        BigDecimal remainingUnits =
                investment.getUnitsPurchased()
                        .subtract(sellUnits);

        if (remainingUnits.compareTo(BigDecimal.ZERO) == 0) {

            investmentRepository.delete(investment);

        } else {

            investment.setUnitsPurchased(remainingUnits);

            investment.setInvestmentAmount(

                    remainingUnits.multiply(
                            investment.getPurchaseNav()
                    )

            );

            investmentRepository.save(investment);

        }

        return mapInvestment(investment);

    }

    @Override
    public List<InvestmentResponse> getPortfolio(Long accountId) {

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new RuntimeException("Account not found"));

        List<Investment> investments =
                investmentRepository.findByAccount(account);

        List<InvestmentResponse> response =
                new ArrayList<>();

        for (Investment investment : investments) {

            response.add(mapInvestment(investment));

        }

        return response;

    }

    private InvestmentResponse mapInvestment(
            Investment investment) {

        InvestmentResponse dto =
                new InvestmentResponse();

        dto.setInvestmentId(
                investment.getId());

        dto.setFundName(
                investment.getMutualFund()
                        .getFundName());

        dto.setInvestedAmount(
                investment.getInvestmentAmount());

        dto.setUnits(
                investment.getUnitsPurchased());

        dto.setPurchaseNav(
                investment.getPurchaseNav());

        dto.setCurrentNav(
                investment.getMutualFund()
                        .getNav());

        dto.setCurrentValue(
                investment.getCurrentValue());

        dto.setProfitLoss(
                investment.getProfitLoss());

        dto.setInvestmentDate(
                investment.getInvestmentDate());

        return dto;

    }

}