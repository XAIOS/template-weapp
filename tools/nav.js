const map = {
  replace: 'redirectTo',
  clear: 'reLaunch',
  tab: 'switchTab'
}

export default function(path, query, type) {
  let url = path.includes('/') ? path : [`../${path}/index`, query].filter(i => i).join('?')

  if (type == 'format') return url

  wx[map[type] || 'navigateTo']({ url })
}
