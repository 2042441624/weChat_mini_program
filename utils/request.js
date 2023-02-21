// ajax请求文件
import config from "./config.js";
export default (url, data = {}, methed = 'get') => {

  return new Promise((resolve, reject) => {
    let cookies = wx.getStorageSync('cookies')? JSON.parse(wx.getStorageSync('cookies')) : '';
    wx.request({
      url: `${config.host}${url}`,
      data,
      methed,
      header: {
        cookies:cookies
      },
      success: (res) => {
        if (data.isLogin) {
          wx.setStorageSync('cookies', JSON.stringify(res.cookies))
        }
        resolve(res.data)
      },
      fail: (err) => {
        console.log('请求失败：', err);
        reject(err)
      }
    })

  })

}