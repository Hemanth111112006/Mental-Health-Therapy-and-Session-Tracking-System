package com.mhtsts.repository;

import com.mhtsts.entity.Client;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ClientRepositoryTest {

    @Autowired
    private ClientRepository clientRepository;

    private Client client;

    @BeforeEach
    public void setUp() {
        client = new Client();
        client.setClientNumber("CLI-TEST-1");
        client.setFirstName("Jane");
        client.setLastName("Smith");
        client.setEmail("jane.smith@example.com");
        client.setPhoneNumber("1234567890");
        client.setDateOfBirth(java.time.LocalDate.of(1990, 1, 1));
        client.setEmergencyContactName("John Smith");
        client.setEmergencyContactPhone("9876543210");
    }

    @Test
    public void testSaveAndFindClient() {
        Client saved = clientRepository.save(client);
        assertNotNull(saved.getId());

        Optional<Client> found = clientRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Jane", found.get().getFirstName());
    }

    @Test
    public void testDeleteClient() {
        Client saved = clientRepository.save(client);
        Long id = saved.getId();

        clientRepository.delete(saved);

        Optional<Client> found = clientRepository.findById(id);
        assertFalse(found.isPresent());
    }
}
