// 创建请求实例
function _createWxRequest(opts) {
  let requestTask

  // TODO: 检查 opts

  return new Promise((resolve, reject) => {
    requestTask = wx.request({
      ...opts,
      header: {
        'cookie': wx.getStorageSync("cookies"),
        ...opts.header
      },
      success: function(res) {
        // TODO: 拦截 http status 和 code

        // 更新 cookie
        _updateCookie(res.header)

        resolve(res.data)
      },
      fail: function(error) {
        // http 异常
        reject(error)
      }
    })
  })

  // requestTask.abort() // 取消请求任务
}

// 更新 cookie
function _updateCookie(header) {
  // 取得本次请求的 cookie
  let newCookies = header['Set-Cookie'] ? header['Set-Cookie'].match(/[\w\_]+\=\w+;/g) : []
  if (newCookies.length) {
    // 取得旧 cookie
    let cookies = wx.getStorageSync('cookies').match(/[\w\_]+\=\w+;/g) || []

    // 新旧 cookie 合并
    while (newCookies.length) {
      const nc = newCookies.pop()
      const ncKey = nc.match(/([\w\_]+)(?=\=)/g)[0] // 取得 cookie 名

      // 原来就存在这个 cookie 则替换
      let index = cookies.findIndex(el => el.indexOf(ncKey) >= 0)
      if (index >= 0) cookies[index] = nc
      // 否则加入尾部            
      else cookies.push(nc)
    }

    // 更新 cookie
    wx.setStorage({
      key: 'cookies',
      data: cookies.join('')
    })
  }
}

const zajax = _createWxRequest

// get
zajax.get = (url, data, opts) => _createWxRequest({
  ...opts,
  url,
  data,
  method: 'GET',
})

// post
zajax.post = (url, data, opts) => _createWxRequest({
  ...opts,
  url,
  data,
  method: 'POST'
})

// 上传文件
zajax.upload = (url, data , opts) => new Promise((resolve, reject) => {
  wx.uploadFile({
    url,
    filePath: data.path,
    name: 'file', // 什么名字都没关系
    formData: data,
    success: res => {
      var data = res.data
      resolve(res.data)
    },
    fail: err => {
      reject(err)
    }
  })
})

export default zajax
