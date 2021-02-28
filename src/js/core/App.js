import {dom} from './DOM';
import {Router} from './router/Router';
import {EventDispatcher} from './EventDispatcher';

export class App {
  constructor(selector, options) {
    if (!selector) throw new Error('Router: No selector provided')

    const appNode = dom.get(selector)
    const eventDispatcher = new EventDispatcher()
    new Router(appNode, options.routes, eventDispatcher)

    // options = {...options, eventDispatcher: eventDispatcher}
  }
}
