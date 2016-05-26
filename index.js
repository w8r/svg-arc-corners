const RAD_DEG = Math.PI / 180.0;
const PI2 = 2 * Math.PI;


/**
 * @param  {Array.<Number>} center
 * @param  {Number} R
 * @param  {Number} angle
 * @return {Array.<Number>}
 */
function pointOnArc(center, R, angle) {
  const radians = (angle - 90) * RAD_DEG;

  return [
    center[0] + (R * Math.cos(radians)),
    center[1] + (R * Math.sin(radians))
  ];
}


/**
 * @param  {Array.<Number>} center [description]
 * @param  {} R      [description]
 * @param  {[type]} width  [description]
 * @return {[type]}        [description]
 */
function drawCircle(center, R, width) {
  let iR     = R - width;
  let [x, y] = center;

  return [
    'M', x - R,   y,
    'A',  R,   R, 0, 1, 0,  x + R, y,
    'A',  R,   R, 0, 1, 0,  x - R, y,

    'M', x - iR,  y,
    'A',  iR, iR, 0, 1, 0, x + iR, y,
    'A',  iR, iR, 0, 1, 0, x - iR, y,
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
  const iR  = R - w;
  const iR2 = iR + cR;
  const oR  = R - cR;

  // butts corner points
  let oStart = pointOnArc(center, oR, start);
  let oEnd   = pointOnArc(center, oR, end);

  let iStart = pointOnArc(center, iR2, start);
  let iEnd   = pointOnArc(center, iR2, end);

  let iSection  = 360 * (cR / (PI2 * iR));
  let oSection  = 360 * (cR / (PI2 * R));

  // arcs endpoints
  let iArcStart = pointOnArc(center, iR, start + iSection);
  let iArcEnd   = pointOnArc(center, iR, end   - iSection);

  let oArcStart = pointOnArc(center, R, start + oSection);
  let oArcEnd   = pointOnArc(center, R, end   - oSection);

  const arcSweep = end - start <= 180 ? 0 : 1;

  return [
    // begin path
    "M", oStart[0], oStart[1],
    // outer start corner
    "A", cR, cR, 0, 0,        1, oArcStart[0], oArcStart[1],
    // outer main arc
    "A", R,  R,  0, arcSweep, 1, oArcEnd[0],   oArcEnd[1],
    // outer end corner
    "A", cR, cR, 0, 0,        1, oEnd[0],      oEnd[1],
    // end butt
    "L", iEnd[0], iEnd[1],
    // inner end corner
    "A", cR, cR, 0, 0,        1, iArcEnd[0],   iArcEnd[1],
    // inner arc
    "A", iR, iR, 0, arcSweep, 0, iArcStart[0], iArcStart[1],
    // inner start corner
    "A", cR, cR, 0, 0,        1, iStart[0],    iStart[1],
    "Z" // end path
  ].join(' ');
}

module.exports = arc;
module.exports.pointOnArc = pointOnArc;
module.exports.drawCircle = drawCircle;



