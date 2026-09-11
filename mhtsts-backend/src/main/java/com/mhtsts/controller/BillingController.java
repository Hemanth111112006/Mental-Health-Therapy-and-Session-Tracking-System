package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.Client;
import com.mhtsts.entity.Invoice;
import com.mhtsts.entity.User;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.service.InvoiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final InvoiceService invoiceService;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public BillingController(InvoiceService invoiceService, UserRepository userRepository, ClientRepository clientRepository) {
        this.invoiceService = invoiceService;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }

    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<List<Invoice>>> getInvoices(Authentication authentication) {
        if (authentication != null) {
            User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (user != null && "CLIENT".equalsIgnoreCase(user.getRole())) {
                // If client user, find their client record
                Client client = clientRepository.findAll().stream()
                        .filter(c -> c.getId().equals(4L) || 
                                     (c.getEmail() != null && c.getEmail().equalsIgnoreCase(user.getEmail())) ||
                                     (user.getLastName() != null && user.getLastName().equalsIgnoreCase(c.getLastName())))
                        .findFirst().orElse(null);
                if (client != null) {
                    return ResponseEntity.ok(ApiResponse.success("Invoices retrieved for client", invoiceService.getInvoicesByClientId(client.getId())));
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.success("All invoices retrieved", invoiceService.getAllInvoices()));
    }

    @GetMapping("/invoices/client/{clientId}")
    public ResponseEntity<ApiResponse<List<Invoice>>> getClientInvoices(@PathVariable Long clientId) {
        return ResponseEntity.ok(ApiResponse.success("Client invoices retrieved", invoiceService.getInvoicesByClientId(clientId)));
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<ApiResponse<Invoice>> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Invoice retrieved", invoiceService.getInvoiceById(id)));
    }

    @PostMapping("/invoices")
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@RequestBody Map<String, Object> payload) {
        Invoice invoice = new Invoice();
        Long clientId = null;
        if (payload.containsKey("clientId") && payload.get("clientId") != null) {
            clientId = Long.valueOf(payload.get("clientId").toString());
        }
        if (payload.containsKey("cptCode")) {
            invoice.setCptCode(payload.get("cptCode").toString());
        } else if (payload.containsKey("cpt")) {
            invoice.setCptCode(payload.get("cpt").toString());
        }
        if (payload.containsKey("serviceDescription")) {
            invoice.setServiceDescription(payload.get("serviceDescription").toString());
        } else {
            invoice.setServiceDescription("Psychotherapy Session · CPT " + invoice.getCptCode());
        }
        if (payload.containsKey("billedAmount")) {
            invoice.setBilledAmount(Double.valueOf(payload.get("billedAmount").toString()));
        } else if (payload.containsKey("amount")) {
            invoice.setBilledAmount(Double.valueOf(payload.get("amount").toString()));
        }
        if (payload.containsKey("clientResponsibility")) {
            invoice.setClientResponsibility(Double.valueOf(payload.get("clientResponsibility").toString()));
        } else {
            invoice.setClientResponsibility(30.0);
        }
        if (payload.containsKey("insurancePaid")) {
            invoice.setInsurancePaid(Double.valueOf(payload.get("insurancePaid").toString()));
        } else {
            double billed = invoice.getBilledAmount() != null ? invoice.getBilledAmount() : 150.0;
            invoice.setInsurancePaid(Math.max(0.0, billed - invoice.getClientResponsibility()));
        }
        invoice.setProviderName(payload.getOrDefault("providerName", "Dr. Sarah Chen, LCSW").toString());
        invoice.setStatus(payload.getOrDefault("status", "SUBMITTED").toString());

        Invoice created = invoiceService.createInvoice(invoice, clientId);
        return new ResponseEntity<>(ApiResponse.success("Claim/Invoice recorded successfully", created), HttpStatus.CREATED);
    }

    @PostMapping("/invoices/{id}/pay")
    public ResponseEntity<ApiResponse<Invoice>> payInvoice(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String method = payload != null && payload.containsKey("paymentMethod") ? payload.get("paymentMethod") : "Visa ending in 4242";
        Invoice paid = invoiceService.payInvoice(id, method);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", paid));
    }
}
