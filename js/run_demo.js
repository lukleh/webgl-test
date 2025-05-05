/**
 * Demo runner utility
 */
(function() {
  'use strict';

  /**
   * Runs a WebGL demo with fullscreen toggle and WebGL fallback
   * @param {Function} fn - The demo function to run
   */
  function runDemo(fn) {
    // Set up fullscreen toggle
    document.querySelector("#hud p").addEventListener('click', function(evt) {
      if (screenfull && screenfull.isEnabled) {
        try {
          // Get the container element to make fullscreen
          const container = document.getElementById("container");
          screenfull.toggle(container);
        } catch (error) {
          console.error("Fullscreen error:", error);
        }
      }
    });

    // Check WebGL capability and run demo or show fallback
    if (LL.webglCapable()) {
      fn(document.getElementById("container"));
    } else {
      document.getElementById("container").style.display = "none";
      document.getElementById("hud").style.display = "none";
      document.getElementById("webglfallback").style.display = "block";
    }
  }

  // Add to global namespace
  window.LL = window.LL || {};
  window.LL.runDemo = runDemo;
})();
