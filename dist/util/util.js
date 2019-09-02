"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotate = rotate;
exports.stringifyPoints = stringifyPoints;
exports.getEquilateralTriangleFromCentroid = getEquilateralTriangleFromCentroid;
exports.tupdif = tupdif;
exports.rangeeq = rangeeq;
exports.logicalAndOver = logicalAndOver;
exports.logicalOrOver = logicalOrOver;
exports.rangeIntersection = rangeIntersection;
exports.zip = zip;
exports.scaleRangeToBox = scaleRangeToBox;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function rotate(cx, cy, x, y, deg) {
  /*
  Rotatate the point (x,y) around the origin (cx,cy) 
  by some angle (degrees)
  */
  var rad = Math.PI / 180 * deg,
      cos = Math.cos(rad),
      sin = Math.sin(rad),
      nx = cos * (x - cx) + sin * (y - cy) + cx,
      ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
}

function stringifyPoints(points) {
  /*
  Array of points [[x1,x2], ..., etc.] => string representation for svg 'points' property 
  */
  return points.reduce(function (acc, cur) {
    return "".concat(acc).concat(cur[0], ",").concat(cur[1], " ");
  }, '');
}

function getEquilateralTriangleFromCentroid(centroid, s, o) {
  /*
  returns an equilateral triangle (defined as [[x1,y1], ..., etc.]) 
  s is the distance from the geometric centroid to each of the vertices 
  o is the orientation of the triangle (1 is UP, 0 is DOWN) 
  */
  var x = centroid.x,
      y = centroid.y;

  if (o == 0) {
    //triangle points up if there was no change 
    o = 1;
  }

  var so = s * o;
  var dv = so / 2;
  var dh = so / 2 * Math.sqrt(3);
  return [[x, y + so], [x - dh, y - dv], [x + dh, y - dv]];
}

function tupdif(tup) {
  return tup[1] - tup[0];
}

function rangeeq(arr1, arr2) {
  return arr1[0] === arr2[0] && arr1[1] === arr2[1];
}

function logicalAndOver(arr) {
  return arr.reduce(function (acc, cur) {
    return acc && cur;
  }, true);
}

function logicalOrOver(arr) {
  return arr.reduce(function (acc, cur) {
    return acc || cur;
  }, false);
}

function rangeIntersection(ar, br) {
  /*
  Determines if two intervals overlap. If the intervals overlap we return 
  an array [oStart, oEnd]. If not, we return an empty array. 
  */
  var _ar = _slicedToArray(ar, 2),
      a0 = _ar[0],
      a1 = _ar[1];

  var _br = _slicedToArray(br, 2),
      b0 = _br[0],
      b1 = _br[1];

  var intersection = b0 <= a1 ? [b0, a1] : a0 <= b1 ? [a0, b1] : [];
  var didIntersect = intersection.length == 2;
  return didIntersect, intersection;
}

function zip(a, b) {
  var zipped = [];

  for (var i = 0; i < a.length; i++) {
    zipped.push([a[i], b[i]]);
  }

  return zipped;
}

function scaleRangeToBox(xRange, yRange, xScale, yScale) {
  /*
  Scale a d3 scale object to (optionally) specified ranges 
  */
  if (xScale) xScale.range(xRange);
  if (yScale) yScale.range(yRange);
  return {
    xScale: xScale,
    yScale: yScale
  };
}