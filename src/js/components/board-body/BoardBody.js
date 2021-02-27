import {BaseComponent} from '../../core/BaseComponent';
import {List} from '../list/List';
import {AddListBlock} from '../add-list-block/AddListBlock';
import {dom} from '../../core/DOM';
import {getOnDragover} from '../../drag-n-drop';

export class BoardBody extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create('div', '', 'board__body')
    super(componentNode, {
      name: 'BoardBody',
      listeners: ['dragover'],
      ...options,
    })
  }

  render() {
    const listsRootNode = dom.create('div', '', 'board__lists-container')
    this.rootNode.append(listsRootNode)

    const data = {}
    // sort lists by position
    this.data.lists = this.data.lists.sort((l1, l2) => (l1.position > l2.position) ? 1 : -1)

    this.data.lists.forEach((list, idx) => {
      data[idx] = list
      data[idx]['rootNode'] = listsRootNode
      this.components.push(List)
    })
    // data for addListBlock component
    const dataKeys = [...Object.keys(data).map((key) => parseInt(key))]
    data[dataKeys.length] = {}
    this.components.push(AddListBlock)

    this.renderInnerComponents(data)
  }

  init() {
    super.init()
    this.on('Card:dragstart', () => this.removeListener('dragover'))
    this.on('Card:dragend', () => this.addListener('dragover'))
  }

  // listener's methods
  onDragover = getOnDragover(
      () => this.rootNode.querySelector('.board__lists-container'),
      'x',
      '.list',
      '.dragging-list'
  )
}
