(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cornerArc = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQSxJQUFNLFVBQVUsS0FBSyxFQUFMLEdBQVUsS0FBMUI7QUFDQSxJQUFNLE1BQU0sSUFBSSxLQUFLLEVBQXJCOzs7Ozs7OztBQVNBLFNBQVMsVUFBVCxDQUFvQixNQUFwQixFQUE0QixDQUE1QixFQUErQixLQUEvQixFQUFzQztBQUNwQyxNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQVQsSUFBZSxPQUEvQjs7QUFFQSxTQUFPLENBQ0wsT0FBTyxDQUFQLElBQWEsSUFBSSxLQUFLLEdBQUwsQ0FBUyxPQUFULENBRFosRUFFTCxPQUFPLENBQVAsSUFBYSxJQUFJLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FGWixDQUFQO0FBSUQ7Ozs7Ozs7O0FBU0QsU0FBUyxVQUFULENBQW9CLE1BQXBCLEVBQTRCLENBQTVCLEVBQStCLEtBQS9CLEVBQXNDO0FBQ3BDLE1BQUksS0FBUyxJQUFJLEtBQWpCOztBQURvQywrQkFFdkIsTUFGdUI7O0FBQUEsTUFFL0IsQ0FGK0I7QUFBQSxNQUU1QixDQUY0Qjs7O0FBSXBDLFNBQU8sQ0FDTCxHQURLLEVBQ0EsSUFBSSxDQURKLEVBQ1MsQ0FEVCxFQUVMLEdBRkssRUFFQyxDQUZELEVBRU0sQ0FGTixFQUVTLENBRlQsRUFFWSxDQUZaLEVBRWUsQ0FGZixFQUVtQixJQUFJLENBRnZCLEVBRTBCLENBRjFCLEVBR0wsR0FISyxFQUdDLENBSEQsRUFHTSxDQUhOLEVBR1MsQ0FIVCxFQUdZLENBSFosRUFHZSxDQUhmLEVBR21CLElBQUksQ0FIdkIsRUFHMEIsQ0FIMUIsRUFLTCxHQUxLLEVBS0EsSUFBSSxFQUxKLEVBS1MsQ0FMVCxFQU1MLEdBTkssRUFNQyxFQU5ELEVBTUssRUFOTCxFQU1TLENBTlQsRUFNWSxDQU5aLEVBTWUsQ0FOZixFQU1rQixJ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QlEsQ0FoQlIsRUFnQlcsQ0FoQlgsRUFnQnFCLENBaEJyQixFQWdCd0IsT0FBTyxDQUFQLENBaEJ4QixFQWdCc0MsT0FBTyxDQUFQLENBaEJ0QyxFQWlCTCxHO0FBakJLLElBa0JMLElBbEJLLENBa0JBLEdBbEJBLENBQVA7QUFtQkQ7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLEdBQWpCO0FBQ0EsT0FBTyxPQUFQLENBQWUsVUFBZixHQUE0QixVQUE1QjtBQUNBLE9BQU8sT0FBUCxDQUFlLFVBQWYsR0FBNEIsVUFBNUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgUkFEX0RFRyA9IE1hdGguUEkgLyAxODAuMDtcbmNvbnN0IFBJMiA9IDIgKiBNYXRoLlBJO1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSBSXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGFuZ2xlXG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuZnVuY3Rpb24gcG9pbnRPbkFyYyhjZW50ZXIsIFIsIGFuZ2xlKSB7XG4gIGNvbnN0IHJhZGlhbnMgPSAoYW5nbGUgLSA5MCkgKiBSQURfREVHO1xuXG4gIHJldHVybiBbXG4gICAgY2VudGVyWzBdICsgKFIgKiBNYXRoLmNvcyhyYWRpYW5zKSksXG4gICAgY2VudGVyWzFdICsgKFIgKiBNYXRoLnNpbihyYWRpYW5zKSlcbiAgXTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBjZW50ZXIgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7fSBSICAgICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSB3aWR0aCAgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKGNlbnRlciwgUiwgd2lkdGgpIHtcbiAgbGV0IGlSICAgICA9IFIgLSB3aWR0aDtcbiAgbGV0IFt4LCB5XSA9IGNlbnRlcjtcblxuICByZXR1cm4gW1xuICAgICdNJywgeCAtIFIsICAgeSxcbiAgICAnQScsICBSLCAgIFIsIDAsIDEsIDAsICB4ICsgUiwgeSxcbiAgICAnQScsICBSLCAgIFIsIDAsIDEsIDAsICB4IC0gUiwgeSxcblxuICAgICdNJywgeCAtIGlSLCAgeSxcbiAgICAnQScsICBpUiwgaVIsIDAsIDEsIDAsIHggKyBpUiwgeSxcbiAgICAnQScsICBpUiwgaVIsIDAsIDEsIDAsIHggLSBpUiwgeSxcbiAgICAnWidcbiAgXS5qb2luKCcgJyk7XG59XG5cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYXJjIHBhdGhcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgUlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHN0YXJ0XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgZW5kXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgd1xuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGNSIENvcm5lciByYWRpdXNcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGFyYyhjZW50ZXIsIFIsIHN0YXJ0LCBlbmQsIHcsIGNSKSB7XG4gIGlmIChNYXRoLmFicyhlbmQgLSBzdGFydCkgPT09IDM2MCkge1xuICAgIHJldHVybiBkcmF3Q2lyY2xlKGNlbnRlciwgUiwgdyk7XG4gIH1cblxuICBjUiA9IE1hdGgubWluKHcgLyAyLCBjUik7XG5cbiAgLy8gaW5uZXIgYW5kIG91dGVyIHJhZGl1c2VzXG4gIGNvbnN0IGlSICA9IFIgLSB3O1xuICBjb25zdCBpUjIgPSBpUiArIGNSO1xuICBjb25zdCBvUiAgPSBSIC0gY1I7XG5cbiAgLy8gYnV0dHMgY29ybmVyIHBvaW50c1xuICBsZXQgb1N0YXJ0ID0gcG9pbnRPbkFyYyhjZW50ZXIsIG9SLCBzdGFydCk7XG4gIGxldCBvRW5kICAgPSBwb2ludE9uQXJjKGNlbnRlciwgb1IsIGVuZCk7XG5cbiAgbGV0IGlTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBpUjIsIHN0YXJ0KTtcbiAgbGV0IGlFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBpUjIsIGVuZCk7XG5cbiAgbGV0IGlTZWN0aW9uICA9IDM2MCAqIChjUiAvIChQSTIgKiBpUikpO1xuICBsZXQgb1NlY3Rpb24gID0gMzYwICogKGNSIC8gKFBJMiAqIFIpKTtcblxuICAvLyBhcmNzIGVuZHBvaW50c1xuICBsZXQgaUFyY1N0YXJ0ID0gcG9pbnRPbkFyYyhjZW50ZXIsIGlSLCBzdGFydCArIGlTZWN0aW9uKTtcbiAgbGV0IGlBcmNFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBpUiwgZW5kICAgLSBpU2VjdGlvbik7XG5cbiAgbGV0IG9BcmNTdGFydCA9IHBvaW50T25BcmMoY2VudGVyLCBSLCBzdGFydCArIG9TZWN0aW9uKTtcbiAgbGV0IG9BcmNFbmQgICA9IHBvaW50T25BcmMoY2VudGVyLCBSLCBlbmQgICAtIG9TZWN0aW9uKTtcblxuICBjb25zdCBhcmNTd2VlcCA9IGVuZCAtIHN0YXJ0IDw9IDE4MCA/IDAgOiAxO1xuXG4gIHJldHVybiBbXG4gICAgLy8gYmVnaW4gcGF0aFxuICAgIFwiTVwiLCBvU3RhcnRbMF0sIG9TdGFydFsxXSxcbiAgICAvLyBvdXRlciBzdGFydCBjb3JuZXJcbiAgICBcIkFcIiwgY1IsIGNSLCAwLCAwLCAgICAgICAgMSwgb0FyY1N0YXJ0WzBdLCBvQXJjU3RhcnRbMV0sXG4gICAgLy8gb3V0ZXIgbWFpbiBhcmNcbiAgICBcIkFcIiwgUiwgIFIsICAwLCBhcmNTd2VlcCwgMSwgb0FyY0VuZFswXSwgICBvQXJjRW5kWzFdLFxuICAgIC8vIG91dGVyIGVuZCBjb3JuZXJcbiAgICBcIkFcIiwgY1IsIGNSLCAwLCAwLCAgICAgICAgMSwgb0VuZFswXSwgICAgICBvRW5kWzFdLFxuICAgIC8vIGVuZCBidXR0XG4gICAgXCJMXCIsIGlFbmRbMF0sIGlFbmRbMV0sXG4gICAgLy8gaW5uZXIgZW5kIGNvcm5lclxuICAgIFwiQVwiLCBjUiwgY1IsIDAsIDAsICAgICAgICAxLCBpQXJjRW5kWzBdLCAgIGlBcmNFbmRbMV0sXG4gICAgLy8gaW5uZXIgYXJjXG4gICAgXCJBXCIsIGlSLCBpUiwgMCwgYXJjU3dlZXAsIDAsIGlBcmNTdGFydFswXSwgaUFyY1N0YXJ0WzFdLFxuICAgIC8vIGlubmVyIHN0YXJ0IGNvcm5lclxuICAgIFwiQVwiLCBjUiwgY1IsIDAsIDAsICAgICAgICAxLCBpU3RhcnRbMF0sICAgIGlTdGFydFsxXSxcbiAgICBcIlpcIiAvLyBlbmQgcGF0aFxuICBdLmpvaW4oJyAnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcmM7XG5tb2R1bGUuZXhwb3J0cy5wb2ludE9uQXJjID0gcG9pbnRPbkFyYztcbm1vZHVsZS5leHBvcnRzLmRyYXdDaXJjbGUgPSBkcmF3Q2lyY2xlO1xuXG5cblxuIl19
