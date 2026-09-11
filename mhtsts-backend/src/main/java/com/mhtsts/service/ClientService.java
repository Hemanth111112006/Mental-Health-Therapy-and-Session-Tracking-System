package com.mhtsts.service;

import com.mhtsts.entity.Client;
import com.mhtsts.entity.User;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client registerClient(Client client) {
        return clientRepository.save(client);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + id));
    }

    public Client updateClient(Long id, Client clientDetails) {
        Client existingClient = getClientById(id);
        existingClient.setFirstName(clientDetails.getFirstName());
        existingClient.setLastName(clientDetails.getLastName());
        existingClient.setDateOfBirth(clientDetails.getDateOfBirth());
        existingClient.setGender(clientDetails.getGender());
        existingClient.setPhoneNumber(clientDetails.getPhoneNumber());
        existingClient.setEmail(clientDetails.getEmail());
        existingClient.setEmergencyContactName(clientDetails.getEmergencyContactName());
        existingClient.setEmergencyContactPhone(clientDetails.getEmergencyContactPhone());
        // Note: The logic for updating insurance object should be handled if required.
        // client.setInsurancePolicy(...);
        existingClient.setStatus(clientDetails.getStatus());
        existingClient.setIsMinor(clientDetails.getIsMinor());
        return clientRepository.save(existingClient);
    }

    public void deleteClient(Long id) {
        Client existingClient = getClientById(id);
        clientRepository.delete(existingClient);
    }

    public Client assignTherapist(Long clientId, User therapist) {
        Client client = getClientById(clientId);
        client.setAssignedTherapist(therapist);
        return clientRepository.save(client);
    }
}
