import {DOMListener} from './DOMListener';

export class BaseComponent extends DOMListener {
  constructor(node, options={}) {
    super(node)
    this.components = 'components' in options ? options.components : []
    this.data = 'data' in options ? options.data : []
  }

  render() {
    // 1 - render itself - add nodes to root
    // 2 - render children components
    this.renderInnerComponents()
  }

  renderInnerComponents(data, rootNode=null) {
    this.components.forEach((ComponentClass, idx) => {
      const component = new ComponentClass(data[idx])
      component.render()
      console.log(component)
      if (rootNode) rootNode.append(component.rootNode)
      else this.rootNode.append(component.rootNode)
    })
  }

  toHTML() {}
}
