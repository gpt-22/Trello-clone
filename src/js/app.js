import './../less/theme.less'

import {sendRequest,
  // getIDNum
} from './helpers'
// import {createModal} from './plugins/modal'
import {App} from './components/app/App';
import {Header} from './components/header/Header';
import {Board} from './components/board/Board';
import {EventDispatcher} from './core/EventDispatcher';


// Modals
// async function showCardModal(listID, cardID) {
//   const url = `boards/1/lists/${listID}/cards/${cardID}/`
//   const card = await sendRequest('GET', url)
//   const options = {
//     type: 'card',
//     card: card,
//   }
//   createModal(options)
// }
//
//
// function showSettingsModal(e, settingsContainer) {
//   const listNode = e.target.parentNode.parentNode.parentNode
//   const listID = getIDNum(listNode.id)
//   const options = {
//     type: 'listSettings',
//     listID: listID,
//     container: settingsContainer,
//   }
//   createModal(options)
// }


// Entry point
const main = async () => {
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
      data: {
        0: {},
        1: board,
      },
    })

    app.render()

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


main().catch((err) => console.log(err))

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
