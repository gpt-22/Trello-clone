import {BaseComponent} from '../../core/BaseComponent';
import {BoardHeader} from '../board-header/BoardHeader';
import {BoardBody} from '../board-body/BoardBody';
import {dom} from '../../core/DOM';

export class Board extends BaseComponent {
  constructor(options) {
    const componentNode = dom.create('main', '', 'board')
    super(componentNode, {
      name: 'Board',
      components: [BoardHeader, BoardBody],
      ...options,
    })
  }

  render() {
    const data = {
      0: {},
      1: {
        lists: this.data['lists'],
      },
    }
    this.renderInnerComponents(data)
  }
}
