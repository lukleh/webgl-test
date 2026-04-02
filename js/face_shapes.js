/**
 * WebGL Face Shapes Demo
 */
import * as THREE from 'three';
import { Face } from './faces.js';

// Preserve existing global objects in case they're accessed from other scripts
if (typeof window.LL === 'undefined') {
  window.LL = {};
}

var Cube, CylinderGeometry, Object3Dcamera, Space, Sphere, SpinningObject;

// Helper function for inheritance
function extend(child, parent) {
  for (var key in parent) {
    if ({}.hasOwnProperty.call(parent, key)) child[key] = parent[key];
  }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
}

Space = (function() {
  function Space(container) {
    var light,
      _this = this;
    this.container = container;
    this.last_time = null;
    this.objects = [];
    this.scene = new THREE.Scene;
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true 
    });
    // Configure renderer with the current Three.js color-space API.
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, 1, 4000);
    this.camera.position.set(0, 2, 7);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    // No lights needed since MeshBasicMaterial doesn't require lighting
    
    window.addEventListener('resize', function() {
      return _this.onWindowResize();
    });
    this.start_stats();
  }

  Space.prototype.onWindowResize = function() {
    var h, w;
    if (this.isFullscreen) {
      w = window.innerWidth;
      h = window.innerHeight;
    } else {
      w = this.container.offsetWidth;
      h = this.container.offsetHeight;
    }
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    return this.renderer.setSize(w, h);
  };

  Space.prototype.start_stats = function() {
    this.stats = new Stats;
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    return document.body.appendChild(this.stats.domElement);
  };

  Space.prototype.update = function(t_step, timestamp) {
    var o, _i, _len, _ref, _results;
    _ref = this.objects;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      o = _ref[_i];
      _results.push(o.update(t_step, timestamp));
    }
    return _results;
  };

  Space.prototype.run = function(timestamp) {
    var t_step,
      _this = this;
    if (!this.last_time) {
      this.last_time = timestamp;
    }
    t_step = timestamp - this.last_time;
    if (t_step > 0) {
      this.update(t_step, timestamp);
      this.render();
      this.last_time = timestamp;
      this.stats.update();
    } else {
      this.render();
    }
    return requestAnimationFrame(function(par) {
      return _this.run(par);
    });
  };

  Space.prototype.add = function(obj) {
    this.scene.add(obj.object3D);
    obj.attachScene(this);
    return this.objects.push(obj);
  };

  Space.prototype.render = function() {
    return this.renderer.render(this.scene, this.camera);
  };

  return Space;

})();

Object3Dcamera = (function() {
  function Object3Dcamera(video) {
    this.video = video;
    // Create texture with proper settings for video
    this.videoTexture = new THREE.VideoTexture(this.video);
    // Use modern texture settings (THREE.RGBFormat is deprecated)
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Use MeshBasicMaterial for video to avoid lighting issues
    this.material = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.DoubleSide, // Show texture on both sides
      color: 0xffffff // Ensure no tint is applied
    });
  }

  Object3Dcamera.prototype.attachScene = function(scene) {
    return this.scene = scene;
  };

  Object3Dcamera.prototype.update = function(t_step, timestamp) {
    // VideoTexture automatically updates itself, no need to set needsUpdate
    // Just ensure video is ready
    return (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA);
  };

  Object3Dcamera.prototype.setObject3D = function(m) {
    return this.object3D = m;
  };

  Object3Dcamera.prototype.setPosition = function(pos) {
    var x, y, z;
    this.setPos = pos;
    x = pos[0], y = pos[1], z = pos[2];
    this.object3D.position.x = x;
    this.object3D.position.y = y;
    this.object3D.position.z = z;
    return this;
  };

  return Object3Dcamera;

})();

SpinningObject = (function(_super) {
  extend(SpinningObject, _super);

  function SpinningObject(video) {
    var speed;
    SpinningObject.__super__.constructor.call(this, video);
    speed = 0.003;
    this.rotXspeed = speed;
    this.rotYspeed = speed;
    this.rotZspeed = speed;
  }

  SpinningObject.prototype.update = function(t_step, timestamp) {
    var step;
    step = t_step / 16.7;
    if (this.rotX) {
      this.object3D.rotation.x -= step * this.rotXspeed;
    }
    if (this.rotY) {
      this.object3D.rotation.y -= step * this.rotYspeed;
    }
    if (this.rotZ) {
      this.object3D.rotation.z -= step * this.rotZspeed;
    }
    return SpinningObject.__super__.update.call(this, t_step, timestamp);
  };

  SpinningObject.prototype.allowedRotations = function(rot) {
    this.rotX = rot[0], this.rotY = rot[1], this.rotZ = rot[2];
    return this;
  };

  return SpinningObject;

})(Object3Dcamera);

Cube = (function(_super) {
  extend(Cube, _super);

  function Cube(video, dim) {
    var geometry, mesh;
    if (dim == null) {
      dim = 1;
    }
    Cube.__super__.constructor.call(this, video);
    // Replace deprecated CubeGeometry with BoxGeometry
    geometry = new THREE.BoxGeometry(dim, dim, dim);
    mesh = new THREE.Mesh(geometry, this.material);
    this.setObject3D(mesh);
    this.object3D.rotation.y = Math.PI / 4;
  }

  return Cube;

})(SpinningObject);

Sphere = (function(_super) {
  extend(Sphere, _super);

  function Sphere(video, radius, widthSegments, heightSegments) {
    var geometry, mesh;
    if (radius == null) {
      radius = 1;
    }
    if (widthSegments == null) {
      widthSegments = 30;
    }
    if (heightSegments == null) {
      heightSegments = 30;
    }
    Sphere.__super__.constructor.call(this, video);
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    mesh = new THREE.Mesh(geometry, this.material);
    this.setObject3D(mesh);
    this.object3D.rotation.y = 0;
  }

  return Sphere;

})(SpinningObject);

CylinderGeometry = (function(_super) {
  extend(CylinderGeometry, _super);

  function CylinderGeometry(video, radiusTop, radiusBottom, height, radiusSegments) {
    var geometry, mesh;
    if (radiusTop == null) {
      radiusTop = 1;
    }
    if (radiusBottom == null) {
      radiusBottom = 1;
    }
    if (height == null) {
      height = 2;
    }
    if (radiusSegments == null) {
      radiusSegments = 20;
    }
    CylinderGeometry.__super__.constructor.call(this, video);
    geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments);
    mesh = new THREE.Mesh(geometry, this.material);
    this.setObject3D(mesh);
    this.object3D.rotation.y -= Math.PI / 2;
  }

  return CylinderGeometry;

})(SpinningObject);

window.LL.run_face_shapes = function(container) {
  var dim, f, m;
  m = new Space(container);
  f = new Face().autoCreateVideo().doFace();
  m.add(new Cube(f.video, dim = 1.5).setPosition([-2.5, 0, 0]).allowedRotations([false, true, false]));
  m.add(new Sphere(f.video).allowedRotations([false, true, false]));
  m.add(new CylinderGeometry(f.video).setPosition([2.5, 0, 0]).allowedRotations([false, true, false]));
  return m.run(window.performance.now());
};
