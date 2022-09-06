// import Store from 'tools/store'
// import { InitUpload } from 'tools/upload'
import { InitRequest } from 'tools/request'

// InitUpload({ host: 'https://xxxxx', key_id: '', key_secret: '' })
InitRequest({ host: 'https://xxxxx/api/', login_api: 'MiniProgram/Login', config_api: 'Config/List' })

App({
  onLaunch() {
    // Store.add('is_login', false)
    // Get('Config/GetVersion').then(data => {
    //   if (StorageHandle.Get('pomelo_version') == data) return
    //   StorageHandle.Set('pomelo_version', data)
    // })
  },
  onShareAppMessage() {
    return {
      title: 'Demo',
      path: '/page/index/index'
      // 5:4
      // imageUrl: ''
    }
  }
})
