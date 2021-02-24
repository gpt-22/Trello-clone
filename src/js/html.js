import {sendRequest, getIDNum} from './helpers';


const getCardMarkHTML = (title) => `
    <div class="card-mark-color ${title}"></div>
`

export const cardToHTML = (card) => `
<div class="list__item card" draggable="true" id="card${ card.id }">
    <div class="card-marks-container">
        ${ 'marks' in card ? card.marks.map((mark) => getCardMarkHTML(mark.title)).join('') : ''}
    </div>
    <div class="card-title">${card.title}</div>
</div>
`


export const listToHTML = (list) => `
<div id="list${ list.id }" class="list" draggable="true">
    <div class="list__header">
        <input type="text" class="list__title" value="${ list.title }">
        <div class="options-container">
            <img src="img/list-settings.png" alt="options" class="list__options">
        </div>
    </div>
    <div class="list__body">
        ${ list.cards.map(cardToHTML).join('') }
    </div>
    <div class="list__footer">
        <button class="add-card-btn">
            Добавить карточку
        </button>
    </div>
</div>
`


export const checkListItemToHTML = (item) => `
    <li class="checklist-item">
        <div class="checklist-item-container">
            <input type="checkbox" ${ item.done ? 'checked' : '' } />
            <textarea class="checklist-item-title" rows="1">${ item.text }</textarea>
        </div>
    </li>
`


export const checkListToHTML = (checkList) => `
    <div class="checklist-block">
        <div class="checklist-header">
            <textarea class="checklist-title" rows="1"> ${ checkList.title } </textarea>
            <button type="button" class="modal-btn default del-checklist-btn">Удалить</button>
        </div>
        <div class="checklist-body">
            <div class="checklist-progress">
            </div>
            <div class="checklist-list-container">
                <ul class="checklist-list">
                    ${ checkList.items.map(checkListItemToHTML).join('') }
                </ul>
            </div>
        </div>
        <div class="checklist-footer">
            <button type="button" class="modal-btn default checklist-add-item-btn">Добавить элемент</button>
            <form class="checklist-add-form">
                <textarea class="checklist-add-input" placeholder="Добавить элемент"></textarea>
                <div class="checklist-add-form-btns">
                    <button type="button" class="modal-btn primary">Сохранить</button>
                    <button type="button" class="modal-btn default">&#10006;</button>
                </div>
            </form>
        </div>
    </div>
`


export const getAddListBlockHTML = () => `
    <div class="add-list-block">
        <button class="show-form-btn">
            <svg width="16" height="16" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="plus">
                <rect x="9" y="1" width="2" height="17"></rect><rect x="1" y="9" width="17" height="2"></rect>
            </svg>
            Добавить колонку
        </button>
        <form class="add-list-form">
            <input type="text" class="add-list-input" placeholder="Заголовок списка">
            <div class="add-list-form-controls">
                <button type="button" class="add-list-btn">Добавить список</button>
                <button type="button" class="add-list-cancel-btn">&#10006;</button>
            </div>
        </form>
    </div>
`

export const getCardModalInnerHTML = (cardObj) => `
    <div class="modal-overlay" data-close="true">
        <div class="modal-container">
            <div class="modal-header">
                <input class="modal-title" type="text" placeholder="Название карточки"
                       value="${ cardObj.title }">
                <span class="modal-close" data-close="true">&#10006;</span>
            </div>
            <div class="modal-body">
                <div class="modal-col modal-col-left">
                    <div class="modal-marks-block">
                        ${ 'marks' in cardObj ? cardObj.marks.map((mark) => `
                            <div class="mark-color ${mark.title}"></div>`).join('') : '' }
                    </div>
                    <div class="modal-desc-block">
                        <h3 class="modal-desc-title">Описание</h3>
                        <textarea class="modal-description" placeholder="Добавьте более подробное описание..."
                                  data-desc >${ cardObj.description ? cardObj.description : '' }</textarea>
                        <div class="modal-desc-btns">
                            <button type="button" class="modal-btn primary">Сохранить</button>
                            <button type="button" class="modal-btn default">&#10006;</button>
                        </div>
                    </div>
                    ${ 'checklists' in cardObj ? cardObj.checklists.map(checkListToHTML).join('') : '' }
                </div>
                <div class="modal-col modal-col-right">
                    <div class="modal-add-block">
                        <span class="modal-add-title">Добавить на карточку</span>
                        <div class="marks-container">
                           <button type="button" class="modal-btn default modal-mark-btn">Метку</button>
                        </div>
                        <div class="checklist-container">
                            <button type="button" class="modal-btn default modal-checklist-btn">Чек-лист</button>
                        </div>
                        <div class="datetime-container">
                            <button type="button" class="modal-btn default modal-datetime-btn">Срок</button>
                        </div>
                    </div>
                    <div class="modal-actions-block">
                        <span class="modal-actions-title">Действия</span>
                        <div class="copy-container">
                            <button type="button" class="modal-btn default modal-move-btn">Переместить</button>
                        </div>
                        <div class="move-container">
                            <button type="button" class="modal-btn default modal-copy-btn">Копировать</button>
                        </div>
                        <div class="delete-container">
                            <button type="button" class="modal-btn danger modal-delete-btn">Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`


