(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cornerArc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _ = require("../");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function describeArc(center, radius, startAngle, endAngle) {
  var start = (0, _.pointOnArc)(center, radius, endAngle);
  var end = (0, _.pointOnArc)(center, radius, startAngle);

  var arcSweep = endAngle - startAngle < 180 ? 0 : 1;

  return ["M", start[0], start[1], "A", radius, radius, 0, arcSweep, 0, end[0], end[1]].join(" ");
}

var arc1 = document.querySelector('#arc1');
var arc2 = document.querySelector('#arc2');
var a = document.querySelector('#arc');

var c1 = document.querySelector('#c1');
var c2 = document.querySelector('#c2');
var c3 = document.querySelector('#c3');
var c4 = document.querySelector('#c4');

var b1 = document.querySelector('#b1');
var b2 = document.querySelector('#b2');

var form = document.querySelector('.controls');

function render() {
  var c = [form['x'].value, form['y'].value].map(parseFloat);
  var radius = parseFloat(form['radius'].value);
  var width = parseFloat(form['width'].value);
  var corner = parseFloat(form['corner'].value);

  var angle = parseFloat(form['angle'].value);
  form['angle-value'].value = angle;

  update(c, radius, 0, angle, width, corner);
}

function updateCircle(circle, c, r) {
  circle.setAttribute('r', r);
  circle.setAttribute('cx', c[0]);
  circle.setAttribute('cy', c[1]);
}

function updateLine(line, p1, p2) {
  line.setAttribute('x1', p1[0]);
  line.setAttribute('y1', p1[1]);
  line.setAttribute('x2', p2[0]);
  line.setAttribute('y2', p2[1]);
}

function update(c, radius, start, angle, width, corner) {
  var outerShift = 360 * (corner / (2 * Math.PI * (radius - corner)));
  var innerShift = 360 * (corner / (2 * Math.PI * (radius - width + corner)));

  var center1 = (0, _.pointOnArc)(c, radius - corner, start + outerShift);
  var center2 = (0, _.pointOnArc)(c, radius - corner, angle - outerShift);
  var center3 = (0, _.pointOnArc)(c, radius - width + corner, start + innerShift);
  var center4 = (0, _.pointOnArc)(c, radius - width + corner, angle - innerShift);

  arc1.setAttribute('d', describeArc(c, radius - corner, start + outerShift, angle - outerShift));
  arc2.setAttribute('d', describeArc(c, radius - width + corner, start + innerShift, angle - innerShift));

  a.setAttribute('d', (0, _2.default)(c, radius, start, angle, width, corner));

  updateCircle(c1, center1, corner);
  updateCircle(c2, center2, corner);
  updateCircle(c3, center3, corner);
  updateCircle(c4, center4, corner);

  updateLine(b1, center1, center3);
  updateLine(b2, center2, center4);
}

render();

form.addEventListener('change', render);

},{"../":2}],2:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var RAD_DEG = Math.PI / 180.0;
var PI2 = 2 * Math.PI;

/**
 * @param  {Array.<Number>} center
 * @param  {Number} R
 * @param  {Number} angle
 * @return {Array.<Number>}
 */
function pointOnArc(center, R, angle) {
  var radians = (angle - 90) * RAD_DEG;

  return [center[0] + R * Math.cos(radians), center[1] + R * Math.sin(radians)];
}

/**
 * @param  {Array.<Number>} center [description]
 * @param  {} R      [description]
 * @param  {[type]} width  [description]
 * @return {[type]}        [description]
 */
function drawCircle(center, R, width) {
  var iR = R - width;

  var _center = _slicedToArray(center, 2);

  var x = _center[0];
  var y = _center[1];


  return ['M', x - R, y, 'A', R, R, 0, 1, 0, x + R, y, 'A', R, R, 0, 1, 0, x - R, y, 'M', x - iR, y, 'A', iR, iR, 0, 1, 0, x + iR, y, 'A', iR, iR, 0, 1, 0, x - iR, y, 'Z'].join(' ');
}

/**
 * Generates arc path
 *
 * @param  {Array.<Number>} center
 * @param  {Number}         R
 * @param  {Number}         start
 * @param  {Number}         end
 * @param  {Number}         w
 * @param  {Number}         cR Corner radius
 *
 * @return {String}
 */
