import { Dialog, Message, Loading } from './operate'

let config, system_config, token, is_loading

const REQUEST_STORE = {}

export function InitRequest(option) {
  let is_test = wx.getAccountInfoSync().miniProgram.envVersion != 'release'

  option.host_test = option.host_test || option.host
  option.host = is_test ? option.host_test : option.host

  config = option
}

function Login(next) {
  is_loading = true
  wx.login({
    success: res => {
      Post(config.login_api, { code: res.code }).then(data => {
        token = data
        is_loading = false
        next()
      }).catch(() => {
        is_loading = false
      })
    }
  })
}

function Request(method, api, data = {}) {
  return new Promise((resolve, reject) => {
    let is_login = api == config.login_api
    let id = (Math.random() * 10000).toFixed(0)

    // token，或叫第三方 session，其管理是自动化的，实际项目中不应操作或关注
    // 每次启动小程序会在调用接口前先获取一次 token
    // 当 token 获取时所有的请求会被挂起，直到 token 获取成功

    REQUEST_STORE[id] = () => {
      if (!is_login && is_loading) return setTimeout(REQUEST_STORE[id], 800)

      if (!is_login && !token) return Login(REQUEST_STORE[id])

      wx.request({
        url: /^https?\:\/\//.test(api) ? api : `${config.host}${api}`,
        data,
        method,
        // token 的应用方法，要跟接口方沟通协商
        header: { token },
        success(res) {
          if (res.statusCode != 200) {
            Dialog.warning('网络异常，请重试')
            return reject()
          }

          res = res.data

          // 约定的返回结构，code data message
          // code 1 为轻提示，接口错误，用 toast 显示错误信息
          // code 2 为重提示，接口错误，用 alert 显示错误信息
          // code 3 为登录态异常，重新获取 token
          // code 0 为接口正常，返回 data 供继续操作

          if (res.code == 1)
            Message.info(res.message)
          else if (res.code == 2)
            Dialog.warning(res.message)
          else if (res.code == 3)
            Login(REQUEST_STORE[id])
          else
            resolve(res.data)

          if (res.code != 3) delete REQUEST_STORE[id]
        },
        fail() {
          delete REQUEST_STORE[id]
          Dialog.warning('网络异常，请重试')
          reject()
        }
      })
    }

    REQUEST_STORE[id]()
  })
}

export function Get(api, data = {}) {
  return Request('GET', api, data)
}

export function Post(api, data = {}) {
  if (data._params) {
    api += `?${Object.keys(data._params).map(i => `${i}=${data._params[i]}`).join('&')}`
    delete data._params
  }

  return Request('POST', api, data)
}

export function LoadConfig(next) {
  if (system_config) return next(system_config)

  Get(config.config_api).then(data => {
    let map = {}
    data.forEach(i => map[i.key] = i.value)
    next(system_config = map)
  })
}
