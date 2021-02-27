import {DOMListener} from './DOMListener';

export class BaseComponent extends DOMListener {
  constructor(rootNode, options={}) {
    super(rootNode, options.listeners)
    this.parentComponent = options.parentComponent || null
    this.eventDispatcher = options.eventDispatcher
    this.components = 'components' in options ? options.components : []
    this.data = 'data' in options ? options.data : []
    this.unsubscribers = []
  }

  init() {
    // TODO: this method must be called only once -> rewrite usages
    // add component and child components events
    this.addListeners()
    this.components.forEach((component) => component.init())
  }

  dispatch(event, ...args) {
    // notice listeners about events
    this.eventDispatcher.dispatch(event, ...args)
  }

  on(event, callback) {
    // subscribe on event
    const unsubFunc = this.eventDispatcher.listen(event, callback)
    this.unsubscribers.push(unsubFunc)
  }

  destroy() {
    // remove component event listeners, event subscriptions and node from DOM
    // save for child components
    this.removeListeners()
    this.unsubscribers.forEach((unsub) => unsub())
    this.destroyInnerComponents()
    this.rootNode.parentNode.removeChild(this.rootNode)
  }

  destroyInnerComponents() {
    this.components.forEach((component) => component.destroy())
  }

  render() {
    // 1. add child nodes to root
    // 2. insert child components nodes in root or a place
    this.renderInnerComponents()
  }

  renderInnerComponent(ComponentClass, data, idx, rootNode) {
    const componentOptions = {
      parentComponent: this,
      eventDispatcher: this.eventDispatcher,
      data: data[idx],
    }
    const component = new ComponentClass(componentOptions)
    component.render()
    // rootNode provided in component data has first priority
    if ('rootNode' in data[idx]) data[idx].rootNode.append(component.rootNode)
    // then rootNode for all components will be checked
    else if (rootNode) rootNode.append(component.rootNode)
    // and by default components will be rendered in rootNode of a component
    else this.rootNode.append(component.rootNode)
    return component
  }

  renderInnerComponents(data, rootNode=null) {
    this.components = this.components.map((ComponentClass, idx) => {
      return this.renderInnerComponent(ComponentClass, data, idx, rootNode)
    })
  }

  toHTML() {}
}
