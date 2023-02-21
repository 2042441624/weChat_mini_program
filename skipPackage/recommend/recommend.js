// pages/Recommend/recommend.js
import pubsub from "pubsub-js";
import request from "../../utils/request";
import { getRequsetTime } from "../../utils/utils";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: []
  },

  toSongDetail(e) {
    let song = e.currentTarget.dataset.song.id
    wx.navigateTo({
      url: '/songPackage/songdetail/songdetail?song=' + JSON.stringify(song),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //接受消息上一首下一首



    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
    })
    if (!wx.getStorageSync('userinfo')) {
      wx.showToast({
        title: '请登录',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })

        }
      })
      return
    }
    let recommendList = getRequsetTime() ? await request('recommend/songs',{
      time:''
    }) : wx.getStorageSync('recommend') ? JSON.parse(wx.getStorageSync('recommend')) : await request('recommend/songs', {
      time: ''
    })

    //先请求
    if (recommendList.code === 200) {
      console.log('请求成功');
      this.setData({ recommendList: recommendList.data.dailySongs })
      wx.setStorageSync('recommend', JSON.stringify(recommendList.data.dailySongs))
    } else if (wx.getStorageSync('recommend')) {
      recommendList = JSON.parse(wx.getStorageSync('recommend'))
      this.setData({ recommendList })
    } else {
      console.log(recommendList);
      recommendList = []
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
    pubsub.subscribe('switchType', (msg, obj) => {
      let { recommendList } = this.data
      console.log(this.data.recommendList);
      console.log(msg, obj);
      let nowIndex = recommendList.findIndex(item => {
        return item.id === obj.id
      })

      console.log(nowIndex);
      if (obj.type === 'pre') {

        nowIndex -= 1
        if (nowIndex <= -1) {
          nowIndex = recommendList.length - 1
        }
        console.log('上一首', nowIndex);
        pubsub.publish('switchIndex', recommendList[nowIndex].id)
      } else {


        if (obj.mode === "icon-suijisenlin") {
          nowIndex = parseInt(Math.random() * recommendList.length-1)
        } else if (obj.mode === "icon-24gl-repeat2") {
          nowIndex += 1
        }
        nowIndex >= recommendList.length ? nowIndex = 0 : nowIndex
        console.log('下一首' + obj.mode, nowIndex);
        pubsub.publish('switchIndex', recommendList[nowIndex].id)
      }

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
    pubsub.unsubscribe('switchType')
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