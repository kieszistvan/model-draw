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

const applyAnimate = function(element, dim) {
  element.animate({
    opacity: dim ? 0.25 : 1
  }, 300, ">");
};

const toFront = function toFront(element) {
  element.toFront();
};

const toBack = function toFront(element) {
  element.toFront();
};


export default class OperatorEventHandler {
  constructor(operator) {
    this.operator = operator;

    radio('operatorMoveStart').subscribe(function(operatorInfoObject) {
      if (operatorInfoObject.box.oid === this.operator.box.oid) {
        return;
      }

      applyAnimate(this.operator.box, true);
      toBack(this.operator.box);
      applyAnimate(operator.boxHeader, true);
      toBack(operator.boxHeader);

      toFront(operator.inputPort.circle);
      if (operator.outputPorts.length) {
        for (let i = 0; i < operator.outputPorts.length; i++) {
          const outputPort = operator.outputPorts[i];
          toFront(outputPort.circle);
        }
      }

    }.bind(this));

    radio('operatorMoveFinish').subscribe(function(operatorInfoObject) {
      if (operatorInfoObject.box.oid === this.operator.box.oid) {
        return;
      }

      applyAnimate(this.operator.box);
      toFront(this.operator.box);
      applyAnimate(operator.boxHeader);
      toFront(operator.boxHeader);

    }.bind(this));

  }
  getDragStartHandler() {
    var operator = this.operator;

    if (!this.dragStartEventHandler) {
      this.dragStartEventHandler = function(x, y, event) {
        this.ox = this.attr('x');
        this.oy = this.attr('y');

        applyAnimate(this, true);
        applyAnimate(operator.boxHeader, true);

        toFront(operator.inputPort.circle);
        if (operator.outputPorts.length) {
          for (let i = 0; i < operator.outputPorts.length; i++) {
            const outputPort = operator.outputPorts[i];
            toFront(outputPort.circle);
          }
        }

        radio('operatorMoveStart').broadcast(operator.createPositionInfoObject());
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


        const currX = this.attr('x');
        const currY = this.attr('y');

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
            const outputPort = operator.outputPorts[i];
            outputPort.circle.attr({
              cx: outputCirclePlacementRules.x(currX),
              cy: outputCirclePlacementRules.y(currY, i)
            });
          }
        }

        radio('operatorMove').broadcast(operator.createPositionInfoObject());
      };
    }

    return this.draggingEventHandler;
  }
  getDragFinishHandler() {
    if (!this.dragFinishHandler) {
      const operator = this.operator;

      this.dragFinishHandler = function dragFinishHandler() {
        applyAnimate(this);
        toFront(this);
        applyAnimate(operator.boxHeader);
        toFront(operator.boxHeader);

        operator.inputPort.circle.insertBefore(this);
        if (operator.outputPorts.length) {
          for (let i = 0; i < operator.outputPorts.length; i++) {
            const outputPort = operator.outputPorts[i];
            outputPort.circle.insertBefore(this);
          }
        }

        radio('operatorMoveFinish').broadcast(operator.createPositionInfoObject());
      };
    }

    return this.dragFinishHandler;
  }
}
