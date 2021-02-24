import {DOMListener} from './DOMListener';

export class BaseComponent extends DOMListener {
  constructor(rootNode, options={}) {
    super(rootNode, options.listeners)
    this.eventDispatcher = options.eventDispatcher
    this.components = 'components' in options ? options.components : []
    this.data = 'data' in options ? options.data : []
  }

  init() {
    this.addListeners()
    this.components.forEach((component) => component.init())
  }

  destroy() {
    this.removeListeners()
    this.components.forEach((component) => component.destroy())
  }

  render() {
    // 1. add child nodes to root
    // 2. insert child components nodes in root or a place
    this.renderInnerComponents()
  }

  renderInnerComponents(data, rootNode=null) {
    this.components = this.components.map((ComponentClass, idx) => {
      const componentOptions = {
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
    })
  }

  toHTML() {}
}
