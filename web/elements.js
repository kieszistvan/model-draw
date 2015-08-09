export function createBox(paper, x, y, headLine) {
  const rectWidth = 200;
  const rectHeight = 100;
  const rectR = 2;
  const circleRadius = 20;
  const circleOffset = 5;
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
        return x + circleOffset;
      },
      y(y) {
        return y + (rectHeight / 2);
      }
  };

  const outputCirclePlacementRules = {
    x(x) {
        return x + rectWidth - circleOffset;
      },
      y(y) {
        return y + (rectHeight / 2);
      }
  };

  let boxHeader = paper.text(headerPlacementRules.x(x), headerPlacementRules.y(y), headLine).attr({
    fill: '#fff'
  });

  let inputCircle = paper.circle(inputCirclePlacementRules.x(x), inputCirclePlacementRules.y(y), circleRadius)
    .attr({
      fill: inputCircleColor,
      ['stroke-width']: 0
    });

  let outputCircle = paper.circle(outputCirclePlacementRules.x(x), outputCirclePlacementRules.y(y), circleRadius)
    .attr({
      fill: outputCircleColor,
      ['stroke-width']: 0
    });

  const dragStart = function dragStart(x, y, event) {
    this.ox = this.attr('x');
    this.oy = this.attr('y');
  };

  const drag = function drag(dx, dy, x, y, event) {
    this.attr({
      x: (this.ox + dx),
      y: (this.oy + dy)
    });

    let currX = this.attr('x');
    let currY = this.attr('y');

    boxHeader.attr({
      x: headerPlacementRules.x(currX),
      y: headerPlacementRules.y(currY)
    });

    inputCircle.attr({
      cx: inputCirclePlacementRules.x(currX),
      cy: inputCirclePlacementRules.y(currY)
    });

    outputCircle.attr({
      cx: outputCirclePlacementRules.x(currX),
      cy: outputCirclePlacementRules.y(currY)
    });
  };

  const changeCursorStyle = function changeCursorStyle() {
    const currentCursor = this.attr('cursor');
    this.attr('cursor', currentCursor === 'move' ? 'auto' : 'move');
  };

  let box = paper.rect(x, y, rectWidth, rectHeight, rectR)
    .attr({
      fill: '#333',
      title: headLine || '',
      ['stroke-width']: 0
    })
    .drag(drag, dragStart)
    .mousedown(changeCursorStyle)
    .mouseup(changeCursorStyle);

  boxHeader.toFront();
}

export function createConnection(elem1, elem2) {

}
