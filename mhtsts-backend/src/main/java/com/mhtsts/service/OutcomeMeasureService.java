package com.mhtsts.service;

import com.mhtsts.dto.OutcomeMeasureDTO;
import com.mhtsts.entity.OutcomeMeasure;
import com.mhtsts.entity.enums.MeasureType;
import com.mhtsts.entity.enums.SeverityLevel;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.OutcomeMeasureRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class OutcomeMeasureService {

    private final OutcomeMeasureRepository outcomeMeasureRepository;
    private final ClientRepository clientRepository;

    public OutcomeMeasureService(OutcomeMeasureRepository outcomeMeasureRepository, ClientRepository clientRepository) {
        this.outcomeMeasureRepository = outcomeMeasureRepository;
        this.clientRepository = clientRepository;
    }

    public OutcomeMeasure saveOutcomeMeasure(OutcomeMeasure measure) {
        return outcomeMeasureRepository.save(measure);
    }

    public OutcomeMeasure saveFromDTO(OutcomeMeasureDTO dto) {
        OutcomeMeasure measure = new OutcomeMeasure();

        // Resolve client
        if (dto.getClientId() != null) {
            measure.setClient(clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + dto.getClientId())));
        }

        // Map measureType — accept instrumentName OR measureType string
        String typeStr = dto.getMeasureType() != null ? dto.getMeasureType() : dto.getInstrumentName();
        if (typeStr != null) {
            try {
                // Normalize common names
                String normalized = typeStr.toUpperCase().replace("-", "_").replace(" ", "_");
                if (normalized.contains("PHQ")) normalized = "PHQ_9";
                else if (normalized.contains("GAD")) normalized = "GAD_7";
                else normalized = "OTHER";
                measure.setMeasureType(MeasureType.valueOf(normalized));
            } catch (IllegalArgumentException e) {
                measure.setMeasureType(MeasureType.OTHER);
            }
        } else {
            measure.setMeasureType(MeasureType.OTHER);
        }

        // Map score — accept score OR totalScore
        Integer score = dto.getTotalScore() != null ? dto.getTotalScore() : dto.getScore();
        if (score == null && dto.getScoreDouble() != null) score = dto.getScoreDouble().intValue();
        measure.setTotalScore(score);

        // Map date — accept assessmentDate OR administrationDate
        LocalDate date = dto.getAdministrationDate() != null ? dto.getAdministrationDate() : dto.getAssessmentDate();
        if (date == null) date = LocalDate.now();
        measure.setAdministrationDate(date);

        // Map severity
        if (dto.getSeverityLevel() != null) {
            try {
                measure.setSeverityLevel(SeverityLevel.valueOf(dto.getSeverityLevel().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // compute from score if possible
                computeSeverity(measure);
            }
        } else {
            computeSeverity(measure);
        }

        return outcomeMeasureRepository.save(measure);
    }

    private void computeSeverity(OutcomeMeasure measure) {
        if (measure.getTotalScore() == null || measure.getMeasureType() == null) return;
        int s = measure.getTotalScore();
        if (measure.getMeasureType() == MeasureType.PHQ_9) {
            if (s <= 4) measure.setSeverityLevel(SeverityLevel.MINIMAL);
            else if (s <= 9) measure.setSeverityLevel(SeverityLevel.MILD);
            else if (s <= 14) measure.setSeverityLevel(SeverityLevel.MODERATE);
            else if (s <= 19) measure.setSeverityLevel(SeverityLevel.MODERATELY_SEVERE);
            else measure.setSeverityLevel(SeverityLevel.SEVERE);
        } else if (measure.getMeasureType() == MeasureType.GAD_7) {
            if (s <= 4) measure.setSeverityLevel(SeverityLevel.MINIMAL);
            else if (s <= 9) measure.setSeverityLevel(SeverityLevel.MILD);
            else if (s <= 14) measure.setSeverityLevel(SeverityLevel.MODERATE);
            else measure.setSeverityLevel(SeverityLevel.SEVERE);
        }
    }

    public List<OutcomeMeasure> getOutcomeMeasures() {
        return outcomeMeasureRepository.findAll();
    }

    public OutcomeMeasure getOutcomeMeasureById(Long id) {
        return outcomeMeasureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OutcomeMeasure not found with id: " + id));
    }

    public Double calculateProgress(Long clientId) {
        List<OutcomeMeasure> measures = outcomeMeasureRepository.findAll();
        if (measures.isEmpty()) return 0.0;
        double totalScore = 0.0;
        int count = 0;
        for (OutcomeMeasure m : measures) {
            if (m.getClient() != null && m.getClient().getId().equals(clientId) && m.getClinicalScore() != null) {
                totalScore += m.getClinicalScore();
                count++;
            }
        }
        return count > 0 ? totalScore / count : 0.0;
    }

    public void deleteOutcomeMeasure(Long id) {
        if (!outcomeMeasureRepository.existsById(id)) {
            throw new ResourceNotFoundException("OutcomeMeasure not found with id: " + id);
        }
        outcomeMeasureRepository.deleteById(id);
    }
}