function arc(center, R, start, end, w, cR) {
  if (Math.abs(end - start) === 360) {
    return drawCircle(center, R, w);
  }

  cR = Math.min(w / 2, cR);

  // inner and outer radiuses
  var iR = R - w;
  var iR2 = iR + cR;
  var oR = R - cR;

  // butts corner points
  var oStart = pointOnArc(center, oR, start);
  var oEnd = pointOnArc(center, oR, end);

  var iStart = pointOnArc(center, iR2, start);
  var iEnd = pointOnArc(center, iR2, end);

  var iSection = 360 * (cR / (PI2 * iR));
  var oSection = 360 * (cR / (PI2 * R));

  // arcs endpoints
  var iArcStart = pointOnArc(center, iR, start + iSection);
  var iArcEnd = pointOnArc(center, iR, end - iSection);

  var oArcStart = pointOnArc(center, R, start + oSection);
  var oArcEnd = pointOnArc(center, R, end - oSection);

  var arcSweep = end - start <= 180 ? 0 : 1;

  return [
  // begin path
  "M", oStart[0], oStart[1],
  // outer start corner
  "A", cR, cR, 0, 0, 1, oArcStart[0], oArcStart[1],
  // outer main arc
  "A", R, R, 0, arcSweep, 1, oArcEnd[0], oArcEnd[1],
  // outer end corner
  "A", cR, cR, 0, 0, 1, oEnd[0], oEnd[1],
  // end butt
  "L", iEnd[0], iEnd[1],
  // inner end corner
  "A", cR, cR, 0, 0, 1, iArcEnd[0], iArcEnd[1],
  // inner arc
  "A", iR, iR, 0, arcSweep, 0, iArcStart[0], iArcStart[1],
  // inner start corner
  "A", cR, cR, 0, 0, 1, iStart[0], iStart[1], "Z" // end path
  ].join(' ');
}

