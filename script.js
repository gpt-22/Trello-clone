
const board = document.querySelector('.board')
const lists = document.querySelectorAll('.list')
const cards = document.querySelectorAll('.card')


// Drag & Drop for cards

function getBeforeElement(container, y) {
    const notDraggingElements = [...container.querySelectorAll('.card:not(.dragging)')]

    const reducer = (closest, containerChild) => {
        const containerChildRect = containerChild.getBoundingClientRect() // возвращает размер и позицию относительно viewport
        const offset = y - containerChildRect.top - containerChildRect.height / 2
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: containerChild }
        else return closest
    }

    return notDraggingElements.reduce( reducer, { offset: Number.NEGATIVE_INFINITY } ).element
}

function onOverList(e) {
    e.preventDefault() // enable drop event
    const beforeElement = getBeforeElement(this, e.clientY)
    const dragging = document.querySelector('.dragging')
    beforeElement === null ? this.childNodes[3].appendChild(dragging) : this.childNodes[3].insertBefore(dragging, beforeElement)
}


// Drag & Drop for lists

function getBeforeList(board, x) {
    const notDraggingElements = [...board.querySelectorAll('.list:not(.dragging-list)')]

    const reducer = (closest, boardChild) => {
        const boardChildRect = boardChild.getBoundingClientRect() // возвращает размер и позицию относительно viewport
        const offset = x - boardChildRect.left - boardChildRect.width / 2
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: boardChild }
        else return closest
    }

    return notDraggingElements.reduce( reducer, { offset: Number.NEGATIVE_INFINITY } ).element
}

function onOverBoard(e) {
    e.preventDefault() // enable drop event
    const beforeList = getBeforeList(this, e.clientX)
    const dragging = document.querySelector('.dragging-list')
    beforeList === null ? this.appendChild(dragging) : this.insertBefore(dragging, beforeList)
}


// Adding listeners

board.addEventListener('dragover', onOverBoard)

lists.forEach(list => { 
    list.addEventListener('dragover', onOverList)
    list.addEventListener('dragstart', () => {
        list.removeEventListener('dragover', onOverList)
        list.classList.add('dragging-list')
    })
    list.addEventListener('dragend', () => { 
        list.addEventListener('dragover', onOverList)
        list.classList.remove('dragging-list')
    })
})

cards.forEach(card => { 
    card.addEventListener('dragstart', (e) => {
        e.stopPropagation()
        board.removeEventListener('dragover', onOverBoard);
        card.classList.add('dragging')
    })
    card.addEventListener('dragend', (e) => {
        e.stopPropagation()
        board.addEventListener('dragover', onOverBoard)
        card.classList.remove('dragging')
    })
})


// CRUD card

const createOrDelete = function () {
    if (this.value !== '') {
        this.parentNode.insertAdjacentHTML('beforeEnd', `
            <div class=\"list__item card\" draggable=\"true\">
                ${this.value}
            </div>
        `)
        const siblings = this.parentNode.childNodes
        const createdCard = siblings[siblings.length - 1]
        createdCard.addEventListener("dragstart", dragStart) 
        createdCard.addEventListener("dragend", dragEnd) 
    } 
    this.parentNode.removeChild(this)
}

const addCard = function() {
    // list__body -> inser "input card" -> handle onenter and 
    // onclick btn
 
    const listBody = this.parentElement.parentElement.childNodes[3]
    listBody.insertAdjacentHTML('beforeEnd',`
        <textarea class=\"add-card-text\" name=\"\" id=\"\" rows=\"3\" placeholder=\"Введите заголовок для этой карточки\"></textarea>
    `)

    // it's always the only one element in document
    const textarea = document.querySelector('.add-card-text')
    textarea.addEventListener('blur', createOrDelete, false)
    textarea.focus()
}


const addCardBtns = document.querySelectorAll('.add-card-btn')

addCardBtns.forEach(btn => {
    btn.addEventListener('click', addCard)
})


// CRUD list
