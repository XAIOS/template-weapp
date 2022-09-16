// 用户信息授权示例
const { Init, onShareAppMessage } = getApp()

Page({
  data: {
    // 约定一个全局的是否已授权标识，默认值 false
    is_auth: false
  },
  Handle() {
    // 可以通过赋值操作进行全局更新，也可以用 this.$store.set('is_auth', true)
    // 外部调用可执行 Store.set('is_auth', true)，需引入 tools 目录中的 store
    this.is_auth = true
  },
  onLoad() {
    // 初始化页面功能
    Init(this)

    // 进入页面时进行全局标识绑定，把全局数据库中的授权字段绑定到当前页面
    // 返回一个解绑方法，页面被卸载时应当执行解绑操作
    this.UnbindAuth = this.$store.bind(this, 'is_auth')
  },
  onUnload() {
    // 全局字段更新时会执行相关更新操作，若不解绑，可能因对象不存在而报错
    this.UnbindAuth()
  },
  // onShow() {
  //   当一个页面因为没有授权，跳到授权页面后，授权完成会跳回去，这时候在原页面的 onShow 里面判断，并继续原来的操作，会是很好的体验
  // },
  onShareAppMessage
})
