import {getIDNum} from './helpers';


// Drag & Drop for cards
export function getBeforeCard(container, y) {
  const notDraggingElements = [
    ...container.querySelectorAll('.card:not(.dragging)'),
  ]

  const reducer = (closest, containerChild) => {
    const containerChildRect = containerChild.getBoundingClientRect()
    const offset = y - containerChildRect.top - containerChildRect.height / 2
    if (offset < 0 && offset > closest.offset) {
      return {offset: offset, element: containerChild}
    } else return closest
  }

  return notDraggingElements.reduce(
      reducer, {offset: Number.NEGATIVE_INFINITY}
  ).element
}


export function onOverList(e) {
  e.preventDefault() // enable drop event
  const beforeElement = getBeforeCard(this, e.clientY)
  const dragging = document.querySelector('.dragging')
  if (beforeElement === null) this.childNodes[3].appendChild(dragging)
  else this.childNodes[3].insertBefore(dragging, beforeElement)
}


export function cardOnDragStart(e) {
  e.stopPropagation()
  const board = document.querySelector('.board')
  board.removeEventListener('dragover', onOverBoard);
  this.classList.add('dragging')
}


export function cardOnDragEnd(e) {
  e.stopPropagation()
  const board = document.querySelector('.board')
  board.addEventListener('dragover', onOverBoard)
  this.classList.remove('dragging')
}


// Drag & Drop for lists
export function getBeforeList(board, x) {
  const notDraggingElements = [
    ...board.querySelectorAll('.list:not(.dragging-list)'),
  ]
  const reducer = (closest, boardChild) => {
    const boardChildRect = boardChild.getBoundingClientRect()
    const offset = x - boardChildRect.left - boardChildRect.width / 2
    if (offset < 0 && offset > closest.offset) {
      return {offset: offset, element: boardChild}
    } else return closest
  }

  return notDraggingElements.reduce(
      reducer, {offset: Number.NEGATIVE_INFINITY}
  ).element
}


export function onOverBoard(e) {
  e.preventDefault() // enable drop event
  const beforeList = getBeforeList(this, e.clientX)
  const dragging = document.querySelector('.dragging-list')
  const addListBlock = document.querySelector('.add-list-block')
  if (beforeList === undefined) this.insertBefore(dragging, addListBlock)
  else this.insertBefore(dragging, beforeList)
}
