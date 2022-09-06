export default function(text, size = 14) {
  let pre = 'style="max-width: 100% !important;'
  let imgs = text.match(/<img[^>]*>/g)
  imgs && imgs.forEach(i => text = text.replace(i, i => /style="/.test(i) ? i.replace('style="', pre) : i.replace('<img', `<img ${pre}"`)))
  return `<div style="font-size: ${size}px;text-align: justify;word-break: break-all;white-space: pre-wrap;">${text}</div>`
}
