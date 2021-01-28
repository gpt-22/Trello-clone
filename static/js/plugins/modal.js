import {
    getCardModalInnerHTML,
    getOptionModalInnerHTML,
    getListSettingsModalBody,
    getMarksModalBody,
    getChecklistModalBody,
    getExpirationModalBody,
    getMoveCardModalBody,
    getCopyCardModalBody,
    createCardInDOM,
    createListInDOM,
    deleteFromDOMbyID,
} from "../html";
import {sendRequest, getIDNum} from "../helpers";


function _createCardModal(options) {
    const modalNode = document.createElement('div')
    modalNode.classList.add('modal')
    modalNode.classList.add('card-modal')
    modalNode.id = 'cardModal' + options.card.id
    modalNode.insertAdjacentHTML('afterbegin', getCardModalInnerHTML(options.card))
    document.body.appendChild(modalNode)

    return modalNode
}


const getCardModalMethods = $modalNode => {
    return {
        close() {
            $modalNode.classList.remove('open')
            $modalNode.classList.add('hiding')
            setTimeout( () => {
                $modalNode.classList.remove('hiding')
                this.destroy()
            }, 500)
        },
        setModalDescriptionEventListeners(options) {
            const modalDesc = $modalNode.querySelector('.modal-description')
            const modalDescBtns = $modalNode.querySelector('.modal-desc-btns')
            modalDesc.addEventListener('focus', e => modalDescBtns.style.display = 'flex')
            modalDesc.addEventListener('blur', e => {
                const cardID = options.card.id
                const listID = options.card.list
                const body = {
                    description: modalDesc.value
                }
                const url = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/cards/${ cardID }/`
                sendRequest('PATCH', url, body).catch(err => console.log(err))
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
        setChecklistItemsEventListeners() {},
        delete(listID, cardID) {
            const url = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/cards/${ cardID }/`
            sendRequest('DELETE', url, null).catch(err => console.log(err))
            this.close()
            deleteFromDOMbyID('card'+cardID)
        }
    }
}


function _createOptionModal(options, body, optionsContainer) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.classList.add('settings-modal')
    modal.insertAdjacentHTML('afterbegin', getOptionModalInnerHTML(body))
    optionsContainer.appendChild(modal)

    return modal
}


const getListSettingsModalMethods = ($modalNode, listID) => {
    return {
        setEventListeners() {
            const addCardBtn = $modalNode.querySelector('.settings-modal-add-card-btn')
            addCardBtn.addEventListener('click', e => {
                this.close()
                const list = document.getElementById('list'+listID)
                const addCardBtn = list.querySelector('.add-card-btn')
                addCardBtn.click()
            })
            const copyListBtn = $modalNode.querySelector('.settings-modal-copy-list-btn')
            copyListBtn.addEventListener('click', async e => {
                const title =  document.getElementById('list'+ listID).querySelector('.list__title').value
                // create list in DB: +
                const body = {
                    board: 1,
                    title: title
                }
                const url = `http://127.0.0.1:8000/api/boards/1/lists/`
                const createdList = await  sendRequest('POST', url, body)
                // create list in DOM
                const createdListNode = createListInDOM(createdList)
                // create list cards in DB: +/-
                const getCardsURL = `http://127.0.0.1:8000/api/boards/1/lists/${listID}/cards/`
                const cards = await sendRequest('GET', getCardsURL)
                for (let i = 0; i < cards.length; ++i) {
                    const body = cards[i]
                    delete body.id
                    delete body.marks // to fix: create marks
                    delete body.checklists // to fix: create checklists
                    body.list = createdList.id
                    const url = `http://127.0.0.1:8000/api/boards/1/lists/${ body.list }/cards/`
                    const createdCard = await sendRequest('POST', url, body)
                    const cardNode = createCardInDOM(createdCard)
                    const listBody = createdListNode.querySelector('.list__body')
                    listBody.appendChild(cardNode)
                }
                // add to board
                const board = document.querySelector('.board')
                const addListBlock = board.querySelector('.add-list-block')
                board.insertBefore(createdListNode, addListBlock)
                board.scrollLeft = board.scrollWidth
                this.close()
           })
            const delAllCardsBtn = $modalNode.querySelector('.settings-modal-delete-all-cards-btn')
            delAllCardsBtn.addEventListener('click', e => {
                const listNode = document.getElementById('list' + listID)
                const cardNodes = listNode.querySelectorAll('.card')
                const ids = Array.from(cardNodes).map(card => card.id)
                ids.forEach(idStr => {
                    const cardID = getIDNum(idStr)
                    const url = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/cards/${ cardID }/`
                    sendRequest('DELETE', url, null).catch(err => console.log(err))
                    deleteFromDOMbyID('card' + cardID)
                })
                this.close()
            })
            const delListBtn = $modalNode.querySelector('.settings-modal-delete-list-btn')
            delListBtn.addEventListener('click', e => {
                const url = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/`
                sendRequest('DELETE', url, null).catch(err => console.log(err))
                deleteFromDOMbyID('list' + listID)
            })
        }
    }
}


export const modal = function(options, afterNode = null) {
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
    const overlay = options.overlay ? options.overlay : true
    const animateOpenClose = options.animateOpenClose ? options.animateOpenClose : true

    let isDestroyed = false
    let $modalNode


    const modal = {
        open() {
            if (isDestroyed) return
            $modalNode.classList.add('open')
        },
        close() {
            $modalNode.classList.remove('open')
            this.destroy()
        },
        destroy() {
            const $modalClone = $modalNode.cloneNode(true)
            $modalNode.parentNode.replaceChild($modalClone, $modalNode)
            $modalClone.parentNode.removeChild($modalClone)
            isDestroyed = true
        },
    }

    if (type === 'card') {
        $modalNode = _createCardModal(options)
        Object.assign(modal, getCardModalMethods($modalNode))
        modal.setModalDescriptionEventListeners(options)
        if ('checklists' in options.card)
            modal.setChecklistsEventListeners()
        const modalTitle = $modalNode.querySelector('.modal-title')
        modalTitle.addEventListener('blur', e => {
            // change title in DB
            const body = {
                title: modalTitle.value
            }
            const cardID = options.card.id
            const listID = options.card.list
            const url = `http://127.0.0.1:8000/api/boards/1/lists/${listID}/cards/${cardID}/`
            console.log(url)
            sendRequest('PATCH', URL, body)
                .then(data => console.log(data))
                .catch(err => console.log(err))
            // change title in list
            const cardNode = document.getElementById('card'+cardID)
            cardNode.innerText = modalTitle.value
        })
        const deleteBtn = $modalNode.querySelector('.modal-delete-btn')
        deleteBtn.addEventListener('click', e => modal.delete(options.card.list, options.card.id))
    } else if (type === 'listSettings') {
        $modalNode = _createOptionModal(options, getListSettingsModalBody(options), afterNode)
        Object.assign(modal, getListSettingsModalMethods($modalNode, options.listID))
        modal.setEventListeners($modalNode)
    } else if (type === 'marks') {
        $modalNode = _createOptionModal(options, getMarksModalBody(options), afterNode)
    } else if (type === 'checklist') {
        $modalNode = _createOptionModal(options, getChecklistModalBody(options), afterNode)
    } else if (type === 'expiration') {
        $modalNode = _createOptionModal(options, getExpirationModalBody(options), afterNode)
    } else if (type === 'moveCard') {
        $modalNode = _createOptionModal(options, getMoveCardModalBody(options), afterNode)
    } else if (type === 'copyCard') {
        $modalNode = _createOptionModal(options, getCopyCardModalBody(options), afterNode)
    }


    $modalNode.addEventListener('click', e => (e.target.dataset.close === 'true') ? modal.close() : '')

    return modal
}


// modal -> overlay -> container -> header / body / footer
// modal -> container -> header / body / footer
// options:
// * type
// * overlay
// * animateOpenClose