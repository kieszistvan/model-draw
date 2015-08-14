import radio from 'radio';
import shortid from 'shortid';
import Port from './Port';
import PortType from './PortType';
import OperatorEventHandler from './OperatorEventHandler';

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

const setOidForElement = function setNewIdForElement(element) {
  element.oid = shortid.generate();
};

const flipCursorStyle = function flipCursorStyle() {
  const currentCursor = this.attr('cursor');
  this.attr('cursor', currentCursor === 'move' ? 'auto' : 'move');
};

export default class Operator {
  constructor(paper, x, y, headLine) {
    this.paper = paper;
    this.headLine = headLine;
    this.inputPort = null;
    this.outputPorts = [];

    const box = paper.rect(x, y, rectWidth, rectHeight, rectR).attr({
      fill: boxColor,
      title: headLine || '',
      stroke: boxStrokeColor,
      ['stroke-width']: 1
    });
    setOidForElement(box);

    const boxHeader = paper.text(headerPlacementRules.x(x), headerPlacementRules.y(y), headLine).attr({
      fill: boxHeaderColor
    });
    setOidForElement(boxHeader);
    boxHeader.toFront();

    const dragEventHandler = new OperatorEventHandler(this);

    box.drag(dragEventHandler.getDraggingHandler(),
      dragEventHandler.getDragStartHandler(),
      dragEventHandler.getDragFinishHandler());

    this.box = box;
    this.boxHeader = boxHeader;
    this.dragEventHandler = dragEventHandler;
  }
  addPort(port) {
    let portX, portY;
    const [boxX, boxY] = [this.box.attr('x'), this.box.attr('y')];

    if (port.type === PortType.output) {
      const currNumOfOutputPorts = this.outputPorts.length;

      this.box.attr('height', rectHeight + (circleOffset * currNumOfOutputPorts));

      portX = outputCirclePlacementRules.x(boxX);
      portY = outputCirclePlacementRules.y(boxY, currNumOfOutputPorts);

      this.outputPorts.push(port);
    }

    if (port.type === PortType.input) {
      if (this.inputPort) {
        return;
      }

      portX = inputCirclePlacementRules.x(boxX);
      portY = inputCirclePlacementRules.y(boxY);

      this.inputPort = port;
    }

    port.draw(this.paper, portX, portY, circleRadius);
    port.circle.toBack();

    return this;
  }
  getOutputPort(index) {
    const outputPort = this.outputPorts[index];
    if (outputPort) {
      return {
        oid: outputPort.circle.oid,
        x: outputPort.circle.attr('cx'),
        y: outputPort.circle.attr('cy')
      };
    }
  }
  getInputPort() {
    if (this.inputPort) {
      return {
        oid: this.inputPort.circle.oid,
        x: this.inputPort.circle.attr('cx'),
        y: this.inputPort.circle.attr('cy')
      };
    }
  }
  createPositionInfoObject() {
    let inputPort;

    if (this.inputPort) {
      inputPort = {
        oid: this.inputPort.circle.oid,
        x: this.inputPort.circle.attr('cx'),
        y: this.inputPort.circle.attr('cy')
      };
    }

    let outputPorts = [];
    this.outputPorts.forEach(function(outputPort) {
      outputPorts.push({
        oid: outputPort.circle.oid,
        x: outputPort.circle.attr('cx'),
        y: outputPort.circle.attr('cy')
      });
    });

    return {
      box: {
        oid: this.box.oid,
        x: this.box.attr('x'),
        y: this.box.attr('y')
      },
      inputPort,
      outputPorts
    };
  }
  get oid() {
    return this._oid;
  }
  set oid(oid) {
    this._oid = oid;
  }
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
  }
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
  }

}
