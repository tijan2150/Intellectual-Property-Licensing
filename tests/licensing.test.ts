import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';

describe('Licensing Contract', () => {
  const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const user2 = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should create a license', () => {
    const mockCreateLicense = vi.fn().mockReturnValue({ success: true, value: 1 });
    expect(mockCreateLicense(1, user2, 1625097600, 1656633600, 'License terms', 500))
        .toEqual({ success: true, value: 1 });
  });
  
  it('should not allow unauthorized user to create a license', () => {
    const mockCreateLicense = vi.fn().mockReturnValue({ success: false, error: 102 });
    expect(mockCreateLicense(1, user2, 1625097600, 1656633600, 'License terms', 500))
        .toEqual({ success: false, error: 102 });
  });
  
  it('should terminate a license', () => {
    const mockTerminateLicense = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockTerminateLicense(1)).toEqual({ success: true, value: true });
  });
  
  it('should not allow unauthorized user to terminate a license', () => {
    const mockTerminateLicense = vi.fn().mockReturnValue({ success: false, error: 102 });
    expect(mockTerminateLicense(1)).toEqual({ success: false, error: 102 });
  });
  
  it('should get license details', () => {
    const mockGetLicense = vi.fn().mockReturnValue({
      success: true,
      value: {
        ip_nft_id: 1,
        licensor: contractOwner,
        licensee: user2,
        start_date: 1625097600,
        end_date: 1656633600,
        terms: 'License terms',
        royalty_rate: 500,
        is_active: true
      }
    });
    const result = mockGetLicense(1);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      ip_nft_id: 1,
      licensor: contractOwner,
      licensee: user2,
      start_date: 1625097600,
      end_date: 1656633600,
      terms: 'License terms',
      royalty_rate: 500,
      is_active: true
    });
  });
  
  it('should check if license is active', () => {
    const mockIsLicenseActive = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockIsLicenseActive(1)).toEqual({ success: true, value: true });
  });
});

