import radio from 'radio';

export default function Paths(paper) {
  let that = this;
  this.paper = paper;
  this.connections = {};

  const subscribeToBoxMoved = function subscribeToBoxMoved() {
    radio('boxMoved').subscribe(function boxMoved({
      box: box,
      input: input,
      output: output
    }) {
      let updateConnection = function updateConnection(element) {
        let connection = that.connections[element.oid];
        if (connection) {
          connection.line.remove();
          that.connect(element, connection.to);
        }
      };

      updateConnection(input);
      updateConnection(output);
    });
  };

  subscribeToBoxMoved();
}

Paths.prototype = Object.create(Object.prototype);

Paths.prototype.connect = function connect(from, to) {
  let connections = this.connections;
  let linePath = 'M' + from.x + ',' + from.y + 'L' + to.x + ',' + to.y;
  let line = this.paper.path(linePath).attr({
    stroke: '#db3d13',
    ['stroke-width']: 2
  }).toBack();

  let createConnection = function createConnection(from, to, line) {
    connections[from.oid] = {
      from: {
        x: from.x,
        y: from.y
      },
      to: to,
      line: line
    };
  };

  createConnection(from, to, line);
  createConnection(to, from, line);

};
