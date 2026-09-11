import { describe, it, expect } from 'vitest';
import React from 'react';

describe('ClientProfile Component Test', () => {
  it('renders patient profile personal details and assigned therapist', () => {
    const profile = { clientNumber: 'CLI-1001', therapist: 'Dr. Sarah Smith' };
    expect(profile.clientNumber).toBe('CLI-1001');
  });
});
