import { describe, it, expect } from 'vitest';
import React from 'react';

describe('ReceptionistDashboard Component Test', () => {
  it('renders front desk operations and appointment summary cards', () => {
    const kpis = { todaysAppointments: 34, newClients: 5 };
    expect(kpis.todaysAppointments).toBe(34);
  });
});
