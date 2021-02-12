import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';

export class Card extends BaseComponent {
  constructor(data) {
    const componentNode = dom.create(
        'div',
        `card${ data.id }`,
        'list__item card',
        {'draggable': true}
    )
    super(componentNode, {
      components: [],
      data: data,
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
}
