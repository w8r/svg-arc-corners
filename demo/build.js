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
var pointOnArc = function pointOnArc(center, R, angle) {
  var radians = (angle - 90) * RAD_DEG;

  return [center[0] + R * Math.cos(radians), center[1] + R * Math.sin(radians)];
};

/**
 * @param  {Array.<Number>} center
 * @param  {Number}         R
 * @param  {Number}         width
 * @return {String}
 */
var drawCircle = function drawCircle(center, R, width) {
  var innerR = R - width;

  var _center = _slicedToArray(center, 2);

  var x = _center[0];
  var y = _center[1];


  return ['M', x - R, y, 'A', R, R, 0, 1, 0, x + R, y, 'A', R, R, 0, 1, 0, x - R, y, 'M', x - innerR, y, 'A', innerR, innerR, 0, 1, 0, x + innerR, y, 'A', innerR, innerR, 0, 1, 0, x - innerR, y, 'Z'];
};

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
var arc = function arc(center, R, start, end, w, corner, returnPoints) {
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
};

module.exports = arc;
module.exports.pointOnArc = pointOnArc;
module.exports.drawCircle = drawCircle;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL2luZGV4LmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7Ozs7O0FBRUEsT0FBTyxHQUFQOztBQUVBLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxVQUFyQyxFQUFpRCxRQUFqRCxFQUEwRDtBQUN4RCxNQUFNLFFBQVEsdUJBQVcsTUFBWCxFQUFtQixNQUFuQixFQUEyQixRQUEzQixDQUFkO0FBQ0EsTUFBTSxNQUFNLHVCQUFXLE1BQVgsRUFBbUIsTUFBbkIsRUFBMkIsVUFBM0IsQ0FBWjs7QUFFQSxNQUFJLFdBQVcsV0FBVyxVQUFYLEdBQXdCLEdBQXhCLEdBQThCLENBQTlCLEdBQWtDLENBQWpEOztBQUVBLFNBQU8sQ0FDTCxHQURLLEVBQ0EsTUFBTSxDQUFOLENBREEsRUFDVSxNQUFNLENBQU4sQ0FEVixFQUVMLEdBRkssRUFFQSxNQUZBLEVBRVEsTUFGUixFQUVnQixDQUZoQixFQUVtQixRQUZuQixFQUU2QixDQUY3QixFQUVnQyxJQUFJLENBQUosQ0FGaEMsRUFFd0MsSUFBSSxDQUFKLENBRnhDLEVBR0wsSUFISyxDQUdBLEdBSEEsQ0FBUDtBQUlEOztBQUVELElBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLElBQU0sT0FBTyxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNBLElBQU0sSUFBSyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBWDs7QUFFQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxJQUFNLEtBQUssU0FBUyxhQUFULENBQXVC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ZSxVQUFmLEdBQTRCLFVBQTVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBhcmMsIHsgcG9pbnRPbkFyYyB9IGZyb20gJy4uL2luZGV4JztcblxuZ2xvYmFsLmFyYyA9IGFyYztcblxuZnVuY3Rpb24gZGVzY3JpYmVBcmMoY2VudGVyLCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKXtcbiAgY29uc3Qgc3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgcmFkaXVzLCBlbmRBbmdsZSk7XG4gIGNvbnN0IGVuZCA9IHBvaW50T25BcmMoY2VudGVyLCByYWRpdXMsIHN0YXJ0QW5nbGUpO1xuXG4gIHZhciBhcmNTd2VlcCA9IGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSA8IDE4MCA/IDAgOiAxO1xuXG4gIHJldHVybiBbXG4gICAgXCJNXCIsIHN0YXJ0WzBdLCBzdGFydFsxXSxcbiAgICBcIkFcIiwgcmFkaXVzLCByYWRpdXMsIDAsIGFyY1N3ZWVwLCAwLCBlbmRbMF0sIGVuZFsxXVxuICBdLmpvaW4oXCIgXCIpO1xufVxuXG5jb25zdCBhcmMxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FyYzEnKTtcbmNvbnN0IGFyYzIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXJjMicpO1xuY29uc3QgYSAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXJjJyk7XG5cbmNvbnN0IGMxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2MxJyk7XG5jb25zdCBjMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjMicpO1xuY29uc3QgYzMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYzMnKTtcbmNvbnN0IGM0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2M0Jyk7XG5cbmNvbnN0IGIxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2IxJyk7XG5jb25zdCBiMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNiMicpO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzJyk7XG5cbmZ1bmN0aW9uIHJlbmRlciAoKSB7XG4gIGxldCBjID0gW2Zvcm1bJ3gnXS52YWx1ZSwgZm9ybVsneSddLnZhbHVlXS5tYXAocGFyc2VGbG9hdCk7XG4gIGxldCByYWRpdXMgPSBwYXJzZUZsb2F0KGZvcm1bJ3JhZGl1cyddLnZhbHVlKTtcbiAgbGV0IHdpZHRoICA9IHBhcnNlRmxvYXQoZm9ybVsnd2lkdGgnXS52YWx1ZSk7XG4gIGxldCBjb3JuZXIgPSBwYXJzZUZsb2F0KGZvcm1bJ2Nvcm5lciddLnZhbHVlKTtcblxuICBsZXQgYW5nbGUgID0gcGFyc2VGbG9hdChmb3JtWydhbmdsZSddLnZhbHVlKTtcbiAgZm9ybVsnYW5nbGUtdmFsdWUnXS52YWx1ZSA9IGFuZ2xlO1xuXG4gIHVwZGF0ZShjLCByYWRpdXMsIDAsIGFuZ2xlLCB3aWR0aCwgY29ybmVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ2lyY2xlKGNpcmNsZSwgYywgcikge1xuICBjaXJjbGUuc2V0QXR0cmlidXRlKCdyJywgcik7XG4gIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N4JywgY1swXSk7XG4gIGNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2N5JywgY1sxXSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmUobGluZSwgcDEsIHAyKSB7XG4gIGxpbmUuc2V0QXR0cmlidXRlKCd4MScsIHAxWzBdKTtcbiAgbGluZS5zZXRBdHRyaWJ1dGUoJ3kxJywgcDFbMV0pO1xuICBsaW5lLnNldEF0dHJpYnV0ZSgneDInLCBwMlswXSk7XG4gIGxpbmUuc2V0QXR0cmlidXRlKCd5MicsIHAyWzFdKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGMsIHJhZGl1cywgc3RhcnQsIGFuZ2xlLCB3aWR0aCwgY29ybmVyKSB7XG4gIGxldCBvdXRlclNoaWZ0ID0gMzYwICogKGNvcm5lciAvICgyICogTWF0aC5QSSAqIChyYWRpdXMgLSBjb3JuZXIpKSk7XG4gIGxldCBpbm5lclNoaWZ0ID0gMzYwICogKGNvcm5lciAvICgyICogTWF0aC5QSSAqIChyYWRpdXMgLSB3aWR0aCArIGNvcm5lcikpKTtcblxuICBsZXQgY2VudGVyMSA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gY29ybmVyLCBzdGFydCArIG91dGVyU2hpZnQpO1xuICBsZXQgY2VudGVyMiA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gY29ybmVyLCBhbmdsZSAtIG91dGVyU2hpZnQpO1xuICBsZXQgY2VudGVyMyA9IHBvaW50T25BcmMoYywgcmFkaXVzIC0gd2lkdGggKyBjb3JuZXIsIHN0YXJ0ICsgaW5uZXJTaGlmdCk7XG4gIGxldCBjZW50ZXI0ID0gcG9pbnRPbkFyYyhjLCByYWRpdXMgLSB3aWR0aCArIGNvcm5lciwgYW5nbGUgLSBpbm5lclNoaWZ0KTtcblxuICBhcmMxLnNldEF0dHJpYnV0ZSgnZCcsIGRlc2NyaWJlQXJjKGMsIHJhZGl1cyAtIGNvcm5lciwgc3RhcnQgKyBvdXRlclNoaWZ0LCBhbmdsZSAtIG91dGVyU2hpZnQpKTtcbiAgYXJjMi5zZXRBdHRyaWJ1dGUoJ2QnLCBkZXNjcmliZUFyYyhjLCByYWRpdXMgLSB3aWR0aCArIGNvcm5lciwgc3RhcnQgKyBpbm5lclNoaWZ0LCBhbmdsZSAtIGlubmVyU2hpZnQpKTtcblxuICBhLnNldEF0dHJpYnV0ZSgnZCcsIGFyYyhjLCByYWRpdXMsIHN0YXJ0LCBhbmdsZSwgd2lkdGgsIGNvcm5lcikpO1xuXG4gIHVwZGF0ZUNpcmNsZShjMSwgY2VudGVyMSwgY29ybmVyKTtcbiAgdXBkYXRlQ2lyY2xlKGMyLCBjZW50ZXIyLCBjb3JuZXIpO1xuICB1cGRhdGVDaXJjbGUoYzMsIGNlbnRlcjMsIGNvcm5lcik7XG4gIHVwZGF0ZUNpcmNsZShjNCwgY2VudGVyNCwgY29ybmVyKTtcblxuICB1cGRhdGVMaW5lKGIxLCBjZW50ZXIxLCBjZW50ZXIzKTtcbiAgdXBkYXRlTGluZShiMiwgY2VudGVyMiwgY2VudGVyNCk7XG59XG5cbnJlbmRlcigpO1xuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHJlbmRlcik7XG5mb3JtWydhbmdsZSddLmZvY3VzKCk7XG4iLCJjb25zdCBSQURfREVHID0gTWF0aC5QSSAvIDE4MC4wO1xuY29uc3QgUEkyID0gMiAqIE1hdGguUEk7XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IFJcbiAqIEBwYXJhbSAge051bWJlcn0gYW5nbGVcbiAqIEByZXR1cm4ge0FycmF5LjxOdW1iZXI+fVxuICovXG5jb25zdCBwb2ludE9uQXJjID0gKGNlbnRlciwgUiwgYW5nbGUpID0+IHtcbiAgbGV0IHJhZGlhbnMgPSAoYW5nbGUgLSA5MCkgKiBSQURfREVHO1xuXG4gIHJldHVybiBbXG4gICAgY2VudGVyWzBdICsgKFIgKiBNYXRoLmNvcyhyYWRpYW5zKSksXG4gICAgY2VudGVyWzFdICsgKFIgKiBNYXRoLnNpbihyYWRpYW5zKSlcbiAgXTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgUlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHdpZHRoXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmNvbnN0IGRyYXdDaXJjbGUgPSAoY2VudGVyLCBSLCB3aWR0aCkgPT4ge1xuICBsZXQgaW5uZXJSID0gUiAtIHdpZHRoO1xuICBsZXQgW3gsIHldID0gY2VudGVyO1xuXG4gIHJldHVybiBbXG4gICAgJ00nLCB4IC0gUiwgICB5LFxuICAgICdBJywgUiwgICBSLCAwLCAxLCAwLCAgeCArIFIsIHksXG4gICAgJ0EnLCBSLCAgIFIsIDAsIDEsIDAsICB4IC0gUiwgeSxcblxuICAgICdNJywgeCAtIGlubmVyUiwgIHksXG4gICAgJ0EnLCBpbm5lclIsICAgICBpbm5lclIsIDAsIDEsIDAsIHggKyBpbm5lclIsIHksXG4gICAgJ0EnLCBpbm5lclIsICAgICBpbm5lclIsIDAsIDEsIDAsIHggLSBpbm5lclIsIHksXG4gICAgJ1onXG4gIF07XG59O1xuXG5cbi8qKlxuICogR2VuZXJhdGVzIGFyYyBwYXRoXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIFJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBzdGFydFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGVuZFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHdcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBjb3JuZXIgQ29ybmVyIHJhZGl1c1xuICogQHBhcmFtICB7Qm9vZWxhbj19ICAgICAgIHJldHVyblBvaW50cyAtIHJldHVybiBhcnJheSBmb3IgcGF0aCBvciBzdHJpbmdcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd8QXJyYXkuPE51bWJlcnxTdHJpbmc+fVxuICovXG5jb25zdCBhcmMgPSAoY2VudGVyLCBSLCBzdGFydCwgZW5kLCB3LCBjb3JuZXIsIHJldHVyblBvaW50cykgPT4ge1xuICBsZXQgcG9pbnRzO1xuICBpZiAoTWF0aC5hYnMoZW5kIC0gc3RhcnQpID09PSAzNjApIHtcbiAgICBwb2ludHMgPSBkcmF3Q2lyY2xlKGNlbnRlciwgUiwgdyk7XG4gICAgcmV0dXJuIHJldHVyblBvaW50cyA/IHBvaW50cyA6IHBvaW50cy5qb2luKCcgJyk7XG4gIH1cblxuICBsZXQgaW5uZXJSICAgICAgICA9IFIgLSB3O1xuICBsZXQgY2lyY3VtZmVyZW5jZSA9IE1hdGguYWJzKGVuZCAtIHN0YXJ0KTtcbiAgY29ybmVyID0gTWF0aC5taW4odyAvIDIsIGNvcm5lcik7XG5cbiAgaWYgKDM2MCAqIChjb3JuZXIgLyAoTWF0aC5QSSAqIChSIC0gdykpKSA+IE1hdGguYWJzKHN0YXJ0IC0gZW5kKSkge1xuICAgIGNvcm5lciA9IChjaXJjdW1mZXJlbmNlIC8gMzYwKSAqIGlubmVyUiAqIE1hdGguUEk7XG4gIH1cblxuICAvLyBpbm5lciBhbmQgb3V0ZXIgcmFkaXVzZXNcbiAgbGV0IGlubmVyUjIgICAgICA9IGlubmVyUiArIGNvcm5lcjtcbiAgbGV0IG91dGVyUmFkaXVzICA9IFIgLSBjb3JuZXI7XG5cbiAgLy8gYnV0dHMgY29ybmVyIHBvaW50c1xuICBsZXQgb1N0YXJ0ID0gcG9pbnRPbkFyYyhjZW50ZXIsIG91dGVyUmFkaXVzLCBzdGFydCk7XG4gIGxldCBvRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgb3V0ZXJSYWRpdXMsIGVuZCk7XG5cbiAgbGV0IGlTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBpbm5lclIyLCBzdGFydCk7XG4gIGxldCBpRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgaW5uZXJSMiwgZW5kKTtcblxuICBsZXQgaVNlY3Rpb24gID0gMzYwICogKGNvcm5lciAvIChQSTIgKiBpbm5lclIpKTtcbiAgbGV0IG9TZWN0aW9uICA9IDM2MCAqIChjb3JuZXIgLyAoUEkyICogUikpO1xuXG4gIC8vIGFyY3MgZW5kcG9pbnRzXG4gIGxldCBpQXJjU3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgaW5uZXJSLCBzdGFydCArIGlTZWN0aW9uKTtcbiAgbGV0IGlBcmNFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBpbm5lclIsIGVuZCAgIC0gaVNlY3Rpb24pO1xuXG4gIGxldCBvQXJjU3RhcnQgPSBwb2ludE9uQXJjKGNlbnRlciwgUiwgc3RhcnQgKyBvU2VjdGlvbik7XG4gIGxldCBvQXJjRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgUiwgZW5kICAgLSBvU2VjdGlvbik7XG5cbiAgbGV0IGFyY1N3ZWVwMSA9IGNpcmN1bWZlcmVuY2UgPiAxODAgKyAyICogb1NlY3Rpb24gPyAxIDogMDtcbiAgbGV0IGFyY1N3ZWVwMiA9IGNpcmN1bWZlcmVuY2UgPiAxODAgKyAyICogaVNlY3Rpb24gPyAxIDogMDtcblxuICBwb2ludHMgPSBbXG4gICAgLy8gYmVnaW4gcGF0aFxuICAgIFwiTVwiLCBvU3RhcnRbMF0sIG9TdGFydFsxXSxcbiAgICAvLyBvdXRlciBzdGFydCBjb3JuZXJcbiAgICBcIkFcIiwgIGNvcm5lciwgIGNvcm5lciwgMCwgICAgICAgICAgMCwgMSwgIG9BcmNTdGFydFswXSwgb0FyY1N0YXJ0WzFdLFxuICAgIC8vIG91dGVyIG1haW4gYXJjXG4gICAgXCJBXCIsICAgICAgIFIsICAgICAgIFIsIDAsICBhcmNTd2VlcDEsIDEsICAgb0FyY0VuZFswXSwgICAgb0FyY0VuZFsxXSxcbiAgICAvLyBvdXRlciBlbmQgY29ybmVyXG4gICAgXCJBXCIsICBjb3JuZXIsICBjb3JuZXIsIDAsICAgICAgICAgIDAsIDEsICAgICAgb0VuZFswXSwgICAgICAgb0VuZFsxXSxcbiAgICAvLyBlbmQgYnV0dFxuICAgIFwiTFwiLCBpRW5kWzBdLCBpRW5kWzFdLFxuICAgIC8vIGlubmVyIGVuZCBjb3JuZXJcbiAgICBcIkFcIiwgIGNvcm5lciwgIGNvcm5lciwgMCwgICAgICAgICAgMCwgMSwgICBpQXJjRW5kWzBdLCAgICBpQXJjRW5kWzFdLFxuICAgIC8vIGlubmVyIGFyY1xuICAgIFwiQVwiLCAgaW5uZXJSLCAgaW5uZXJSLCAwLCAgIGFyY1N3ZWVwMiwgMCwgaUFyY1N0YXJ0WzBdLCAgaUFyY1N0YXJ0WzFdLFxuICAgIC8vIGlubmVyIHN0YXJ0IGNvcm5lclxuICAgIFwiQVwiLCAgY29ybmVyLCAgY29ybmVyLCAwLCAgICAgICAgICAwLCAxLCAgICBpU3RhcnRbMF0sICAgICBpU3RhcnRbMV0sXG4gICAgXCJaXCIgLy8gZW5kIHBhdGhcbiAgXTtcblxuICByZXR1cm4gcmV0dXJuUG9pbnRzID8gcG9pbnRzIDogcG9pbnRzLmpvaW4oJyAnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcmM7XG5tb2R1bGUuZXhwb3J0cy5wb2ludE9uQXJjID0gcG9pbnRPbkFyYztcbm1vZHVsZS5leHBvcnRzLmRyYXdDaXJjbGUgPSBkcmF3Q2lyY2xlO1xuIl19
