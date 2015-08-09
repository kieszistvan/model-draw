//import * as someDep from './some-dep.js';
//import jquery from 'jquery';
import Raphael from 'raphael/dev';
import * as elements from './elements';

(function(Raphael, undefined) {

  const paper = new Raphael('canvas');

  var box1 = elements.createBox(paper, 50, 50, 'YOLO');
  var box2 = elements.createBox(paper, 300, 200, 'Shiny Metal Box');
})(Raphael);
