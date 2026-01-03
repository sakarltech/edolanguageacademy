import { describe, it, expect } from 'vitest';
import { validatePhoneNumber, getPhoneNumberLength, generateOTP } from './_core/otp';

describe('Phone Verification System', () => {
  describe('OTP Generation', () => {
    it('should generate a 6-digit OTP code', () => {
      const otp = generateOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate unique OTP codes', () => {
      const otp1 = generateOTP();
      const otp2 = generateOTP();
      const otp3 = generateOTP();
      
      // While theoretically they could be the same, probability is extremely low
      const uniqueOTPs = new Set([otp1, otp2, otp3]);
      expect(uniqueOTPs.size).toBeGreaterThan(1);
    });
  });

  describe('Phone Number Length Validation', () => {
    it('should return correct length for Nigeria (+234)', () => {
      const { min, max } = getPhoneNumberLength('+234');
      expect(min).toBe(10);
      expect(max).toBe(10);
    });

    it('should return correct length for UK (+44)', () => {
      const { min, max } = getPhoneNumberLength('+44');
      expect(min).toBe(10);
      expect(max).toBe(10);
    });

    it('should return correct length for US/Canada (+1)', () => {
      const { min, max } = getPhoneNumberLength('+1');
      expect(min).toBe(10);
      expect(max).toBe(10);
    });

    it('should return correct length for South Africa (+27)', () => {
      const { min, max } = getPhoneNumberLength('+27');
      expect(min).toBe(9);
      expect(max).toBe(9);
    });

    it('should return default range for unknown country codes', () => {
      const { min, max } = getPhoneNumberLength('+999');
      expect(min).toBe(8);
      expect(max).toBe(15);
    });
  });

  describe('Phone Number Format Validation', () => {
    it('should validate correct Nigerian phone number', () => {
      const result = validatePhoneNumber('+234', '8012345678');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate correct UK phone number', () => {
      const result = validatePhoneNumber('+44', '7911123456');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate correct US phone number', () => {
      const result = validatePhoneNumber('+1', '2025551234');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject phone number with letters', () => {
      const result = validatePhoneNumber('+234', '801234ABC8');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Phone number must contain only digits');
    });

    it('should accept phone number with special characters (cleaned)', () => {
      // The validation function cleans dashes, spaces, and parentheses before validation
      const result = validatePhoneNumber('+234', '8012-345-678');
      expect(result.valid).toBe(true); // 8012345678 = 10 digits, valid for Nigeria
    });

    it('should reject phone number that is too short', () => {
      const result = validatePhoneNumber('+234', '801234');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be 10 digits');
    });

    it('should reject phone number that is too long', () => {
      const result = validatePhoneNumber('+234', '80123456789012');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be 10 digits');
    });

    it('should accept phone number with spaces (cleaned)', () => {
      const result = validatePhoneNumber('+234', '801 234 5678');
      expect(result.valid).toBe(true);
    });

    it('should accept phone number with dashes (cleaned)', () => {
      const result = validatePhoneNumber('+1', '202-555-1234');
      expect(result.valid).toBe(true);
    });

    it('should accept phone number with parentheses (cleaned)', () => {
      const result = validatePhoneNumber('+1', '(202) 555-1234');
      expect(result.valid).toBe(true);
    });
  });

  describe('Country-Specific Validation', () => {
    it('should validate South African 9-digit number', () => {
      const result = validatePhoneNumber('+27', '821234567');
      expect(result.valid).toBe(true);
    });

    it('should reject South African 10-digit number', () => {
      const result = validatePhoneNumber('+27', '8212345678');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be 9 digits');
    });

    it('should validate Kenyan 9-digit number', () => {
      const result = validatePhoneNumber('+254', '712345678');
      expect(result.valid).toBe(true);
    });

    it('should validate Ghanaian 9-digit number', () => {
      const result = validatePhoneNumber('+233', '241234567');
      expect(result.valid).toBe(true);
    });

    it('should validate Indian 10-digit number', () => {
      const result = validatePhoneNumber('+91', '9876543210');
      expect(result.valid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty phone number', () => {
      const result = validatePhoneNumber('+234', '');
      expect(result.valid).toBe(false);
    });

    it('should handle whitespace-only phone number', () => {
      const result = validatePhoneNumber('+234', '   ');
      expect(result.valid).toBe(false);
    });

    it('should handle phone number with only special characters', () => {
      const result = validatePhoneNumber('+234', '---()---');
      expect(result.valid).toBe(false);
    });

    it('should handle very long phone number', () => {
      const result = validatePhoneNumber('+234', '12345678901234567890');
      expect(result.valid).toBe(false);
    });

    it('should handle phone number starting with zero', () => {
      const result = validatePhoneNumber('+234', '0801234567');
      expect(result.valid).toBe(true); // 10 digits, valid for Nigeria
    });
  });

  describe('International Format Support', () => {
    it('should validate phone numbers from multiple countries', () => {
      const testCases = [
        { country: '+234', number: '8012345678', expected: true }, // Nigeria
        { country: '+44', number: '7911123456', expected: true },  // UK
        { country: '+1', number: '2025551234', expected: true },   // US
        { country: '+91', number: '9876543210', expected: true },  // India
        { country: '+27', number: '821234567', expected: true },   // South Africa
        { country: '+254', number: '712345678', expected: true },  // Kenya
        { country: '+233', number: '241234567', expected: true },  // Ghana
        { country: '+237', number: '671234567', expected: true },  // Cameroon
      ];

      testCases.forEach(({ country, number, expected }) => {
        const result = validatePhoneNumber(country, number);
        expect(result.valid).toBe(expected);
      });
    });
  });
});
