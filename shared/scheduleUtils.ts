/**
 * Schedule and cohort management utilities
 * Handles automatic rolling cohorts and timezone conversions
 */

export interface TimeSlot {
  id: string;
  time: string;
  timezone: string;
  suitableFor: string[];
  conversions: {
    uk: string;
    nigeria: string;
    centralEurope: string;
    northAmerica: string;
  };
}

export interface Cohort {
  startDate: Date;
  endDate: Date;
  spotsRemaining: number;
  status: "upcoming" | "in-progress" | "completed";
}

/**
 * Two main time slots for classes
 */
export const TIME_SLOTS: TimeSlot[] = [
  {
    id: "gmt",
    time: "11:00 AM",
    timezone: "GMT",
    suitableFor: ["UK", "Nigeria", "Europe"],
    conversions: {
      uk: "11:00 AM GMT",
      nigeria: "12:00 PM WAT (West Africa Time)",
      centralEurope: "12:00 PM CET (Central European Time)",
      northAmerica: "6:00 AM EST / 3:00 AM PST",
    },
  },
  {
    id: "cst",
    time: "11:00 AM",
    timezone: "CST",
    suitableFor: ["North America"],
    conversions: {
      uk: "5:00 PM GMT",
      nigeria: "6:00 PM WAT (West Africa Time)",
      centralEurope: "6:00 PM CET (Central European Time)",
      northAmerica: "11:00 AM CST / 12:00 PM EST / 9:00 AM PST",
    },
  },
];

/**
 * First cohort start date (December 6, 2025)
 */
const FIRST_COHORT_START = new Date("2025-12-06");

/**
 * Cohort duration in weeks (8 weeks of classes)
 */
const COHORT_DURATION_WEEKS = 8;

/**
 * Christmas/New Year break dates (2 Saturdays: Dec 27, 2025 & Jan 3, 2026)
 * Classes skip these dates, extending the cohort by 2 weeks
 */
const CHRISTMAS_BREAK_START = new Date("2025-12-27");
const CHRISTMAS_BREAK_END = new Date("2026-01-03");

/**
 * Interval between cohort starts in weeks
 */
const COHORT_INTERVAL_WEEKS = 10;

/**
 * Calculate the next upcoming cohort start date
 * Cohorts start every 10 weeks from the first cohort date
 */
export function getNextCohortStartDate(): Date {
  const now = new Date();
  const firstStart = new Date(FIRST_COHORT_START);
  
  // If we haven't reached the first cohort yet, return it
  if (now < firstStart) {
    return firstStart;
  }
  
  // Calculate how many cohorts have started since the first one
  const daysSinceFirst = Math.floor((now.getTime() - firstStart.getTime()) / (1000 * 60 * 60 * 24));
  const weeksSinceFirst = Math.floor(daysSinceFirst / 7);
  
  // Calculate the next cohort number
  const cohortsCompleted = Math.floor(weeksSinceFirst / COHORT_INTERVAL_WEEKS);
  const nextCohortNumber = cohortsCompleted + 1;
  
  // Calculate the next cohort start date
  const nextCohortStart = new Date(firstStart);
  nextCohortStart.setDate(firstStart.getDate() + (nextCohortNumber * COHORT_INTERVAL_WEEKS * 7));
  
  return nextCohortStart;
}

/**
 * Check if a cohort overlaps with Christmas break
 */
function cohortOverlapsChristmasBreak(startDate: Date): boolean {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (COHORT_DURATION_WEEKS * 7));
  
  // Check if Christmas break falls within the cohort period
  return (
    (startDate <= CHRISTMAS_BREAK_END && endDate >= CHRISTMAS_BREAK_START)
  );
}

/**
 * Get cohort end date based on start date
 * Accounts for 2-week Christmas break if cohort overlaps with it
 */
export function getCohortEndDate(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (COHORT_DURATION_WEEKS * 7));
  
  // If cohort overlaps with Christmas break, add 2 weeks
  if (cohortOverlapsChristmasBreak(startDate)) {
    endDate.setDate(endDate.getDate() + 14); // Add 2 weeks
  }
  
  return endDate;
}

/**
 * Get the upcoming cohort information
 */
export function getUpcomingCohort(): Cohort {
  const startDate = getNextCohortStartDate();
  const endDate = getCohortEndDate(startDate);
  
  return {
    startDate,
    endDate,
    spotsRemaining: Math.floor(Math.random() * 5) + 3, // Random 3-7 spots for "limited availability"
    status: "upcoming",
  };
}

/**
 * Format date for display
 */
export function formatCohortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Get all upcoming cohorts (next 3)
 */
export function getUpcomingCohorts(count: number = 3): Cohort[] {
  const cohorts: Cohort[] = [];
  const firstStart = getNextCohortStartDate();
  
  for (let i = 0; i < count; i++) {
    const startDate = new Date(firstStart);
    startDate.setDate(firstStart.getDate() + (i * COHORT_INTERVAL_WEEKS * 7));
    
    const endDate = getCohortEndDate(startDate);
    
    cohorts.push({
      startDate,
      endDate,
      spotsRemaining: Math.floor(Math.random() * 5) + 3,
      status: "upcoming",
    });
  }
  
  return cohorts;
}
