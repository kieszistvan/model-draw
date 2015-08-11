import radio from 'radio';
import shortid from 'shortid';
import * as ports from './ports';

const portOffset = 30;

const rectWidth = 150;
const rectHeight = 100;
const rectR = 2;
const circleRadius = 10;
const circleOffset = circleRadius + 20;
const boxColor = '#fff';
const boxStrokeColor = '#333';
const boxHeaderColor = '#333';
const inputCircleColor = '#000462';
const outputCircleColor = '#9c0013';

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

const createOperatorInfoObject = function createOperatorInfoObject(operator) {
  let inputPort;

  if (operator.inputPort) {
    inputPort = {
      oid: operator.inputPort.oid,
      x: operator.inputPort.attr('cx'),
      y: operator.inputPort.attr('cy')
    };
  }

  let outputPorts = [];
  operator.outputPorts.forEach(function(outputPort) {
    outputPorts.push({
      oid: outputPort.oid,
      x: outputPort.attr('cx'),
      y: outputPort.attr('cy')
    });
  });

  return {
    box: {
      oid: operator.box.oid,
      x: operator.box.attr('x'),
      y: operator.box.attr('y')
    },
    inputPort,
    outputPorts
  };

};

const setOidForElement = function setNewIdForElement(element) {
  element.oid = shortid.generate();
};

const flipCursorStyle = function flipCursorStyle() {
  const currentCursor = this.attr('cursor');
  this.attr('cursor', currentCursor === 'move' ? 'auto' : 'move');
};

export function createOperator(paper, x, y, headLine) {

  const Operator = function Operator(x, y, headLine) {
    this.headLine = headLine;
    this.inputPort = null;
    this.outputPorts = [];

    this.box = paper.rect(x, y, rectWidth, rectHeight, rectR).attr({
      fill: boxColor,
      title: headLine || '',
      stroke: boxStrokeColor,
      ['stroke-width']: 1
    });
    setOidForElement(this.box);

    this.boxHeader = paper.text(headerPlacementRules.x(x), headerPlacementRules.y(y), headLine).attr({
      fill: boxHeaderColor
    });
    setOidForElement(this.boxHeader);

    this.boxHeader.toFront();

    const dragStart = function dragStart(x, y, event) {
      this.ox = this.attr('x');
      this.oy = this.attr('y');
    };

    let that = this;
    const dragging = function dragging(dx, dy, x, y, event) {
      this.attr({
        x: (this.ox + dx),
        y: (this.oy + dy)
      });

      let currX = this.attr('x');
      let currY = this.attr('y');

      if (that.boxHeader) {
        that.boxHeader.attr({
          x: headerPlacementRules.x(currX),
          y: headerPlacementRules.y(currY)
        });
      }

      if (that.inputPort) {
        that.inputPort.attr({
          cx: inputCirclePlacementRules.x(currX),
          cy: inputCirclePlacementRules.y(currY)
        });
      }

      if (that.outputPorts.length) {
        for (let i = 0; i < that.outputPorts.length; i++) {
          let outputPort = that.outputPorts[i];
          outputPort.attr({
            cx: outputCirclePlacementRules.x(currX),
            cy: outputCirclePlacementRules.y(currY, i)
          });
        }
      }

      radio('operatorMoved').broadcast(createOperatorInfoObject(that));
    };


    this.box.drag(dragging, dragStart);
  };

  Operator.prototype.addPort = function(type) {
    let [boxX, boxY] = [this.box.attr('x'), this.box.attr('y')];

    if (type === ports.portType.output) {
      let currNumOfOutputPorts = this.outputPorts.length;

      this.box.attr('height', rectHeight + (circleOffset * currNumOfOutputPorts));

      let portX = outputCirclePlacementRules.x(boxX);
      let portY = outputCirclePlacementRules.y(boxY, currNumOfOutputPorts);

      let port = ports.createPort(paper, portX, portY, circleRadius, type);
      port.toBack();
      setOidForElement(port);

      this.outputPorts.push(port);
    } else if (type === ports.portType.input) {
      if (this.inputPort) {
        return;
      }

      let portX = inputCirclePlacementRules.x(boxX);
      let portY = inputCirclePlacementRules.y(boxY);

      this.inputPort = ports.createPort(paper, portX, portY, circleRadius, type);
      setOidForElement(this.inputPort);
      this.inputPort.toBack();
    } else {
      throw new Error('No such port type');
    }

    return this;
  };

  Operator.prototype.getOutputPort = function(index) {
    let port = this.outputPorts[index];
    return {
      oid: port.oid,
      x: port.attr('cx'),
      y: port.attr('cy')
    };
  };

  Operator.prototype.getInputPort = function() {
    let port = this.inputPort;
    return {
      oid: port.oid,
      x: port.attr('cx'),
      y: port.attr('cy')
    };
  };

  return new Operator(x, y, headLine);
}
