package com.mhtsts.service;

import com.mhtsts.entity.Client;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.ClientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientService clientService;

    private Client sampleClient;

    @BeforeEach
    public void setUp() {
        sampleClient = new Client();
        sampleClient.setId(1L);
        sampleClient.setClientNumber("CLI-1001");
        sampleClient.setFirstName("John");
        sampleClient.setLastName("Doe");
    }

    @Test
    public void testCreateClient() {
        when(clientRepository.save(any(Client.class))).thenReturn(sampleClient);

        Client result = clientService.registerClient(sampleClient);

        assertNotNull(result);
        assertEquals("John", result.getFirstName());
        verify(clientRepository, times(1)).save(any(Client.class));
    }

    @Test
    public void testGetClientById_Success() {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(sampleClient));

        Client result = clientService.getClientById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(clientRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetClientById_NotFound_ThrowsResourceNotFoundException() {
        when(clientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> clientService.getClientById(99L));
        verify(clientRepository, times(1)).findById(99L);
    }

    @Test
    public void testGetAllClients() {
        when(clientRepository.findAll()).thenReturn(Arrays.asList(sampleClient));

        List<Client> clients = clientService.getAllClients();

        assertEquals(1, clients.size());
        verify(clientRepository, times(1)).findAll();
    }

    @Test
    public void testDeleteClient() {
        when(clientRepository.findById(1L)).thenReturn(Optional.of(sampleClient));
        doNothing().when(clientRepository).delete(sampleClient);

        clientService.deleteClient(1L);

        verify(clientRepository, times(1)).delete(sampleClient);
    }
}
