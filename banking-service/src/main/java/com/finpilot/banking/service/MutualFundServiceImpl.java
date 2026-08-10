package com.finpilot.banking.service;

import com.finpilot.banking.exception.ResourceNotFoundException;
import com.finpilot.banking.exception.BadRequestException;
import com.finpilot.banking.dto.InvestmentResponse;
import com.finpilot.banking.dto.MutualFundRequest;
import com.finpilot.banking.dto.MutualFundResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.Investment;
import com.finpilot.banking.entity.MutualFund;
import com.finpilot.banking.entity.Transaction;
import com.finpilot.banking.entity.TransactionStatus;
import com.finpilot.banking.entity.TransactionType;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.InvestmentRepository;
import com.finpilot.banking.repository.MutualFundRepository;
import com.finpilot.banking.repository.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MutualFundServiceImpl implements MutualFundService {

    @Autowired
    private MutualFundRepository mutualFundRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    // =========================================================
    // UPDATE NAV
    // =========================================================

    private void updateNavs() {

        List<MutualFund> funds =
                mutualFundRepository.findAll();

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

            fund.setNav(
                    BigDecimal.valueOf(newNav)
            );
        }

        mutualFundRepository.saveAll(funds);
    }


    // =========================================================
    // GET ALL FUNDS
    // =========================================================

    @Override
    public List<MutualFundResponse> getAllFunds() {

        updateNavs();

        List<MutualFundResponse> response =
                new ArrayList<>();

        for (MutualFund fund :
                mutualFundRepository.findAll()) {

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


    // =========================================================
    // BUY MUTUAL FUND
    // =========================================================

    @Override
    @Transactional
    public InvestmentResponse buyFund(
            Long accountId,
            MutualFundRequest request) {

        updateNavs();

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found"
                                )
                        );

        MutualFund fund =
                mutualFundRepository.findById(
                                request.getFundId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Fund not found"
                                )
                        );

        if (request.getAmount() == null ||
                request.getAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Invalid investment amount"
            );
        }

        if (account.getBalance()
                .compareTo(request.getAmount()) < 0) {

            throw new BadRequestException(
                    "Insufficient balance"
            );
        }


        // ---------------------------------------------------------
        // DEBIT ACCOUNT
        // ---------------------------------------------------------

        BigDecimal investmentAmount =
                request.getAmount();

        account.setBalance(
                account.getBalance()
                        .subtract(investmentAmount)
        );

        accountRepository.save(account);


        // ---------------------------------------------------------
        // CALCULATE UNITS
        // ---------------------------------------------------------

        BigDecimal units =
                investmentAmount.divide(
                        fund.getNav(),
                        4,
                        RoundingMode.HALF_UP
                );


        // ---------------------------------------------------------
        // CREATE INVESTMENT
        // ---------------------------------------------------------

        Investment investment =
                new Investment();

        investment.setAccount(account);
        investment.setMutualFund(fund);
        investment.setInvestmentAmount(
                investmentAmount
        );
        investment.setUnitsPurchased(units);
        investment.setPurchaseNav(
                fund.getNav()
        );

        Investment savedInvestment =
                investmentRepository.save(investment);


        // ---------------------------------------------------------
        // CREATE TRANSACTION
        // ---------------------------------------------------------

        Transaction transaction =
                new Transaction();

        transaction.setAccount(account);

        // Negative because money left wallet
        transaction.setAmount(
                investmentAmount.negate()
        );

        transaction.setTransactionType(
                TransactionType.MF_INVESTMENT
        );

        transaction.setStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setDescription(
                "Mutual Fund investment - "
                        + fund.getFundName()
                        + " #"
                        + savedInvestment.getId()
        );

        transaction.setReferenceNumber(
                "MF-INV-"
                        + savedInvestment.getId()
                        + "-"
                        + UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
        );

        transactionRepository.save(transaction);


        return mapInvestment(savedInvestment);
    }


    // =========================================================
    // SELL MUTUAL FUND
    // =========================================================

    @Override
    @Transactional
    public InvestmentResponse sellFund(
            Long investmentId,
            Double units) {

        updateNavs();

        Investment investment =
                investmentRepository.findById(
                                investmentId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Investment not found"
                                )
                        );

        if (units == null) {
            throw new BadRequestException(
                    "Invalid units"
            );
        }

        BigDecimal sellUnits =
                BigDecimal.valueOf(units);

        if (sellUnits.compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Invalid units"
            );
        }

        if (investment.getUnitsPurchased()
                .compareTo(sellUnits) < 0) {

            throw new BadRequestException(
                    "Not enough units"
            );
        }


        MutualFund fund =
                investment.getMutualFund();

        Account account =
                investment.getAccount();


        // ---------------------------------------------------------
        // CALCULATE REDEMPTION VALUE
        // ---------------------------------------------------------

        BigDecimal sellAmount =
                sellUnits.multiply(
                        fund.getNav()
                );


        // ---------------------------------------------------------
        // CREDIT ACCOUNT
        // ---------------------------------------------------------

        account.setBalance(
                account.getBalance()
                        .add(sellAmount)
        );

        accountRepository.save(account);


        // ---------------------------------------------------------
        // UPDATE INVESTMENT
        // ---------------------------------------------------------

        BigDecimal remainingUnits =
                investment.getUnitsPurchased()
                        .subtract(sellUnits);


        // ---------------------------------------------------------
        // CREATE TRANSACTION BEFORE DELETE
        // ---------------------------------------------------------

        Transaction transaction =
                new Transaction();

        transaction.setAccount(account);

        // Positive because money returned to wallet
        transaction.setAmount(
                sellAmount
        );

        transaction.setTransactionType(
                TransactionType.MF_REDEMPTION
        );

        transaction.setStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setDescription(
                "Mutual Fund redemption - "
                        + fund.getFundName()
                        + " #"
                        + investment.getId()
        );

        transaction.setReferenceNumber(
                "MF-SELL-"
                        + investment.getId()
                        + "-"
                        + UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
        );

        transactionRepository.save(transaction);


        // ---------------------------------------------------------
        // REMOVE / UPDATE INVESTMENT
        // ---------------------------------------------------------

        if (remainingUnits.compareTo(
                BigDecimal.ZERO) == 0) {

            investmentRepository.delete(
                    investment
            );

        } else {

            investment.setUnitsPurchased(
                    remainingUnits
            );

            investment.setInvestmentAmount(
                    remainingUnits.multiply(
                            investment.getPurchaseNav()
                    )
            );

            investmentRepository.save(
                    investment
            );
        }


        return mapInvestment(investment);
    }


    // =========================================================
    // GET PORTFOLIO
    // =========================================================

    @Override
    public List<InvestmentResponse> getPortfolio(
            Long accountId) {

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found"
                                )
                        );

        List<Investment> investments =
                investmentRepository.findByAccount(
                        account
                );

        List<InvestmentResponse> response =
                new ArrayList<>();

        for (Investment investment :
                investments) {

            response.add(
                    mapInvestment(investment)
            );
        }

        return response;
    }


    // =========================================================
    // MAP INVESTMENT
    // =========================================================

    private InvestmentResponse mapInvestment(
            Investment investment) {

        InvestmentResponse dto =
                new InvestmentResponse();

        dto.setInvestmentId(
                investment.getId()
        );

        dto.setFundName(
                investment.getMutualFund()
                        .getFundName()
        );

        dto.setInvestedAmount(
                investment.getInvestmentAmount()
        );

        dto.setUnits(
                investment.getUnitsPurchased()
        );

        dto.setPurchaseNav(
                investment.getPurchaseNav()
        );

        dto.setCurrentNav(
                investment.getMutualFund()
                        .getNav()
        );

        dto.setCurrentValue(
                investment.getCurrentValue()
        );

        dto.setProfitLoss(
                investment.getProfitLoss()
        );

        dto.setInvestmentDate(
                investment.getInvestmentDate()
        );

        return dto;
    }
}
