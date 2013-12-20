// Generated by CoffeeScript 1.6.3
var Cube, CubeRot, CubeSpin, Object3D, Space, makeCombinations, makeGrid, printout, run, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Space = (function() {
  function Space(container) {
    var _this = this;
    this.container = container;
    this.last_time = null;
    this.objects = [];
    this.scene = new THREE.Scene;
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(45, this.container.offsetWidth / this.container.offsetHeight, 1, 4000);
    this.camera.position.set(0, 0, 10);
    this.light = new THREE.DirectionalLight(0xffffff, 1.5);
    this.light.position.set(0, 0, 1);
    this.scene.add(this.light);
    this.light2 = new THREE.DirectionalLight(0xFFFF99, 1.5);
    this.light2.position.set(0, 0, -1);
    this.scene.add(this.light2);
    this.light3 = new THREE.DirectionalLight(0xFF66CC, 1.5);
    this.light3.position.set(1, 0, 0);
    this.scene.add(this.light3);
    this.light4 = new THREE.DirectionalLight(0x00FF33, 1.5);
    this.light4.position.set(-1, 0, 0);
    this.scene.add(this.light4);
    this.light5 = new THREE.DirectionalLight(0x0033FF, 1.5);
    this.light5.position.set(0, 1, 0);
    this.scene.add(this.light5);
    this.light6 = new THREE.DirectionalLight(0xFF3300, 1.5);
    this.light6.position.set(0, -1, 0);
    this.scene.add(this.light6);
    window.addEventListener('resize', function() {
      return _this.onWindowResize();
    });
    this.container.addEventListener('click', function(evt) {
      return _this.toggleFullScreen(evt);
    });
    this.start_stats();
  }

  Space.prototype.isFullscreen = function() {
    return document.webkitIsFullScreen || document.mozFullScreen;
  };

  Space.prototype.toggleFullScreen = function(et) {
    var el;
    el = et.target;
    if (!this.isFullscreen()) {
      if (el.requestFullscreen) {
        return el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        return el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        return el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        return document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        return document.webkitCancelFullScreen();
      }
    }
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
    var o, t, _i, _len, _ref, _results;
    t = new Date().getTime();
    this.camera.position.x = 0 + Math.sin(t * 0.0002 + Math.PI / 2) * 10;
    this.camera.position.z = 0 + Math.sin(t * 0.0002) * 10;
    this.camera.position.y = 5;
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
    if (!timestamp) {
      timestamp = 0;
    }
    if (!this.last_time) {
      this.last_time = timestamp;
    }
    t_step = timestamp - this.last_time;
    this.update(t_step, timestamp);
    this.render();
    this.last_time = timestamp;
    this.stats.update();
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

Object3D = (function() {
  function Object3D() {}

  Object3D.prototype.attachScene = function(scene) {
    return this.scene = scene;
  };

  Object3D.prototype.update = function(t_step, timestamp) {
    return t_step;
  };

  Object3D.prototype.setObject3D = function(m) {
    return this.object3D = m;
  };

  Object3D.prototype.setPosition = function(pos) {
    var x, y, z;
    this.setPos = pos;
    x = pos[0], y = pos[1], z = pos[2];
    this.object3D.position.x = x;
    this.object3D.position.y = y;
    this.object3D.position.z = z;
    return this;
  };

  return Object3D;

})();

Cube = (function(_super) {
  __extends(Cube, _super);

  function Cube() {
    var geometry, material, materials, mesh;
    materials = this.makeMaterials();
    material = new THREE.MeshFaceMaterial(materials);
    geometry = new THREE.CubeGeometry(1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    this.setObject3D(mesh);
  }

  Cube.prototype.makeMaterials = function() {
    var i, _i, _results;
    _results = [];
    for (i = _i = 0; _i <= 5; i = ++_i) {
      _results.push(new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture("img/Numbers-" + i + "-icon.png")
      }));
    }
    return _results;
  };

  Cube.prototype.update = function(t_step, timestamp) {
    var step;
    step = t_step / 16.7;
    this.object3D.rotation.y -= step * 0.01;
    this.object3D.rotation.x -= step * 0.01;
    return this.object3D.rotation.z -= step * 0.01;
  };

  return Cube;

})(Object3D);

CubeSpin = (function(_super) {
  __extends(CubeSpin, _super);

  function CubeSpin() {
    _ref = CubeSpin.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  CubeSpin.prototype.allowedRotations = function(rot) {
    var x, y, z;
    x = rot[0], y = rot[1], z = rot[2];
    this.rotX = x;
    this.rotY = y;
    this.rotZ = z;
    return this;
  };

  CubeSpin.prototype.update = function(t_step, timestamp) {
    var step;
    step = t_step / 16.7;
    if (this.rotX) {
      this.object3D.rotation.y -= step * 0.01;
    }
    if (this.rotY) {
      this.object3D.rotation.x -= step * 0.01;
    }
    if (this.rotZ) {
      return this.object3D.rotation.z -= step * 0.01;
    }
  };

  return CubeSpin;

})(Cube);

CubeRot = (function(_super) {
  __extends(CubeRot, _super);

  function CubeRot() {
    this.rotStart = Math.PI * Math.random();
    CubeRot.__super__.constructor.apply(this, arguments);
  }

  CubeRot.prototype.update = function(t_step, timestamp) {
    var t;
    t = new Date().getTime();
    if (this.rotY) {
      this.object3D.position.x = this.setPos[0] + Math.sin(t * 0.0015 + this.rotStart);
    }
    if (this.rotX) {
      this.object3D.position.y = this.setPos[1] + Math.sin(t * 0.0015 + this.rotStart);
    }
    if (this.rotZ) {
      this.object3D.position.z = this.setPos[2] + Math.sin(t * 0.0015 + this.rotStart);
    }
    return CubeRot.__super__.update.call(this, t_step, timestamp);
  };

  return CubeRot;

})(CubeSpin);

makeGrid = function(spacX, spacY, spacZ, countX, countY, countZ, center) {
  var centerX, centerY, centerZ, result, x, y, z, _i, _j, _k;
  if (spacX == null) {
    spacX = 1;
  }
  if (spacY == null) {
    spacY = 1;
  }
  if (spacZ == null) {
    spacZ = 1;
  }
  if (countX == null) {
    countX = 1;
  }
  if (countY == null) {
    countY = 1;
  }
  if (countZ == null) {
    countZ = 1;
  }
  if (center == null) {
    center = true;
  }
  result = [];
  centerX = center ? spacX * (countX - 1) / 2 : 0;
  centerY = center ? spacY * (countY - 1) / 2 : 0;
  centerZ = center ? spacZ * (countZ - 1) / 2 : 0;
  for (x = _i = 0; 0 <= countX ? _i < countX : _i > countX; x = 0 <= countX ? ++_i : --_i) {
    for (y = _j = 0; 0 <= countY ? _j < countY : _j > countY; y = 0 <= countY ? ++_j : --_j) {
      for (z = _k = 0; 0 <= countZ ? _k < countZ : _k > countZ; z = 0 <= countZ ? ++_k : --_k) {
        result.push([x * spacX - centerX, y * spacY - centerY, z * spacZ - centerZ]);
      }
    }
  }
  return result;
};

makeCombinations = function(size) {
  var i, s, x, zeros, _i, _ref1, _results;
  _results = [];
  for (x = _i = 0, _ref1 = Math.pow(2, size); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; x = 0 <= _ref1 ? ++_i : --_i) {
    s = x.toString(2);
    zeros = new Array(size - s.length + 1).join('0');
    _results.push((function() {
      var _j, _len, _ref2, _results1;
      _ref2 = zeros + s;
      _results1 = [];
      for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
        i = _ref2[_j];
        _results1.push(i === '1');
      }
      return _results1;
    })());
  }
  return _results;
};

printout = function(o) {
  return console.log(JSON.stringify(o));
};

run = function(container) {
  var c, countX, countY, gpos, grid, m, rotations, rpos, spacX, spacY, spacZ, _i, _len, _ref1, _ref2;
  m = new Space(container);
  grid = makeGrid(spacX = 3, spacY = 3, spacZ = 0, countX = 4, countY = 2);
  rotations = makeCombinations(3);
  _ref1 = _.zip(grid, rotations);
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    _ref2 = _ref1[_i], gpos = _ref2[0], rpos = _ref2[1];
    c = new CubeRot().setPosition(gpos).allowedRotations(rpos);
    m.add(c);
  }
  return m.run();
};
