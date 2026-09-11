package com.mhtsts.controller;

import com.mhtsts.entity.Client;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
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
    @WithMockUser(roles = "THERAPIST")
    public void testGetClientById_Status200() throws Exception {
        when(clientService.getClientById(1L)).thenReturn(sampleClient);

        mockMvc.perform(get("/api/clients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.firstName").value("John"));
    }

    @Test
    @WithMockUser(roles = "THERAPIST")
    public void testGetClientById_Status404() throws Exception {
        when(clientService.getClientById(99L)).thenThrow(new ResourceNotFoundException("Client not found with id: 99"));

        mockMvc.perform(get("/api/clients/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Client not found with id: 99"));
    }
}
