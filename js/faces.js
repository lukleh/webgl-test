/**
 * Face detection and camera utilities
 */
(function() {
  'use strict';

  /**
   * Face class for handling camera access and video elements
   */
  class Face {
    /**
     * Create a new Face instance
     */
    constructor() {
      // Bind methods to ensure 'this' context
      this.cameraErrorCallback = this.cameraErrorCallback.bind(this);
      this.showCamera = this.showCamera.bind(this);
    }

    /**
     * Set an existing video element
     * @param {HTMLVideoElement} video - The video element to use
     * @returns {Face} The Face instance for chaining
     */
    setVideoElement(video) {
      this.video = video;
      return this;
    }

    /**
     * Create a new video element
     * @returns {Face} The Face instance for chaining
     */
    autoCreateVideo() {
      this.video = document.createElement('video');
      this.video.width = 640;
      this.video.height = 360;
      this.video.autoplay = true;
      return this;
    }

    /**
     * Check if getUserMedia is supported using modern MediaDevices API
     * @returns {boolean} True if getUserMedia is supported
     */
    hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * Handle camera access errors
     * @param {Error} e - The error object
     */
    cameraErrorCallback(e) {
      console.log('Reeeejected!', e);
    }

    /**
     * Display camera feed in the video element
     * @param {MediaStream} localMediaStream - The media stream from getUserMedia
     */
    showCamera(localMediaStream) {
      // Modern approach: directly assign the stream to srcObject instead of using createObjectURL
      if ('srcObject' in this.video) {
        this.video.srcObject = localMediaStream;
      } else {
        // Fallback for older browsers
        try {
          this.video.src = window.URL.createObjectURL(localMediaStream);
        } catch (error) {
          console.error('Error creating object URL:', error);
        }
      }
      this.video.onloadedmetadata = function() {};
    }

    /**
     * Start video capture using the modern MediaDevices API
     * @param {Object} params - Parameters for getUserMedia
     * @param {Function} callback - Success callback
     * @param {Function} errorCallback - Error callback
     */
    startVideo(params, callback, errorCallback) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(params)
          .then(callback)
          .catch(errorCallback);
      } else {
        errorCallback(new Error('getUserMedia is not supported in this browser'));
      }
    }

    /**
     * Initialize face detection
     * @returns {Face} The Face instance for chaining
     */
    doFace() {
      if (this.hasGetUserMedia()) {
        this.startVideo(
          { video: true },
          this.showCamera,
          this.cameraErrorCallback
        );
      } else {
        alert('getUserMedia() is not supported in your browser');
      }
      return this;
    }
  }

  /**
   * Initialize face detection with a video element from the page
   */
  function run_faces() {
    const video = document.querySelector('video');
    new Face().setVideoElement(video).doFace();
  }

  // Add to global namespace
  window.LL = window.LL || {};
  window.LL.Face = Face;
  window.LL.run_faces = run_faces;
})();
