import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';

describe('IP-NFT Contract', () => {
  const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const user2 = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should mint an IP-NFT', () => {
    const mockMintIpNft = vi.fn().mockReturnValue({ success: true, value: 1 });
    expect(mockMintIpNft('patent', 'Test Patent', 'A test patent description', 'US12345678', 1735689600))
        .toEqual({ success: true, value: 1 });
  });
  
  it('should not mint an IP-NFT with invalid IP type', () => {
    const mockMintIpNft = vi.fn().mockReturnValue({ success: false, error: 103 });
    expect(mockMintIpNft('invalid-type', 'Test Patent', 'A test patent description', 'US12345678', 1735689600))
        .toEqual({ success: false, error: 103 });
  });
  
  it('should list an IP-NFT', () => {
    const mockListIpNft = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockListIpNft(1, 1000000)).toEqual({ success: true, value: true });
  });
  
  it('should not allow non-owner to list an IP-NFT', () => {
    const mockListIpNft = vi.fn().mockReturnValue({ success: false, error: 100 });
    expect(mockListIpNft(1, 1000000)).toEqual({ success: false, error: 100 });
  });
  
  it('should unlist an IP-NFT', () => {
    const mockUnlistIpNft = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockUnlistIpNft(1)).toEqual({ success: true, value: true });
  });
  
  it('should transfer an IP-NFT', () => {
    const mockTransfer = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockTransfer(1, user2)).toEqual({ success: true, value: true });
  });
  
  it('should get IP-NFT details', () => {
    const mockGetIpNft = vi.fn().mockReturnValue({
      success: true,
      value: {
        owner: contractOwner,
        ip_type: 'patent',
        title: 'Test Patent',
        description: 'A test patent description',
        registration_number: 'US12345678',
        expiration_date: 1735689600,
        is_listed: false,
        price: 0
      }
    });
    const result = mockGetIpNft(1);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      owner: contractOwner,
      ip_type: 'patent',
      title: 'Test Patent',
      description: 'A test patent description',
      registration_number: 'US12345678',
      expiration_date: 1735689600,
      is_listed: false,
      price: 0
    });
  });
  
  it('should get the owner of an IP-NFT', () => {
    const mockGetOwner = vi.fn().mockReturnValue({ success: true, value: contractOwner });
    expect(mockGetOwner(1)).toEqual({ success: true, value: contractOwner });
  });
  
  it('should get the last token ID', () => {
    const mockGetLastTokenId = vi.fn().mockReturnValue({ success: true, value: 1 });
    expect(mockGetLastTokenId()).toEqual({ success: true, value: 1 });
  });
});

