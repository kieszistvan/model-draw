import radio from 'radio';
import Raphael from 'raphael/dev';

import * as elements from './elements';
import Paths from './paths';

(function(Raphael, undefined) {

  const paper = new Raphael('canvas');

  let box1 = elements.createBox(paper, 50, 50, 'Bender');
  let box2 = elements.createBox(paper, 300, 200, 'Leela');
  let box3 = elements.createBox(paper, 600, 10, 'Fry');

  const paths = new Paths(paper);
  paths.connect(box1.output, box2.input);

})(Raphael);
