import {onOverBoard} from './drag-n-drop';
import {sendRequest, isValidTitle, getIDNum} from './helpers'
import {
  listToHTML,
  addListEvents,
  addCardEvents,
  addTextArea,
  createList,
  getAddListBlockHTML,
} from './html'
import {createModal} from './plugins/modal'
import {App} from './components/app/App';
import {Header} from './components/header/Header';
import {Board} from './components/board/Board';


// Modals
async function showCardModal(listID, cardID) {
  const url = `boards/1/lists/${listID}/cards/${cardID}/`
  const card = await sendRequest('GET', url)
  const options = {
    type: 'card',
    card: card,
  }
  createModal(options)
}


function showSettingsModal(e, settingsContainer) {
  const listNode = e.target.parentNode.parentNode.parentNode
  const listID = getIDNum(listNode.id)
  const options = {
    type: 'listSettings',
    listID: listID,
    container: settingsContainer,
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
  addListForm.addEventListener('submit', (e) => e.preventDefault()) // prevent reloading if in input enter is pressed
  formInput.addEventListener('keyup', (e) => (e.keyCode === 13) ? addListOrHideListInput() : {})
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


function renderLists(board) {
  // Getting HTML
  const HTML = board.lists.map(listToHTML).join('')
  const app = document.getElementById('app')
  app.insertAdjacentHTML('beforeend', HTML)
  app.insertAdjacentHTML('beforeend', getAddListBlockHTML())

  // Adding event listeners
  const boardNode = document.querySelector('.board')
  boardNode.addEventListener('dragover', onOverBoard)
  const lists = boardNode.querySelectorAll('.list')
  lists.forEach((list) => addListEvents(list, lists))
  const cards = boardNode.querySelectorAll('.card')
  cards.forEach((card) => addCardEvents(card))
  const addCardButtons = document.querySelectorAll('.add-card-btn')
  addCardButtons.forEach((btn) => btn.addEventListener('click', addTextArea))
  addListBlockEventListeners(boardNode)
}


// Entry point
export const main = async () => {
  sendRequest('POST', 'token/', {
    'username': 'admin',
    'password': 'admin',
  }).then((data) => {
    localStorage.setItem('refreshToken', data['refresh'])
    localStorage.setItem('accessToken', data['access'])
    return sendRequest('GET', 'boards/1/')
  }).then((board) => {
    const app = new App('#app', {
      components: [Header, Board],
      data: {0: {}, 1: board},
    })

    app.renderPage()

    // renderLists(board)
    // document.addEventListener('click', (e) => {
    //   // Optimized way to listen click on card instead of adding many eventListeners
    //   if (e.target.classList.contains('card')) {
    //     const cardID = getIDNum(e.target.id)
    //     const listID = getIDNum(e.target.parentNode.parentNode.id)
    //     showCardModal(listID, cardID)
    //   } else if (e.target.parentNode.classList.contains('card')) {
    //     const cardID = getIDNum(e.target.parentNode.id)
    //     const listID = getIDNum(e.target.parentNode.parentNode.parentNode.id)
    //     showCardModal(listID, cardID)
    //   } else if (e.target.parentNode.parentNode.classList.contains('card')) {
    //     const cardID = getIDNum(e.target.parentNode.parentNode.id)
    //     const listID = getIDNum(e.target.parentNode.parentNode.parentNode.parentNode.id)
    //     showCardModal(listID, cardID)
    //   } else if (e.target.classList.contains('list__options')) {
    //     const settingsContainer = e.target.parentNode
    //     if (settingsContainer.children.length === 1) {
    //       showSettingsModal(e, settingsContainer)
    //     } else {
    //       const modalNode = e.target.parentNode.querySelector('.list-settings-modal')
    //       // remove all event listeners
    //       const modalClone = modalNode.cloneNode(true)
    //       modalNode.parentNode.replaceChild(modalClone, modalNode)
    //       // remove from DOM
    //       modalClone.parentNode.removeChild(modalClone)
    //     }
    //   }
    // })
  })
}


/* TODO:
* fix eslint with 'no-invalid-this'
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
**/
