// pages/login/login.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    password: '',
    buttonStr: '验证码登录',
    isLogin: true
  },
  handlefocus(e) {
    //看看是否有缓存
    this.setData({
      [e.currentTarget.id]: e.detail.value
    })




  },
  async login() {
    let { email, password, isLogin } = this.data
    console.log(email, password, isLogin);
    //手机号以及验证码请求
    let emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (emailReg.test(email) && password) {
      let loginResult = await request('login', {
        email, password, isLogin
      }, "post")

      if (loginResult.code === 200) {
        //设置本地缓存
        console.log(loginResult);

        wx.setStorageSync('userinfo', JSON.stringify(loginResult.profile))
        wx.reLaunch({
          url: '/pages/user/user',
        })
      }
    }






  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})