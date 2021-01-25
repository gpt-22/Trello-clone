import {sendRequest} from '../helpers'


const checkListItemToHTML = item => `
    <li class="checklist-item">
        <div class="checklist-item-container">
            <input type="checkbox" ${ item.done ? 'checked' : '' } />
            <textarea class="checklist-item-title" rows="1">${ item.text }</textarea>
        </div>
    </li>
`


const checkListToHTML = checkList => `
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


function _createCardModal(options) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true">
            <div class="modal-container">
                <div class="modal-header">
                    <input class="modal-title" type="text" placeholder="Название карточки" 
                    value="${ 'title' in options ? options.title : 'Название карточки' }" data-title>
                    <span class="modal-close" data-close="true">&#10006;</span>
                </div>
                <div class="modal-body">
                    <div class="modal-col modal-col-left">
                        <div class="modal-desc-block">
                            <h3 class="modal-desc-title">Описание</h3>
                            <textarea class="modal-description" placeholder="Добавьте более подробное описание..." 
                                      data-desc >${ options.description ? options.description : '' }</textarea>
                            <div class="modal-desc-btns">
                                <button type="button" class="modal-btn primary">Сохранить</button>
                                <button type="button" class="modal-btn default">&#10006;</button>
                            </div>
                        </div>

                        ${ 'checklists' in options ? options.checklists.map(checkListToHTML).join('') : '' }
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
    `)
    document.body.appendChild(modal)

    return modal
}


const getCardModalMethods = $modalNode => {
    return {
        setDescription(text) {
            $modalNode.querySelector('[data-desc]').innerText = text
        },
        setModalDescriptionEventListeners() {
            const modalDesc = $modalNode.querySelector('.modal-description')
            const modalDescBtns = $modalNode.querySelector('.modal-desc-btns')
            modalDesc.addEventListener('focus', e => modalDescBtns.style.display = 'flex')
            modalDesc.addEventListener('blur', e => {
                modalDescBtns.style.display = 'none'
                modalDesc.value === '' ? modalDesc.style.minHeight = '56px' : ''
            })
            modalDesc.addEventListener('input', e => {
                modalDesc.style.height = 'auto'
                modalDesc.style.height = modalDesc.scrollHeight + 'px'
            })
        },
        setChecklistsEventListeners() {
            // const itemTitles = $modalNode.querySelectorAll('.checklist-item-title')
            // itemTitles.forEach(title => {
            //     title.addEventListener('focus', e => {
            //         title.style.minHeight = '56px'
            //         title.style.padding = '8px 12px'
            //         const item = title.parentNode.parentNode
            //         item.insertAdjacentHTML('beforeend', `
            //             <div class="checklist-item-btns">
            //                 <button type="button" class="modal-btn primary">Сохранить</button>
            //                 <button type="button" class="modal-btn default">&#10006;</button>
            //             </div>
            //         `)
            //     })
            //     title.addEventListener('blur', e => {
            //         title.style.minHeight = '25.6px'
            //         title.style.padding = '4px 8px'
            //         const item = title.parentNode.parentNode
            //         item.removeChild(item.children[item.children.length - 1])
            //     })
            // })
            // const addItemBtn = $modalNode.querySelector('.checklist-add-item-btn')
            // addItemBtn.addEventListener('click', e => {
            //     addForm = $modalNode.querySelector('.checklist-add-form')
            //     addForm.style.display = 'block'
            //     addItemBtn.style.display = 'none'
            //     input = addForm.querySelector('.checklist-add-input')
            //     input.focus()
            //     input.addEventListener('blur', e => {
            //         addForm.style.display = 'none'
            //         addItemBtn.style.display = 'block'
            //     })
            // })
        },
        setChecklistItemsEventListeners() {

        }
    }
}


function _createOptionModal(options) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title" style="text-align: center;" data-title>
                    ${ 'title' in options ? options.title : 'Название карточки' }
                </h3>
                <span class="modal-close" data-close="true">&#10006;</span>
            </div>
            <div class="modal-body">
                ${ getOptionBody(options) }
            </div>
        </div>
    `)
    document.body.appendChild(modal)

    return modal
}


function getOptionBody(options) {
    const type = options.type
    switch (type) {
        case 'listSettings':
            return  getListSettingsModalBody(options)
        case 'marks':
            return getMarksModalBody(options)
        case 'checklist':
            return getChecklistModalBody(options)
        case 'expiration':
            return getExpirationModalBody(options)
        case 'moveCard':
            return getMoveCardModalBody(options)
        case 'copyCard':
            return getCopyCardModalBody(options)
    }
}


function getListSettingsModalBody(options) {

}


function getMarksModalBody(options) {

}


function getChecklistModalBody(options) {

}


function getExpirationModalBody(options) {

}


function getMoveCardModalBody(options) {

}


function getCopyCardModalBody(options) {

}


function changeCardTitleInList(listId, oldTitle, newTitle) {
    const list = document.getElementById('list' + listId)
    const cards = list.querySelectorAll('.card')
    cards.forEach(card => {
        if (card.innerText === oldTitle) card.innerText = newTitle
    })
}


export const modal = function(options) {
    // closure -> access to private fields/methods

    // modal types:
    // 'card'
    // 'listSettings'
    // 'marks'
    // 'checklist'
    // 'expiration'
    // 'moveCard'
    // 'copyCard'

    options = typeof options !== 'undefined' ? options : {}
    const type = options.type ? options.type : 'card'
    let isDestroyed = false
    let $modalNode

    const modal = {
        open() {
            if (isDestroyed) return
            $modalNode.classList.add('open')
        },
        close() {
            $modalNode.classList.remove('open')
            $modalNode.classList.add('hiding')
            setTimeout( () => {
                $modalNode.classList.remove('hiding')
                this.destroy()
            }, 500)
        },
        destroy() {
            const $modalClone = $modalNode.cloneNode(true)
            $modalNode.parentNode.replaceChild($modalClone, $modalNode)
            $modalClone.parentNode.removeChild($modalClone)
            isDestroyed = true
        },
        setTitle(text) {
            $modalNode.querySelector('[data-title]').innerText = text
        },
    }

    if (type === 'card') {
        $modalNode = _createCardModal(options)
        Object.assign(modal, getCardModalMethods($modalNode))
        if ('checklists' in options)
            modal.setChecklistsEventListeners()
    } else $modalNode = _createOptionModal(options)

    $modalNode.addEventListener('click', e => (e.target.dataset.close === 'true') ? modal.close() : '')

    const modalTitle = $modalNode.querySelector('.modal-title')
    modalTitle.addEventListener('blur', e => {
        const body = {
            title: modalTitle.value
        }

        const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
        const headers = {
            'X-CSRFToken':  csrfToken,
            'Content-Type': 'application/json; charset=UTF-8'
        }

        const listId = options.list
        const cardId = options.id
        const URL = `http://127.0.0.1:8000/api/boards/1/lists/${ listId }/cards/${ cardId }/`

        sendRequest('PATCH', URL, body, headers)
            .then(data => console.log(data))
            .catch(err => console.log(err))

        changeCardTitleInList(listId, options.title, modalTitle.value)
    })

    return modal
}
