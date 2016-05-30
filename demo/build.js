(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cornerArc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.arc = _index2.default;

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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


  return ['M', x - R, y, 'A', R, R, 0, 1, 0, x + R, y, 'A', R, R, 0, 1, 0, x - R, y, 'M', x - innerR, y, 'A', innerR, innerR, 0, 1, 0, x + innerR, y, 'A', innerR, innerR, 0, 1, 0, x - innerR, y, 'Z'];
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
 * @param  {Booelan=}       returnPoints - return array for path or string
 *
 * @return {String|Array.<Number|String>}
 */
function arc(center, R, start, end, w, corner, returnPoints) {
  var points = void 0;
  if (Math.abs(end - start) === 360) {
    points = drawCircle(center, R, w);
    return returnPoints ? points : points.join(' ');
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

  points = [
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
  ];

  return returnPoints ? points : points.join(' ');
}

module.exports = arc;
module.exports.pointOnArc = pointOnArc;
module.exports.drawCircle = drawCircle;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxHQUFQOztBQUVBLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxVQUFyQyxFQUFpRCxRQUFqRCxFQUEwRDtBQUN4RCxNQUFNLFFBQVEsdUJBQVcsTUFBWCxFQUFtQixNQUFuQixFQUEyQixRQUEzQixDQUFkO0FBQ0EsTUFBTSxNQUFNLHVCQUFXLE1BQVgsRUFBbUIsTUFBbkIsRUFBMkIsVUFBM0IsQ0FBWjs7QUFFQSxNQUFJLFdBQVcsV0FBVyxVQUFYLEdBQXdCLEdBQXhCLEdBQThCLENBQTlCLEdBQWtDLENBQWpEOztBQUVBLFNBQU8sQ0FDTCxHQURLLEVBQ0EsTUFBTSxDQUFOLENBREEsRUFDVSxNQUFNLENBQU4sQ0FEVixFQUVMLEdBRkssRUFFQSxNQUZBLEVBRVEsTUFGUixFQUVnQixDQUZoQixFQUVtQixRQUZuQixFQUU2QixDQUY3QixFQUVnQyxJQUFJLENBQUosQ0FGaEMsRUFFd0MsSUFBSSxDQUFKLENBRnhDLEVBR0wsSUFISyxDQUdBLEdBSEEsQ0FBUDtBQUlEOztBQUVELElBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLElBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLElBQU0sSUFBSyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBWDs7QUFFQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVC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cmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgYXJjLCB7IHBvaW50T25BcmMgfSBmcm9tICcuLi9pbmRleCc7XG5cbmdsb2JhbC5hcmMgPSBhcmM7XG5cbmZ1bmN0aW9uIGRlc2NyaWJlQXJjKGNlbnRlciwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSl7XG4gIGNvbnN0IHN0YXJ0ID0gcG9pbnRPbkFyYyhjZW50ZXIsIHJhZGl1cywgZW5kQW5nbGUpO1xuICBjb25zdCBlbmQgPSBwb2ludE9uQXJjKGNlbnRlciwgcmFkaXVzLCBzdGFydEFuZ2xlKTtcblxuICB2YXIgYXJjU3dlZXAgPSBlbmRBbmdsZSAtIHN0YXJ0QW5nbGUgPCAxODAgPyAwIDogMTtcblxuICByZXR1cm4gW1xuICAgIFwiTVwiLCBzdGFydFswXSwgc3RhcnRbMV0sXG4gICAgXCJBXCIsIHJhZGl1cywgcmFkaXVzLCAwLCBhcmNTd2VlcCwgMCwgZW5kWzBdLCBlbmRbMV1cbiAgXS5qb2luKFwiIFwiKTtcbn1cblxuY29uc3QgYXJjMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcmMxJyk7XG5jb25zdCBhcmMyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FyYzInKTtcbmNvbnN0IGEgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FyYycpO1xuXG5jb25zdCBjMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjMScpO1xuY29uc3QgYzIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYzInKTtcbmNvbnN0IGMzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2MzJyk7XG5jb25zdCBjNCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjNCcpO1xuXG5jb25zdCBiMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiMScpO1xuY29uc3QgYjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYjInKTtcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9scycpO1xuXG5mdW5jdGlvbiByZW5kZXIgKCkge1xuICBsZXQgYyA9IFtmb3JtWyd4J10udmFsdWUsIGZvcm1bJ3knXS52YWx1ZV0ubWFwKHBhcnNlRmxvYXQpO1xuICBsZXQgcmFkaXVzID0gcGFyc2VGbG9hdChmb3JtWydyYWRpdXMnXS52YWx1ZSk7XG4gIGxldCB3aWR0aCAgPSBwYXJzZUZsb2F0KGZvcm1bJ3dpZHRoJ10udmFsdWUpO1xuICBsZXQgY29ybmVyID0gcGFyc2VGbG9hdChmb3JtWydjb3JuZXInXS52YWx1ZSk7XG5cbiAgbGV0IGFuZ2xlICA9IHBhcnNlRmxvYXQoZm9ybVsnYW5nbGUnXS52YWx1ZSk7XG4gIGZvcm1bJ2FuZ2xlLXZhbHVlJ10udmFsdWUgPSBhbmdsZTtcblxuICB1cGRhdGUoYywgcmFkaXVzLCAwLCBhbmdsZSwgd2lkdGgsIGNvcm5lcik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNpcmNsZShjaXJjbGUsIGMsIHIpIHtcbiAgY2lyY2xlLnNldEF0dHJpYnV0ZSgncicsIHIpO1xuICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeCcsIGNbMF0pO1xuICBjaXJjbGUuc2V0QXR0cmlidXRlKCdjeScsIGNbMV0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5lKGxpbmUsIHAxLCBwMikge1xuICBsaW5lLnNldEF0dHJpYnV0ZSgneDEnLCBwMVswXSk7XG4gIGxpbmUuc2V0QXR0cmlidXRlKCd5MScsIHAxWzFdKTtcbiAgbGluZS5zZXRBdHRyaWJ1dGUoJ3gyJywgcDJbMF0pO1xuICBsaW5lLnNldEF0dHJpYnV0ZSgneTInLCBwMlsxXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZShjLCByYWRpdXMsIHN0YXJ0LCBhbmdsZSwgd2lkdGgsIGNvcm5lcikge1xuICBsZXQgb3V0ZXJTaGlmdCA9IDM2MCAqIChjb3JuZXIgLyAoMiAqIE1hdGguUEkgKiAocmFkaXVzIC0gY29ybmVyKSkpO1xuICBsZXQgaW5uZXJTaGlmdCA9IDM2MCAqIChjb3JuZXIgLyAoMiAqIE1hdGguUEkgKiAocmFkaXVzIC0gd2lkdGggKyBjb3JuZXIpKSk7XG5cbiAgbGV0IGNlbnRlcjEgPSBwb2ludE9uQXJjKGMsIHJhZGl1cyAtIGNvcm5lciwgc3RhcnQgKyBvdXRlclNoaWZ0KTtcbiAgbGV0IGNlbnRlcjIgPSBwb2ludE9uQXJjKGMsIHJhZGl1cyAtIGNvcm5lciwgYW5nbGUgLSBvdXRlclNoaWZ0KTtcbiAgbGV0IGNlbnRlcjMgPSBwb2ludE9uQXJjKGMsIHJhZGl1cyAtIHdpZHRoICsgY29ybmVyLCBzdGFydCArIGlubmVyU2hpZnQpO1xuICBsZXQgY2VudGVyNCA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gd2lkdGggKyBjb3JuZXIsIGFuZ2xlIC0gaW5uZXJTaGlmdCk7XG5cbiAgYXJjMS5zZXRBdHRyaWJ1dGUoJ2QnLCBkZXNjcmliZUFyYyhjLCByYWRpdXMgLSBjb3JuZXIsIHN0YXJ0ICsgb3V0ZXJTaGlmdCwgYW5nbGUgLSBvdXRlclNoaWZ0KSk7XG4gIGFyYzIuc2V0QXR0cmlidXRlKCdkJywgZGVzY3JpYmVBcmMoYywgcmFkaXVzIC0gd2lkdGggKyBjb3JuZXIsIHN0YXJ0ICsgaW5uZXJTaGlmdCwgYW5nbGUgLSBpbm5lclNoaWZ0KSk7XG5cbiAgYS5zZXRBdHRyaWJ1dGUoJ2QnLCBhcmMoYywgcmFkaXVzLCBzdGFydCwgYW5nbGUsIHdpZHRoLCBjb3JuZXIpKTtcblxuICB1cGRhdGVDaXJjbGUoYzEsIGNlbnRlcjEsIGNvcm5lcik7XG4gIHVwZGF0ZUNpcmNsZShjMiwgY2VudGVyMiwgY29ybmVyKTtcbiAgdXBkYXRlQ2lyY2xlKGMzLCBjZW50ZXIzLCBjb3JuZXIpO1xuICB1cGRhdGVDaXJjbGUoYzQsIGNlbnRlcjQsIGNvcm5lcik7XG5cbiAgdXBkYXRlTGluZShiMSwgY2VudGVyMSwgY2VudGVyMyk7XG4gIHVwZGF0ZUxpbmUoYjIsIGNlbnRlcjIsIGNlbnRlcjQpO1xufVxuXG5yZW5kZXIoKTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCByZW5kZXIpO1xuZm9ybVsnYW5nbGUnXS5mb2N1cygpO1xuIiwiY29uc3QgUkFEX0RFRyA9IE1hdGguUEkgLyAxODAuMDtcbmNvbnN0IFBJMiA9IDIgKiBNYXRoLlBJO1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSBSXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGFuZ2xlXG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuZnVuY3Rpb24gcG9pbnRPbkFyYyhjZW50ZXIsIFIsIGFuZ2xlKSB7XG4gIGxldCByYWRpYW5zID0gKGFuZ2xlIC0gOTApICogUkFEX0RFRztcblxuICByZXR1cm4gW1xuICAgIGNlbnRlclswXSArIChSICogTWF0aC5jb3MocmFkaWFucykpLFxuICAgIGNlbnRlclsxXSArIChSICogTWF0aC5zaW4ocmFkaWFucykpXG4gIF07XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgUlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHdpZHRoXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGRyYXdDaXJjbGUoY2VudGVyLCBSLCB3aWR0aCkge1xuICBsZXQgaW5uZXJSID0gUiAtIHdpZHRoO1xuICBsZXQgW3gsIHldID0gY2VudGVyO1xuXG4gIHJldHVybiBbXG4gICAgJ00nLCB4IC0gUiwgICB5LFxuICAgICdBJywgUiwgICBSLCAwLCAxLCAwLCAgeCArIFIsIHksXG4gICAgJ0EnLCBSLCAgIFIsIDAsIDEsIDAsICB4IC0gUiwgeSxcblxuICAgICdNJywgeCAtIGlubmVyUiwgIHksXG4gICAgJ0EnLCBpbm5lclIsICAgICBpbm5lclIsIDAsIDEsIDAsIHggKyBpbm5lclIsIHksXG4gICAgJ0EnLCBpbm5lclIsICAgICBpbm5lclIsIDAsIDEsIDAsIHggLSBpbm5lclIsIHksXG4gICAgJ1onXG4gIF07XG59XG5cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYXJjIHBhdGhcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgUlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHN0YXJ0XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgZW5kXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgd1xuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGNvcm5lciBDb3JuZXIgcmFkaXVzXG4gKiBAcGFyYW0gIHtCb29lbGFuPX0gICAgICAgcmV0dXJuUG9pbnRzIC0gcmV0dXJuIGFycmF5IGZvciBwYXRoIG9yIHN0cmluZ1xuICpcbiAqIEByZXR1cm4ge1N0cmluZ3xBcnJheS48TnVtYmVyfFN0cmluZz59XG4gKi9cbmZ1bmN0aW9uIGFyYyhjZW50ZXIsIFIsIHN0YXJ0LCBlbmQsIHcsIGNvcm5lciwgcmV0dXJuUG9pbnRzKSB7XG4gIGxldCBwb2ludHM7XG4gIGlmIChNYXRoLmFicyhlbmQgLSBzdGFydCkgPT09IDM2MCkge1xuICAgIHBvaW50cyA9IGRyYXdDaXJjbGUoY2VudGVyLCBSLCB3KTtcbiAgICByZXR1cm4gcmV0dXJuUG9pbnRzID8gcG9pbnRzIDogcG9pbnRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIGxldCBpbm5lclIgICAgICAgID0gUiAtIHc7XG4gIGxldCBjaXJjdW1mZXJlbmNlID0gTWF0aC5hYnMoZW5kIC0gc3RhcnQpO1xuICBjb3JuZXIgPSBNYXRoLm1pbih3IC8gMiwgY29ybmVyKTtcblxuICBpZiAoMzYwICogKGNvcm5lciAvIChNYXRoLlBJICogKFIgLSB3KSkpID4gTWF0aC5hYnMoc3RhcnQgLSBlbmQpKSB7XG4gICAgY29ybmVyID0gKGNpcmN1bWZlcmVuY2UgLyAzNjApICogaW5uZXJSICogTWF0aC5QSTtcbiAgfVxuXG4gIC8vIGlubmVyIGFuZCBvdXRlciByYWRpdXNlc1xuICBsZXQgaW5uZXJSMiAgICAgID0gaW5uZXJSICsgY29ybmVyO1xuICBsZXQgb3V0ZXJSYWRpdXMgID0gUiAtIGNvcm5lcjtcblxuICAvLyBidXR0cyBjb3JuZXIgcG9pbnRzXG4gIGxldCBvU3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgb3V0ZXJSYWRpdXMsIHN0YXJ0KTtcbiAgbGV0IG9FbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBvdXRlclJhZGl1cywgZW5kKTtcblxuICBsZXQgaVN0YXJ0ID0gcG9pbnRPbkFyYyhjZW50ZXIsIGlubmVyUjIsIHN0YXJ0KTtcbiAgbGV0IGlFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBpbm5lclIyLCBlbmQpO1xuXG4gIGxldCBpU2VjdGlvbiAgPSAzNjAgKiAoY29ybmVyIC8gKFBJMiAqIGlubmVyUikpO1xuICBsZXQgb1NlY3Rpb24gID0gMzYwICogKGNvcm5lciAvIChQSTIgKiBSKSk7XG5cbiAgLy8gYXJjcyBlbmRwb2ludHNcbiAgbGV0IGlBcmNTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBpbm5lclIsIHN0YXJ0ICsgaVNlY3Rpb24pO1xuICBsZXQgaUFyY0VuZCAgID0gcG9pbnRPbkFyYyhjZW50ZXIsIGlubmVyUiwgZW5kICAgLSBpU2VjdGlvbik7XG5cbiAgbGV0IG9BcmNTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBSLCBzdGFydCArIG9TZWN0aW9uKTtcbiAgbGV0IG9BcmNFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBSLCBlbmQgICAtIG9TZWN0aW9uKTtcblxuICBsZXQgYXJjU3dlZXAxID0gY2lyY3VtZmVyZW5jZSA+IDE4MCArIDIgKiBvU2VjdGlvbiA/IDEgOiAwO1xuICBsZXQgYXJjU3dlZXAyID0gY2lyY3VtZmVyZW5jZSA+IDE4MCArIDIgKiBpU2VjdGlvbiA/IDEgOiAwO1xuXG4gIHBvaW50cyA9IFtcbiAgICAvLyBiZWdpbiBwYXRoXG4gICAgXCJNXCIsIG9TdGFydFswXSwgb1N0YXJ0WzFdLFxuICAgIC8vIG91dGVyIHN0YXJ0IGNvcm5lclxuICAgIFwiQVwiLCAgY29ybmVyLCAgY29ybmVyLCAwLCAgICAgICAgICAwLCAxLCAgb0FyY1N0YXJ0WzBdLCBvQXJjU3RhcnRbMV0sXG4gICAgLy8gb3V0ZXIgbWFpbiBhcmNcbiAgICBcIkFcIiwgICAgICAgUiwgICAgICAgUiwgMCwgIGFyY1N3ZWVwMSwgMSwgICBvQXJjRW5kWzBdLCAgICBvQXJjRW5kWzFdLFxuICAgIC8vIG91dGVyIGVuZCBjb3JuZXJcbiAgICBcIkFcIiwgIGNvcm5lciwgIGNvcm5lciwgMCwgICAgICAgICAgMCwgMSwgICAgICBvRW5kWzBdLCAgICAgICBvRW5kWzFdLFxuICAgIC8vIGVuZCBidXR0XG4gICAgXCJMXCIsIGlFbmRbMF0sIGlFbmRbMV0sXG4gICAgLy8gaW5uZXIgZW5kIGNvcm5lclxuICAgIFwiQVwiLCAgY29ybmVyLCAgY29ybmVyLCAwLCAgICAgICAgICAwLCAxLCAgIGlBcmNFbmRbMF0sICAgIGlBcmNFbmRbMV0sXG4gICAgLy8gaW5uZXIgYXJjXG4gICAgXCJBXCIsICBpbm5lclIsICBpbm5lclIsIDAsICAgYXJjU3dlZXAyLCAwLCBpQXJjU3RhcnRbMF0sICBpQXJjU3RhcnRbMV0sXG4gICAgLy8gaW5uZXIgc3RhcnQgY29ybmVyXG4gICAgXCJBXCIsICBjb3JuZXIsICBjb3JuZXIsIDAsICAgICAgICAgIDAsIDEsICAgIGlTdGFydFswXSwgICAgIGlTdGFydFsxXSxcbiAgICBcIlpcIiAvLyBlbmQgcGF0aFxuICBdO1xuXG4gIHJldHVybiByZXR1cm5Qb2ludHMgPyBwb2ludHMgOiBwb2ludHMuam9pbignICcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFyYztcbm1vZHVsZS5leHBvcnRzLnBvaW50T25BcmMgPSBwb2ludE9uQXJjO1xubW9kdWxlLmV4cG9ydHMuZHJhd0NpcmNsZSA9IGRyYXdDaXJjbGU7XG4iXX0=
