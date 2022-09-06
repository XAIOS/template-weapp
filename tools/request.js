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

    REQUEST_STORE[id] = () => {
      if (!is_login && is_loading) return setTimeout(REQUEST_STORE[id], 1000)

      if (!is_login && !token) return Login(REQUEST_STORE[id])

      wx.request({
        url: /^https?\:\/\//.test(api) ? api : `${config.host}${api}`,
        data,
        method,
        header: { token },
        success(res) {
          if (res.statusCode != 200) {
            Dialog.warning('网络异常，请重试')
            return reject()
          }

          res = res.data

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
