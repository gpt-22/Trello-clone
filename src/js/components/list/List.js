import {BaseComponent} from '../../core/BaseComponent';
import {Card} from '../card/Card';
import {dom, HTMLToNode} from '../../core/DOM';
import {isValidTitle, sendRequest} from '../../helpers';
import {listToHTML} from '../../html';
import {getOnDragover} from '../../drag-n-drop';

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
    console.log(this.eventDispatcher)
  }

  init() {
    super.init()
    this.eventDispatcher.listen('List:dragstart', () => this.removeListener('dragover'))
    this.eventDispatcher.listen('List:dragend', () => this.addListener('dragover'))
  }

  render() {
    this.rootNode.innerHTML = this.toHTML(this.data)
    const data = {}
    this.data['cards'].forEach((card, idx) => {
      data[idx] = card
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
        </div>
        <div class="list__footer">
            <button class="add-card-btn">
                Добавить карточку
            </button>
        </div>
    `
  }

  async create(title) {
    // create in DB
    const body = {
      board: 1,
      title: title,
    }
    const url = `boards/1/lists/`
    const createdList = await sendRequest('POST', url, body)

    // create in DOM
    const newList = HTMLToNode(listToHTML(createdList))
    // const lists = document.querySelectorAll('.list')
    // addListEvents(newList, lists)
    newList.querySelector('.add-card-btn').addEventListener('click', addTextArea)

    return newList
  }

  // listener's methods
  onClick(event) {
    if (event.target.classList.contains('add-card-btn')) {
      const listBody = this.rootNode.querySelector('.list__body')
      addTextArea(listBody)
    }
  }

  onDragover = getOnDragover(
      () => this.rootNode.querySelector('.list__body'),
      'y',
      '.card',
      '.dragging'
  )

  onDragstart() {
    this.eventDispatcher.dispatch('List:dragstart')
    const lists = document.querySelectorAll('.list')
    lists.forEach((list) => {
      list.removeEventListener('dragover', this.onDragover)
    })
    this.rootNode.classList.add('dragging-list')
  }

  onDragend() {
    this.eventDispatcher.dispatch('List:dragend')
    const lists = document.querySelectorAll('.list')
    this.rootNode.classList.remove('dragging-list')
    lists.forEach((list) => {
      list.addEventListener('dragover', this.onDragover)
    })
  }
}

function addCardOrHideTextArea() {
  const listBody = this.parentNode
  const title = this.value
  if (isValidTitle(title)) {
    // rewrite
    // createCard(e, title, listBody, this).then( () => {
    //   this.value = ''
    //   this.focus()
    // })
  } else listBody.removeChild(this)
  listBody.scrollTop = listBody.scrollHeight
}

function addTextArea(listBody) {
  const textArea = dom.create(
      'textarea',
      '',
      'add-card-text',
      {
        'placeholder': 'Введите заголовок для этой карточки',
        'rows': 3,
      }
  )
  textArea.addEventListener('keyup', (e) => (e.keyCode === 13) ? textArea.blur() : {})
  textArea.addEventListener('blur', addCardOrHideTextArea)
  listBody.appendChild(textArea)
  textArea.focus()
  listBody.scrollTop = listBody.scrollHeight
}
