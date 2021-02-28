export class Page {
  // interface in TS
  constructor(props) {
    this.props = props
    this.components = []
  }

  render(html, data) {
    // Insert page html
    this.props.appNode.innerHTML = html
    // Render components in their nodes
    this.components = this.components.map((ComponentClass, idx) => {
      const componentOptions = {
        eventDispatcher: this.props.eventDispatcher,
        data: data[idx],
      }
      const component = new ComponentClass(componentOptions)
      component.render()
      if ('rootNode' in data[idx]) data[idx].rootNode.append(component.rootNode)
      else this.props.appNode.append(component.rootNode)
      return component
    })
  }

  afterRender() {
    // Init components
    this.components.forEach((component) => component.init())
  }

  setData() {
    // return sendRequest Promise
    // Get data from server and then set it as a 'data' field
    throw new Error('Method "setData" must be implemented')
  }

  destroy() {
    // Destroy components
    this.components.forEach((component) => component.destroy())
    // Remove event listeners
    // Remove html
  }
}
