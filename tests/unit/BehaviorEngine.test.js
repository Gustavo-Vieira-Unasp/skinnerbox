/**
 * @file BehaviorEngine.test.js
 * @description Validates the stochastic selection and weight adjustment.
 */

import BehaviorEngine from '../../src/core/BehaviorEngine';

describe('Behavior Engine - Stochastic Selection', () => {
  
  test('should increase frequency of a behavior when its weight is updated', () => {
    const engine = new BehaviorEngine();
    const SAMPLES = 1000;
    
    // Count baseline for barPress
    let baselineCount = 0;
    for(let i = 0; i < SAMPLES; i++) {
      if(engine.selectBehavior() === 'barPress') baselineCount++;
    }

    // Drastic update (Learning simulation)
    engine.updateWeight('barPress', 500); 

    let learnedCount = 0;
    for(let i = 0; i < SAMPLES; i++) {
      if(engine.selectBehavior() === 'barPress') learnedCount++;
    }

    expect(learnedCount).toBeGreaterThan(baselineCount);
    // With weight 500 against ~100 total of others, it should be the dominant behavior
    expect(learnedCount).toBeGreaterThan(SAMPLES * 0.7); 
  });
});