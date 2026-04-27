/**
 * @file RatIntegration.test.js
 * @description Integration test to ensure the rat learns over time.
 */

import Rat from '../../src/core/Rat';

describe('Rat Integration - Learning Validation', () => {
  
  test('should increase bar press frequency after successful reinforcement', () => {
    const rat = new Rat();
    const STEPS = 500;
    
    let earlyBarPresses = 0;
    let lateBarPresses = 0;

    // First 100 steps: Baseline
    for(let i = 0; i < 100; i++) {
      if(rat.nextStep(i * 100).action === 'barPress') earlyBarPresses++;
    }

    // Simulate 400 more steps to allow learning to stabilize
    for(let i = 100; i < STEPS; i++) {
      const result = rat.nextStep(i * 100);
      if(i > 400 && result.action === 'barPress') lateBarPresses++;
    }

    // The rat should be pressing the bar significantly more at the end
    expect(lateBarPresses).toBeGreaterThan(earlyBarPresses);
  });
});