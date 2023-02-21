// pages/user/user.js
import request from "../../utils/request";
let oldPageY = 0;
let newPageY = 0;
let distance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: `translateY(0rpx)`,
    coveTransition: '',
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 配置信息
console.log();
    let syncInfo = JSON.parse(wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo'):"{}")
    this.setData({ userInfo: syncInfo })

    if(this.data.userInfo.userId){
      this.getRecentPlayList()
    }

  },

  // 获取最近播放歌单
  async getRecentPlayList() {
    // 请求个人列表详情
    let recentPlayList = await request('user/record', {
      uid: this.data.userInfo.userId,
    })
    this.setData({ recentPlayList: recentPlayList.allData.slice(0,5)})
    console.log(recentPlayList)
  },
  toLogin() {
    wx.navigateTo({
      url: '/userPackage/login/login',
    })
  },
  handleTouchStart(e) {
    oldPageY = e.touches[0].clientY;
    this.setData({
      coveTransition: ""
    })
  },
  handleTouchMove(e) {
    newPageY = e.touches[0].clientY;
    distance = newPageY - oldPageY
    if (distance <= 0) {
      return
    }
    distance >= 80 ? distance = 80 : this.setData({
      coverTransform: `translateY(${distance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coveTransition: "transform 0.5s linear"
    })

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