import radio from 'radio';
import Raphael from 'raphael/dev';

import * as PortType from './PortType';
import Operator from './Operator';
import Paths from './paths';

const paper = new Raphael('canvas');

let paths = new Paths(paper);

let operator0 = new Operator(paper, 50, 200, 'Zapp')
  .addPort(PortType.input)
  .addPort(PortType.output);

let operator1 = new Operator(paper, 300, 200, 'Bender')
  .addPort(PortType.input)
  .addPort(PortType.output)
  .addPort(PortType.output)
  .addPort(PortType.output);

let operator2 = new Operator(paper, 700, 50, 'Leela')
  .addPort(PortType.input)
  .addPort(PortType.output);

let operator3 = new Operator(paper, 700, 200, 'Fry')
  .addPort(PortType.input)
  .addPort(PortType.output);


let operator4 = new Operator(paper, 700, 350, 'Kif')
  .addPort(PortType.input)
  .addPort(PortType.output);

paths.connect(operator0.getOutputPort(0), operator1.getInputPort());
paths.connect(operator1.getOutputPort(0), operator2.getInputPort());
paths.connect(operator1.getOutputPort(1), operator3.getInputPort());
paths.connect(operator1.getOutputPort(2), operator4.getInputPort());
