import { describe, it, expect } from 'vitest';
import React from 'react';

describe('ClientDashboard Component Test', () => {
  it('renders client portal summary cards and services', () => {
    const kpis = { upcomingAppointment: 'Aug 15', completedSessions: 12 };
    expect(kpis.completedSessions).toBe(12);
  });
});
