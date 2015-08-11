import radio from 'radio';
import Raphael from 'raphael/dev';

import * as ports from './ports';
import * as operator from './operator';
import Paths from './paths';

const paper = new Raphael('canvas');

let paths = new Paths(paper);

let operator1 = operator.createOperator(paper, 50, 200, 'Bender')
  .addPort(ports.portType.input)
  .addPort(ports.portType.output);


let operator2;
setTimeout(function() {
  operator2 = operator.createOperator(paper, 300, 50, 'Leela')
    .addPort(ports.portType.input)
    .addPort(ports.portType.output);
}, 1000);

setTimeout(function() {
  paths.connect(operator1.getOutputPort(0), operator2.getInputPort());
}, 2000);

let operator3;
setTimeout(function() {
  operator3 = operator.createOperator(paper, 300, 200, 'Fry')
    .addPort(ports.portType.input)
    .addPort(ports.portType.output);
}, 3000);

setTimeout(function() {
  operator1.addPort(ports.portType.output);
}, 4000);

setTimeout(function() {
  paths.connect(operator1.getOutputPort(1), operator3.getInputPort());
}, 5000);

let operator4;
setTimeout(function() {
  operator4 = operator.createOperator(paper, 300, 350, 'Kif')
    .addPort(ports.portType.input)
    .addPort(ports.portType.output);
}, 6000);

setTimeout(function() {
  operator1.addPort(ports.portType.output);
}, 7000);

setTimeout(function() {
  paths.connect(operator1.getOutputPort(2), operator4.getInputPort());
}, 8000);
