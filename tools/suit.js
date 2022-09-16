export default function(w, h, dw = 750, dh = 1206) {
  let screen = wx.getSystemInfoSync()
  let sw = screen.windowWidth
  let sh = screen.windowHeight

  let s = w / h
  let w1 = w / dw * sw
  let w2 = h / dh * sh * s

  w = w2 > w1 ? w1 : w2
  h = w / s

  return { w: Math.ceil(w), h: Math.ceil(h) }
}
