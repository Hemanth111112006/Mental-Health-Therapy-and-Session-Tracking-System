package com.mhtsts.service;

import com.mhtsts.entity.Client;
import com.mhtsts.entity.Invoice;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.InvoiceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, ClientRepository clientRepository) {
        this.invoiceRepository = invoiceRepository;
        this.clientRepository = clientRepository;
    }

    @PostConstruct
    public void seedInitialInvoices() {
        if (invoiceRepository.count() > 0) return;

        List<Client> clients = clientRepository.findAll();
        if (clients.isEmpty()) return;

        // Seed for Client 4 (Taylor Morgan)
        Client client4 = clients.stream().filter(c -> c.getId().equals(4L)).findFirst().orElse(clients.get(0));

        createSeedInvoice(client4, "INV-2026-004", "Individual Psychotherapy (60 min) · CPT 90837", "90837",
                "Dr. Sarah Chen, LCSW", LocalDate.of(2026, 8, 15), 150.0, 120.0, 30.0, "PAID", "Visa ending in 4242", LocalDate.of(2026, 8, 15));

        createSeedInvoice(client4, "INV-2026-003", "Individual Psychotherapy (60 min) · CPT 90837", "90837",
                "Dr. Sarah Chen, LCSW", LocalDate.of(2026, 8, 1), 150.0, 120.0, 30.0, "PAID", "Visa ending in 4242", LocalDate.of(2026, 8, 1));

        createSeedInvoice(client4, "INV-2026-002", "Routine Progress & Medication Review · CPT 99214", "99214",
                "Dr. James Rodriguez, MD", LocalDate.of(2026, 7, 16), 175.0, 140.0, 35.0, "PAID", "Visa ending in 4242", LocalDate.of(2026, 7, 16));

        createSeedInvoice(client4, "INV-2026-001", "Comprehensive Intake Diagnostic Evaluation · CPT 90791", "90791",
                "Dr. Sarah Chen, LCSW", LocalDate.of(2026, 6, 15), 220.0, 180.0, 40.0, "PAID", "Visa ending in 4242", LocalDate.of(2026, 6, 15));

        // Seed for Client 1 & 2
        if (clients.size() > 1) {
            createSeedInvoice(clients.get(0), "INV-2026-005", "CBT Psychotherapy (45 min) · CPT 90834", "90834",
                    "Dr. Emily Chen, PsyD", LocalDate.of(2026, 8, 10), 135.0, 110.0, 25.0, "PAID", "Mastercard ending in 1188", LocalDate.of(2026, 8, 10));
        }
    }

    private void createSeedInvoice(Client client, String invNum, String desc, String cpt, String provider,
                                   LocalDate date, Double billed, Double insPaid, Double clientResp,
                                   String status, String payMethod, LocalDate paidDate) {
        Invoice inv = new Invoice();
        inv.setInvoiceNumber(invNum);
        inv.setClient(client);
        inv.setServiceDescription(desc);
        inv.setCptCode(cpt);
        inv.setProviderName(provider);
        inv.setServiceDate(date);
        inv.setBilledAmount(billed);
        inv.setInsurancePaid(insPaid);
        inv.setClientResponsibility(clientResp);
        inv.setStatus(status);
        inv.setPaymentMethod(payMethod);
        inv.setPaidDate(paidDate);
        inv.setCreatedAt(LocalDateTime.now());
        invoiceRepository.save(inv);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAllByOrderByServiceDateDesc();
    }

    public List<Invoice> getInvoicesByClientId(Long clientId) {
        return invoiceRepository.findByClientIdOrderByServiceDateDesc(clientId);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
    }

    public Invoice createInvoice(Invoice invoice, Long clientId) {
        if (clientId != null) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + clientId));
            invoice.setClient(client);
        }
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isEmpty()) {
            invoice.setInvoiceNumber("INV-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        if (invoice.getCreatedAt() == null) {
            invoice.setCreatedAt(LocalDateTime.now());
        }
        if (invoice.getServiceDate() == null) {
            invoice.setServiceDate(LocalDate.now());
        }
        if (invoice.getStatus() == null) {
            invoice.setStatus("SUBMITTED");
        }
        return invoiceRepository.save(invoice);
    }

    public Invoice payInvoice(Long id, String paymentMethod) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus("PAID");
        invoice.setPaymentMethod(paymentMethod != null ? paymentMethod : "Visa ending in 4242");
        invoice.setPaidDate(LocalDate.now());
        return invoiceRepository.save(invoice);
    }
}
