export class App {
  constructor(selector, options) {
    this.rootNode = document.querySelector(selector)
    this.components = options.components || []
    this.data = options.data || {}
  }

  renderPage() {
    this.components.forEach((ComponentClass, idx) => {
      const component = new ComponentClass(this.data[idx])
      component.render()
      this.rootNode.append(component.rootNode)
    })
  }
}
