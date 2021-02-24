import {BaseComponent} from '../../core/BaseComponent'
import {dom} from '../../core/DOM';
import {isValidTitle} from '../../helpers';

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

  async addListOrHide() {
    const formInput = this.rootNode.querySelector('.add-list-input')
    if (isValidTitle(formInput.value)) {
      // const newList = await createList(formInput.value)
      // const board = document.querySelector('.board')
      // board.insertBefore(newList, this.rootNode)
      // board.scrollLeft = board.scrollWidth
      formInput.value = ''
      formInput.focus()
    }
  }

  // listener's methods
  onClick(event) {
    const formInput = this.rootNode.querySelector('.add-list-input')
    formInput.focus()

    if (event.target.classList.contains('show-form-btn')) {
      this.show()
    } else if (event.target.classList.contains('add-list-btn')) {
      this.addListOrHide().then((r) => r)
    } else if (event.target.classList.contains('add-list-cancel-btn')) {
      this.hide()
    }
  }
}
