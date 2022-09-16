# 模板介绍

~~不可否认的是，微信小程序很难开发，可能开发组就没考虑过开发者的感受，但做还是要做的。~~

业界针对开发难的问题出了很多解决方案，作为原教旨主义者，我觉得比起层层封装编译，对原生的小程序进行一些加强会比较合适，毕竟在黑盒外面套黑盒的风险比较高，项目还是尽可能地能掌控比较好。

小程序的核心开发难点其实不多，主要就是调用逻辑复杂，以及一些机制很难理解，尤其是登录跟授权，很绕，但除去这些，其实都还可以，所以只要对一些函数调用进行封装，再整理一些功能实现方案，原生的开发并不是什么难事。

需要特别提一句的是，项目各种各样，模板的意思就是一个原型，调整模板至适合自己跟自己的项目，才是正确的使用方法，不要太过拘谨，模板只是提供一个思路。

# 小程序登录机制

简单来说，就是通过 `wx.login` 获取一个码，调后台接口后，跟微信服务器要一个第三方 session，之后通过这个来识别微信用户身份，小程序本地需要缓存起来，之后有身份识别需求的接口，都需要传给后台。

看起来不复杂，主要工作在接口那边，前端只需要调接口缓存就可以了，但一方面获取期间不能调用其它有身份识别需求的接口，另一方面这个识别码会过期，一段时间后会需要重新走一次流程，这两点使整件事复杂了很多倍。

程序是应该面向对象的，面向对象的重点就是自己的事情自己做，登录验证过期重试这些，其实都不需要用户交互的，程序既然可以自己完成，那就应该把这些放到请求逻辑里面，让请求操作内部消化这些问题。

所以在封装请求函数的时候，就把登录跟重登录的逻辑封装进去了，如果当前需要登录，则先挂起别的请求，登录速度很快，整体对用户来说没有感知，对开发者而言更是可以完全无视登录机制，把工作重心放到业务上。

具体可查看 `/tools/request.js` 中的实现。

# 小程序授权机制

官方变了好几个版本，其实也理解，是有那么一点改变的需要，设计个方案跟着适应一下就好了，也没办法。

最新的一版是扩展了输入控件，方便用户在填入信息的时候选中自己的头像昵称信息，简单来说就是从原来的一键授权，变成需要进行登录，为此，需要在小程序中加入久违的登录页，通过页面操作的方式完成信息授权。

最佳的实践，应该是创建一个登录页，所有需要登录的操作，先检测是否完成登录，若无则跳转到登录页，完成后刷新全局状态，并返回原页面继续操作，用户体验上会差一点，但也没办法。

具体可查看 `/pages/_auth/index.js` 中的示例代码。

# 完善小程序开发

工欲善其事，必先利其器，有好的工具，需求实现起来就会轻松很多，所以模板提供了一批超实用的工具。

