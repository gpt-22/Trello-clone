class DOM {}

export function dom() {
  return new DOM()
}

dom.create = (tagName, id='', classes='', attrs={}) => {
  const element = document.createElement(tagName)
  if (id) element.id = id
  if (classes) element.className = classes
  Object.keys(attrs).forEach((key) => element.setAttribute(key, attrs[key]))

  return element
}

// create html methods
