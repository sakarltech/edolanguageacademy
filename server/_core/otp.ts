import twilio from 'twilio';
import { ENV } from './env';

// Initialize Twilio client
let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!twilioClient && ENV.twilioAccountSid && ENV.twilioAuthToken) {
    twilioClient = twilio(ENV.twilioAccountSid, ENV.twilioAuthToken);
  }
  return twilioClient;
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP via SMS using Twilio
 * @param countryCode - Country code with + prefix (e.g., "+234")
 * @param phoneNumber - Phone number without country code
 * @param otpCode - The OTP code to send
 * @returns Promise<boolean> - true if sent successfully, false otherwise
 */
export async function sendOTP(
  countryCode: string,
  phoneNumber: string,
  otpCode: string
): Promise<{ success: boolean; error?: string }> {
  const client = getTwilioClient();
  
  if (!client) {
    console.warn('[OTP] Twilio not configured - skipping SMS send');
    console.log(`[OTP] Would send code ${otpCode} to ${countryCode}${phoneNumber}`);
    return { success: false, error: 'SMS service not configured' };
  }

  if (!ENV.twilioPhoneNumber) {
    console.warn('[OTP] Twilio phone number not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    
    await client.messages.create({
      body: `Your Edo Language Academy verification code is: ${otpCode}. This code expires in 10 minutes.`,
      from: ENV.twilioPhoneNumber,
      to: fullPhoneNumber,
    });

    console.log(`[OTP] SMS sent successfully to ${fullPhoneNumber}`);
    return { success: true };
  } catch (error) {
    console.error('[OTP] Failed to send SMS:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send SMS' 
    };
  }
}

/**
 * Validate phone number format based on country code
 * Returns the expected length for the phone number (without country code)
 */
export function getPhoneNumberLength(countryCode: string): { min: number; max: number } {
  const lengths: Record<string, { min: number; max: number }> = {
    '+234': { min: 10, max: 10 }, // Nigeria
    '+44': { min: 10, max: 10 },  // UK
    '+1': { min: 10, max: 10 },   // US/Canada
    '+91': { min: 10, max: 10 },  // India
    '+27': { min: 9, max: 9 },    // South Africa
    '+254': { min: 9, max: 9 },   // Kenya
    '+233': { min: 9, max: 9 },   // Ghana
    '+237': { min: 9, max: 9 },   // Cameroon
  };

  return lengths[countryCode] || { min: 8, max: 15 }; // Default range for unknown countries
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(countryCode: string, phoneNumber: string): {
  valid: boolean;
  error?: string;
} {
  // Remove any spaces, dashes, or parentheses
  const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '');
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    return { valid: false, error: 'Phone number must contain only digits' };
  }

  // Check length based on country code
  const { min, max } = getPhoneNumberLength(countryCode);
  if (cleanNumber.length < min || cleanNumber.length > max) {
    return { 
      valid: false, 
      error: `Phone number must be ${min === max ? min : `${min}-${max}`} digits for ${countryCode}` 
    };
  }

  return { valid: true };
}
