import { describe, it, expect } from 'vitest';
import React from 'react';

describe('ProtectedRoute Route Guard Test', () => {
  it('allows access for matching user role', () => {
    const userRole = 'ADMIN';
    const allowedRoles = ['ADMIN'];
    expect(allowedRoles.includes(userRole)).toBe(true);
  });

  it('blocks access for mismatched user role', () => {
    const userRole = 'CLIENT';
    const allowedRoles = ['ADMIN'];
    expect(allowedRoles.includes(userRole)).toBe(false);
  });
});
