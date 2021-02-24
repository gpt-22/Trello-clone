import {BaseComponent} from '../../core/BaseComponent';
import {dom} from '../../core/DOM';
import {EventDispatcher} from '../../core/EventDispatcher';

export class App extends BaseComponent {
  constructor(selector, options) {
    const appNode = dom.get(selector)
    const eventDispatcher = new EventDispatcher()
    options = {...options, eventDispatcher: eventDispatcher}
    super(appNode, options)
  }

  render() {
    this.renderInnerComponents(this.data)
    this.init()
  }
}
