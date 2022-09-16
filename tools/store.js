const STATE = {}
const ACTION = {}

export default {
  add(key, val) {
    ACTION[key] = [val => STATE[key] = val]
    STATE[key] = val
  },
  set(key, val) {
    ACTION[key].forEach(todo => todo(val))
  },
  get(key) {
    return STATE[key]
  },
  bind(host, key) {
    let Todo = val => host.setData({ [key]: val })
    let length = ACTION[key].push(Todo)

    Todo(STATE[key])

    Object.defineProperty(host, key, {
      get: () => STATE[key],
      set: val => ACTION[key].forEach(todo => todo(val))
    })

    return () => this._unbind(key, length - 1)
  },
  _unbind(key, index) {
    delete ACTION[key][index]
    clearTimeout(this.timer)
    this.timer = setTimeout(() => ACTION[key] = ACTION[key].filter(i => i), 300)
  }
}
