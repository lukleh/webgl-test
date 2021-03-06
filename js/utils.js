// Generated by CoffeeScript 1.6.3
(function() {
  var makeCombinations, makeGrid, printout;

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
    var i, s, x, zeros, _i, _ref, _results;
    _results = [];
    for (x = _i = 0, _ref = Math.pow(2, size); 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      s = x.toString(2);
      zeros = new Array(size - s.length + 1).join('0');
      _results.push((function() {
        var _j, _len, _ref1, _results1;
        _ref1 = zeros + s;
        _results1 = [];
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          i = _ref1[_j];
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

}).call(this);
