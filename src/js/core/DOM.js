class DOM {}

export function dom() {
  return new DOM()
}

dom.get = (selector, all=false, rootNode=null) => {
  const node = rootNode || document
  if (all) return node.querySelectorAll(selector)
  else return node.querySelector(selector)
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

// returns node that has class if it or one of its parents has the class classname
// rootNode is an end search point
dom.findParentNodeWithTheClass = (node, classname, rootNode=null) => {
  if (node.className.split(' ').indexOf(classname)>=0) return node
  if (rootNode && node === rootNode) return false
  return dom.findParentNodeWithTheClass(node.parentNode, classname, rootNode)
}
