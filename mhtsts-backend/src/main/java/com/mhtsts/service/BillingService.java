package com.mhtsts.service;

import com.mhtsts.entity.Billing;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public Billing createBilling(Billing billing) {
        return billingRepository.save(billing);
    }

    public Billing getBillingDetails(Long id) {
        return billingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Billing details not found with id: " + id));
    }

    public List<Billing> getAllBilling() {
        return billingRepository.findAll();
    }

    public Billing updateBillingStatus(Long id, String status) {
        Billing billing = getBillingDetails(id);
        billing.setStatus(status);
        return billingRepository.save(billing);
    }
}
