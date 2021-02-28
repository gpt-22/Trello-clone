import {ActiveRout} from './ActiveRout';

export class Router {
  constructor(appNode, routes, eventDispatcher) {
    this.appNode = appNode
    this.routes = routes
    this.eventDispatcher = eventDispatcher
    this.changePage = this.changePage.bind(this)

    this.init()
  }

  init() {
    window.addEventListener('hashchange', this.changePage)
    this.changePage()
  }

  destroy() {
    window.removeEventListener('hashchange', this.changePage)
  }

  changePage() {
    // clear last page
    if ('activePage' in this) this.activePage.destroy()
    // create new page
    const activeBaseRout = ActiveRout.splitRout[0]
    const PageClass = this.routes[activeBaseRout]
    const pageProps = {
      appNode: this.appNode,
      eventDispatcher: this.eventDispatcher,
      splitRout: ActiveRout.splitRout,
    }
    const page = new PageClass(pageProps)
    page.setData().then((d) => {
      // render new page
      page.render()
      page.afterRender()
      this.activePage = page
    })
  }
}
