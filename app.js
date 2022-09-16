import Init from 'tools/init'
import Store from 'tools/store'
import { InitRequest } from 'tools/request'

// 初始化接口请求配置
// host 是全局的接口前缀，当调用地址非 http 或 https 协议时，会添加此前缀进行调用
// host_test 是 host 的测试版本，当小程序环境不是正式版时使用，不存在时取 host
// login_api 是 wx.login 后调用的地址，换取第三方 session
// config_api 是获取全局配置信息的接口，首次获取后会缓存直到小程序关闭
InitRequest({ host: 'https://xxxxx/api/', login_api: 'MiniProgram/Login', config_api: 'Config/List' })

App({
  Init,
  onLaunch() {
    // 添加全局授权标识，默认 false，再根据接口返回判断是否已经授权过
    // 如调用用户信息接口判断是否已有信息
    Store.add('is_auth', false)
  },
  onShareAppMessage() {
    // 全局默认的分享信息
    return {
      title: 'TemplateWeapp',
      path: '/pages/index/index'
      // 分享图片的比例是 5:4
      // imageUrl: ''
    }
  }
})
