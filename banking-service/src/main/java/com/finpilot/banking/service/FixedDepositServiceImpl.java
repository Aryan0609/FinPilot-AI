package com.finpilot.banking.service;

import com.finpilot.banking.dto.FDResponse;
import com.finpilot.banking.entity.Account;
import com.finpilot.banking.entity.FDStatus;
import com.finpilot.banking.entity.FixedDeposit;
import com.finpilot.banking.repository.AccountRepository;
import com.finpilot.banking.repository.FixedDepositRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class FixedDepositServiceImpl
        implements FixedDepositService {

    private final FixedDepositRepository fixedDepositRepository;

    private final AccountRepository accountRepository;

    public FixedDepositServiceImpl(
            FixedDepositRepository fixedDepositRepository,
            AccountRepository accountRepository) {

        this.fixedDepositRepository = fixedDepositRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FDResponse createFD(
            Long accountId,
            BigDecimal amount,
            Integer tenureMonths) {

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new RuntimeException("Account not found"));

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid FD amount");
        }

        if (tenureMonths <= 0) {
            throw new RuntimeException("Invalid tenure");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        double interestRate = 7.0;

        BigDecimal interest =
                amount
                        .multiply(BigDecimal.valueOf(interestRate))
                        .multiply(BigDecimal.valueOf(tenureMonths))
                        .divide(
                                BigDecimal.valueOf(1200),
                                2,
                                RoundingMode.HALF_UP
                        );

        BigDecimal maturityAmount =
                amount.add(interest);

        account.setBalance(
                account.getBalance().subtract(amount)
        );

        accountRepository.save(account);

        FixedDeposit fd = new FixedDeposit();

        fd.setUser(account.getUser());
        fd.setPrincipalAmount(amount);
        fd.setInterestRate(interestRate);
        fd.setTenureMonths(tenureMonths);
        fd.setMaturityAmount(maturityAmount);
        fd.setStartDate(LocalDate.now());
        fd.setMaturityDate(
                LocalDate.now().plusMonths(tenureMonths)
        );
        fd.setStatus(FDStatus.ACTIVE);

        FixedDeposit savedFD =
                fixedDepositRepository.save(fd);

        return map(savedFD);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FDResponse> getUserFDs(Long userId) {

        return fixedDepositRepository
                .findByUserId(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public FDResponse closeFD(Long fdId) {

        FixedDeposit fd =
                fixedDepositRepository.findById(fdId)
                        .orElseThrow(() ->
                                new RuntimeException("FD not found"));

        if (fd.getStatus() != FDStatus.ACTIVE) {
            throw new RuntimeException(
                    "FD is already closed"
            );
        }

        Account account =
                accountRepository.findByUser(fd.getUser())
                        .orElseThrow(() ->
                                new RuntimeException("Account not found"));

        account.setBalance(
                account.getBalance()
                        .add(fd.getMaturityAmount())
        );

        accountRepository.save(account);

        fd.setStatus(FDStatus.CLOSED);

        FixedDeposit closedFD =
                fixedDepositRepository.save(fd);

        return map(closedFD);
    }

    private FDResponse map(FixedDeposit fd) {

        FDResponse response = new FDResponse();

        response.setId(fd.getId());

        response.setPrincipalAmount(
                fd.getPrincipalAmount()
        );

        response.setInterestRate(
                fd.getInterestRate()
        );

        response.setTenureMonths(
                fd.getTenureMonths()
        );

        response.setMaturityAmount(
                fd.getMaturityAmount()
        );

        response.setStartDate(
                fd.getStartDate()
        );

        response.setMaturityDate(
                fd.getMaturityDate()
        );

        response.setStatus(
                fd.getStatus().name()
        );

        return response;
    }
}