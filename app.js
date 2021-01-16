// Vars

const $ = {} // for including custom plugins


const board = document.querySelector('.board')
const addListBlock = board.querySelector('.add-list-block')
const showFormBtn = addListBlock.querySelector('.show-form-btn')
const addListForm = addListBlock.querySelector('.add-list-form')
const formInput = addListBlock.querySelector('.add-list-input')
const addListBtn = addListBlock.querySelector('.add-list-btn')
const cancelBtn = addListBlock.querySelector('.add-list-cancel-btn')


const data = {
    lists: [
        {
            id: 1,
            title: 'Super list 1',
            cards: [
                {
                    title: 'Card 1'
                },
                {
                    title: 'Card 2'
                },
                {
                    title: 'Card 3'
                },
            ]
        },
        {
            id: 2,
            title: 'Super list 2',
            cards: [
                {
                    title: 'Card 4'
                },
            ]
        },
        {
            id: 3,
            title: 'Super list 3',
            cards: [
                {
                    title: 'Card 5'
                },
                {
                    title: 'Card 6'
                },
            ]
        },
    ],
}


const cardToHTML = card => `<div class="list__item card" draggable="true">${ card.title }</div>`


const listToHTML = list => `
    <div id="list${ list.id }" class="list" draggable="true">
        <div class="list__header">
            <input type="text" class="list__title" value="${ list.title }">
            <div class="list__options">
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="more">
                    <circle cx="5"  cy="10" r="1.2"></circle>
                    <circle cx="10" cy="10" r="1.2"></circle>
                    <circle cx="15" cy="10" r="1.2"></circle>
                </svg>                
            </div>
        </div>
        <div class="list__body">
            ${ list.cards.map(cardToHTML).join('') }
        </div>
        <div class="list__footer">
            <button class="add-card-btn">
                <svg width="16" height="16" fill="#888" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="plus">
                    <rect x="9" y="1" width="2" height="17" rx="2"></rect>
                    <rect x="1" y="9" width="17" height="2" rx="2"></rect>
                </svg>    
            </button>
        </div>
    </div>    
`

function render() {
    const HTML = data.lists.map(listToHTML).join('')
    const app = document.getElementById('app')
    app.insertAdjacentHTML('afterbegin', HTML)
}

render()


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

function addListEvents(list) {
    list.addEventListener('dragover', onOverList)
    list.addEventListener('dragstart', () => {
        lists.forEach(list => list.removeEventListener('dragover', onOverList))
        list.classList.add('dragging-list')
    })
    list.addEventListener('dragend', () => { 
        list.classList.remove('dragging-list')
        lists.forEach(list => list.addEventListener('dragover', onOverList))
    })
}


function addCardEvents(card) {
    card.addEventListener('dragstart', cardOnDragStart)
    card.addEventListener('dragend', cardOnDragEnd)
    card.addEventListener('click', () => console.log(1))
}


board.addEventListener('dragover', onOverBoard)

let lists = board.querySelectorAll('.list')
let cards = board.querySelectorAll('.card')

lists.forEach(list => addListEvents(list))
cards.forEach(card => addCardEvents(card))


// create card

function isValidTitle(titleText) {
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
        
    if (isValidTitle(this.value)) {
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
    showFormBtn.style.display = 'none'
    addListForm.style.display = 'block'
    formInput.focus()
    addListForm.addEventListener('submit', e => e.preventDefault()) // prevent reloading if in input enter is pressed
    formInput.addEventListener('keyup', e => (e.keyCode === 13) ? addListOrHideListInput() : {})
    document.addEventListener('click', closeAddListForm)
}


function hideAddListForm() {
    showFormBtn.style.display = 'block'
    addListForm.style.display = 'none'    
    document.removeEventListener('click', closeAddListForm)
}


const closeAddListForm = e => document.activeElement !== formInput ? hideAddListForm() : ''


function listHTMLToNode(listHTML) {
    const div = document.createElement('div');
    div.innerHTML = listHTML.trim();
    return div.firstChild; 
}


function createList(title) {
    const newList = {
        id: data.lists.length + 1,
        title: title,
        cards: [],
    }
    data.lists.push(newList)
    newListNode = listHTMLToNode(listToHTML(newList))    
    addListEvents(newListNode)
    newListNode.querySelector('.add-card-btn').addEventListener('click', addTextArea)
    return newListNode
}


function addListOrHideListInput() {
    if (isValidTitle(formInput.value)) {
        const newList = createList(formInput.value)
        board.insertBefore(newList, addListBlock)
        board.scrollLeft = board.scrollWidth
        lists = document.querySelectorAll('.list')
        formInput.value = ''
        formInput.focus()
    }
}


addListBlock.addEventListener('click', () => formInput.focus())
showFormBtn.addEventListener('click', showAddListForm)
cancelBtn.addEventListener('click', hideAddListForm)
addListBtn.addEventListener('click', addListOrHideListInput)



// delete list

// update list



/* TODO:
* drag&drop card +
* drag&drop list +
* create card +
* delete card
* update card: title
* mark card as done
* add/remove check-list 
* add/remove date 
* add/remove comment
* create list +
* delete list 
* update list
* render lists and cards
**/
