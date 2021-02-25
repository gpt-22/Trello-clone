import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';

export class Header extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create('header', '', 'header')
    super(componentNode, {
      name: 'Header',
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
