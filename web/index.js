import radio from 'radio';
import Raphael from 'raphael/dev';

import * as ports from './ports';
import * as operator from './operator';
import Paths from './paths';

const paper = new Raphael('canvas');

let operator1 = operator.createOperator(paper, 50, 200, 'Bender')
  .addPort(ports.portType.input)
  .addPort(ports.portType.output)
  .addPort(ports.portType.output)
  .addPort(ports.portType.output);

let operator2 = operator.createOperator(paper, 300, 50, 'Leela')
  .addPort(ports.portType.input)
  .addPort(ports.portType.output);

let operator3 = operator.createOperator(paper, 300, 200, 'Fry')
  .addPort(ports.portType.input)
  .addPort(ports.portType.output);

let operator4 = operator.createOperator(paper, 300, 350, 'Kif')
  .addPort(ports.portType.input)
  .addPort(ports.portType.output);

let paths = new Paths(paper);

paths.connect(operator1.getOutputPort(0), operator2.getInputPort());
paths.connect(operator1.getOutputPort(1), operator3.getInputPort());
paths.connect(operator1.getOutputPort(2), operator4.getInputPort());
