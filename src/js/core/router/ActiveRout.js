export class ActiveRout {
  static get path() {
    return window.location.hash.slice(1)
  }

  static get splitRout() {
    const pathSplit = ActiveRout.path.split('/')
    if (pathSplit.slice(-1)[0] === '') pathSplit.pop()
    return (pathSplit[0] !== '') ? pathSplit : false
  }
}
