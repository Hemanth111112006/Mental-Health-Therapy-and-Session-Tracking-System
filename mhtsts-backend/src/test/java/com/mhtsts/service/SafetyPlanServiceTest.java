package com.mhtsts.service;

import com.mhtsts.entity.SafetyPlan;
import com.mhtsts.repository.SafetyPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SafetyPlanServiceTest {

    @Mock
    private SafetyPlanRepository safetyPlanRepository;

    @InjectMocks
    private SafetyPlanService safetyPlanService;

    private SafetyPlan samplePlan;

    @BeforeEach
    public void setUp() {
        samplePlan = new SafetyPlan();
        samplePlan.setId(1L);
        samplePlan.setWarningSigns("Insomnia, withdrawal");
    }

    @Test
    public void testCreateSafetyPlan() {
        when(safetyPlanRepository.save(any(SafetyPlan.class))).thenReturn(samplePlan);

        SafetyPlan result = safetyPlanService.createSafetyPlan(samplePlan);

        assertNotNull(result);
        assertEquals("Insomnia, withdrawal", result.getWarningSigns());
        verify(safetyPlanRepository, times(1)).save(any(SafetyPlan.class));
    }

    @Test
    public void testGetSafetyPlanById() {
        when(safetyPlanRepository.findById(1L)).thenReturn(Optional.of(samplePlan));

        SafetyPlan result = safetyPlanService.getSafetyPlan(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }
}
