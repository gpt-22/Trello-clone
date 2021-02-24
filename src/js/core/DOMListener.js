import {getListenerMethod} from '../helpers';

export class DOMListener {
  constructor(rootNode, listeners=[]) {
    if (!rootNode) throw new Error('No rootNode provided for DOMListener')
    this.rootNode = rootNode
    this.listeners = listeners
  }

  addListener(listener) {
    const method = getListenerMethod(listener)
    if (!this[method]) {
      throw new Error(`Method ${method} is not implemented in ${this.constructor.name} component`)
    }
    this[method] = this[method].bind(this)
    this.rootNode.addEventListener(listener, this[method])
  }

  addListeners() {
    this.listeners.forEach((listener) => this.addListener(listener))
  }

  removeListener(listener) {
    const method = getListenerMethod(listener)
    this.rootNode.removeEventListener(listener, this[method])
  }

  removeListeners() {
    this.listeners.forEach((listener) => this.removeListener(listener))
  }

  init() {}
}
