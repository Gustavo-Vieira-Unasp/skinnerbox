/**
 * @file OperantEngine.test.js
 * @description Validates that reinforcement schedules trigger at the correct intervals.
 */

import OperantEngine from '../../src/core/OperantEngine';

describe('Operant Engine - Fixed Ratio (FR) Validation', () => {
  
  test('FR-1 should reinforce every single response', () => {
    const schedule = new OperantEngine('FR', 1);
    
    expect(schedule.processResponse()).toBe(true);
    expect(schedule.processResponse()).toBe(true);
  });

  test('FR-5 should reinforce only on the 5th response', () => {
    const schedule = new OperantEngine('FR', 5);
    
    // First 4 responses: no food
    for (let i = 0; i < 4; i++) {
      expect(schedule.processResponse()).toBe(false);
    }
    
    // 5th response: food!
    expect(schedule.processResponse()).toBe(true);
    
    // Counter should reset: 6th response: no food
    expect(schedule.processResponse()).toBe(false);
  });

  test('FI-10 should reinforce only after 10 virtual seconds have passed', () => {
    const schedule = new OperantEngine('FI', 10);
    let virtualTime = 0;

    // 5 seconds pass...
    virtualTime = 5000;
    schedule.update(virtualTime);
    expect(schedule.processResponse(virtualTime)).toBe(false);

    // 11 seconds pass...
    virtualTime = 11000;
    schedule.update(virtualTime);
    
    // First press after 10s should work
    expect(schedule.processResponse(virtualTime)).toBe(true);
    
    // Immediate second press should NOT work (timer reset)
    expect(schedule.processResponse(virtualTime)).toBe(false);
  });

});