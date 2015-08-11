import shortid from 'shortid';
import * as PortType from './PortType';

const inputCircleColor = '#000462';
const outputCircleColor = '#9c0013';

export default class Port {
  constructor(paper, x, y, radius, type) {
    this.type = type;
    let circleColor = (type === PortType.input) ? inputCircleColor : outputCircleColor;
    this.circle = paper.circle(x, y, radius)
      .attr({
        fill: circleColor,
        ['stroke-width']: 0
      });
    this.circle.oid = shortid.generate();
  }
  getPortType() {
    return this.type;
  }

}
