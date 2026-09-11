package com.mhtsts.service;

import com.mhtsts.entity.SessionNote;
import com.mhtsts.entity.enums.NoteFormat;
import com.mhtsts.repository.SessionNoteRepository;
import com.mhtsts.repository.UserRepository;
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
public class SessionNoteServiceTest {

    @Mock
    private SessionNoteRepository sessionNoteRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionNoteService sessionNoteService;

    private SessionNote sampleNote;

    @BeforeEach
    public void setUp() {
        sampleNote = new SessionNote();
        sampleNote.setId(1L);
        sampleNote.setNoteFormat(NoteFormat.SOAP);
        sampleNote.setNoteContent("Test Content");
        sampleNote.setCptCode("90834");
        sampleNote.setSessionDurationMinutes(50);
    }

    @Test
    public void testSaveSessionNote() {
        when(sessionNoteRepository.save(any(SessionNote.class))).thenReturn(sampleNote);

        SessionNote result = sessionNoteService.createSessionNote(sampleNote);

        assertNotNull(result);
        assertEquals(NoteFormat.SOAP, result.getNoteFormat());
        verify(sessionNoteRepository, times(1)).save(any(SessionNote.class));
    }

    @Test
    public void testSignSessionNote() {
        when(sessionNoteRepository.findById(1L)).thenReturn(Optional.of(sampleNote));
        when(sessionNoteRepository.save(any(SessionNote.class))).thenReturn(sampleNote);

        SessionNote signed = sessionNoteService.therapistSignSessionNote(1L, 10L);

        assertNotNull(signed);
        assertTrue(signed.getIsSigned());
    }
}
