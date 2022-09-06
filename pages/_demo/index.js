import Init from '../../tools/init'

const { onShareAppMessage } = getApp()

Page({
  data: {
    // is_login: false
  },
  onLoad() {
    Init(this)
    // this.UnbindAuth = this.$store.bind(this, 'is_login')
  },
  onShareAppMessage
})
