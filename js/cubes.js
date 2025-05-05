/**
 * WebGL Cubes Demo
 */
(function() {
  'use strict';

  var Cube, Object3D, Space, run_cubes;

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
      var _this = this;
      this.container = container;
      this.last_time = null;
      this.objects = [];
      this.scene = new THREE.Scene;
      this.renderer = new THREE.WebGLRenderer;
      this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMapSoft = true;
      this.container.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, 1, 4000);
      this.camera.position.set(0, 5, 0);
      window.addEventListener('resize', function() {
        return _this.onWindowResize();
      });
      this.start_stats();
    }

    Space.prototype.addToScene = function(o) {
      return this.scene.add(o);
    };

    Space.prototype.addLight = function(x, y, z, color, intensity, castShadow) {
      var d, light;
      if (castShadow == null) {
        castShadow = false;
      }
      light = new THREE.DirectionalLight(color, intensity);
      light.position.set(x, y, z);
      if (castShadow) {
        light.castShadow = true;
        light.shadowCameraNear = 0.01;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;
        d = 10;
        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;
        light.shadowCameraFar = 100;
        light.shadowDarkness = 0.5;
      }
      return this.addToScene(light);
    };

    Space.prototype.onWindowResize = function() {
      var h, w;
      if (this.isFullscreen) {
        w = window.innerWidth;
        h = window.innerHeight;
      } else {
        w = this.container.offsetWidth;
        h = this.container.offsetHeight;
      }
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      return this.camera.updateProjectionMatrix();
    };

    Space.prototype.start_stats = function() {
      this.stats = new Stats;
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      return document.body.appendChild(this.stats.domElement);
    };

    Space.prototype.update = function(t_step, timestamp) {
      var o, sin_speed, _i, _len, _ref, _results;
      sin_speed = timestamp / 1000 / 5;
      this.camera.position.x = Math.sin(sin_speed + Math.PI / 2) * 10;
      this.camera.position.z = Math.sin(sin_speed) * 10;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
      return this.objects.push(obj);
    };

    Space.prototype.render = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    return Space;

  })();

  Object3D = (function() {
    function Object3D() {}

    Object3D.prototype.update = function(t_step, timestamp) {};

    Object3D.prototype.setPosition = function(pos) {
      this.setPos = pos;
      this.object3D.position.x = pos[0];
      this.object3D.position.y = pos[1];
      this.object3D.position.z = pos[2];
      return this;
    };

    return Object3D;

  })();

  Cube = (function(_super) {
    extend(Cube, _super);

    function Cube(space) {
      var geometry, material, materials;
      this.space = space;
      materials = this.makeMaterials();
      material = new THREE.MeshFaceMaterial(materials);
      geometry = new THREE.CubeGeometry(1, 1, 1);
      this.object3D = new THREE.Mesh(geometry, material);
      this.object3D.castShadow = true;
      this.object3D.receiveShadow = true;
      this.rotStart = Math.PI * Math.random();
    }

    Cube.prototype.makeTextureDraw = function(text) {
      var bitmap, g;
      bitmap = document.createElement('canvas');
      g = bitmap.getContext('2d');
      bitmap.width = 100;
      bitmap.height = 100;
      g.fillStyle = '#404040';
      g.fillRect(0, 0, bitmap.width, bitmap.height);
      g.fillStyle = '#FFFFFF';
      g.fillRect(10, 10, 80, 80);
      g.font = 'Bold 80px Arial';
      g.fillStyle = '#202020';
      g.textBaseline = 'middle';
      g.textAlign = 'center';
      g.fillText(text, bitmap.width / 2, bitmap.height / 2);
      return bitmap;
    };

    Cube.prototype.makeMaterials = function() {
      var i, texture, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 5; i = ++_i) {
        texture = new THREE.Texture(this.makeTextureDraw(i.toString()));
        texture.needsUpdate = true;
        texture.anisotropy = this.space.renderer.getMaxAnisotropy();
        _results.push(new THREE.MeshLambertMaterial({
          map: texture
        }));
      }
      return _results;
    };

    Cube.prototype.setRotations = function(rot) {
      this.rotXspeed = rot[0], this.rotYspeed = rot[1], this.rotZspeed = rot[2];
      return this;
    };

    Cube.prototype.update = function(t_step, timestamp) {
      var sin_step, step;
      step = t_step / 16.7;
      sin_step = timestamp / 1000 * 1.5;
      if (this.rotXspeed !== 0) {
        this.object3D.rotation.x -= step * this.rotXspeed;
        this.object3D.position.x = this.setPos[0] + Math.sin(sin_step + this.rotStart);
      }
      if (this.rotYspeed !== 0) {
        this.object3D.rotation.y -= step * this.rotYspeed;
        this.object3D.position.y = this.setPos[1] + Math.sin(sin_step + this.rotStart);
      }
      if (this.rotZspeed !== 0) {
        this.object3D.rotation.z -= step * this.rotZspeed;
        return this.object3D.position.z = this.setPos[2] + Math.sin(sin_step + this.rotStart);
      }
    };

    return Cube;

  })(Object3D);

  // Using utility functions from utils.js

  run_cubes = function(container) {
    var c, castShadow, floorTexture, gpos, grid, plane, r, rot, rotations, s, _i, _len, _ref, _ref1;
    s = new Space(container);
    s.addLight(0, 10, 0, 0xffffff, 1.0, castShadow = true);
    s.addLight(0, 0, 1, 0xFF0000, 1.0);
    s.addLight(0, 0, -1, 0x00FF00, 1.0);
    s.addLight(1, 0, 0, 0x0000FF, 1.0);
    s.addLight(-1, 0, 0, 0xFFFF00, 1.0);
    floorTexture = THREE.ImageUtils.loadTexture("img/tile.jpg");
    floorTexture.anisotropy = s.renderer.getMaxAnisotropy();
    plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15, 1, 1), new THREE.MeshPhongMaterial({
      map: floorTexture
    }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -3.5;
    plane.receiveShadow = true;
    s.addToScene(plane);
    // Use utility functions from utils.js
    grid = LL.utils.makeGrid(3, 3, 0, 4, 2, 1, true);
    rotations = LL.utils.makeCombinations(3);

    // Create a zip function to replace _.zip
    function zip(arrays) {
      return arrays[0].map(function(_, i) {
        return arrays.map(function(array) {
          return array[i];
        });
      });
    }

    // Zip the grid and rotations arrays
    var zipped = zip([grid, rotations]);

    for (_i = 0, _len = zipped.length; _i < _len; _i++) {
      _ref1 = zipped[_i], gpos = _ref1[0], rot = _ref1[1];
      c = new Cube(s).setPosition(gpos).setRotations((function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = rot.length; _j < _len1; _j++) {
          r = rot[_j];
          _results.push(r ? 0.01 : 0);
        }
        return _results;
      })());
      s.add(c);
    }
    return s.run(window.performance.now());
  };

  window.LL = window.LL || {};

  window.LL.run_cubes = run_cubes;

}).call(this);
