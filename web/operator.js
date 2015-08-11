import radio from 'radio';
import shortid from 'shortid';
import Port from './Port';
import * as PortType from './PortType';
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

    this.dragEventHandler = new OperatorEventHandler(this);
    this.box.drag(this.dragEventHandler.getDraggingEventHandler(), this.dragEventHandler.getDragStartEventHandler());
  }
  addPort(type) {
    let [boxX, boxY] = [this.box.attr('x'), this.box.attr('y')];

    if (type === PortType.output) {
      let currNumOfOutputPorts = this.outputPorts.length;

      this.box.attr('height', rectHeight + (circleOffset * currNumOfOutputPorts));

      let portX = outputCirclePlacementRules.x(boxX);
      let portY = outputCirclePlacementRules.y(boxY, currNumOfOutputPorts);

      let port = new Port(this.paper, portX, portY, circleRadius, type);
      setOidForElement(port);
      port.circle.toBack();

      this.outputPorts.push(port);
    } else if (type === PortType.input) {
      if (this.inputPort) {
        return;
      }

      let portX = inputCirclePlacementRules.x(boxX);
      let portY = inputCirclePlacementRules.y(boxY);

      this.inputPort = new Port(this.paper, portX, portY, circleRadius, type);
      setOidForElement(this.inputPort);
      this.inputPort.circle.toBack();
    } else {
      throw new Error('No such port type');
    }

    return this;
  }
  getOutputPort(index) {
    let outputPort = this.outputPorts[index];
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
}
