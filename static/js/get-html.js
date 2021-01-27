
export const cardToHTML = card => `
<div class="list__item card" draggable="true" id="card${ card.id }">
    ${ card.title }
</div>
`


export const listToHTML = list => `
<div id="list${ list.id }" class="list" draggable="true">
    <div class="list__header">
        <input type="text" class="list__title" value="${ list.title }">
        <div class="options-container">
            <img src="static/img/list-settings.png" alt="options" class="list__options">
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


export const checkListItemToHTML = item => `
    <li class="checklist-item">
        <div class="checklist-item-container">
            <input type="checkbox" ${ item.done ? 'checked' : '' } />
            <textarea class="checklist-item-title" rows="1">${ item.text }</textarea>
        </div>
    </li>
`


export const checkListToHTML = checkList => `
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
                        <button type="button" class="modal-btn default modal-mark-btn">Метку</button>
                        <button type="button" class="modal-btn default modal-checklist-btn">Чек-лист</button>
                        <button type="button" class="modal-btn default modal-datetime-btn">Срок</button>    
                    </div>
                    <div class="modal-actions-block">
                        <span class="modal-actions-title">Действия</span>
                        <button type="button" class="modal-btn default modal-move-btn">Переместить</button>
                        <button type="button" class="modal-btn default modal-copy-btn">Копировать</button>
                        <button type="button" class="modal-btn danger modal-delete-btn">Удалить</button>    
                    </div>
                </div>
            </div>
        </div>
    </div>    
`


export const getOptionModalInnerHTML = (body) => `
    <div class="modal-container">
        <div class="modal-header">
            <h3 class="modal-title" >Действия со списком</h3>
            <span class="modal-close" data-close="true">&#10006;</span>                
        </div>
        <div class="modal-body">
            ${ body }            
        </div>
    </div>
`


export const getListSettingsModalBody = () => `
    <button class="settings-modal-add-card-btn">Добавить карточку</button>
    <button class="settings-modal-copy-list-btn">Копировать список</button>
    <button class="settings-modal-delete-all-cards-btn">Удалить все карточки списка</button>
    <button class="settings-modal-delete-list-btn">Удалить список</button>
`


export function getMarksModalBody(options) {}
export function getChecklistModalBody(options) {}
export function getExpirationModalBody(options) {}
export function getMoveCardModalBody(options) {}
export function getCopyCardModalBody(options) {}

