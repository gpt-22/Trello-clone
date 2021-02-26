import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';
import {getIDNum, sendRequest} from '../../helpers';

export class Card extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create(
        'div',
        `card${ options.data.id }`,
        'list__item card',
        {'draggable': true}
    )
    super(componentNode, {
      name: 'Card',
      listeners: ['dragstart', 'dragend'],
      ...options,
    })
  }

  render() {
    this.rootNode.innerHTML = this.toHTML(this.data)
  }

  toHTML(card) {
    return `
        <div class="card-marks-container">
        ${ 'marks' in card ? card.marks.map((mark) => `
            <div class="card-mark-color ${mark.title}"></div>
        `).join('') : ''}
        </div>
        <div class="card-title">${card.title}</div>
    `
  }

  // listener's methods
  onDragstart(event) {
    event.stopPropagation()
    this.dispatch('Card:dragstart')
    this.rootNode.classList.add('dragging')
  }

  async onDragend(event) {
    event.stopPropagation()
    this.rootNode.classList.remove('dragging')

    const toListNode = dom.findParentNodeWithTheClass(this.rootNode, 'list')
    const cardID = this.data.id
    const fromListID = this.data.list
    const toListID = getIDNum(toListNode.id)
    const boardBody = this.parentComponent.parentComponent
    const fromList = boardBody.components
        .filter((component) => component.data.id === fromListID)[0]
    const toList = boardBody.components
        .filter((component) => component.data.id === toListID)[0]

    // change list id in DB
    const body = {list: toListID}
    const url = `boards/1/lists/${fromListID}/cards/${cardID}/`
    await sendRequest('PATCH', url, body)
        .catch((err) => console.log('change listID in DB:', err))

    await this.dispatch('Card:dragend', fromList, toList, this)

    // change list id in component
    this.data.list = toListID
  }
}
