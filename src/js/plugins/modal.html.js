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
