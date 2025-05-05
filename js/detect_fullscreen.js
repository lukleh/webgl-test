/**
 * Fullscreen detection and toggle utility
 */
(function() {
  'use strict';

  /**
   * Checks if fullscreen is enabled in the browser
   * @returns {boolean} True if fullscreen is enabled
   */
  function fullscreenEnabled() {
    return document.fullscreenEnabled ||
           document.mozFullScreenEnabled ||
           document.webkitFullscreenEnabled;
  }

  /**
   * Checks if the browser is currently in fullscreen mode
   * @returns {boolean} True if in fullscreen mode
   */
  function isFullscreen() {
    return document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement;
  }

  /**
   * Toggles fullscreen mode
   */
  function toggleFullScreen() {
    const el = document.body;

    if (!isFullscreen()) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  // Add to global namespace
  window.LL = window.LL || {};
  window.LL.fullscreen = {
    isEnabled: fullscreenEnabled,
    isFullscreen: isFullscreen,
    toggle: toggleFullScreen
  };
})();
