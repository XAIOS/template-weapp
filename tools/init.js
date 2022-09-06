import Nav from './nav'
import Hack from './hack'
import Time from './time'
import RText from './text'
import Slice from './slice'
import Store from './store'
import PreLoad from './preload'
import StorageHandle from './storage'

import { Get, Post, LoadConfig } from './request'
import { Dialog, Message, Loading, Copy } from './operate'

export default function(page) {
  Hack(page)

  page.$db = StorageHandle
  page.$get = Get
  page.$nav = Nav
  page.$copy = Copy
  page.$post = Post
  page.$text = RText
  page.$time = Time
  page.$spin = Loading
  page.$slice = Slice
  page.$store = Store
  page.$config = LoadConfig
  page.$dialog = Dialog
  page.$message = Message
  page.$preload = PreLoad

  page.$back = (delta = 1) => wx.navigateBack({ delta })
}
