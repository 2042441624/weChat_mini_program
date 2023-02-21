// pages/songdetial/songdetail.js
import request from "../../utils/request";
import { patternGenerator } from "../../utils/utils";
import pubsub from "pubsub-js";
import moment from "moment";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: true,
    song: {},
    url: '',
    songId: '',
    durationTime: "",
    currentTime: "",
    currentWidth: '',
    icon:  wx.getStorageSync('musicMode') ? JSON.parse(wx.getStorageSync('musicMode')):'icon-danquxunhuan'
  },
  // 获取歌曲详情
  async getSongs(ids) {
    let song = await request('song/detail', { ids })
    wx.setNavigationBarTitle({ title: song.songs[0].name })

    let durationTime = moment(song.songs[0].dt).format("mm:ss")
    this.setData({ song: song.songs[0], durationTime })
  },
  // 请求歌曲详情url以及操作背景音频实例
  async musiceControl(id = this.data.song.id) {

    if (this.data.isPlay) {
      let audioUrl = await request('song/url', {
        id
      })
      // console.log(audioUrl);
      this.setData({ url: audioUrl.data[0].url })
      this.audioManager.src = audioUrl.data[0].url
      this.audioManager.title = this.data.song.name
      this.audioManager.play()
    }
  },
  // 点击播放按钮
  handleMusicPlay() {
    this.setData({ isPlay: !this.data.isPlay })
    this.data.isPlay ? this.audioManager.play() : this.audioManager.pause()
  },
  // 歌曲切换配合pubsub
  handleSwitch(e) {
    //订阅消息是上一首还是下一首
    pubsub.publish('switchType', { type: e.currentTarget.id, id: this.data.song.id, mode: this.data.icon })
  },
  // 播放模式构造


  handleType() {
    this.setData({ icon: patternGenerator() })
    wx.setStorageSync('musicMode', JSON.stringify(this.data.icon) )
  },
  /**
  * 生命周期函数--监听页面加载
  */
  async onLoad(options) {
    this.audioManager = wx.getBackgroundAudioManager()
    let songId = JSON.parse(options.song)
    // 切换事件
    await this.getSongs(songId)
    await this.musiceControl()
    this.audioManager.onPlay(() => {
      this.setData({ isPlay: true })
    })
    // 播放时间
    this.audioManager.onTimeUpdate(() => {
      this.setData({ currentTime: moment(this.audioManager.currentTime * 1000).format("mm:ss"), currentWidth: ((this.audioManager.currentTime) / this.audioManager.duration) * 450 })
    })
    this.audioManager.onPause(() => {
      this.setData({ isPlay: false })
    })
    this.audioManager.onStop(() => {
      this.setData({ isPlay: false })
    })
    this.audioManager.onEnded(async () => {
      this.setData({ isPlay: false })
      pubsub.publish('switchType', { type: 'next', id: this.data.song.id, mode: this.data.icon })
      this.setData({ isPlay: true })
    })
    pubsub.subscribe('switchIndex', async (msg, musicId) => {
      await this.getSongs(musicId)
      await this.musiceControl()
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
    pubsub.unsubscribe('switchIndex')
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