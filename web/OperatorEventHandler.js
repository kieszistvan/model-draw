import radio from 'radio';

const rectWidth = 150;
const rectHeight = 100;

const headerPlacementRules = {
  x(x) {
      return x + (rectWidth / 2);
    },
    y(y) {
      return y + 10;
    }
};

const inputCirclePlacementRules = {
  x(x) {
      return x;
    },
    y(y) {
      return y + (rectHeight / 2);
    }
};

const outputCirclePlacementRules = {
  x(x) {
      return x + rectWidth;
    },
    y(y, currNumOfOutputPorts) {
      return y + (rectHeight / 2) + (currNumOfOutputPorts * 30);
    }
};


export default class OperatorEventHandler {
  constructor(operator) {
    this.operator = operator;
  }
  getDragStartEventHandler() {
    if (!this.dragStartEventHandler) {
      this.dragStartEventHandler = function(x, y, event) {
        this.ox = this.attr('x');
        this.oy = this.attr('y');
      };
    }

    return this.dragStartEventHandler;
  }

  getDraggingEventHandler() {
    var operator = this.operator;

    if (!this.draggingEventHandler) {
      this.draggingEventHandler = function(dx, dy, x, y, event) {
        this.attr({
          x: (this.ox + dx),
          y: (this.oy + dy)
        });

        let currX = this.attr('x');
        let currY = this.attr('y');

        if (operator.boxHeader) {
          operator.boxHeader.attr({
            x: headerPlacementRules.x(currX),
            y: headerPlacementRules.y(currY)
          });
        }

        if (operator.inputPort) {
          operator.inputPort.circle.attr({
            cx: inputCirclePlacementRules.x(currX),
            cy: inputCirclePlacementRules.y(currY)
          });
        }

        if (operator.outputPorts.length) {
          for (let i = 0; i < operator.outputPorts.length; i++) {
            let outputPort = operator.outputPorts[i];
            outputPort.circle.attr({
              cx: outputCirclePlacementRules.x(currX),
              cy: outputCirclePlacementRules.y(currY, i)
            });
          }
        }

        radio('operatorMoved').broadcast(operator.createPositionInfoObject());
      };
    }

    return this.draggingEventHandler;
  }
}
