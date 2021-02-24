import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';

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

  onDragend(event) {
    event.stopPropagation()
    this.dispatch('Card:dragend')
    this.rootNode.classList.remove('dragging')
  }
}
