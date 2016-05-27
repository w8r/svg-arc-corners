const RAD_DEG = Math.PI / 180.0;
const PI2 = 2 * Math.PI;


/**
 * @param  {Array.<Number>} center
 * @param  {Number} R
 * @param  {Number} angle
 * @return {Array.<Number>}
 */
function pointOnArc(center, R, angle) {
  let radians = (angle - 90) * RAD_DEG;

  return [
    center[0] + (R * Math.cos(radians)),
    center[1] + (R * Math.sin(radians))
  ];
}


/**
 * @param  {Array.<Number>} center
 * @param  {Number}         R
 * @param  {Number}         width
 * @return {String}
 */
function drawCircle(center, R, width) {
  let innerR = R - width;
  let [x, y] = center;

  return [
    'M', x - R,   y,
    'A', R,   R, 0, 1, 0,  x + R, y,
    'A', R,   R, 0, 1, 0,  x - R, y,

    'M', x - innerR,  y,
    'A', innerR,     innerR, 0, 1, 0, x + innerR, y,
    'A', innerR,     innerR, 0, 1, 0, x - innerR, y,
    'Z'
  ].join(' ');
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

  corner = Math.min(w / 2, corner);

  // inner and outer radiuses
  let innerR  = R - w;
  let innerR2 = innerR + corner;
  let oR  = R - corner;

  // butts corner points
  let oStart = pointOnArc(center, oR, start);
  let oEnd   = pointOnArc(center, oR, end);

  let iStart = pointOnArc(center, innerR2, start);
  let iEnd   = pointOnArc(center, innerR2, end);

  let iSection  = 360 * (corner / (PI2 * innerR));
  let oSection  = 360 * (corner / (PI2 * R));

  // arcs endpoints
  let iArcStart = pointOnArc(center, innerR, start + iSection);
  let iArcEnd   = pointOnArc(center, innerR, end   - iSection);

  let oArcStart = pointOnArc(center, R, start + oSection);
  let oArcEnd   = pointOnArc(center, R, end   - oSection);

  let arcSweep = end - start <= 180 ? 0 : 1;

  return [
    // begin path
    "M", oStart[0], oStart[1],
    // outer start corner
    "A",  corner,  corner, 0,          0, 1,  oArcStart[0], oArcStart[1],
    // outer main arc
    "A",       R,       R, 0,   arcSweep, 1,   oArcEnd[0],    oArcEnd[1],
    // outer end corner
    "A",  corner,  corner, 0,          0, 1,      oEnd[0],       oEnd[1],
    // end butt
    "L", iEnd[0], iEnd[1],
    // inner end corner
    "A",  corner,  corner, 0,          0, 1,   iArcEnd[0],    iArcEnd[1],
    // inner arc
    "A",  innerR,  innerR, 0,   arcSweep, 0, iArcStart[0],  iArcStart[1],
    // inner start corner
    "A",  corner,  corner, 0,          0, 1,    iStart[0],     iStart[1],
    "Z" // end path
  ].join(' ');
}

module.exports = arc;
module.exports.pointOnArc = pointOnArc;
module.exports.drawCircle = drawCircle;



