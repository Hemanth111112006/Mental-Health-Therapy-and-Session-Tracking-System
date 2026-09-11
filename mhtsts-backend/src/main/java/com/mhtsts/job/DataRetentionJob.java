package com.mhtsts.job;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import org.springframework.transaction.annotation.Transactional;
import com.mhtsts.repository.AuditLogRepository;
import com.mhtsts.repository.BillingRepository;
import com.mhtsts.repository.CrisisAssessmentRepository;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.entity.Client;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class DataRetentionJob {

    private static final Logger logger = LoggerFactory.getLogger(DataRetentionJob.class);

    private final AuditLogRepository auditLogRepository;
    private final BillingRepository billingRepository;
    private final CrisisAssessmentRepository crisisAssessmentRepository;
    private final ClientRepository clientRepository;

    public DataRetentionJob(AuditLogRepository auditLogRepository,
                            BillingRepository billingRepository,
                            CrisisAssessmentRepository crisisAssessmentRepository,
                            ClientRepository clientRepository) {
        this.auditLogRepository = auditLogRepository;
        this.billingRepository = billingRepository;
        this.crisisAssessmentRepository = crisisAssessmentRepository;
        this.clientRepository = clientRepository;
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void purgeOldRecords() {
        logger.info("Executing Data Retention Purge Job at {}", LocalDateTime.now());
        
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        // 4. Audit logs > 6 years old
        auditLogRepository.deleteByTimestampBefore(now.minusYears(6));
        logger.info("Purged audit logs older than 6 years.");

        // 3. Crisis/Billing records > 10 years old
        crisisAssessmentRepository.deleteByAssessmentDateBefore(now.minusYears(10));
        billingRepository.deleteByClaimSubmissionDateBefore(today.minusYears(10));
        logger.info("Purged crisis and billing records older than 10 years.");

        // 1 & 2. Client records (Adults > 7 years, Minors > 7 years AND age >= 25)
        List<Client> allClients = clientRepository.findAll();
        int clientsDeleted = 0;
        
        for (Client client : allClients) {
            long age = ChronoUnit.YEARS.between(client.getDateOfBirth(), today);
            long inactiveYears = ChronoUnit.YEARS.between(client.getIntakeDate(), today); // Assuming intakeDate serves as activity base for simplicity
            
            boolean isAdult = age >= 18;
            boolean shouldDelete = false;
            
            if (isAdult && inactiveYears > 7) {
                shouldDelete = true;
            } else if (!isAdult && inactiveYears > 7 && age >= 25) {
                shouldDelete = true;
            }
            
            if (shouldDelete) {
                clientRepository.delete(client);
                clientsDeleted++;
            }
        }
        
        logger.info("Purged {} expired client records based on retention policy.", clientsDeleted);
    }
}
