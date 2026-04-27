/**
 * @file Rat.js
 * @description The main controller that integrates Classical, Operant, and Behavioral engines.
 */

import RescorlaWagner from './RescorlaWagner.js';
import OperantEngine from './OperantEngine.js';
import BehaviorEngine from './BehaviorEngine.js';

export default class Rat {
  constructor() {
    this.classical = new RescorlaWagner();
    this.operant = new OperantEngine('FR', 1); // Default FR-1
    this.behavior = new BehaviorEngine();
    
    // Initializing standard stimuli
    this.classical.registerStimulus('bar', 0.5);
    this.classical.registerStimulus('magazine_sound', 0.8);
  }

  /**
   * Main simulation step.
   * @param {number} virtualTimeMs - Current simulation clock.
   * @returns {Object} The action taken and if it was reinforced.
   */
  nextStep(virtualTimeMs) {
    // 1. Rat decides what to do based on its current brain state
    const action = this.behavior.selectBehavior();
    let reinforced = false;

    // 2. If the action is a Bar Press, we check the Operant Engine
    if (action === 'barPress') {
      reinforced = this.operant.processResponse(virtualTimeMs);
      
      if (reinforced) {
        // 3. Learning: If reinforced, we update the Classical engine
        // The rat associates the 'bar' and 'magazine_sound' with food (lambda=1)
        this.classical.calculateTrial(['bar', 'magazine_sound']);
        
        // 4. Feedback: Update behavior weights based on new associative strength
        const strength = this.classical.associations['bar'];
        this.behavior.updateWeight('barPress', 5 + (strength * 100));
      }
    }

    return { action, reinforced };
  }
}