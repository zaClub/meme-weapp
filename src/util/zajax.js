// 创建请求实例
function createWxRequest(opts) {
  let requestTask

  return new Promise((resolve, reject) => {
    requestTask = wx.request({
      ...opts,
      success: function(res) {
        // TODO: 判断 http status 和 code

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

const zajax = createWxRequest

// get
zajax.get = (url, data, opts) => createWxRequest({
  ...opts,
  url,
  data,
  method: 'GET',
})

// post
zajax.post = (url, data, opts) => createWxRequest({
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
