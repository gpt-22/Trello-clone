import {BaseComponent} from '../../core/BaseComponent';
import {List} from '../list/List';
import {dom} from '../../core/DOM';

export class BoardBody extends BaseComponent {
  constructor(data) {
    const componentNode = dom.create('div', '', 'board__body')
    super(componentNode, {
      components: [],
      data: data,
    })
  }

  render() {
    const data = {}
    this.data.lists.forEach((list, idx) => {
      data[idx] = list
      this.components.push(List)
    })
    this.renderInnerComponents(data)
  }
}
