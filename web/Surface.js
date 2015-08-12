import Raphael from 'raphael/dev';

import * as PortType from './PortType';
import Operator from './Operator';
import Paths from './Paths';

export default class Surface {
  constructor(domId) {
    const paper = new Raphael(domId);
    const paths = new Paths(paper);

    this.operators = [];
    this.paper = paper;
    this.paths = paths;
  }
  buildFromJson(json) {

  }
  exportAsJson() {

  }
  buildDummy() {
    let operator0 = new Operator(this.paper, 50, 200, 'Zapp')
      .addPort(PortType.input)
      .addPort(PortType.output);

    let operator1 = new Operator(this.paper, 300, 200, 'Bender')
      .addPort(PortType.input)
      .addPort(PortType.output)
      .addPort(PortType.output)
      .addPort(PortType.output);

    let operator2 = new Operator(this.paper, 700, 50, 'Leela')
      .addPort(PortType.input)
      .addPort(PortType.output);

    let operator3 = new Operator(this.paper, 700, 200, 'Fry')
      .addPort(PortType.input)
      .addPort(PortType.output);


    let operator4 = new Operator(this.paper, 700, 350, 'Kif')
      .addPort(PortType.input)
      .addPort(PortType.output);

    this.operators.push(operator0, operator1, operator2, operator3, operator4);

    this.paths.connect(operator0.getOutputPort(0), operator1.getInputPort());
    this.paths.connect(operator1.getOutputPort(0), operator2.getInputPort());
    this.paths.connect(operator1.getOutputPort(1), operator3.getInputPort());
    this.paths.connect(operator1.getOutputPort(2), operator4.getInputPort());
  }
}
