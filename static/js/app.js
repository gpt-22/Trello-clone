import {onOverBoard} from "./drag-n-drop";
import {sendRequest, isValidTitle, getIDNum} from './helpers'
import {listToHTML, addListEvents, addCardEvents, addTextArea, createList} from "./html"
import {createModal} from './plugins/modal'


// Vars
const getBoardURL = 'http://127.0.0.1:8000/api/boards/1'  // just takes the first board


// Modals
async function showCardModal(e) {
    const listNode = e.target.parentNode.parentNode
    const listID = getIDNum(listNode.id)
    const response = await sendRequest('GET', getBoardURL)
    const list = response.lists.filter( list => list.id === listID )[0]
    const card = list.cards.filter( card => card.title === e.target.innerText.trim())[0]
    const options = {
        type: 'card',
        card: card
    }
    createModal(options)
}


function showSettingsModal(e, settingsContainer) {
    const listNode = e.target.parentNode.parentNode.parentNode
    const listID = getIDNum(listNode.id)
    const options = {
        type: 'listSettings',
        listID: listID,
        container: settingsContainer
    }
    createModal(options)
}


// Add list form
function showAddListForm() {
    const addListBlock = document.querySelector('.add-list-block')
    const showFormBtn = addListBlock.querySelector('.show-form-btn')
    const addListForm = addListBlock.querySelector('.add-list-form')
    const formInput = addListBlock.querySelector('.add-list-input')
    showFormBtn.style.display = 'none'
    addListForm.style.display = 'block'
    formInput.focus()
    addListForm.addEventListener('submit', e => e.preventDefault()) // prevent reloading if in input enter is pressed
    formInput.addEventListener('keyup', e => (e.keyCode === 13) ? addListOrHideListInput() : {})
    document.addEventListener('click', closeAddListForm)
}


function hideAddListForm() {
    const addListBlock = document.querySelector('.add-list-block')
    const showFormBtn = addListBlock.querySelector('.show-form-btn')
    const addListForm = addListBlock.querySelector('.add-list-form')
    showFormBtn.style.display = 'block'
    addListForm.style.display = 'none'
    document.removeEventListener('click', closeAddListForm)
}


const closeAddListForm = () => {
    const formInput = document.querySelector('.add-list-input')
    document.activeElement !== formInput ? hideAddListForm() : ''
}


async function addListOrHideListInput() {
    const formInput = document.querySelector('.add-list-input')
    if (isValidTitle(formInput.value)) {
        const newList = await createList(formInput.value)
        const board = document.querySelector('.board')
        const addListBlock = document.querySelector('.add-list-block')
        board.insertBefore(newList, addListBlock)
        board.scrollLeft = board.scrollWidth
        formInput.value = ''
        formInput.focus()
    }
}


function addListBlockEventListeners(board) {
    const addListBlock = board.querySelector('.add-list-block')
    const formInput = addListBlock.querySelector('.add-list-input')
    addListBlock.addEventListener('click', () => formInput.focus())
    const showFormBtn = addListBlock.querySelector('.show-form-btn')
    showFormBtn.addEventListener('click', showAddListForm)
    const addListBtn = addListBlock.querySelector('.add-list-btn')
    addListBtn.addEventListener('click', addListOrHideListInput)
    const cancelBtn = addListBlock.querySelector('.add-list-cancel-btn')
    cancelBtn.addEventListener('click', hideAddListForm)
}


async function renderLists() {
    // Getting HTML
    const response = await sendRequest('GET', getBoardURL)
    const HTML = response.lists.map(listToHTML).join('')
    const app = document.getElementById('app')
    app.insertAdjacentHTML('afterbegin', HTML)

    // Adding event listeners
    const board = document.querySelector('.board')
    board.addEventListener('dragover', onOverBoard)
    const lists = board.querySelectorAll('.list')
    lists.forEach(list => addListEvents(list, lists))
    const cards = board.querySelectorAll('.card')
    cards.forEach(card => addCardEvents(card))
    const addCardButtons = document.querySelectorAll('.add-card-btn')
    addCardButtons.forEach(btn => btn.addEventListener('click', addTextArea))
    addListBlockEventListeners(board)
}


// Entry point
const main = async () => {
    await renderLists()

    document.addEventListener('click', e => {
        // Optimized way to listen click on card instead of adding many eventListeners
        if (e.target.classList.contains('card')) {
            showCardModal(e)
        } else if (e.target.classList.contains('list__options')) {
            const settingsContainer = e.target.parentNode
            if (settingsContainer.children.length === 1)
                showSettingsModal(e, settingsContainer)
            else {
                const modalNode = e.target.parentNode.querySelector('.settings-modal')
                // remove all event listeners
                const modalClone = modalNode.cloneNode(true)
                modalNode.parentNode.replaceChild(modalClone, modalNode)
                // remove from DOM
                modalClone.parentNode.removeChild(modalClone)
            }
        }
    })
}


main()
    .then(() => console.log("Board is rendered"))
    .catch(err => console.log(err))


/* TODO:
*---------------
* drag&drop card +
* drag&drop list +
* save dropped card in list (update db): delete from one list + add copy to another
* save dropped list in position (update db)
* --------------
* render lists and cards +
*---------------
* create card +
* on click card show modal with card details +
* update card title +
* update description +
* render checklists +
* delete card +
*---------------
* create list +
* list settings modal +
* add card +
* copy list +- (fix marks & checklists copying)
* delete all list cards +
* delete list +
*---------------
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
* mark card as done
**/
