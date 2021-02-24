import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';

export class BoardHeader extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create('div', '', 'board__header')
    super(componentNode, {
      name: 'BoardHeader',
      ...options,
    })
  }

  render() {
    this.rootNode.innerHTML = this.toHTML()
    this.renderInnerComponents(this.data)
  }

  toHTML() {
    return ``
  }
}
