import radio from 'radio';

export default class Paths {
  constructor(paper) {
    let that = this;
    this.paper = paper;
    this.connections = {};

    radio('operatorMoveStart').subscribe(function() {
      const connections = this.connections;

      for (let oid in connections) {
        if (connections.hasOwnProperty(oid)) {
          connections[oid].line.toFront();
        }
      }
    }.bind(this));

    radio('operatorMoveFinish').subscribe(function() {
      const connections = this.connections;

      for (let oid in connections) {
        if (connections.hasOwnProperty(oid)) {
          connections[oid].line.toBack();
        }
      }
    }.bind(this));

    radio('operatorMove').subscribe(function operatorMoved(operatorInfo) {
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
        x: from.x,
        y: from.y,
        to: to,
        line: line
      };
    };

    createConnection(from, to, line);
    createConnection(to, from, line);
  }
}
