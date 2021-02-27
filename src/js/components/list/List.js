import {BaseComponent} from '../../core/BaseComponent';
import {Card} from '../card/Card';
import {dom} from '../../core/DOM';
import {sendRequest, isValidTitle, getIDNum} from '../../helpers';
import {getOnDragover} from '../../drag-n-drop';
import {createModal} from '../../plugins/modal';

export class List extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create(
        'div',
        `list${ options.data.id }`,
        'list',
        {'draggable': true}
    )
    super(componentNode, {
      name: 'List',
      listeners: ['click', 'dragover', 'dragstart', 'dragend'],
      ...options,
    })
  }

  init() {
    super.init()
    this.on('List:dragstart', () => this.removeListener('dragover'))
    this.on('List:dragend', () => {
      this.addListener('dragover')

      const newPosition = Array
          .from(dom.get('.list', true))
          .map((list) => getIDNum(list.id))
          .indexOf(this.data.id)

      const body = {position: newPosition}
      const url = `boards/1/lists/${this.data.id}/`
      sendRequest('PATCH', url, body).catch((err) => console.log(err))

      this.data.position = newPosition
    })
    this.on(
        'Card:dragend',
        async (fromListComponent, toListComponent, cardComponent) => {
          const isSameList = fromListComponent === toListComponent
          if (!isSameList && this.data.id === fromListComponent.data.id) {
            this.components = this.components.filter((component) => component !== cardComponent)
          } else if (!isSameList && this.data.id === toListComponent.data.id) {
            this.components.push(cardComponent)
            this.data.cards.push(cardComponent.data)
            const cards = fromListComponent.data.cards
            fromListComponent.data.cards = cards.filter((card) => card !== cardComponent.data)
          }
          // change card positions
          const cardsNodes = this.rootNode.querySelectorAll('.card')
          const cardsIDs = Array.from(cardsNodes).map((cardNode) => getIDNum(cardNode.id))
          await this.components.forEach((component) => {
            const newPosition = cardsIDs.indexOf(component.data.id)
            // in DB
            const body = {position: newPosition}
            const url = `boards/1/lists/${this.data.id}/cards/${component.data.id}/`
            sendRequest('PATCH', url, body)
                .catch((err) => console.log('change pos:', err))
            // in component
            component.data.position = newPosition
          })

          this.sortCardsByPosition()
        })
  }

  render() {
    this.rootNode.innerHTML = this.toHTML(this.data)
    this.sortCardsByPosition()
    const cardsContainerNode = dom.get('.list__cards-container', false, this.rootNode)
    const data = {}

    this.data.cards.forEach((card, idx) => {
      data[idx] = card
      data[idx]['rootNode'] = cardsContainerNode
      this.components.push(Card)
    })
    const listBody = this.rootNode.querySelector('.list__body')
    this.renderInnerComponents(data, listBody)
  }

  toHTML(list) {
    return `
        <div class="list__header">
            <input type="text" class="list__title" value="${ list.title }">
            <div class="options-container">
                <img src="img/list-settings.png" alt="options" class="list__options">
            </div>
        </div>
        <div class="list__body">
            <div class="list__cards-container"></div>
        </div>
        <div class="list__footer">
            <button class="add-card-btn">
                Добавить карточку
            </button>
        </div>
    `
  }

  sortCardsByPosition() {
    this.data.cards = this.data.cards.sort((l1, l2) => {
      return (l1.position > l2.position) ? 1 : -1
    })
  }

  showNewListTitleInput(listBody) {
    const textArea = dom.create(
        'textarea',
        '',
        'add-card-text',
        {
          'placeholder': 'Введите заголовок для этой карточки',
          'rows': 3,
        }
    )
    textArea.addEventListener('keyup', (e) => e.key === 'Enter' ? textArea.blur() : {})
    textArea.addEventListener('blur', () => {
      // addCardOrHideTextArea
      const listBody = textArea.parentNode
      const title = textArea.value
      if (isValidTitle(title)) {
        this.createCard(title).then( () => {
          textArea.value = ''
          textArea.focus()
        })
        console.log('card must be created')
      } else listBody.removeChild(textArea)
      listBody.scrollTop = listBody.scrollHeight
    })

    listBody.appendChild(textArea)
    textArea.focus()
    listBody.scrollTop = listBody.scrollHeight
  }

  getNewCardPosition = () => this.data.cards.length

  async createCard(title) {
    const position = this.getNewCardPosition()

    // create in DB
    const body = {
      list: this.data.id,
      title: title,
      position: position,
    }
    const url = `boards/1/lists/${this.data.id}/cards/`
    const createdCard = await sendRequest('POST', url, body)

    // add card data to list component data
    const cardsContainerNode = dom.get('.list__cards-container', false, this.rootNode)
    const cardData = {0: {...createdCard, 'rootNode': cardsContainerNode}}
    this.data.cards.push(createdCard)

    // add list component to listBody component
    const newCard = this.renderInnerComponent(Card, cardData, 0)
    // const idx = this.components.length - 1
    this.components.push(newCard)
    newCard.init()

    const listBodyNode = dom.get('.list__body', false, this.rootNode)
    listBodyNode.scrollTop = listBodyNode.scrollHeight
  }

  // listener's methods
  onClick(event) {
    const cardNode = dom.findParentNodeWithTheClass(event.target, 'card', this.rootNode)
    const isAddCardBtn = event.target.classList.contains('add-card-btn')
    const isOptions = event.target.classList.contains('list__options')

    if (cardNode) {
      const cardID = getIDNum(cardNode.id)
      const listID = getIDNum(this.rootNode.id)
      showCardModal(listID, cardID)
    } else if (isAddCardBtn) {
      const listBody = this.rootNode.querySelector('.list__body')
      this.showNewListTitleInput(listBody)
    } else if (isOptions) {
      const settingsContainer = event.target.parentNode
      if (settingsContainer.children.length === 1) {
        showSettingsModal(event, settingsContainer)
      } else {
        const modalNode = event.target.parentNode.querySelector('.list-settings-modal')
        // remove all event listeners
        const modalClone = modalNode.cloneNode(true)
        modalNode.parentNode.replaceChild(modalClone, modalNode)
        // remove from DOM
        modalClone.parentNode.removeChild(modalClone)
      }
    }
  }

  onDragover = getOnDragover(
      () => dom.get('.list__cards-container', false, this.rootNode),
      'y',
      '.card',
      '.dragging'
  )

  onDragstart() {
    this.dispatch('List:dragstart')
    this.rootNode.classList.add('dragging-list')
  }

  onDragend() {
    this.dispatch('List:dragend')
    this.rootNode.classList.remove('dragging-list')
  }
}


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

/* TODO: copy list +- (fix marks & checklists copying) */
