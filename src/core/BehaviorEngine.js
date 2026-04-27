/**
 * @file BehaviorEngine.js
 * @description Manages the rat's behavioral repertoire and stochastic selection.
 */

export default class BehaviorEngine {
  constructor() {
    /** * @type {Object.<string, number>} 
     * Internal weights for each behavior. Baseline values.
     */
    this.weights = {
      sniff: 40,
      groom: 20,
      explore: 25,
      rest: 10,
      barPress: 5 // Initial very low probability
    };
  }

  /**
   * Adjusts the weight of a specific behavior based on learning.
   * @param {string} id - Behavior ID.
   * @param {number} newWeight - New weight value.
   */
  updateWeight(id, newWeight) {
    if (this.weights[id] !== undefined) {
      this.weights[id] = Math.max(0.1, newWeight);
    }
  }

  /**
   * Selects the next behavior based on current weights.
   * Uses a cumulative probability algorithm.
   * @returns {string} The ID of the selected behavior.
   */
  selectBehavior() {
    const totalWeight = Object.values(this.weights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (const [behavior, weight] of Object.entries(this.weights)) {
      if (random < weight) {
        return behavior;
      }
      random -= weight;
    }
    return 'rest';
  }
}