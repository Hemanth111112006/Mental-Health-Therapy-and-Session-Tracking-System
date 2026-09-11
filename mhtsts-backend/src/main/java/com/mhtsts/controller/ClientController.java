package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.Client;
import com.mhtsts.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST', 'PSYCHOLOGIST', 'PSYCHIATRIST', 'SUPERVISOR', 'CASE_MANAGER', 'RECEPTIONIST')")
    @PostMapping
    public ResponseEntity<ApiResponse<Client>> registerClient(@Valid @RequestBody Client client) {
        Client savedClient = clientService.registerClient(client);
        return new ResponseEntity<>(
                ApiResponse.success("Client registered successfully", savedClient),
                HttpStatus.CREATED
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST', 'PSYCHOLOGIST', 'PSYCHIATRIST', 'SUPERVISOR', 'CASE_MANAGER', 'RECEPTIONIST')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Client>>> getClients() {
        return ResponseEntity.ok(ApiResponse.success("Client list retrieved", clientService.getAllClients()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST', 'PSYCHOLOGIST', 'PSYCHIATRIST', 'SUPERVISOR', 'CASE_MANAGER', 'RECEPTIONIST', 'CLIENT')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Client>> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Client record retrieved", clientService.getClientById(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST', 'PSYCHOLOGIST', 'PSYCHIATRIST', 'SUPERVISOR', 'CASE_MANAGER', 'RECEPTIONIST')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Client>> updateClient(@PathVariable Long id, @Valid @RequestBody Client client) {
        return ResponseEntity.ok(ApiResponse.success("Client record updated", clientService.updateClient(id, client)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST', 'PSYCHOLOGIST', 'PSYCHIATRIST', 'SUPERVISOR', 'CASE_MANAGER', 'RECEPTIONIST')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok(ApiResponse.success("Client record deleted"));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST')")
    @PutMapping("/{clientId}/assign-therapist/{therapistId}")
    public ResponseEntity<ApiResponse<Client>> assignTherapist(@PathVariable Long clientId, @PathVariable Long therapistId) {
        com.mhtsts.entity.User therapist = new com.mhtsts.entity.User();
        therapist.setId(therapistId);
        Client updated = clientService.assignTherapist(clientId, therapist);
        return ResponseEntity.ok(ApiResponse.success("Therapist assigned", updated));
    }
}
