
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

function cardOnDragStart(e) {
    e.stopPropagation()
    board.removeEventListener('dragover', onOverBoard);
    this.classList.add('dragging')
}

function cardOnDragEnd(e) {
    e.stopPropagation()
    board.addEventListener('dragover', onOverBoard)
    this.classList.remove('dragging')
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
    card.addEventListener('dragstart', cardOnDragStart)
    card.addEventListener('dragend', cardOnDragEnd)
})


// CRUD card

function isValidCardTitle(titleText) {
    const NUM = '1234567890'
    const ENG = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const RUS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    const char = titleText.trim()[0]
    return ENG.includes(char) || RUS.includes(char) || NUM.includes(char)
}

function createCardOrDeleteTextArea() {
    if (isValidCardTitle(this.value)) {
        this.parentNode.insertAdjacentHTML('beforeEnd', `
            <div class=\"list__item card\" draggable=\"true\">
                ${this.value}
            </div>
        `)
        const siblings = this.parentNode.children
        const createdCard = siblings[siblings.length - 1]
        createdCard.addEventListener('dragstart', cardOnDragStart) 
        createdCard.addEventListener('dragend', cardOnDragEnd) 
    } 
    this.parentNode.removeChild(this)
}

function showCardTitleTextArea() {
    const listBody = this.parentElement.parentElement.childNodes[3]
    listBody.insertAdjacentHTML('beforeEnd',`
        <textarea class=\"add-card-text\" name=\"\" id=\"\" rows=\"3\" placeholder=\"Введите заголовок для этой карточки\"></textarea>
    `)
    const textarea = document.querySelector('.add-card-text') // it's always a single element in document
    textarea.addEventListener('keyup', (e) => (e.keyCode === 13) ? textarea.blur() : {})
    textarea.addEventListener('blur', createCardOrDeleteTextArea)
    textarea.focus()
}

const addCardBtns = document.querySelectorAll('.add-card-btn')

addCardBtns.forEach(btn => {
    btn.addEventListener('click', showCardTitleTextArea)
})


// CRUD list