export const getOptionModalInnerHTML = (type, title='Действия со списком') => `
    <div class="modal-container">
        <div class="modal-header">
            <h3 class="modal-title" >${title}</h3>
            <span class="modal-close" data-close="true">&#10006;</span>
        </div>
        <div class="modal-body">
            ${ getOptionModalBodyByType(type) }
        </div>
    </div>
`


const getOptionModalBodyByType = (type) => {
  let body
  if (type === 'listSettings') body = getListSettingsModalBody()
  else if (type === 'marks') body = getMarksModalBody()
  else if (type === 'checklist') body = getChecklistModalBody()
  else if (type === 'expiration') body = getExpirationModalBody()
  else if (type === 'moveCard') body = getMoveCardModalBody()
  else if (type === 'copyCard') body = getCopyCardModalBody()
  else if (type === 'deleteCard') body = getDeleteCardModalBody()
  return body
}


export const getListSettingsModalBody = () => `
    <button class="settings-modal-add-card-btn">Добавить карточку</button>
    <button class="settings-modal-copy-list-btn">Копировать список</button>
    <button class="settings-modal-delete-all-cards-btn">Удалить все карточки списка</button>
    <button class="settings-modal-delete-list-btn">Удалить список</button>
`


export const getMarksModalBody = () => `
    <div class="mark-color green"></div>
    <div class="mark-color yellow"></div>
    <div class="mark-color orange"></div>
    <div class="mark-color red"></div>
    <div class="mark-color purple"></div>
    <div class="mark-color blue"></div>
`


export const getChecklistModalBody = () => ``
export const getExpirationModalBody = () => ``
export const getMoveCardModalBody = () => ``
export const getCopyCardModalBody = () => ``
export const getDeleteCardModalBody = () => `
    <div class="delete-card-modal-btns-row">
        <button class="delete-card-ok red">Удалить</button>
        <button class="delete-card-cancel">Отмена</button>
    </div>
`


export function createCardInDOM(createdCard) {
  const newCard = document.createElement('div')
  newCard.id = 'card' + createdCard.id
  newCard.className += 'list__item card'
  newCard.setAttribute('draggable', 'true')
  newCard.innerHTML = `
        <div class="card-marks-container"></div>
        <div class="card-title">${createdCard.title}</div>
    `
  // addCardEvents(newCard)

  return newCard
}


export async function createCard(e, title, listBody, textArea) {
  const listID = getIDNum(e.target.parentNode.parentNode.id)
  const body = {
    list: listID,
    title: title,
  }
  const url = `boards/1/lists/${ listID }/cards/`
  const createdCard = await sendRequest('POST', url, body)
  const newCard = createCardInDOM(createdCard)
  listBody.insertBefore(newCard, textArea)
}


// delete
export function createListInDOM(createdList) {
  const newList = HTMLToNode(listToHTML(createdList))
  const lists = document.querySelectorAll('.list')
  // addListEvents(newList, lists)
  newList.querySelector('.add-card-btn').addEventListener('click', addTextArea)

  return newList
}


export async function createList(title) {
  const body = {
    board: 1,
    title: title,
  }
  const url = `boards/1/lists/`
  const createdList = await sendRequest('POST', url, body)
  return createListInDOM(createdList)
}
