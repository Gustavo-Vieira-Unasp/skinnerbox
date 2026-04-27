/**
 * @file OperantEngine.js
 * @description Manages reinforcement schedules including time-based intervals.
 */

export default class OperantEngine {
  /**
   * @param {string} type - Schedule type: 'FR', 'VR', 'FI', 'VI'.
   * @param {number} value - The requirement (count for Ratio, seconds for Interval).
   */
  constructor(type = 'FR', value = 1) {
    this.type = type;
    this.value = value;
    this.responseCount = 0;
    
    /** @type {number} Virtual timestamp of the last reinforcement in milliseconds. */
    this.lastReinforcementTime = 0;
    
    /** @type {boolean} For interval schedules, indicates if the reward is "armed". */
    this.isArmed = false;

    /** @type {number} Current randomized target. */
    this.currentTarget = value;
  }

  /**
   * Updates the engine's internal timer. Should be called on every simulation tick.
   * @param {number} virtualTimeMs - The current time within the simulation.
   */
  update(virtualTimeMs) {
    if (this.type === 'FI' || this.type === 'VI') {
      const elapsed = (virtualTimeMs - this.lastReinforcementTime) / 1000;
      if (elapsed >= this.currentTarget) {
        this.isArmed = true;
      }
    }
  }

  /**
   * Evaluates a behavioral response (e.g., bar press).
   * @param {number} virtualTimeMs - Current simulation time.
   * @returns {boolean} True if food is delivered.
   */
  processResponse(virtualTimeMs) {
    let shouldReinforce = false;

    if (this.type === 'FR' || this.type === 'VR') {
      this.responseCount++;
      if (this.responseCount >= this.currentTarget) {
        shouldReinforce = true;
        this.responseCount = 0;
        if (this.type === 'VR') {
          this.currentTarget = Math.max(1, Math.floor(this.value * (0.5 + Math.random())));
        }
      }
    } else if ((this.type === 'FI' || this.type === 'VI') && this.isArmed) {
      shouldReinforce = true;
      this.isArmed = false;
      this.lastReinforcementTime = virtualTimeMs;
      if (this.type === 'VI') {
        this.currentTarget = Math.max(1, this.value * (0.5 + Math.random()));
      }
    }

    return shouldReinforce;
  }
}