  /**
       request.js
     * 封装一个Promise风格的通用请求
     * url - 请求地址
     * option - 包含请求方式、请求参数的配置对象
 */

  const request = function (url, options, verification = false) {
      return new Promise((resolve, reject) => {
          wx.showLoading({
              title: '加载中',
          })
          wx.request({
              url: 'https://www.mingzhisuan.com' + url,
              method: options.method,
              data: options.data,
              header: {
                //   'token': wx.getStorageSync('token'),
                  'content-type': 'application/x-www-form-urlencoded'
              },
              success: (res) => {
                  wx.hideLoading()
                  if (res.data.code == 200 || res.data.code == 1000 || res.data.result == 'success' || res.data.result || verification) {
                      resolve(res)
                  } else {
                      wx.showToast({
                          title: res.data.message,
                          icon: 'error'
                      })
                      reject(res.data.message)
                  }
              },
              fail: (err) => {
                  wx.hideLoading()
                  reject(err)
              },

          })
      })
  }


  module.exports = {
      //封装get方法
      get(url, data, verification) {
          return request(url, {
              method: "GET",
              data,
          }, verification)
      },
      //封装post方法
      post(url, data, verification) {
          return request(url, {
              method: "POST",
              data,
          }, verification)
      }
  }