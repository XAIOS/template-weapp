const state = {}
const action = {}

export default {
  add(key, val) {
    action[key] = [val => state[key] = val]
    state[key] = val
  },
  set(key, val) {
    action[key].forEach(todo => todo(val))
  },
  get(key) {
    return state[key]
  },
  bind(host, key) {
    let Todo = val => host.setData({ [key]: val })
    let length = action[key].push(Todo)

    Todo(state[key])

    Object.defineProperty(host, key, {
      get: () => state[key],
      set: val => action[key].forEach(todo => todo(val))
    })

    return () => this.unbind(key, length - 1)
  },
  unbind(key, index) {
    delete action[key][index]
    clearTimeout(this.timer)
    this.timer = setTimeout(() => action[key] = action[key].filter(i => i), 300)
  }
}
