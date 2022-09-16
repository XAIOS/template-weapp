const map = {
  replace: 'redirectTo',
  clear: 'reLaunch',
  tab: 'switchTab'
}

export default function(path, query, type) {
  query = typeof query == 'object' ? Object.keys(query).map(i => `${i}=${query[i]}`).join('&') : query

  let url = path.includes('/') ? path : [`/pages/${path}/index`, query].filter(i => i).join('?')

  if (type == 'format') return url

  wx[map[type] || 'navigateTo']({ url })
}