module.exports = arc;
module.exports.pointOnArc = pointOnArc;
module.exports.drawCircle = drawCircle;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxTQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkIsTUFBN0IsRUFBcUMsVUFBckMsRUFBaUQsUUFBakQsRUFBMEQ7QUFDeEQsTUFBTSxRQUFRLGtCQUFXLE1BQVgsRUFBbUIsTUFBbkIsRUFBMkIsUUFBM0IsQ0FBZDtBQUNBLE1BQU0sTUFBTSxrQkFBVyxNQUFYLEVBQW1CLE1BQW5CLEVBQTJCLFVBQTNCLENBQVo7O0FBRUEsTUFBSSxXQUFXLFdBQVcsVUFBWCxHQUF3QixHQUF4QixHQUE4QixDQUE5QixHQUFrQyxDQUFqRDs7QUFFQSxTQUFPLENBQ0wsR0FESyxFQUNBLE1BQU0sQ0FBTixDQURBLEVBQ1UsTUFBTSxDQUFOLENBRFYsRUFFTCxHQUZLLEVBRUEsTUFGQSxFQUVRLE1BRlIsRUFFZ0IsQ0FGaEIsRUFFbUIsUUFGbkIsRUFFNkIsQ0FGN0IsRUFFZ0MsSUFBSSxDQUFKLENBRmhDLEVBRXdDLElBQUksQ0FBSixDQUZ4QyxFQUdMLElBSEssQ0FHQSxHQUhBLENBQVA7QUFJRDs7QUFFRCxJQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxJQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxJQUFNLElBQUssU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVg7O0FBRUEsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYOztBQUVB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LENBWlgsRUFZcUIsQ0FackIsRUFZd0IsUUFBUSxDQUFSLENBWnhCLEVBWXNDLFFBQVEsQ0FBUixDQVp0Qzs7QUFjTCxLQWRLLEVBY0EsRUFkQSxFQWNJLEVBZEosRUFjUSxDQWRSLEVBY1csUUFkWCxFQWNxQixDQWRyQixFQWN3QixVQUFVLENBQVYsQ0FkeEIsRUFjc0MsVUFBVSxDQUFWLENBZHRDOztBQWdCTCxLQWhCSyxFQWdCQSxFQWhCQSxFQWdCSSxFQWhCSixFQWdCUSxDQWhCUixFQWdCVyxDQWhCWCxFQWdCcUIsQ0FoQnJCLEVBZ0J3QixPQUFPLENBQVAsQ0FoQnhCLEVBZ0JzQyxPQUFPLENBQVAsQ0FoQnRDLEVBaUJMLEc7QUFqQkssSUFrQkwsSUFsQkssQ0FrQkEsR0FsQkEsQ0FBUDtBQW1CRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsR0FBakI7QUFDQSxPQUFPLE9BQVAsQ0FBZSxVQUFmLEdBQTRCLFVBQTVCO0FBQ0EsT0FBTyxPQUFQLENBQWUsVUFBZixHQUE0QixVQUE1QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgYXJjLCB7IHBvaW50T25BcmMgfSBmcm9tICcuLi8nO1xuXG5mdW5jdGlvbiBkZXNjcmliZUFyYyhjZW50ZXIsIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUpe1xuICBjb25zdCBzdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCByYWRpdXMsIGVuZEFuZ2xlKTtcbiAgY29uc3QgZW5kID0gcG9pbnRPbkFyYyhjZW50ZXIsIHJhZGl1cywgc3RhcnRBbmdsZSk7XG5cbiAgdmFyIGFyY1N3ZWVwID0gZW5kQW5nbGUgLSBzdGFydEFuZ2xlIDwgMTgwID8gMCA6IDE7XG5cbiAgcmV0dXJuIFtcbiAgICBcIk1cIiwgc3RhcnRbMF0sIHN0YXJ0WzFdLFxuICAgIFwiQVwiLCByYWRpdXMsIHJhZGl1cywgMCwgYXJjU3dlZXAsIDAsIGVuZFswXSwgZW5kWzFdXG4gIF0uam9pbihcIiBcIik7XG59XG5cbmNvbnN0IGFyYzEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXJjMScpO1xuY29uc3QgYXJjMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcmMyJyk7XG5jb25zdCBhICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcmMnKTtcblxuY29uc3QgYzEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYzEnKTtcbmNvbnN0IGMyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2MyJyk7XG5jb25zdCBjMyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjMycpO1xuY29uc3QgYzQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYzQnKTtcblxuY29uc3QgYjEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYjEnKTtcbmNvbnN0IGIyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2IyJyk7XG5cbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHMnKTtcblxuZnVuY3Rpb24gcmVuZGVyICgpIHtcbiAgbGV0IGMgPSBbZm9ybVsneCddLnZhbHVlLCBmb3JtWyd5J10udmFsdWVdLm1hcChwYXJzZUZsb2F0KTtcbiAgbGV0IHJhZGl1cyA9IHBhcnNlRmxvYXQoZm9ybVsncmFkaXVzJ10udmFsdWUpO1xuICBsZXQgd2lkdGggID0gcGFyc2VGbG9hdChmb3JtWyd3aWR0aCddLnZhbHVlKTtcbiAgbGV0IGNvcm5lciA9IHBhcnNlRmxvYXQoZm9ybVsnY29ybmVyJ10udmFsdWUpO1xuXG4gIGxldCBhbmdsZSAgPSBwYXJzZUZsb2F0KGZvcm1bJ2FuZ2xlJ10udmFsdWUpO1xuICBmb3JtWydhbmdsZS12YWx1ZSddLnZhbHVlID0gYW5nbGU7XG5cbiAgdXBkYXRlKGMsIHJhZGl1cywgMCwgYW5nbGUsIHdpZHRoLCBjb3JuZXIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDaXJjbGUoY2lyY2xlLCBjLCByKSB7XG4gIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ3InLCByKTtcbiAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3gnLCBjWzBdKTtcbiAgY2lyY2xlLnNldEF0dHJpYnV0ZSgnY3knLCBjWzFdKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluZShsaW5lLCBwMSwgcDIpIHtcbiAgbGluZS5zZXRBdHRyaWJ1dGUoJ3gxJywgcDFbMF0pO1xuICBsaW5lLnNldEF0dHJpYnV0ZSgneTEnLCBwMVsxXSk7XG4gIGxpbmUuc2V0QXR0cmlidXRlKCd4MicsIHAyWzBdKTtcbiAgbGluZS5zZXRBdHRyaWJ1dGUoJ3kyJywgcDJbMV0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoYywgcmFkaXVzLCBzdGFydCwgYW5nbGUsIHdpZHRoLCBjb3JuZXIpIHtcbiAgbGV0IG91dGVyU2hpZnQgPSAzNjAgKiAoY29ybmVyIC8gKDIgKiBNYXRoLlBJICogKHJhZGl1cyAtIGNvcm5lcikpKTtcbiAgbGV0IGlubmVyU2hpZnQgPSAzNjAgKiAoY29ybmVyIC8gKDIgKiBNYXRoLlBJICogKHJhZGl1cyAtIHdpZHRoICsgY29ybmVyKSkpO1xuXG4gIGxldCBjZW50ZXIxID0gcG9pbnRPbkFyYyhjLCByYWRpdXMgLSBjb3JuZXIsIHN0YXJ0ICsgb3V0ZXJTaGlmdCk7XG4gIGxldCBjZW50ZXIyID0gcG9pbnRPbkFyYyhjLCByYWRpdXMgLSBjb3JuZXIsIGFuZ2xlIC0gb3V0ZXJTaGlmdCk7XG4gIGxldCBjZW50ZXIzID0gcG9pbnRPbkFyYyhjLCByYWRpdXMgLSB3aWR0aCArIGNvcm5lciwgc3RhcnQgKyBpbm5lclNoaWZ0KTtcbiAgbGV0IGNlbnRlcjQgPSBwb2ludE9uQXJjKGMsIHJhZGl1cyAtIHdpZHRoICsgY29ybmVyLCBhbmdsZSAtIGlubmVyU2hpZnQpO1xuXG4gIGFyYzEuc2V0QXR0cmlidXRlKCdkJywgZGVzY3JpYmVBcmMoYywgcmFkaXVzIC0gY29ybmVyLCBzdGFydCArIG91dGVyU2hpZnQsIGFuZ2xlIC0gb3V0ZXJTaGlmdCkpO1xuICBhcmMyLnNldEF0dHJpYnV0ZSgnZCcsIGRlc2NyaWJlQXJjKGMsIHJhZGl1cyAtIHdpZHRoICsgY29ybmVyLCBzdGFydCArIGlubmVyU2hpZnQsIGFuZ2xlIC0gaW5uZXJTaGlmdCkpO1xuXG4gIGEuc2V0QXR0cmlidXRlKCdkJywgYXJjKGMsIHJhZGl1cywgc3RhcnQsIGFuZ2xlLCB3aWR0aCwgY29ybmVyKSk7XG5cbiAgdXBkYXRlQ2lyY2xlKGMxLCBjZW50ZXIxLCBjb3JuZXIpO1xuICB1cGRhdGVDaXJjbGUoYzIsIGNlbnRlcjIsIGNvcm5lcik7XG4gIHVwZGF0ZUNpcmNsZShjMywgY2VudGVyMywgY29ybmVyKTtcbiAgdXBkYXRlQ2lyY2xlKGM0LCBjZW50ZXI0LCBjb3JuZXIpO1xuXG4gIHVwZGF0ZUxpbmUoYjEsIGNlbnRlcjEsIGNlbnRlcjMpO1xuICB1cGRhdGVMaW5lKGIyLCBjZW50ZXIyLCBjZW50ZXI0KTtcbn1cblxucmVuZGVyKCk7XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgcmVuZGVyKTtcbiIsImNvbnN0IFJBRF9ERUcgPSBNYXRoLlBJIC8gMTgwLjA7XG5jb25zdCBQSTIgPSAyICogTWF0aC5QSTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gUlxuICogQHBhcmFtICB7TnVtYmVyfSBhbmdsZVxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbmZ1bmN0aW9uIHBvaW50T25BcmMoY2VudGVyLCBSLCBhbmdsZSkge1xuICBjb25zdCByYWRpYW5zID0gKGFuZ2xlIC0gOTApICogUkFEX0RFRztcblxuICByZXR1cm4gW1xuICAgIGNlbnRlclswXSArIChSICogTWF0aC5jb3MocmFkaWFucykpLFxuICAgIGNlbnRlclsxXSArIChSICogTWF0aC5zaW4ocmFkaWFucykpXG4gIF07XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge30gUiAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gd2lkdGggIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZHJhd0NpcmNsZShjZW50ZXIsIFIsIHdpZHRoKSB7XG4gIGxldCBpUiAgICAgPSBSIC0gd2lkdGg7XG4gIGxldCBbeCwgeV0gPSBjZW50ZXI7XG5cbiAgcmV0dXJuIFtcbiAgICAnTScsIHggLSBSLCAgIHksXG4gICAgJ0EnLCAgUiwgICBSLCAwLCAxLCAwLCAgeCArIFIsIHksXG4gICAgJ0EnLCAgUiwgICBSLCAwLCAxLCAwLCAgeCAtIFIsIHksXG5cbiAgICAnTScsIHggLSBpUiwgIHksXG4gICAgJ0EnLCAgaVIsIGlSLCAwLCAxLCAwLCB4ICsgaVIsIHksXG4gICAgJ0EnLCAgaVIsIGlSLCAwLCAxLCAwLCB4IC0gaVIsIHksXG4gICAgJ1onXG4gIF0uam9pbignICcpO1xufVxuXG5cbi8qKlxuICogR2VuZXJhdGVzIGFyYyBwYXRoXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIFJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBzdGFydFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGVuZFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHdcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBjUiBDb3JuZXIgcmFkaXVzXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBhcmMoY2VudGVyLCBSLCBzdGFydCwgZW5kLCB3LCBjUikge1xuICBpZiAoTWF0aC5hYnMoZW5kIC0gc3RhcnQpID09PSAzNjApIHtcbiAgICByZXR1cm4gZHJhd0NpcmNsZShjZW50ZXIsIFIsIHcpO1xuICB9XG5cbiAgY1IgPSBNYXRoLm1pbih3IC8gMiwgY1IpO1xuXG4gIC8vIGlubmVyIGFuZCBvdXRlciByYWRpdXNlc1xuICBjb25zdCBpUiAgPSBSIC0gdztcbiAgY29uc3QgaVIyID0gaVIgKyBjUjtcbiAgY29uc3Qgb1IgID0gUiAtIGNSO1xuXG4gIC8vIGJ1dHRzIGNvcm5lciBwb2ludHNcbiAgbGV0IG9TdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBvUiwgc3RhcnQpO1xuICBsZXQgb0VuZCAgID0gcG9pbnRPbkFyYyhjZW50ZXIsIG9SLCBlbmQpO1xuXG4gIGxldCBpU3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgaVIyLCBzdGFydCk7XG4gIGxldCBpRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgaVIyLCBlbmQpO1xuXG4gIGxldCBpU2VjdGlvbiAgPSAzNjAgKiAoY1IgLyAoUEkyICogaVIpKTtcbiAgbGV0IG9TZWN0aW9uICA9IDM2MCAqIChjUiAvIChQSTIgKiBSKSk7XG5cbiAgLy8gYXJjcyBlbmRwb2ludHNcbiAgbGV0IGlBcmNTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBpUiwgc3RhcnQgKyBpU2VjdGlvbik7XG4gIGxldCBpQXJjRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgaVIsIGVuZCAgIC0gaVNlY3Rpb24pO1xuXG4gIGxldCBvQXJjU3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgUiwgc3RhcnQgKyBvU2VjdGlvbik7XG4gIGxldCBvQXJjRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgUiwgZW5kICAgLSBvU2VjdGlvbik7XG5cbiAgY29uc3QgYXJjU3dlZXAgPSBlbmQgLSBzdGFydCA8PSAxODAgPyAwIDogMTtcblxuICByZXR1cm4gW1xuICAgIC8vIGJlZ2luIHBhdGhcbiAgICBcIk1cIiwgb1N0YXJ0WzBdLCBvU3RhcnRbMV0sXG4gICAgLy8gb3V0ZXIgc3RhcnQgY29ybmVyXG4gICAgXCJBXCIsIGNSLCBjUiwgMCwgMCwgICAgICAgIDEsIG9BcmNTdGFydFswXSwgb0FyY1N0YXJ0WzFdLFxuICAgIC8vIG91dGVyIG1haW4gYXJjXG4gICAgXCJBXCIsIFIsICBSLCAgMCwgYXJjU3dlZXAsIDEsIG9BcmNFbmRbMF0sICAgb0FyY0VuZFsxXSxcbiAgICAvLyBvdXRlciBlbmQgY29ybmVyXG4gICAgXCJBXCIsIGNSLCBjUiwgMCwgMCwgICAgICAgIDEsIG9FbmRbMF0sICAgICAgb0VuZFsxXSxcbiAgICAvLyBlbmQgYnV0dFxuICAgIFwiTFwiLCBpRW5kWzBdLCBpRW5kWzFdLFxuICAgIC8vIGlubmVyIGVuZCBjb3JuZXJcbiAgICBcIkFcIiwgY1IsIGNSLCAwLCAwLCAgICAgICAgMSwgaUFyY0VuZFswXSwgICBpQXJjRW5kWzFdLFxuICAgIC8vIGlubmVyIGFyY1xuICAgIFwiQVwiLCBpUiwgaVIsIDAsIGFyY1N3ZWVwLCAwLCBpQXJjU3RhcnRbMF0sIGlBcmNTdGFydFsxXSxcbiAgICAvLyBpbm5lciBzdGFydCBjb3JuZXJcbiAgICBcIkFcIiwgY1IsIGNSLCAwLCAwLCAgICAgICAgMSwgaVN0YXJ0WzBdLCAgICBpU3RhcnRbMV0sXG4gICAgXCJaXCIgLy8gZW5kIHBhdGhcbiAgXS5qb2luKCcgJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJjO1xubW9kdWxlLmV4cG9ydHMucG9pbnRPbkFyYyA9IHBvaW50T25BcmM7XG5tb2R1bGUuZXhwb3J0cy5kcmF3Q2lyY2xlID0gZHJhd0NpcmNsZTtcblxuXG5cbiJdfQ==
