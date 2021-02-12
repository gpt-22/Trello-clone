import {BaseComponent} from '../../core/BaseComponent';
import {BoardHeader} from '../board-body/BoardHeader';
import {BoardBody} from '../board-header/BoardBody';
import {dom} from '../../core/DOM';

export class Board extends BaseComponent {
  constructor(data) {
    const componentNode = dom.create('main', '', 'board')
    super(componentNode, {
      components: [BoardHeader, BoardBody],
      data: data,
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
