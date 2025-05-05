/**
 * WebGL detection utility
 */
(function() {
  'use strict';

  /**
   * Checks if the browser supports WebGL
   * @returns {boolean} True if WebGL is supported, false otherwise
   */
  function webglCapable() {
    const canvas = document.createElement('canvas');
    let gl = null;

    try {
      gl = canvas.getContext("webgl");
    } catch (error) {
      gl = null;
    }

    if (gl === null) {
      try {
        gl = canvas.getContext("experimental-webgl");
      } catch (error) {
        gl = null;
      }
    }

    if (gl) {
      return true;
    } else if ("WebGLRenderingContext" in window) {
      return true;
    } else {
      return false;
    }
  }

  // Add to global namespace
  window.LL = window.LL || {};
  window.LL.webglCapable = webglCapable;
})();
