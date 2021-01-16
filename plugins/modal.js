function _createModal(options) {

    options = typeof options === 'undefined' ? {} : options

    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay" data-close="true">
            <div class="modal-container">
                <div class="modal-header">
                    <input class="modal-title" type="text" placeholder="Название карточки" 
                    value="${ options.hasOwnProperty('title') ? options.title : 'Название карточки' }">
                    <span class="modal-close" data-close="true">&#10006;</span>
                </div>
                <div class="modal-body">
                    <div class="modal-col modal-col-left">
                        <div class="modal-desc-block">
                            <span class="modal-desc-title">Описание</span>
                            <textarea class="modal-description" value="${ options.description ? options.description : '' }" 
                                placeholder="Добавьте более подробное описание..." data-desc></textarea>
                        </div>

                        <div class="modal-checklist-block">
                            <div class="modal-checklist-header">
                                <span class="modal-checklist-title">Чек-лист</span>
                                <button type="button" class="modal-btn modal-del-checklist-btn">Удалить</button>
                            </div>
                            
                            <div class="modal-checklist-body">
                                <div class="modal-progress-body"></div>
                                <div class="modal-checklist-list-container">
                                    <ul class="modal-checklist-list">
                                        <li class="modal-checklist-list-item">1</li>
                                        <li class="modal-checklist-list-item">2</li>
                                        <li class="modal-checklist-list-item">3</li>    
                                    </ul>
                                </div>
                            </div>

                            <div class="modal-checklist-footer">
                    
                            </div>
                        </div>

                    </div>
                    <div class="modal-col modal-col-right">
                        <div class="modal-add-block">
                            <span class="modal-add-title">Добавить на карточку</span>
                            <button type="button" class="modal-btn modal-mark-btn">Метку</button>
                            <button type="button" class="modal-btn modal-checklist-btn">Чек-лист</button>
                            <button type="button" class="modal-btn modal-datetime-btn">Срок</button>    
                        </div>
                        <div class="modal-actions-block">
                            <span class="modal-actions-title">Действия</span>
                            <button type="button" class="modal-btn modal-move-btn">Переместить</button>
                            <button type="button" class="modal-btn modal-copy-btn">Копировать</button>
                            <button type="button" class="modal-btn modal-delete-btn">Удалить</button>    
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    `)
    document.body.appendChild(modal)

    return modal
}


$.modal = function(options) {
    // closure -> access to private fields/methods

    const $modalNode = _createModal(options)
    let isClosing = false
    let isDestroyed = false

    const modal = {
        open() {
            if (isDestroyed) return
            !isClosing && $modalNode.classList.add('open')
        },
        close() {
            isClosing = true
            $modalNode.classList.remove('open')
            $modalNode.classList.add('hiding')     
            setTimeout( () => {
                isClosing = false
                $modalNode.classList.remove('hiding')
            }, 300)
        },
    }

    $modalNode.addEventListener('click', e => (e.target.dataset.close === 'true') ? modal.close() : '')

    return Object.assign(modal, {
        destroy() {
            const $modalClone = $modalNode.cloneNode(true)
            $modalNode.parentNode.replaceChild($modalClone, $modalNode)
            $modalClone.parentNode.removeChild($modalClone)
            isDestroyed = true
        },
        setHTML(html){
            $modalNode.querySelector('[data-desc]').innerHTML = html
        }
    })
}
