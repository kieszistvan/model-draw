import radio from 'radio';

export default class Paths {
  constructor(paper) {
    let that = this;
    this.paper = paper;
    this.connections = {};

    const subscribeToBoxMoved = function subscribeToBoxMoved() {
      radio('operatorMoved').subscribe(function operatorMoved(operatorInfo) {
        const updateConnection = function updateConnection(element) {
          let elementId = element.oid;
          if (element.circle) {
            elementId = element.circle.oid;
          }

          let connection = that.connections[elementId];
          if (connection) {
            connection.line.remove();
            that.connect(element, connection.to);
          }
        };

        updateConnection(operatorInfo.inputPort);
        operatorInfo.outputPorts.forEach(function(output) {
          updateConnection(output);
        });
      });
    };

    subscribeToBoxMoved();
  }
  connect(from, to) {
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
  }
}
