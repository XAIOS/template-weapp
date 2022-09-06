function DialogHandle(option, type) {
  let content = typeof option == 'string' ? option : option.content
  option = typeof option == 'string' ? {} : option

  option.title = option.title || '温馨提示'
  option.content = content
  option.showCancel = type == 'confirm'

  option.placeholderText = option.placeholder || '请输入'

  option.cancelText = option.text_0 || '取消'
  option.confirmText = option.text_1 || '确定'

  option.cancelColor = option.color_0 || '#333'
  option.confirmColor = option.color_1 || '#2b73af'

  delete option.success
  delete option.fail
  delete option.complete

  type == 'warning' && Loading.hide()

  return new Promise((resolve, reject) => {
    wx.showModal(option).then(e => e.cancel ? reject() : resolve(e.content))
  })
}

export const Dialog = new Proxy({}, {
  get: (_, type) => option => DialogHandle(option, type)
})

function MessageHandle(option, type) {
  if (Loading.hard) return
  let content = typeof option == 'string' ? option : option.content
  option = typeof option == 'string' ? {} : option

  option.title = content
  option.icon = type == 'error' ? 'error' : type == 'success' ? 'success' : 'none'
  option.mask = true

  wx.showToast(option)
}

export const Message = new Proxy({}, {
  get: (_, type) => option => MessageHandle(option, type)
})

export const Loading = {
  hard: false,
  show(is_hard, title = '正在处理') {
    if (is_hard === true) this.hard = true
    wx.showLoading({ title, mask: true })
  },
  hide(is_hard) {
    if (this.hard && !is_hard) return
    this.hard = false
    wx.hideLoading()
  }
}

export function Copy(data) {
  data = data.toString()

  return new Promise(resolve => {
    wx.setClipboardData({ data }).then(() => {
      resolve()
    }).catch(() => {
      Dialog.confirm({ title: '复制失败', content: data, text_1: '重试' }).then(() => {
        Copy(data)
      })
    })
  })
}
