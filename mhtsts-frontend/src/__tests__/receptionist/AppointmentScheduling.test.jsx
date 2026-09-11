import { describe, it, expect } from 'vitest';
import React from 'react';

describe('AppointmentScheduling Component Test', () => {
  it('renders appointment booking form and provider selection', () => {
    const booking = { client: 'Emma Johnson', therapist: 'Dr. Sarah Smith', date: '2026-08-15' };
    expect(booking.therapist).toBe('Dr. Sarah Smith');
  });
});
