class DOM {}

export function dom() {
  return new DOM()
}

dom.get = (selector, all=false) => {
  if (all) return document.querySelectorAll(selector)
  else return document.querySelector(selector)
}

dom.create = (tagName, id='', classes='', attrs={}) => {
  const element = document.createElement(tagName)
  if (id) element.id = id
  if (classes) element.className = classes
  Object.keys(attrs).forEach((key) => element.setAttribute(key, attrs[key]))

  return element
}

dom.deleteByID = (ID) => {
  const node = document.getElementById(ID)
  // remove all event listeners
  const nodeClone = node.cloneNode(true)
  node.parentNode.replaceChild(nodeClone, node)
  // remove from DOM
  nodeClone.parentNode.removeChild(nodeClone)
}

dom.HTMLToNode = (HTML) => {
  const div = document.createElement('div')
  div.innerHTML = HTML.trim()
  return div.firstChild
}
