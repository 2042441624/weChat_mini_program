// pages/video/video.js
import request from "../../utils/request";
let index = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTriggered: true,
    Navname: '',
    videoList: [],
    videoGroupList: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
    navId: "",
    videoUrl: "",
    videoId: '',
    TimeUpdate: [],
  },
  handleRefresherrefresh() {

  },
  async handlePlay(e) {
    index++
    // 设置地址
    let videoUrl = "";
    videoUrl = await request('mv/url', { id: e.currentTarget.id })
    this.setData({ videoUrl: videoUrl.data.url })
    // 读取旧的值
    let { TimeUpdate } = this.data

    // 隐藏图片
    if (e.type === 'tap') {
      this.setData({ videoId: e.currentTarget.id })
    }
    let hasIndex = TimeUpdate.findIndex(item => {
      return item.vid === e.currentTarget.id
    })
    let video = {}

    if (hasIndex === -1) {
      video = wx.createVideoContext(e.currentTarget.id).play()
    } else {
      video = {}
      let seekTime = TimeUpdate[hasIndex].currentTime
      videoUrl = await request('mv/url', { id: TimeUpdate[hasIndex].vid })
      this.setData({ videoUrl: videoUrl.data.url })
      video = wx.createVideoContext(TimeUpdate[hasIndex].vid)
      video.seek(seekTime)
      video.play()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async handleToLower(e) {
    index++;
    console.log(e);
    wx.showLoading({
      title: '加载中',
    })
    let vedioResult = await request("mv/all", {
      area: this.data.Navname,
      limit: 20 * index
    })
    this.setData({ videoList: vedioResult.data })
    wx.hideLoading()
  },
  onLoad(options) {
    this.changeNav()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },
  handleTimeUpdate(event) {

    //当前的时间对象

    let { TimeUpdate } = this.data
    let isHas = TimeUpdate.findIndex(item => {
      return item.vid === event.currentTarget.id
    })
    if (isHas === -1) {
      let videoTimeObj = { vid: event.currentTarget.id }
      TimeUpdate.push(videoTimeObj)
      this.setData({ TimeUpdate })
    } else {
      TimeUpdate[isHas] = { vid: event.currentTarget.id, currentTime: event.detail.currentTime }
    }
    this.setData({ TimeUpdate })
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
  //设置nav选中样式
  async changeNav(evnet) {
    wx.showLoading({
      title: '加载中...',
    })
    let name = ''
    let navId = ''

    if (!evnet) {
      name = this.data.videoGroupList[0]
      navId = "0"
    } else {

      name = evnet.currentTarget.dataset.name
      this.setData({ Navname: evnet.currentTarget.dataset.name })
      navId = evnet.currentTarget.id.slice(2)
    }
    this.setData({
      navId
    })

    let vedioResult = await request("mv/all", {
      area: name,
      limit: 20
    })
    this.setData({ videoList: vedioResult.data })
    wx.hideLoading()





  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  handleefresherrefresh(e) {
    this.changeNav()
    this.setData({ isTriggered: false })
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