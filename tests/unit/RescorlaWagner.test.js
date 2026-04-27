/**
 * @file RescorlaWagner.test.js
 * Unit tests for validating behavioral phenomena.
 */

import RescorlaWagner from '../../src/core/RescorlaWagner';

describe('Rescorla-Wagner Engine Validation', () => {
  let engine;

  beforeEach(() => {
    engine = new RescorlaWagner();
  });

  test('should demonstrate an asymptotic acquisition curve', () => {
    const STIM_ID = 'light';
    engine.registerStimulus(STIM_ID, 0.5); 
    engine.updateUS(0.1, 1.0);

    const res1 = engine.calculateTrial([STIM_ID]);
    const res2 = engine.calculateTrial([STIM_ID]);

    expect(res1.associations[STIM_ID]).toBeGreaterThan(0);
    expect(res2.associations[STIM_ID]).toBeGreaterThan(res1.associations[STIM_ID]);
  });

  /**
   * Test Case: Extinction
   * Verification: Association strength should decrease when US is absent (lambda = 0).
   */
  test('should demonstrate extinction when reinforcement is removed', () => {
    const STIM_ID = 'tone';
    engine.registerStimulus(STIM_ID, 0.5);
    
    // Phase 1: Acquisition
    engine.updateUS(0.1, 1.0);
    for(let i = 0; i < 20; i++) engine.calculateTrial([STIM_ID]);
    const strengthAfterAcquisition = engine.associations[STIM_ID];

    // Phase 2: Extinction (US value becomes 0)
    // We increase the number of trials from 20 to 100 to ensure convergence
    engine.updateUS(0.1, 0.0); 
    for(let i = 0; i < 100; i++) engine.calculateTrial([STIM_ID]);
    
    expect(engine.associations[STIM_ID]).toBeLessThan(strengthAfterAcquisition);
    expect(engine.associations[STIM_ID]).toBeCloseTo(0, 1); // Should be near 0
  });

  /**
   * Test Case: Blocking Effect (Kamin, 1969)
   * Verification: A previously learned stimulus (A) prevents learning of a new stimulus (B)
   * when presented together.
   */
  test('should demonstrate the blocking effect', () => {
    engine.registerStimulus('CS_A', 0.5);
    engine.registerStimulus('CS_B', 0.5);
    engine.updateUS(0.1, 1.0);

    // Phase 1: Train CS_A to asymptote
    for(let i = 0; i < 50; i++) engine.calculateTrial(['CS_A']);
    const strengthA = engine.associations['CS_A'];

    // Phase 2: Compound training (CS_A + CS_B)
    for(let i = 0; i < 20; i++) engine.calculateTrial(['CS_A', 'CS_B']);

    // CS_B should have failed to gain significant strength because Vtotal was already near lambda
    expect(engine.associations['CS_B']).toBeLessThan(0.1); 
    expect(strengthA).toBeGreaterThan(0.9);
  });
});