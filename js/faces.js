/**
 * Face detection and camera utilities
 */

// Preserve existing global objects in case they're accessed from other scripts
if (typeof window.LL === 'undefined') {
  window.LL = {};
}

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
    // Set video properties for better texture compatibility
    this.video.width = 512;  // Power of 2 for better WebGL texture compatibility
    this.video.height = 512; // Power of 2 for better WebGL texture compatibility
    this.video.autoplay = true;
    this.video.playsInline = true; // Important for mobile
    this.video.muted = true; // Needed for autoplay in some browsers
    this.video.crossOrigin = "anonymous"; // Handle cross-origin issues
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

    // Ensure video plays when metadata is loaded
    this.video.onloadedmetadata = () => {
      // Try to play the video
      const playPromise = this.video.play();

      // Handle play promise (required for newer browsers)
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Video play error:', error);
          // Auto-play was prevented, try with user interaction
          console.log('Autoplay prevented. Click to play video.');
        });
      }
    };
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
window.LL.Face = Face;
window.LL.run_faces = run_faces;

// Export for module usage
export { Face, run_faces };
