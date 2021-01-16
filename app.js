// Vars

const board = document.querySelector('.board')
const lists = document.querySelectorAll('.list')
const cards = document.querySelectorAll('.card')


// Drag & Drop for cards

function getBeforeCard(container, y) {
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
    const beforeElement = getBeforeCard(this, e.clientY)
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
    beforeList === undefined ? this.insertBefore(dragging, addListBlock) : this.insertBefore(dragging, beforeList)
}


// Adding listeners

board.addEventListener('dragover', onOverBoard)

lists.forEach(list => { 
    list.addEventListener('dragover', onOverList)
    list.addEventListener('dragstart', () => {
        lists.forEach(list => list.removeEventListener('dragover', onOverList))
        list.classList.add('dragging-list')
    })
    list.addEventListener('dragend', () => { 
        list.classList.remove('dragging-list')
        lists.forEach(list => list.addEventListener('dragover', onOverList))
    })
})

cards.forEach(card => { 
    card.addEventListener('dragstart', cardOnDragStart)
    card.addEventListener('dragend', cardOnDragEnd)
    card.addEventListener('click', () => console.log(1))
})


// create card

function isValidCardTitle(titleText) {
    const NUM = '1234567890'
    const ENG = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const RUS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    const char = titleText.trim()[0]
    return ENG.includes(char) || RUS.includes(char) || NUM.includes(char)
}


function createCard(title) {
    const newCard = document.createElement('div')
    newCard.className += 'list__item card'
    newCard.setAttribute('draggable', 'true')
    newCard.innerText = title
    newCard.addEventListener('dragstart', cardOnDragStart) 
    newCard.addEventListener('dragend', cardOnDragEnd) 

    return newCard
}


function addCardOrHideTextArea() {
    const listBody = this.parentNode
        
    if (isValidCardTitle(this.value)) {
        const newCard = createCard(this.value)
        listBody.insertBefore(newCard, this)
        this.value = ''
        this.focus()
    } else listBody.removeChild(this)

    listBody.scrollTop = listBody.scrollHeight
}


function addTextArea() {
    const listBody = this.parentElement.parentElement.querySelector('.list__body')    
    const textArea = document.createElement('textarea')
    textArea.classList.add('add-card-text')
    textArea.placeholder = 'Введите заголовок для этой карточки'
    textArea.rows = 3
    textArea.addEventListener('keyup', e => (e.keyCode === 13) ? textArea.blur() : {})
    textArea.addEventListener('blur', addCardOrHideTextArea)   
    listBody.appendChild(textArea)
    textArea.focus()
    listBody.scrollTop = listBody.scrollHeight
}


const addCardBtns = document.querySelectorAll('.add-card-btn')
addCardBtns.forEach(btn => btn.addEventListener('click', addTextArea))


// delete card

// update card

// create list

function showAddListForm() {
    addListBlock.innerHTML = `
        <form action="" class="add-list-form">
            <input type="text" class="add-list-input" placeholder="Заголовок списка">
            <div class="add-list-form-controls">
                <button class="add-list-form-btn" type="submit">Добавить список</button>
                <button class="add-list-cancel-btn">&#10006;</button>
            </div>
        </form>
    `
    formInput = addListBlock.querySelector('.add-list-input')
    formInput.focus()
    cancelBtn = addListBlock.querySelector('.add-list-cancel-btn')
    cancelBtn.addEventListener('click', hideAddListForm)
}


function hideAddListForm() {
    addListBlock.innerHTML = `
        <button class="add-list-btn">
            <svg width="16" height="16" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="plus">
                <rect x="9" y="1" width="2" height="17"></rect><rect x="1" y="9" width="17" height="2"></rect>
            </svg>
            Добавить колонку
        </button>
    `
    addListBtn = addListBlock.querySelector('.add-list-btn')
    addListBtn.addEventListener('click', showAddListForm)
}


const addListBlock = document.querySelector('.add-list-block')
addListBlock.querySelector('.add-list-btn').addEventListener('click', showAddListForm)
// on click hide form
// validate input to create list



// delete list

// update list



/* TODO:
* drag&drop card +
* drag&drop list +
* create card +
* delete card
* update card
* create list
* delete list
* update list
* mark card as done
* title
* add/remove check-list 
* add/remove date 
* add/remove comment

* render lists and cards
**/
