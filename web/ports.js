import shortid from 'shortid';

const inputCircleColor = '#000462';
const outputCircleColor = '#9c0013';

export let portType = {
  input: Symbol('input'),
  output: Symbol('output')
};

export function createPort(paper, x, y, radius, type) {
  let circleColor = (type === portType.input) ? inputCircleColor : outputCircleColor;
  let inputCircle = paper.circle(x, y, radius)
    .attr({
      fill: circleColor,
      ['stroke-width']: 0
    });
  inputCircle.oid = shortid.generate();

  return inputCircle;
}
