/**
 * @file RescorlaWagner.js
 * @description Core engine for the Rescorla-Wagner (1972) conditioning model.
 * This class handles the mathematical updates of associative strengths between CS and US.
 */

export default class RescorlaWagner {
  /**
   * Initializes the engine with empty associations and default US parameters.
   */
  constructor() {
    /** @type {Object.<string, number>} Current associative strength (V) for each stimulus ID. */
    this.associations = {};
    
    /** @type {Object.<string, {alpha: number}>} Stimuli metadata, specifically salience (alpha). */
    this.stimuli = {};
    
    /** @type {{beta: number, lambda: number}} Unconditioned Stimulus parameters (learning rate and asymptote). */
    this.us = { beta: 0.1, lambda: 1.0 };
  }

  /**
   * Registers a new Conditioned Stimulus (CS) into the system.
   * @param {string} id - Unique identifier for the stimulus (e.g., 'tone', 'light').
   * @param {number} [alpha=0.5] - Stimulus salience (0 to 1). Higher values lead to faster conditioning.
   */
  registerStimulus(id, alpha = 0.5) {
    this.stimuli[id] = { alpha };
    this.associations[id] = 0;
  }

  /**
   * Updates the global Unconditioned Stimulus (US) parameters.
   * @param {number} beta - Learning rate dependent on the properties of the US.
   * @param {number} lambda - The maximum associative strength that the US can support.
   */
  updateUS(beta, lambda) {
    this.us.beta = beta;
    this.us.lambda = lambda;
  }

  /**
   * Calculates a single learning trial update.
   * Applied Formula: ΔV = alpha * beta * (lambda - Vtotal)
   * @param {string[]} presentStimuliIds - Array of IDs of the stimuli present in the current trial.
   * @returns {{Vtotal: number, associations: Object}} The state of the model after the trial update.
   */
  calculateTrial(presentStimuliIds) {
    // Vtotal is the aggregate associative strength of all stimuli present in the trial
    const Vtotal = presentStimuliIds.reduce(
      (sum, id) => sum + (this.associations[id] || 0), 
      0
    );

    presentStimuliIds.forEach(id => {
      const alpha = this.stimuli[id]?.alpha || 0;
      
      // Calculate change in associative strength (ΔV)
      const deltaV = alpha * this.us.beta * (this.us.lambda - Vtotal);
      
      // Update cumulative strength (V = V + ΔV)
      this.associations[id] = (this.associations[id] || 0) + deltaV;
    });

    return { 
      Vtotal, 
      associations: { ...this.associations } 
    };
  }
}