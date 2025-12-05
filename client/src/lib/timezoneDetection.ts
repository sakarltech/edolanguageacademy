/**
 * Timezone detection utility for recommending class time slots
 * Based on visitor's browser timezone
 */

export type TimeSlotId = 'gmt' | 'cst';

/**
 * Detects the visitor's timezone and returns the recommended class time slot
 * @returns 'gmt' for European/African timezones, 'cst' for American timezones
 */
export function getRecommendedTimeSlot(): TimeSlotId {
  try {
    // Get the visitor's timezone from browser
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Get UTC offset in hours
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60; // Negative because getTimezoneOffset returns opposite sign
    
    // Determine recommended slot based on timezone
    // GMT slot (11 AM GMT) is better for:
    // - UK/Ireland (UTC+0 to UTC+1)
    // - Western/Central Europe (UTC+1 to UTC+2)
    // - West/Central Africa including Nigeria (UTC+0 to UTC+2)
    // - Eastern Europe (UTC+2 to UTC+3)
    
    // CST slot (11 AM CST = UTC-6) is better for:
    // - North America (UTC-8 to UTC-4)
    // - Central/South America
    
    // Check if timezone string contains American regions
    const americanRegions = [
      'America/',
      'US/',
      'Canada/',
      'Mexico/',
      'Pacific/',
      'Mountain/',
      'Central/',
      'Eastern/',
      'Atlantic/'
    ];
    
    const isAmericanTimezone = americanRegions.some(region => 
      timezone.includes(region)
    );
    
    if (isAmericanTimezone) {
      return 'cst';
    }
    
    // For other timezones, use offset to determine
    // If offset is between -8 and -3 (Americas), recommend CST
    if (offsetHours >= -8 && offsetHours <= -3) {
      return 'cst';
    }
    
    // Default to GMT for Europe, Africa, Asia, and other regions
    return 'gmt';
    
  } catch (error) {
    console.error('Error detecting timezone:', error);
    // Default to GMT if detection fails
    return 'gmt';
  }
}

/**
 * Gets a human-readable description of why this slot is recommended
 */
export function getRecommendationReason(slotId: TimeSlotId): string {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  if (slotId === 'gmt') {
    return `Based on your location (${timezone}), this time slot works best for you`;
  } else {
    return `Based on your location (${timezone}), this time slot works best for you`;
  }
}

/**
 * Checks if a given slot ID matches the recommended slot
 */
export function isRecommendedSlot(slotId: TimeSlotId): boolean {
  return slotId === getRecommendedTimeSlot();
}
