export default function(text, option = {}) {
  let fsize = `font-size: ${option.size || 14}px;`
  let style = `${fsize}${option.style || 'text-align: justify;word-break: break-all;white-space: pre-wrap;'}`

  let width = 'style="max-width: 100% !important;'
  let image = text.match(/<img[^>]*>/g)
  image && image.forEach(i => text = text.replace(i, i => /style="/.test(i) ? i.replace('style="', width) : i.replace('<img', `<img ${width}"`)))

  return `<div style="${style}">${text}</div>`
}
