import arc, { pointOnArc } from '../';

function describeArc(center, radius, startAngle, endAngle){
  const start = pointOnArc(center, radius, endAngle);
  const end = pointOnArc(center, radius, startAngle);

  var arcSweep = endAngle - startAngle < 180 ? 0 : 1;

  return [
    "M", start[0], start[1],
    "A", radius, radius, 0, arcSweep, 0, end[0], end[1]
  ].join(" ");
}

const arc1 = document.querySelector('#arc1');
const arc2 = document.querySelector('#arc2');
const a  = document.querySelector('#arc');

const c1 = document.querySelector('#c1');
const c2 = document.querySelector('#c2');
const c3 = document.querySelector('#c3');
const c4 = document.querySelector('#c4');

const b1 = document.querySelector('#b1');
const b2 = document.querySelector('#b2');

const form = document.querySelector('.controls');

function render () {
  let c = [form['x'].value, form['y'].value].map(parseFloat);
  let radius = parseFloat(form['radius'].value);
  let width  = parseFloat(form['width'].value);
  let corner = parseFloat(form['corner'].value);

  let angle  = parseFloat(form['angle'].value);
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
  let outerShift = 360 * (corner / (2 * Math.PI * (radius - corner)));
  let innerShift = 360 * (corner / (2 * Math.PI * (radius - width + corner)));

  let center1 = pointOnArc(c, radius - corner, start + outerShift);
  let center2 = pointOnArc(c, radius - corner, angle - outerShift);
  let center3 = pointOnArc(c, radius - width + corner, start + innerShift);
  let center4 = pointOnArc(c, radius - width + corner, angle - innerShift);

  arc1.setAttribute('d', describeArc(c, radius - corner, start + outerShift, angle - outerShift));
  arc2.setAttribute('d', describeArc(c, radius - width + corner, start + innerShift, angle - innerShift));

  a.setAttribute('d', arc(c, radius, start, angle, width, corner));

  updateCircle(c1, center1, corner);
  updateCircle(c2, center2, corner);
  updateCircle(c3, center3, corner);
  updateCircle(c4, center4, corner);

  updateLine(b1, center1, center3);
  updateLine(b2, center2, center4);
}

render();

form.addEventListener('change', render);
