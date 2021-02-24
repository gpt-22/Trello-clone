export class EventDispatcher {
  // Allow components communication via event
  constructor() {
    this.listeners = {}
  }

  dispatch(event, ...args) {
    // notice listeners about events
    if (!Array.isArray(this.listeners[event])) return false
    this.listeners[event].forEach((listener) => listener(...args))
    return true
  }

  listen(event, callback) {
    // start event listening
    this.listeners[event] = this.listeners[event] || []
    this.listeners[event].push(callback)
    return () => {
      this.listeners[event] = this.listeners[event]
          .filter((listener) => listener !== callback)
    }
  }
}
