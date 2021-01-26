import {sendRequest, isValidTitle} from './helpers'
import {modal} from './plugins/modal'


// Vars
const getBoardURL = 'http://127.0.0.1:8000/api/boards/1'  // just takes the first board

let data

let lists,
    cards,
    addCardBtns,
    board,
    addListBlock,
    showFormBtn,
    addListForm,
    formInput,
    addListBtn,
    cancelBtn


const main = (response) => {
    data = response

    renderLists()

    board = document.querySelector('.board')
    board.addEventListener('dragover', onOverBoard)

    // add list block
    addListBlock = board.querySelector('.add-list-block')
    formInput = addListBlock.querySelector('.add-list-input')
    addListBlock.addEventListener('click', () => formInput.focus())
    showFormBtn = addListBlock.querySelector('.show-form-btn')
    showFormBtn.addEventListener('click', showAddListForm)
    addListForm = addListBlock.querySelector('.add-list-form')
    addListBtn = addListBlock.querySelector('.add-list-btn')
    addListBtn.addEventListener('click', addListOrHideListInput)
    cancelBtn = addListBlock.querySelector('.add-list-cancel-btn')
    cancelBtn.addEventListener('click', hideAddListForm)

    lists = board.querySelectorAll('.list')
    lists.forEach(list => addListEvents(list))
    cards = board.querySelectorAll('.card')
    cards.forEach(card => addCardEvents(card))
    addCardBtns = document.querySelectorAll('.add-card-btn')
    addCardBtns.forEach(btn => btn.addEventListener('click', addTextArea))
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

function renderLists() {
    const HTML = data.lists.map(listToHTML).join('')
    const app = document.getElementById('app')
    app.insertAdjacentHTML('afterbegin', HTML)
}


sendRequest('GET', getBoardURL)
    .then(response => main(response))
    .catch(err => console.log(err))


// Card modal

// optimized way to listen click on card instead of adding many eventListeners
document.addEventListener('click', e => {
    if (e.target.classList.contains('card')) {
        const listID = +(e.target.parentNode.parentNode.id.match(/\d+/)[0])
        const list = data.lists.filter( list => list.id === listID )[0]
        const card = list.cards.filter( card => card.title === e.target.innerText.trim())[0]
        const cardModal = modal(card) // DOM operations are async
        setTimeout( () => cardModal.open(), 0) // to see animation
    }
})


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
}


// create card

function createCardInDB(listID, title) {
    const body = {
        list: listID,
        title: title
    }
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    const URL = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/cards/`
    return sendRequest('POST', URL, body, headers)
}


function createCardInDOM(createdCard) {
    const newCard = document.createElement('div')
    newCard.className += 'list__item card'
    newCard.setAttribute('draggable', 'true')
    newCard.innerText = createdCard.title
    newCard.addEventListener('dragstart', cardOnDragStart)
    newCard.addEventListener('dragend', cardOnDragEnd)

    return newCard
}


async function createCard(e, title, listBody, textArea) {
    const listID = +(e.target.parentNode.parentNode.id.match(/\d+/)[0])
    const createdCard = await createCardInDB(listID, title)
    // update data
    await sendRequest('GET', getBoardURL)
        .then(response => data = response)

    const newCard = createCardInDOM(createdCard)
    listBody.insertBefore(newCard, textArea)
}


function addCardOrHideTextArea(e) {
    const listBody = this.parentNode
    const title = this.value
    if (isValidTitle(title)) {
        createCard(e, title, listBody, this)
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


const closeAddListForm = () => document.activeElement !== formInput ? hideAddListForm() : ''


function listHTMLToNode(listHTML) {
    const div = document.createElement('div');
    div.innerHTML = listHTML.trim();
    return div.firstChild;
}


function createListInDB(title) {
    const body = {
        board: 1,
        title: title
    }
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    const URL = `http://127.0.0.1:8000/api/boards/1/lists/`
    return sendRequest('POST', URL, body, headers)
}


function createListInDOM(createdList) {
    const newList = listHTMLToNode(listToHTML(createdList))
    addListEvents(newList)
    newList.querySelector('.add-card-btn').addEventListener('click', addTextArea)

    return newList
}


async function createList(title) {
    const createdList = await createListInDB(title)
    console.log(createdList.id)
    // update data
    await sendRequest('GET', getBoardURL)
        .then(response => data = response)

    return createListInDOM(createdList)
}


async function addListOrHideListInput() {
    if (isValidTitle(formInput.value)) {
        const newList = await createList(formInput.value)
        board.insertBefore(newList, addListBlock)
        board.scrollLeft = board.scrollWidth
        lists = document.querySelectorAll('.list')
        formInput.value = ''
        formInput.focus()
    }
}


// delete list

// update list



/* TODO:
* drag&drop card +
* drag&drop list +
* create card +
* create list +
* render lists and cards +
* on click card show modal with card details +
* render checklists +
* update card title +
*     1. AJAX GET data request and assign it to 'data' obj +
*     2. on blur title AJAX POST request to change title +
* description setter
* mark card as done
* list settings modal
* copy list
* delete all list cards
* delete list
* delete card
* marks modal
* add/remove mark
* checklist modal
* checklist progress bar
* add/remove checklist
* expiration modal
* add/remove expiration
* move card modal
* move card
* copy card modal
* copy card
**/
