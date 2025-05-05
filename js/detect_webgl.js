/**
 * WebGL detection utility
 */
(function() {
  'use strict';

  /**
   * Checks if the browser supports WebGL and returns detailed information
   * @returns {Object} Information about WebGL support
   */
  function detectWebGL() {
    const canvas = document.createElement('canvas');
    const result = {
      webgl1: false,
      webgl2: false,
      supported: false,
      rendererInfo: null,
      contextAttributes: null
    };
    
    let gl1 = null;
    let gl2 = null;

    // Try WebGL 2.0 first
    try {
      gl2 = canvas.getContext("webgl2");
      if (gl2) {
        result.webgl2 = true;
        result.supported = true;
        
        // Get renderer information
        const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          result.rendererInfo = {
            vendor: gl2.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          };
        }
        
        // Get context attributes
        result.contextAttributes = gl2.getContextAttributes();
        return result;
      }
    } catch (e) {
      // Failed to get WebGL 2.0 context
    }

    // Fall back to WebGL 1.0
    try {
      gl1 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl1) {
        result.webgl1 = true;
        result.supported = true;
        
        // Get renderer information
        const debugInfo = gl1.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          result.rendererInfo = {
            vendor: gl1.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl1.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          };
        }
        
        // Get context attributes
        result.contextAttributes = gl1.getContextAttributes();
      }
    } catch (e) {
      // Failed to get WebGL 1.0 context
    }

    // Check if WebGLRenderingContext exists in window
    if (!result.supported && "WebGLRenderingContext" in window) {
      result.supported = true;
    }

    return result;
  }

  /**
   * Legacy function that checks if the browser supports any WebGL
   * @returns {boolean} True if WebGL is supported, false otherwise
   */
  function webglCapable() {
    return detectWebGL().supported;
  }
  // Add to global namespace
  window.LL = window.LL || {};
  window.LL.webglCapable = webglCapable;
  window.LL.detectWebGL = detectWebGL;
})();