另外本模板推荐使用 [vant-weapp](https://vant-ui.github.io/vant-weapp/#/home)。

## 工具函数

### 页面初始化 Init

本模板的核心，会把下面所提到的函数都挂载到页面的 this 上，同时绑定视图层，参考 `/pages/_demo/index.js`，_demo 是模板页面，一般新页面可以直接复制这个目录，更名后开始开发。

视图绑定是通过 `Object.defineProperties`，在 data 的字段被赋值时进行 `setData`，因为是逐个 `setData`，在大量数据更新时肯定是不如批量 `setData` 操作的，但问题不大。

### 数据格式化 Format

```javascript
// 时间格式化
// 参数一是可以被 new Date 的格式，会转换 - 为 /，当数值为秒数时会先转为毫秒再处理
// 参数二默认是 'yyyy-MM-dd hh:mm:ss'
this.$time(new Date, 'yyyy-MM-dd')

// 数值简化
// 就是变成以 k w kw 为单位显示，取两位小数
this.$number(100000000)
```

### 预操作计数器 PreLoad

`Promise.all` 与 `await` 之类的方案都可以很方便地实现数据准备，但一些老的写法也能提供简单可用的帮助。

```javascript
// 如果传入的数值是 0，则立即调用后续操作
let Load = this.$preload(1, () => {})

// 每调用一次计数器加一，达到预设数值时执行后续操作
Load()
```

### 页面导航 Nav

~~我是真没理解为什么跳转还要分是不是 tab，小程序不知道是不是 tab 吗？~~

```javascript
// 参考 _demo 页，约定是使用 index.wxml 作为入口，否则这个功能要重写
// 第一参数是页面名，就是目录名，也可以是完整路径，此时会直接跳转完整路径
// 第二参数是查询参数，如下面示例的拼接结果是 `/pages/_demo/index?id=123`
// 第三参数是功能，replace、clear、tab、format，clear 就是 reLaunch，format 是不跳转，返回要跳转的地址
this.$nav('_demo', 'id=123', 'replace')

// 也可以使用对象形式的查询参数
this.$nav('_demo', { id: 123 })

// this.$nav('_demo') === wx.navigateTo({ url: '/pages/_demo/index' })

// 返回上 N 个页面，默认一个
this.$back()
this.$back(2)
```

### 接口请求 Request

```javascript
// 请求有 GET 跟 POST 两种，都返回一个 Promise，第三方 session 的问题已经在操作内部消化，也不需要关注 wx.login
this.$get('api', { content: 2 }).then().catch()
this.$post('api', { content: 2 }).then().catch()

// 返回数据约定格式是 { code: 0, data: {}, message: '' }，then 中返回的 data 是此处的 data

// POST 操作如果要在 URL 传参，小程序的写法是要在接口上加查询参数，即
this.$post('api?id=1', { content: 2 })

// POST 带查询参数不好维护，所以有第二种写法，在 data 中增加会被处理掉的临时参数对象
this.$post('api', { _params: { id: 1 }, content: 2 })

// 获取全局配置内容
this.$config(config => {})
```

### 数组切割 Slice

把一维数组变成二维，操作不会影响原数据。

```javascript
// 要切割的原数据，新数组单项长度，是否填充空字符串补满矩阵，默认 ture
this.$slice([1, 2, 3, 4, 5], 3, true) // [[1, 2, 3], [4, 5, '']]
```

### 缓存存取 DB

其实就是 `wx.getStorageSync` 那两个，但这个写法更好，如果有需要换实现方案也容易改。

```javascript
this.$db.set('key', 'value')
this.$db.get('key')
```

### 全局数据管理 Store

低配的 vuex，够用就行，参考 `/pages/_auth/index.js` 跟 `app.js`，基本覆盖应用场景。

```javascript
// 设置一个全局数据，参考 app.js
this.$store.add('key', 'value')

// 更新一个全局数据
this.$store.set('key', 'value')

// 获取一个全局数据值
this.$store.get('key')

// 绑定一个全局数据到 data 上，返回解绑方法
this.$store.bind(this, 'key')
```

### 单页元素尺寸计算 Suit

虽然小程序比较少做单页，但元素适配问题也是挺麻烦的。

```javascript
// 元素在设计图中的宽、高、设计图宽、设计图高，默认设计图宽高是 750*1206
// 返回在当前设备中合适的宽高
this.$suit(100, 200)
this.$suit(100, 200, 300, 400)
```

### 格式化富文本内容 Text

~~小程序照镜子。~~

```javascript
// 会返回处理过的富文本内容
// 第一参数是要处理的富文本，第二参数可选
// size 默认 14，指默认字号 14px
// style 为额外样式，默认是 'text-align: justify;word-break: break-all;white-space: pre-wrap;'

// 会在富文本外套一层 div，并把上述处理样式提交上去，对富文本内容进行规范
// 同时设置所有 img 最大宽度为 100%，避免横向溢出

this.$text('<p></p>', { size: 16, style: 'color: red;' })
```

### 复制到剪贴板 Copy

对 `wx.setClipboardData` 的封装，移除与扩展部分功能，参考[原文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/clipboard/wx.setClipboardData.html)。

```javascript
// 传入的数据会进行 toString 操作，所以复制非字符串类型也可以
// 复制成功会调用 then，复制失败会弹窗提示
this.$copy(123123).then()
```

## 反馈操作

### 模态对话框 Dialog

对 `wx.showModal` 的封装，移除与扩展部分功能，参考[原文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html)。

```javascript
// 支持的配置内容及默认值
const option = {
  title: '温馨提示',         // 等价 title
  content: '',              // 等价 content
  editable: false,          // 等价 editable
  placeholder: '请输入',     // 等价 placeholderText
  text_0: '取消',           // 等价 cancelText，含义是从左到右的两个操作按钮，索引分别是 0 跟 1
  text_1: '确定',           // 等价 confirmText
  color_0: '#333',          // 等价 cancelColor
  color_1: '#2b73af'        // 等价 confirmColor
}

// 基础的调用方法，调用皆返回 Promise，如果 option.editable 为 true，then 会返回编辑内容
// option 如果传字符串，则视为 option.content，其余配置取默认值：this.$dialog.alert('提示信息')
this.$dialog.alert(option).then()

// 确认框，会有一个取消按钮，点击调用 catch
this.$dialog.confirm(option).then().catch()

// 错误提示，除框架内部外，一般不会使用
// 在 this.$dialog.alert 的基础上多进行一步 this.$spin.hide()
this.$dialog.warning(option)
```

### 消息提示框 Message

对 `wx.showToast` 的封装，移除与扩展部分功能，参考[原文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html)。

```javascript
// 支持的配置内容及默认值，原配置中的 mask 固定为 true
const option = {
  image: '',         // 等价 image，会使提示内容限制在七个汉字长度
  contnet: '',       // 等价 title
  duration: 1500     // 等价 duration
}

// 基础的调用方法，没有图标的纯提示，提示内容最多两行文本
// option 如果传字符串，则视为 option.content，其余配置取默认值：this.$message.info('提示信息')
this.$message.info(option)

// 显示失败图标，提示内容最多七个汉字长度
this.$message.error(option)

// 显示成功图标，提示内容最多七个汉字长度
this.$message.success(option)
```

### 加载状态 Spin

对 `wx.showLoading` 的封装，移除与扩展部分功能，参考[原文档地址](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html)。

```javascript
// 显示加载状态，原配置中的 mask 固定为 true
// 当第一参数为 true 时，必须通过 this.$spin.hide(true) 取消加载状态，当然用 wx.hideLoading() 也可以
// 第二参数默认为“正在处理”
// 也可以直接调用：this.$spin.show()
this.$spin.show(true, '提示信息')

// 取消加载状态
this.$spin.hide(true)
```
