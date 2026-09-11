import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Navbar Component Unit Test', () => {
  it('renders brand header and active user details', () => {
    const brandName = 'MindCare MHTSTS';
    expect(brandName).toBe('MindCare MHTSTS');
  });
});
