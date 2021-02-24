const _getOffset = (position, axis, rect) => {
  if (axis === 'x') return position.x - rect.left - rect.width / 2
  else return position.y - rect.top - rect.height / 2
}

export function getBeforeNode(position, container, axis, elementCls, draggingCls) {
  const notDraggingElements = [
    ...container.querySelectorAll(`${elementCls}:not(${draggingCls})`),
  ]
  const reducer = (closest, child) => {
    const containerChildRect = child.getBoundingClientRect()
    const offset = _getOffset(position, axis, containerChildRect)
    if (offset < 0 && offset > closest.offset) {
      return {offset: offset, element: child}
    } else {
      return closest
    }
  }

  return notDraggingElements.reduce(
      reducer, {offset: Number.NEGATIVE_INFINITY}
  ).element
}

export function getOnDragover(getContainer, axis, cls, draggingCls) {
  return (event) => {
    event.preventDefault() // enable drop event
    const position = {x: event.clientX, y: event.clientY}
    // container is a child node that appears in render() after object initialization
    const container = getContainer()
    const beforeNode = getBeforeNode(position, container, axis, cls, draggingCls)
    const dragging = document.querySelector(draggingCls)
    container.insertBefore(dragging, beforeNode)
  }
}
