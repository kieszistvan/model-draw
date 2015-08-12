import shortid from 'shortid';
import PortType from './PortType';

const inputCircleColor = '#000462';
const outputCircleColor = '#9c0013';

export default class Port {
  constructor(type) {
    this.type = type;
  }
  draw(paper, x, y, radius) {
    let circleColor = (this.type === PortType.input) ? inputCircleColor : outputCircleColor;
    this.circle = paper.circle(x, y, radius)
      .attr({
        fill: circleColor,
        ['stroke-width']: 0
      });
    this.circle.oid = shortid.generate();
  }
  get type() {
    return this._type;
  }
  set type(portType) {
    this._type = portType;
  }
}
