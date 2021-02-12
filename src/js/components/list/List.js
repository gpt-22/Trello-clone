import {BaseComponent} from '../../core/BaseComponent';
import {Card} from '../card/Card';
import {dom} from '../../core/DOM';

export class List extends BaseComponent {
  constructor(data) {
    const componentNode = dom.create(
        'div',
        `list${ data.id }`,
        'list',
        {'draggable': true}
    )
    super(componentNode, {
      components: [],
      data: data,
    })
  }

  render() {
    this.rootNode.innerHTML = this.toHTML(this.data)
    const data = {}
    this.data.cards.forEach((card, idx) => {
      data[idx] = card
      this.components.push(Card)
    })
    const listBody = this.rootNode.querySelector('.list__body')
    this.renderInnerComponents(data, listBody)
    // list.cards.map((card) => `<div>Here should be cardToHTML (card id: ${card.id})</div>`).join('')
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
}
