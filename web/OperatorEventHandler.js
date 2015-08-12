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

const applyAnimate = function(element) {
  element.animate({
    opacity: 0.25
  }, 300, ">");
};

const toFront = function toFront(element) {
  element.toFront();
};

export default class OperatorEventHandler {
  constructor(operator) {
    this.operator = operator;
  }
  getDragStartHandler() {
    var operator = this.operator;

    if (!this.dragStartEventHandler) {
      this.dragStartEventHandler = function(x, y, event) {
        this.ox = this.attr('x');
        this.oy = this.attr('y');
      };
    }

    return this.dragStartEventHandler;
  }

  getDraggingHandler() {
    var operator = this.operator;

    if (!this.draggingEventHandler) {
      this.draggingEventHandler = function(dx, dy, x, y, event) {
        this.attr({
          x: (this.ox + dx),
          y: (this.oy + dy)
        });
        applyAnimate(this);
        toFront(this);


        const currX = this.attr('x');
        const currY = this.attr('y');

        if (operator.boxHeader) {
          operator.boxHeader.attr({
            x: headerPlacementRules.x(currX),
            y: headerPlacementRules.y(currY)
          });
          applyAnimate(operator.boxHeader);
          toFront(operator.boxHeader);
        }

        if (operator.inputPort) {
          operator.inputPort.circle.attr({
            cx: inputCirclePlacementRules.x(currX),
            cy: inputCirclePlacementRules.y(currY)
          });
          operator.inputPort.circle.toFront();
          toFront(operator.inputPort.circle);
        }

        if (operator.outputPorts.length) {
          for (let i = 0; i < operator.outputPorts.length; i++) {
            const outputPort = operator.outputPorts[i];
            outputPort.circle.attr({
              cx: outputCirclePlacementRules.x(currX),
              cy: outputCirclePlacementRules.y(currY, i)
            });
            outputPort.circle.toFront();
            toFront(outputPort.circle);
          }
        }

        radio('operatorMoved').broadcast(operator.createPositionInfoObject());
      };
    }

    return this.draggingEventHandler;
  }
  getDragFinishHandler() {
    if (!this.dragFinishHandler) {
      const operator = this.operator;

      this.dragFinishHandler = function dragFinishHandler() {
        const applyAnimate = function(element) {
          element.animate({
            opacity: 1
          }, 300, ">");
        };

        applyAnimate(this);

        if (operator.boxHeader) {
          applyAnimate(operator.boxHeader);
        }

        if (operator.inputPort) {
          operator.inputPort.circle.insertAfter(this);
        }

        if (operator.outputPorts.length) {
          for (let i = 0; i < operator.outputPorts.length; i++) {
            const outputPort = operator.outputPorts[i];
            outputPort.circle.insertAfter(this);
          }
        }
      };
    }

    return this.dragFinishHandler;
  }
}
