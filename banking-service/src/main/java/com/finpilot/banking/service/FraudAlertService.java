package com.finpilot.banking.service;

import com.finpilot.banking.entity.FraudAlert;
import com.finpilot.banking.repository.FraudAlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FraudAlertService {

    private final FraudAlertRepository fraudAlertRepository;

    public FraudAlertService(
            FraudAlertRepository fraudAlertRepository) {
        this.fraudAlertRepository = fraudAlertRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FraudAlert save(FraudAlert fraudAlert) {
        return fraudAlertRepository.save(fraudAlert);
    }
}
