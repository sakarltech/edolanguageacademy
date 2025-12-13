/**
 * Timezone conversion utilities for level-based class schedule
 * 
 * Class Times (GMT):
 * - Beginner: 5pm GMT
 * - Intermediary: 6pm GMT
 * - Proficient: 7pm GMT
 */

export type CourseLevel = 'beginner' | 'intermediary' | 'proficient';

export interface ClassTime {
  level: CourseLevel;
  gmtHour: number; // 24-hour format
  displayName: string;
}

export interface TimezoneConversion {
  timezone: string;
  abbreviation: string;
  time: string; // formatted time string like "5:00 PM"
  offset: string; // like "GMT+1"
}

// Class times in GMT
export const CLASS_TIMES: Record<CourseLevel, ClassTime> = {
  beginner: {
    level: 'beginner',
    gmtHour: 17, // 5pm GMT
    displayName: 'Beginner Class',
  },
  intermediary: {
    level: 'intermediary',
    gmtHour: 18, // 6pm GMT
    displayName: 'Intermediary Class',
  },
  proficient: {
    level: 'proficient',
    gmtHour: 19, // 7pm GMT
    displayName: 'Proficient Class',
  },
};

/**
 * Convert GMT hour to time in different timezones
 */
export function convertGMTToTimezones(gmtHour: number): TimezoneConversion[] {
  // Create a date object for today at the specified GMT hour
  const now = new Date();
  const gmtDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), gmtHour, 0, 0));

  const timezones = [
    { name: 'United Kingdom', tz: 'Europe/London', abbr: 'GMT' },
    { name: 'Nigeria', tz: 'Africa/Lagos', abbr: 'WAT' },
    { name: 'Central Europe', tz: 'Europe/Paris', abbr: 'CET' },
    { name: 'US Central', tz: 'America/Chicago', abbr: 'CST' },
    { name: 'US Eastern', tz: 'America/New_York', abbr: 'EST' },
    { name: 'US Pacific', tz: 'America/Los_Angeles', abbr: 'PST' },
  ];

  return timezones.map(({ name, tz, abbr }) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const time = formatter.format(gmtDate);

    // Calculate offset
    const offsetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    });
    const parts = offsetFormatter.formatToParts(gmtDate);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    const offset = offsetPart ? offsetPart.value : abbr;

    return {
      timezone: name,
      abbreviation: abbr,
      time,
      offset,
    };
  });
}

/**
 * Get all timezone conversions for a specific course level
 */
export function getClassTimeConversions(level: CourseLevel): {
  classTime: ClassTime;
  conversions: TimezoneConversion[];
} {
  const classTime = CLASS_TIMES[level];
  const conversions = convertGMTToTimezones(classTime.gmtHour);
  
  return {
    classTime,
    conversions,
  };
}

/**
 * Format class time for display
 */
export function formatClassTime(gmtHour: number): string {
  const hour12 = gmtHour > 12 ? gmtHour - 12 : gmtHour;
  const period = gmtHour >= 12 ? 'PM' : 'AM';
  return `${hour12}:00 ${period} GMT`;
}

/**
 * Get all class times with their timezone conversions
 */
export function getAllClassTimes(): Array<{
  level: CourseLevel;
  classTime: ClassTime;
  conversions: TimezoneConversion[];
}> {
  return Object.keys(CLASS_TIMES).map(level => {
    const courseLevel = level as CourseLevel;
    return {
      level: courseLevel,
      ...getClassTimeConversions(courseLevel),
    };
  });
}
