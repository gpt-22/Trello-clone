import {BaseComponent} from '../../core/BaseComponent'
import {List} from '../list/List';
import {dom} from '../../core/DOM';
import {isValidTitle, sendRequest} from '../../helpers';

export class AddListBlock extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create('div', '', 'add-list-block')
    super(componentNode, {
      name: 'AddListBlock',
      listeners: ['click'],
      ...options,
    })
  }

  render() {
    this.rootNode.innerHTML = this.toHTML()
  }

  toHTML() {
    return `
        <button class="show-form-btn">
            Добавить колонку
        </button>
        <form class="add-list-form">
            <input type="text" class="add-list-input" placeholder="Заголовок списка">
            <div class="add-list-form-controls">
                <button type="button" class="add-list-btn">Добавить список</button>
                <button type="button" class="add-list-cancel-btn">&#10006;</button>
            </div>
        </form>
    `
  }

  show() {
    const showFormBtn = this.rootNode.querySelector('.show-form-btn')
    showFormBtn.style.display = 'none'

    const addListForm = this.rootNode.querySelector('.add-list-form')
    addListForm.style.display = 'block'
    // prevent reloading if in input enter is pressed
    addListForm.addEventListener('submit', (e) => {
      e.preventDefault()
    })

    const formInput = this.rootNode.querySelector('.add-list-input')
    formInput.focus()
    formInput.addEventListener('keyup', (e) => {
      (e.keyCode === 13) ? this.addListOrHide() : {}
    })
  }

  hide() {
    const showFormBtn = this.rootNode.querySelector('.show-form-btn')
    const addListForm = this.rootNode.querySelector('.add-list-form')
    showFormBtn.style.display = 'block'
    addListForm.style.display = 'none'
  }

  addListOrHide() {
    const formInput = this.rootNode.querySelector('.add-list-input')
    if (isValidTitle(formInput.value)) {
      const title = formInput.value
      this.createList(title).catch((error) => console.log(error))
      formInput.value = ''
      formInput.focus()
    }
  }

  getNewListPosition = () => this.parentComponent.data.lists.length

  async createList(title) {
    const position = this.getNewListPosition()

    // create in DB
    const body = {
      board: 1,
      title: title,
      position: position,
    }
    const url = `boards/1/lists/`
    const createdList = await sendRequest('POST', url, body)

    // add list data to boardBody data
    const boardBody = this.parentComponent
    const listsRootNode = dom.get(
        '.board__lists-container',
        false,
        boardBody.rootNode
    )
    const listData = {0: {...createdList, 'rootNode': listsRootNode}}
    boardBody.data.lists.push(createdList)

    // add list component to boardBody components
    const newList = boardBody.renderInnerComponent(List, listData, 0)
    const idx = boardBody.components.length - 1
    boardBody.components.splice(idx, 0, newList)
    newList.init()

    boardBody.rootNode.scrollLeft = boardBody.rootNode.scrollWidth
  }

  // listener's methods
  onClick(event) {
    const formInput = this.rootNode.querySelector('.add-list-input')
    formInput.focus()

    if (event.target.classList.contains('show-form-btn')) this.show()
    else if (event.target.classList.contains('add-list-btn')) this.addListOrHide()
    else if (event.target.classList.contains('add-list-cancel-btn')) this.hide()
  }
}
