export default function(page) {
  let hack = {}

  for (let i in page.data)
    if (i[0] != '_')
      hack[i] = {
        configurable: true,
        get: () => page.data[i],
        set: val => page.setData({ [i]: val })
      }

  Object.defineProperties(page, hack)
}
