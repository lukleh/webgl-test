/**
 * Utility functions for WebGL demos
 */
(function() {
  'use strict';

  /**
   * Creates a grid of 3D coordinates
   * @param {number} spacX - X spacing between points (default: 1)
   * @param {number} spacY - Y spacing between points (default: 1)
   * @param {number} spacZ - Z spacing between points (default: 1)
   * @param {number} countX - Number of points in X direction (default: 1)
   * @param {number} countY - Number of points in Y direction (default: 1)
   * @param {number} countZ - Number of points in Z direction (default: 1)
   * @param {boolean} center - Whether to center the grid (default: true)
   * @returns {Array} Array of [x,y,z] coordinate arrays
   */
  function makeGrid(spacX = 1, spacY = 1, spacZ = 1, countX = 1, countY = 1, countZ = 1, center = true) {
    const result = [];
    const centerX = center ? spacX * (countX - 1) / 2 : 0;
    const centerY = center ? spacY * (countY - 1) / 2 : 0;
    const centerZ = center ? spacZ * (countZ - 1) / 2 : 0;

    for (let x = 0; x < countX; x++) {
      for (let y = 0; y < countY; y++) {
        for (let z = 0; z < countZ; z++) {
          result.push([
            x * spacX - centerX,
            y * spacY - centerY,
            z * spacZ - centerZ
          ]);
        }
      }
    }

    return result;
  }

  /**
   * Creates all possible combinations of true/false values for a given size
   * @param {number} size - The size of combinations to generate
   * @returns {Array} Array of arrays containing boolean values
   */
  function makeCombinations(size) {
    const results = [];
    const totalCombinations = Math.pow(2, size);

    for (let x = 0; x < totalCombinations; x++) {
      let s = x.toString(2);
      const zeros = '0'.repeat(size - s.length);
      const binaryString = zeros + s;

      const combination = [];
      for (let i = 0; i < binaryString.length; i++) {
        combination.push(binaryString[i] === '1');
      }

      results.push(combination);
    }

    return results;
  }

  /**
   * Prints an object as JSON to the console
   * @param {Object} o - The object to print
   */
  function printout(o) {
    console.log(JSON.stringify(o));
  }
  // Add to global namespace
  window.LL = window.LL || {};
  window.LL.utils = {
    makeGrid: makeGrid,
    makeCombinations: makeCombinations,
    printout: printout
  };
})();

