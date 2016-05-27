(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cornerArc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function describeArc(center, radius, startAngle, endAngle) {
  var start = (0, _index.pointOnArc)(center, radius, endAngle);
  var end = (0, _index.pointOnArc)(center, radius, startAngle);

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

  var center1 = (0, _index.pointOnArc)(c, radius - corner, start + outerShift);
  var center2 = (0, _index.pointOnArc)(c, radius - corner, angle - outerShift);
  var center3 = (0, _index.pointOnArc)(c, radius - width + corner, start + innerShift);
  var center4 = (0, _index.pointOnArc)(c, radius - width + corner, angle - innerShift);

  arc1.setAttribute('d', describeArc(c, radius - corner, start + outerShift, angle - outerShift));
  arc2.setAttribute('d', describeArc(c, radius - width + corner, start + innerShift, angle - innerShift));

  a.setAttribute('d', (0, _index2.default)(c, radius, start, angle, width, corner));

  updateCircle(c1, center1, corner);
  updateCircle(c2, center2, corner);
  updateCircle(c3, center3, corner);
  updateCircle(c4, center4, corner);

  updateLine(b1, center1, center3);
  updateLine(b2, center2, center4);
}

render();

form.addEventListener('change', render);
form['angle'].focus();

},{"../index":2}],2:[function(require,module,exports){
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
 * @param  {Array.<Number>} center
 * @param  {Number}         R
 * @param  {Number}         width
 * @return {String}
 */
function drawCircle(center, R, width) {
  var innerR = R - width;

  var _center = _slicedToArray(center, 2);

  var x = _center[0];
  var y = _center[1];


  return ['M', x - R, y, 'A', R, R, 0, 1, 0, x + R, y, 'A', R, R, 0, 1, 0, x - R, y, 'M', x - innerR, y, 'A', innerR, innerR, 0, 1, 0, x + innerR, y, 'A', innerR, innerR, 0, 1, 0, x - innerR, y, 'Z'].join(' ');
}

/**
 * Generates arc path
 *
 * @param  {Array.<Number>} center
 * @param  {Number}         R
 * @param  {Number}         start
 * @param  {Number}         end
 * @param  {Number}         w
 * @param  {Number}         corner Corner radius
 *
 * @return {String}
 */
function arc(center, R, start, end, w, corner) {
  if (Math.abs(end - start) === 360) {
    return drawCircle(center, R, w);
  }

  var innerR = R - w;
  var circumference = Math.abs(end - start);
  corner = Math.min(w / 2, corner);

  if (360 * (corner / (Math.PI * (R - w))) > Math.abs(start - end)) {
    corner = circumference / 360 * innerR * Math.PI;
  }

  // inner and outer radiuses
  var innerR2 = innerR + corner;
  var outerRadius = R - corner;

  // butts corner points
  var oStart = pointOnArc(center, outerRadius, start);
  var oEnd = pointOnArc(center, outerRadius, end);

  var iStart = pointOnArc(center, innerR2, start);
  var iEnd = pointOnArc(center, innerR2, end);

  var iSection = 360 * (corner / (PI2 * innerR));
  var oSection = 360 * (corner / (PI2 * R));

  // arcs endpoints
  var iArcStart = pointOnArc(center, innerR, start + iSection);
  var iArcEnd = pointOnArc(center, innerR, end - iSection);

  var oArcStart = pointOnArc(center, R, start + oSection);
  var oArcEnd = pointOnArc(center, R, end - oSection);

  var arcSweep1 = circumference > 180 + 2 * oSection ? 1 : 0;
  var arcSweep2 = circumference > 180 + 2 * iSection ? 1 : 0;

  return [
  // begin path
  "M", oStart[0], oStart[1],
  // outer start corner
  "A", corner, corner, 0, 0, 1, oArcStart[0], oArcStart[1],
  // outer main arc
  "A", R, R, 0, arcSweep1, 1, oArcEnd[0], oArcEnd[1],
  // outer end corner
  "A", corner, corner, 0, 0, 1, oEnd[0], oEnd[1],
  // end butt
  "L", iEnd[0], iEnd[1],
  // inner end corner
  "A", corner, corner, 0, 0, 1, iArcEnd[0], iArcEnd[1],
  // inner arc
  "A", innerR, innerR, 0, arcSweep2, 0, iArcStart[0], iArcStart[1],
  // inner start corner
  "A", corner, corner, 0, 0, 1, iStart[0], iStart[1], "Z" // end path
  ].join(' ');
}

module.exports = arc;
module.exports.pointOnArc = pointOnArc;
module.exports.drawCircle = drawCircle;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxTQUFTLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkIsTUFBN0IsRUFBcUMsVUFBckMsRUFBaUQsUUFBakQsRUFBMEQ7QUFDeEQsTUFBTSxRQUFRLHVCQUFXLE1BQVgsRUFBbUIsTUFBbkIsRUFBMkIsUUFBM0IsQ0FBZDtBQUNBLE1BQU0sTUFBTSx1QkFBVyxNQUFYLEVBQW1CLE1BQW5CLEVBQTJCLFVBQTNCLENBQVo7O0FBRUEsTUFBSSxXQUFXLFdBQVcsVUFBWCxHQUF3QixHQUF4QixHQUE4QixDQUE5QixHQUFrQyxDQUFqRDs7QUFFQSxTQUFPLENBQ0wsR0FESyxFQUNBLE1BQU0sQ0FBTixDQURBLEVBQ1UsTUFBTSxDQUFOLENBRFYsRUFFTCxHQUZLLEVBRUEsTUFGQSxFQUVRLE1BRlIsRUFFZ0IsQ0FGaEIsRUFFbUIsUUFGbkIsRUFFNkIsQ0FGN0IsRUFFZ0MsSUFBSSxDQUFKLENBRmhDLEVBRXdDLElBQUksQ0FBSixDQUZ4QyxFQUdMLElBSEssQ0FHQSxHQUhBLENBQVA7QUFJRDs7QUFFRCxJQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxJQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLE9BQXZCLENBQWI7QUFDQSxJQUFNLElBQUssU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQVg7O0FBRUEsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYO0FBQ0EsSUFBTSxLQUFLLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFYOztBQUVB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QUpuRDs7QUFNTCxLQU5LLEVBTU0sQ0FOTixFQU1lLENBTmYsRUFNa0IsQ0FObEIsRUFNc0IsU0FOdEIsRUFNaUMsQ0FOakMsRUFNc0MsUUFBUSxDQUFSLENBTnRDLEVBTXFELFFBQVEsQ0FBUixDQU5yRDs7QUFRTCxLQVJLLEVBUUMsTUFSRCxFQVFVLE1BUlYsRUFRa0IsQ0FSbEIsRUFROEIsQ0FSOUIsRUFRaUMsQ0FSakMsRUFReUMsS0FBSyxDQUFMLENBUnpDLEVBUXdELEtBQUssQ0FBTCxDQVJ4RDs7QUFVTCxLQVZLLEVBVUEsS0FBSyxDQUFMLENBVkEsRUFVUyxLQUFLLENBQUwsQ0FWVDs7QUFZTCxLQVpLLEVBWUMsTUFaRCxFQVlVLE1BWlYsRUFZa0IsQ0FabEIsRUFZOEIsQ0FaOUIsRUFZaUMsQ0FaakMsRUFZc0MsUUFBUSxDQUFSLENBWnRDLEVBWXFELFFBQVEsQ0FBUixDQVpyRDs7QUFjTCxLQWRLLEVBY0MsTUFkRCxFQWNVLE1BZFYsRUFja0IsQ0FkbEIsRUFjdUIsU0FkdkIsRUFja0MsQ0FkbEMsRUFjcUMsVUFBVSxDQUFWLENBZHJDLEVBY29ELFVBQVUsQ0FBVixDQWRwRDs7QUFnQkwsS0FoQkssRUFnQkMsTUFoQkQsRUFnQlUsTUFoQlYsRUFnQmtCLENBaEJsQixFQWdCOEIsQ0FoQjlCLEVBZ0JpQyxDQWhCakMsRUFnQnVDLE9BQU8sQ0FBUCxDQWhCdkMsRUFnQnNELE9BQU8sQ0FBUCxDQWhCdEQsRUFpQkwsRztBQWpCSyxJQWtCTCxJQWxCSyxDQWtCQSxHQWxCQSxDQUFQO0FBbUJEOztBQUVELE9BQU8sT0FBUCxHQUFpQixHQUFqQjtBQUNBLE9BQU8sT0FBUCxDQUFlLFVBQWYsR0FBNEIsVUFBNUI7QUFDQSxPQUFPLE9BQVAsQ0FBZSxVQUFmLEdBQTRCLFVBQTVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBhcmMsIHsgcG9pbnRPbkFyYyB9IGZyb20gJy4uL2luZGV4JztcblxuZnVuY3Rpb24gZGVzY3JpYmVBcmMoY2VudGVyLCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKXtcbiAgY29uc3Qgc3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgcmFkaXVzLCBlbmRBbmdsZSk7XG4gIGNvbnN0IGVuZCA9IHBvaW50T25BcmMoY2VudGVyLCByYWRpdXMsIHN0YXJ0QW5nbGUpO1xuXG4gIHZhciBhcmNTd2VlcCA9IGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSA8IDE4MCA/IDAgOiAxO1xuXG4gIHJldHVybiBbXG4gICAgXCJNXCIsIHN0YXJ0WzBdLCBzdGFydFsxXSxcbiAgICBcIkFcIiwgcmFkaXVzLCByYWRpdXMsIDAsIGFyY1N3ZWVwLCAwLCBlbmRbMF0sIGVuZFsxXVxuICBdLmpvaW4oXCIgXCIpO1xufVxuXG5jb25zdCBhcmMxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FyYzEnKTtcbmNvbnN0IGFyYzIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXJjMicpO1xuY29uc3QgYSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXJjJyk7XG5cbmNvbnN0IGMxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2MxJyk7XG5jb25zdCBjMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjMicpO1xuY29uc3QgYzMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYzMnKTtcbmNvbnN0IGM0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2M0Jyk7XG5cbmNvbnN0IGIxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2IxJyk7XG5jb25zdCBiMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiMicpO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzJyk7XG5cbmZ1bmN0aW9uIHJlbmRlciAoKSB7XG4gIGxldCBjID0gW2Zvcm1bJ3gnXS52YWx1ZSwgZm9ybVsneSddLnZhbHVlXS5tYXAocGFyc2VGbG9hdCk7XG4gIGxldCByYWRpdXMgPSBwYXJzZUZsb2F0KGZvcm1bJ3JhZGl1cyddLnZhbHVlKTtcbiAgbGV0IHdpZHRoICA9IHBhcnNlRmxvYXQoZm9ybVsnd2lkdGgnXS52YWx1ZSk7XG4gIGxldCBjb3JuZXIgPSBwYXJzZUZsb2F0KGZvcm1bJ2Nvcm5lciddLnZhbHVlKTtcblxuICBsZXQgYW5nbGUgID0gcGFyc2VGbG9hdChmb3JtWydhbmdsZSddLnZhbHVlKTtcbiAgZm9ybVsnYW5nbGUtdmFsdWUnXS52YWx1ZSA9IGFuZ2xlO1xuXG4gIHVwZGF0ZShjLCByYWRpdXMsIDAsIGFuZ2xlLCB3aWR0aCwgY29ybmVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2lyY2xlKGNpcmNsZSwgYywgcikge1xuICBjaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgcik7XG4gIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgY1swXSk7XG4gIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N5JywgY1sxXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmUobGluZSwgcDEsIHAyKSB7XG4gIGxpbmUuc2V0QXR0cmlidXRlKCd4MScsIHAxWzBdKTtcbiAgbGluZS5zZXRBdHRyaWJ1dGUoJ3kxJywgcDFbMV0pO1xuICBsaW5lLnNldEF0dHJpYnV0ZSgneDInLCBwMlswXSk7XG4gIGxpbmUuc2V0QXR0cmlidXRlKCd5MicsIHAyWzFdKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGMsIHJhZGl1cywgc3RhcnQsIGFuZ2xlLCB3aWR0aCwgY29ybmVyKSB7XG4gIGxldCBvdXRlclNoaWZ0ID0gMzYwICogKGNvcm5lciAvICgyICogTWF0aC5QSSAqIChyYWRpdXMgLSBjb3JuZXIpKSk7XG4gIGxldCBpbm5lclNoaWZ0ID0gMzYwICogKGNvcm5lciAvICgyICogTWF0aC5QSSAqIChyYWRpdXMgLSB3aWR0aCArIGNvcm5lcikpKTtcblxuICBsZXQgY2VudGVyMSA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gY29ybmVyLCBzdGFydCArIG91dGVyU2hpZnQpO1xuICBsZXQgY2VudGVyMiA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gY29ybmVyLCBhbmdsZSAtIG91dGVyU2hpZnQpO1xuICBsZXQgY2VudGVyMyA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gd2lkdGggKyBjb3JuZXIsIHN0YXJ0ICsgaW5uZXJTaGlmdCk7XG4gIGxldCBjZW50ZXI0ID0gcG9pbnRPbkFyYyhjLCByYWRpdXMgLSB3aWR0aCArIGNvcm5lciwgYW5nbGUgLSBpbm5lclNoaWZ0KTtcblxuICBhcmMxLnNldEF0dHJpYnV0ZSgnZCcsIGRlc2NyaWJlQXJjKGMsIHJhZGl1cyAtIGNvcm5lciwgc3RhcnQgKyBvdXRlclNoaWZ0LCBhbmdsZSAtIG91dGVyU2hpZnQpKTtcbiAgYXJjMi5zZXRBdHRyaWJ1dGUoJ2QnLCBkZXNjcmliZUFyYyhjLCByYWRpdXMgLSB3aWR0aCArIGNvcm5lciwgc3RhcnQgKyBpbm5lclNoaWZ0LCBhbmdsZSAtIGlubmVyU2hpZnQpKTtcblxuICBhLnNldEF0dHJpYnV0ZSgnZCcsIGFyYyhjLCByYWRpdXMsIHN0YXJ0LCBhbmdsZSwgd2lkdGgsIGNvcm5lcikpO1xuXG4gIHVwZGF0ZUNpcmNsZShjMSwgY2VudGVyMSwgY29ybmVyKTtcbiAgdXBkYXRlQ2lyY2xlKGMyLCBjZW50ZXIyLCBjb3JuZXIpO1xuICB1cGRhdGVDaXJjbGUoYzMsIGNlbnRlcjMsIGNvcm5lcik7XG4gIHVwZGF0ZUNpcmNsZShjNCwgY2VudGVyNCwgY29ybmVyKTtcblxuICB1cGRhdGVMaW5lKGIxLCBjZW50ZXIxLCBjZW50ZXIzKTtcbiAgdXBkYXRlTGluZShiMiwgY2VudGVyMiwgY2VudGVyNCk7XG59XG5cbnJlbmRlcigpO1xuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHJlbmRlcik7XG5mb3JtWydhbmdsZSddLmZvY3VzKCk7XG4iLCJjb25zdCBSQURfREVHID0gTWF0aC5QSSAvIDE4MC4wO1xuY29uc3QgUEkyID0gMiAqIE1hdGguUEk7XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFJcbiAqIEBwYXJhbSAge051bWJlcn0gYW5nbGVcbiAqIEByZXR1cm4ge0FycmF5LjxOdW1iZXI+fVxuICovXG5mdW5jdGlvbiBwb2ludE9uQXJjKGNlbnRlciwgUiwgYW5nbGUpIHtcbiAgbGV0IHJhZGlhbnMgPSAoYW5nbGUgLSA5MCkgKiBSQURfREVHO1xuXG4gIHJldHVybiBbXG4gICAgY2VudGVyWzBdICsgKFIgKiBNYXRoLmNvcyhyYWRpYW5zKSksXG4gICAgY2VudGVyWzFdICsgKFIgKiBNYXRoLnNpbihyYWRpYW5zKSlcbiAgXTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBSXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgd2lkdGhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZHJhd0NpcmNsZShjZW50ZXIsIFIsIHdpZHRoKSB7XG4gIGxldCBpbm5lclIgPSBSIC0gd2lkdGg7XG4gIGxldCBbeCwgeV0gPSBjZW50ZXI7XG5cbiAgcmV0dXJuIFtcbiAgICAnTScsIHggLSBSLCAgIHksXG4gICAgJ0EnLCBSLCAgIFIsIDAsIDEsIDAsICB4ICsgUiwgeSxcbiAgICAnQScsIFIsICAgUiwgMCwgMSwgMCwgIHggLSBSLCB5LFxuXG4gICAgJ00nLCB4IC0gaW5uZXJSLCAgeSxcbiAgICAnQScsIGlubmVyUiwgICAgIGlubmVyUiwgMCwgMSwgMCwgeCArIGlubmVyUiwgeSxcbiAgICAnQScsIGlubmVyUiwgICAgIGlubmVyUiwgMCwgMSwgMCwgeCAtIGlubmVyUiwgeSxcbiAgICAnWidcbiAgXS5qb2luKCcgJyk7XG59XG5cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYXJjIHBhdGhcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgUlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHN0YXJ0XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgZW5kXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgd1xuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGNvcm5lciBDb3JuZXIgcmFkaXVzXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBhcmMoY2VudGVyLCBSLCBzdGFydCwgZW5kLCB3LCBjb3JuZXIpIHtcbiAgaWYgKE1hdGguYWJzKGVuZCAtIHN0YXJ0KSA9PT0gMzYwKSB7XG4gICAgcmV0dXJuIGRyYXdDaXJjbGUoY2VudGVyLCBSLCB3KTtcbiAgfVxuXG4gIGxldCBpbm5lclIgICAgICAgID0gUiAtIHc7XG4gIGxldCBjaXJjdW1mZXJlbmNlID0gTWF0aC5hYnMoZW5kIC0gc3RhcnQpO1xuICBjb3JuZXIgPSBNYXRoLm1pbih3IC8gMiwgY29ybmVyKTtcblxuICBpZiAoMzYwICogKGNvcm5lciAvIChNYXRoLlBJICogKFIgLSB3KSkpID4gTWF0aC5hYnMoc3RhcnQgLSBlbmQpKSB7XG4gICAgY29ybmVyID0gKGNpcmN1bWZlcmVuY2UgLyAzNjApICogaW5uZXJSICogTWF0aC5QSTtcbiAgfVxuXG4gIC8vIGlubmVyIGFuZCBvdXRlciByYWRpdXNlc1xuICBsZXQgaW5uZXJSMiAgICAgID0gaW5uZXJSICsgY29ybmVyO1xuICBsZXQgb3V0ZXJSYWRpdXMgID0gUiAtIGNvcm5lcjtcblxuICAvLyBidXR0cyBjb3JuZXIgcG9pbnRzXG4gIGxldCBvU3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgb3V0ZXJSYWRpdXMsIHN0YXJ0KTtcbiAgbGV0IG9FbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBvdXRlclJhZGl1cywgZW5kKTtcblxuICBsZXQgaVN0YXJ0ID0gcG9pbnRPbkFyYyhjZW50ZXIsIGlubmVyUjIsIHN0YXJ0KTtcbiAgbGV0IGlFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBpbm5lclIyLCBlbmQpO1xuXG4gIGxldCBpU2VjdGlvbiAgPSAzNjAgKiAoY29ybmVyIC8gKFBJMiAqIGlubmVyUikpO1xuICBsZXQgb1NlY3Rpb24gID0gMzYwICogKGNvcm5lciAvIChQSTIgKiBSKSk7XG5cbiAgLy8gYXJjcyBlbmRwb2ludHNcbiAgbGV0IGlBcmNTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBpbm5lclIsIHN0YXJ0ICsgaVNlY3Rpb24pO1xuICBsZXQgaUFyY0VuZCAgID0gcG9pbnRPbkFyYyhjZW50ZXIsIGlubmVyUiwgZW5kICAgLSBpU2VjdGlvbik7XG5cbiAgbGV0IG9BcmNTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBSLCBzdGFydCArIG9TZWN0aW9uKTtcbiAgbGV0IG9BcmNFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBSLCBlbmQgICAtIG9TZWN0aW9uKTtcblxuICBsZXQgYXJjU3dlZXAxID0gY2lyY3VtZmVyZW5jZSA+IDE4MCArIDIgKiBvU2VjdGlvbiA/IDEgOiAwO1xuICBsZXQgYXJjU3dlZXAyID0gY2lyY3VtZmVyZW5jZSA+IDE4MCArIDIgKiBpU2VjdGlvbiA/IDEgOiAwO1xuXG4gIHJldHVybiBbXG4gICAgLy8gYmVnaW4gcGF0aFxuICAgIFwiTVwiLCBvU3RhcnRbMF0sIG9TdGFydFsxXSxcbiAgICAvLyBvdXRlciBzdGFydCBjb3JuZXJcbiAgICBcIkFcIiwgIGNvcm5lciwgIGNvcm5lciwgMCwgICAgICAgICAgMCwgMSwgIG9BcmNTdGFydFswXSwgb0FyY1N0YXJ0WzFdLFxuICAgIC8vIG91dGVyIG1haW4gYXJjXG4gICAgXCJBXCIsICAgICAgIFIsICAgICAgIFIsIDAsICBhcmNTd2VlcDEsIDEsICAgb0FyY0VuZFswXSwgICAgb0FyY0VuZFsxXSxcbiAgICAvLyBvdXRlciBlbmQgY29ybmVyXG4gICAgXCJBXCIsICBjb3JuZXIsICBjb3JuZXIsIDAsICAgICAgICAgIDAsIDEsICAgICAgb0VuZFswXSwgICAgICAgb0VuZFsxXSxcbiAgICAvLyBlbmQgYnV0dFxuICAgIFwiTFwiLCBpRW5kWzBdLCBpRW5kWzFdLFxuICAgIC8vIGlubmVyIGVuZCBjb3JuZXJcbiAgICBcIkFcIiwgIGNvcm5lciwgIGNvcm5lciwgMCwgICAgICAgICAgMCwgMSwgICBpQXJjRW5kWzBdLCAgICBpQXJjRW5kWzFdLFxuICAgIC8vIGlubmVyIGFyY1xuICAgIFwiQVwiLCAgaW5uZXJSLCAgaW5uZXJSLCAwLCAgIGFyY1N3ZWVwMiwgMCwgaUFyY1N0YXJ0WzBdLCAgaUFyY1N0YXJ0WzFdLFxuICAgIC8vIGlubmVyIHN0YXJ0IGNvcm5lclxuICAgIFwiQVwiLCAgY29ybmVyLCAgY29ybmVyLCAwLCAgICAgICAgICAwLCAxLCAgICBpU3RhcnRbMF0sICAgICBpU3RhcnRbMV0sXG4gICAgXCJaXCIgLy8gZW5kIHBhdGhcbiAgXS5qb2luKCcgJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJjO1xubW9kdWxlLmV4cG9ydHMucG9pbnRPbkFyYyA9IHBvaW50T25BcmM7XG5tb2R1bGUuZXhwb3J0cy5kcmF3Q2lyY2xlID0gZHJhd0NpcmNsZTtcbiJdfQ==
