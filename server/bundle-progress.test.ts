import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../server/db';
import { enrollments, studentProgress } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

describe('Bundle Progress Tracking', () => {
  let testEnrollmentId: number;
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create a test user ID (simulating an existing user)
    testUserId = 999999;

    // Create a test bundle enrollment
    const result = await db.insert(enrollments).values({
      userId: testUserId,
      learnerName: 'Test Bundle Student',
      email: 'test-bundle@example.com',
      countryCode: '+1',
      phone: '2345678900',
      courseLevel: 'bundle',
      timeSlot: '5PM_GMT',
      status: 'paid',
    });

    testEnrollmentId = result[0].insertId;
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    await db.delete(studentProgress).where(eq(studentProgress.enrollmentId, testEnrollmentId));
    await db.delete(enrollments).where(eq(enrollments.id, testEnrollmentId));
  });

  it('should create 3 separate progress records for bundle enrollment', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Create progress records for all 3 levels
    const levels = ['beginner', 'intermediary', 'proficient'] as const;
    
    for (const level of levels) {
      await db.insert(studentProgress).values({
        enrollmentId: testEnrollmentId,
        userId: testUserId,
        courseLevel: level,
        currentModule: 1,
        completedModules: '',
        currentWeek: 1,
        completedWeeks: '',
        attendanceCount: 0,
      });
    }

    // Verify all 3 records were created
    const progressRecords = await db
      .select()
      .from(studentProgress)
      .where(eq(studentProgress.enrollmentId, testEnrollmentId));

    expect(progressRecords).toHaveLength(3);
    expect(progressRecords.map(p => p.courseLevel).sort()).toEqual(['beginner', 'intermediary', 'proficient']);
  });

  it('should track module completion separately for each level', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Mark module 1 as complete for beginner level
    const beginnerProgress = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'beginner')
        )
      )
      .limit(1);

    await db
      .update(studentProgress)
      .set({
        completedModules: '1',
        currentModule: 1,
      })
      .where(eq(studentProgress.id, beginnerProgress[0].id));

    // Verify beginner has module 1 completed
    const updatedBeginner = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'beginner')
        )
      )
      .limit(1);

    expect(updatedBeginner[0].completedModules).toBe('1');

    // Verify intermediary still has no completed modules
    const intermediaryProgress = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'intermediary')
        )
      )
      .limit(1);

    expect(intermediaryProgress[0].completedModules).toBe('');
  });

  it('should calculate completion percentage correctly for each level', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Complete 2 out of 4 modules for beginner
    const beginnerProgress = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'beginner')
        )
      )
      .limit(1);

    await db
      .update(studentProgress)
      .set({
        completedModules: '1,2',
        currentModule: 2,
      })
      .where(eq(studentProgress.id, beginnerProgress[0].id));

    // Fetch and verify
    const updated = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'beginner')
        )
      )
      .limit(1);

    const completedModules = updated[0].completedModules
      ? updated[0].completedModules.split(',').map(Number)
      : [];
    const completionPercentage = (completedModules.length / 4) * 100;

    expect(completionPercentage).toBe(50);
  });

  it('should allow querying progress by courseLevel', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Query only beginner progress
    const beginnerOnly = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'beginner')
        )
      );

    expect(beginnerOnly).toHaveLength(1);
    expect(beginnerOnly[0].courseLevel).toBe('beginner');

    // Query only intermediary progress
    const intermediaryOnly = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'intermediary')
        )
      );

    expect(intermediaryOnly).toHaveLength(1);
    expect(intermediaryOnly[0].courseLevel).toBe('intermediary');
  });

  it('should support level unlocking logic based on completion', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Get all progress records
    const allProgress = await db
      .select()
      .from(studentProgress)
      .where(eq(studentProgress.enrollmentId, testEnrollmentId));

    const progressData = allProgress.map(p => {
      const completedModules = p.completedModules ? p.completedModules.split(',').map(Number) : [];
      return {
        level: p.courseLevel,
        completionPercentage: (completedModules.length / 4) * 100,
      };
    });

    // Sort by level order
    const levelOrder = { beginner: 0, intermediary: 1, proficient: 2 };
    progressData.sort((a, b) => levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]);

    // Apply unlocking logic
    const unlockedLevels = progressData.map((p, index) => {
      if (index === 0) return true; // Beginner always unlocked
      return progressData[index - 1].completionPercentage === 100;
    });

    // Beginner should be unlocked
    expect(unlockedLevels[0]).toBe(true);
    
    // Intermediary should be locked (beginner not 100% complete)
    expect(unlockedLevels[1]).toBe(false);
    
    // Proficient should be locked
    expect(unlockedLevels[2]).toBe(false);
  });

  it('should unlock intermediary when beginner is 100% complete', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Complete all 4 modules for beginner
    const beginnerProgress = await db
      .select()
      .from(studentProgress)
      .where(
        and(
          eq(studentProgress.enrollmentId, testEnrollmentId),
          eq(studentProgress.courseLevel, 'beginner')
        )
      )
      .limit(1);

    await db
      .update(studentProgress)
      .set({
        completedModules: '1,2,3,4',
        currentModule: 4,
      })
      .where(eq(studentProgress.id, beginnerProgress[0].id));

    // Get all progress records
    const allProgress = await db
      .select()
      .from(studentProgress)
      .where(eq(studentProgress.enrollmentId, testEnrollmentId));

    const progressData = allProgress.map(p => {
      const completedModules = p.completedModules ? p.completedModules.split(',').map(Number) : [];
      return {
        level: p.courseLevel,
        completionPercentage: (completedModules.length / 4) * 100,
      };
    });

    // Sort by level order
    const levelOrder = { beginner: 0, intermediary: 1, proficient: 2 };
    progressData.sort((a, b) => levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]);

    // Verify beginner is 100% complete
    expect(progressData[0].completionPercentage).toBe(100);

    // Apply unlocking logic
    const intermediaryUnlocked = progressData[0].completionPercentage === 100;
    expect(intermediaryUnlocked).toBe(true);
  });
});
