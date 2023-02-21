// pages/index/index.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [],//banner视图
    recommendList: [],//推荐歌单
    topList: [],//排行榜
  },
  toSearch(){
    wx.navigateTo({
      url: '/skipPackage/search/search'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {


    let topList = await request('toplist/detail')
    topList = topList.list
    let bannersDataList = await request('banner', { type: 2 })
    // console.log(bannersDataList);
    let recommendList = await request('personalized', { limt: 10 })
    // console.log(recommendList);
    this.setData({
      bannersList: bannersDataList.banners,
      recommendList: recommendList.result,
    })
    let topIndex = 0;
    let IndexTopList = []
    while (IndexTopList.length < 3) {
      let indexList = await request('playlist/detail', { id: topList[topIndex].id })
      if (indexList.code === 200) {
        let indexobj = indexList.playlist
        let obj = { id: indexobj.id, name: indexobj.name, tracks: indexobj.tracks.splice(0, 3) }
        // console.log(obj);

        IndexTopList.push(obj)

      }
      topIndex++
    }
    this.setData({ topList: IndexTopList })
    // console.log(this.data.topList);
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
  toRecommend() {
    wx.navigateTo({
      url: '/skipPackage/recommend/recommend'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})