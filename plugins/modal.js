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
                    <div class="modal-description" data-content>
                        ${ options.description ? options.description : '' }
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
            $modalNode.querySelector('[data-description]').innerHTML = html
        }
    })
}
