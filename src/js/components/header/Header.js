import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';

export class Header extends BaseComponent {
  constructor(data) {
    const componentNode = dom.create('header', '', 'header')
    super(componentNode, {
      components: [],
      data: data,
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
