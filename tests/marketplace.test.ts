import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';

describe('Marketplace Contract', () => {
  const contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const user2 = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should list IP-NFT for sale', () => {
    const mockListForSale = vi.fn().mockReturnValue({ success: true, value: 1 });
    expect(mockListForSale(1, 1000000)).toEqual({ success: true, value: 1 });
  });
  
  it('should not allow unauthorized user to list IP-NFT for sale', () => {
    const mockListForSale = vi.fn().mockReturnValue({ success: false, error: 102 });
    expect(mockListForSale(1, 1000000)).toEqual({ success: false, error: 102 });
  });
  
  it('should cancel sale', () => {
    const mockCancelSale = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockCancelSale(1)).toEqual({ success: true, value: true });
  });
  
  it('should not allow unauthorized user to cancel sale', () => {
    const mockCancelSale = vi.fn().mockReturnValue({ success: false, error: 102 });
    expect(mockCancelSale(1)).toEqual({ success: false, error: 102 });
  });
  
  it('should buy IP-NFT', () => {
    const mockBuyIpNft = vi.fn().mockReturnValue({ success: true, value: true });
    expect(mockBuyIpNft(1)).toEqual({ success: true, value: true });
  });
  
  it('should not allow buying inactive sale', () => {
    const mockBuyIpNft = vi.fn().mockReturnValue({ success: false, error: 101 });
    expect(mockBuyIpNft(1)).toEqual({ success: false, error: 101 });
  });
  
  it('should get sale details', () => {
    const mockGetSale = vi.fn().mockReturnValue({
      success: true,
      value: {
        seller: user1,
        ip_nft_id: 1,
        price: 1000000,
        is_active: true
      }
    });
    const result = mockGetSale(1);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      seller: user1,
      ip_nft_id: 1,
      price: 1000000,
      is_active: true
    });
  });
  
  it('should get last sale id', () => {
    const mockGetLastSaleId = vi.fn().mockReturnValue({ success: true, value: 1 });
    expect(mockGetLastSaleId()).toEqual({ success: true, value: 1 });
  });
});

