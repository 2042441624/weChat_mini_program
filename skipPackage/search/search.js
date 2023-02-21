// pages/sreach/sreach.js
import request from "../../utils/request";

let timeOut = null
Page({
  //  页面的初始数据
  data: {
    searchContent: '',
    hotList: [],
    searchList: [],
    historyList: wx.getStorageSync('historyList') ? JSON.parse(wx.getStorageSync('historyList')) : []
  },
  // 
  async getSearchList(searchContent) {
    let searchList = await request('cloudsearch', {
      keywords: searchContent
    })
    return searchList
  },
  // 删除历史搜索
  deleteSearchHistory(){
    wx.showModal({
      title: '确认删除历史记录吗？',
      content: '',
      complete: (res) => {
        if (res.cancel) {
        }

        if (res.confirm) {
          wx.removeStorage({
            key: 'historyList',
            success :()=> {
            this.setData({historyList:[]})
            }
          })
        }
      }
    })

  },
  // 防抖函数配合搜索监听
  handleInputChange() {
    let searchContent =  this.data.searchContent
    clearTimeout(timeOut)
    if (searchContent.length) {
      timeOut = setTimeout(() => {
        this.getSearchList(searchContent).then(res => {
          res.code === 200 ? this.setData({ searchList: res.result.songs }) : this.setData({ searchList: [] })
        })
      }, 300);
    } else {
      this.setData({ searchList: [] })
    }
  },
  clearSearchContent() {
    this.setData({ searchContent: "", searchList: [] })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  saveHistoryList() {

  },
  setSearchCont(e){
    console.log(e);
    this.setData({searchContent:e.currentTarget.id})
    this.handleInputChange()
  },
  toSongDetail(e) {
    let song = Number(e.currentTarget.id)

    wx.navigateTo({
      url: '/songPackage/songdetail/songdetail?song=' + JSON.stringify(song),
    })
    let historyList = this.data.historyList

    let isHas = historyList.indexOf(this.data.searchContent)
    console.log(isHas,isHas>=0);
   if(isHas>=0){
    historyList.splice(isHas, 1)
    console.log(historyList);
   }
   historyList.unshift(this.data.searchContent)
    wx.setStorageSync('historyList', JSON.stringify(historyList))
    this.setData({ historyList })
  },
  async onLoad(options) {
    let hotList = await this.getSearchHot()
    this.setData({
      hotList: hotList.result.hots
    })



  },
  async getSearchHot() {
    let hot = await request('search/hot')
    return hot
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