// pages/phoneLogin/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '注册审核', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 25,
    examineType: 1,     // 1通过， 3审核中  2悲剧
  },
  tapConfirm() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  tapModifyInfo() {
    wx.navigateTo({ // 0微信注册，1手机号注册
      url: `/pages/register/index?type=0`,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opation) {
    this.setData({
      examineType: opation.type
    })
    console.log('examine', opation, this.data.examineType)
  },
  // 下拉
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    wx.hideNavigationBarLoading(); //完成停止加载图标
    wx.stopPullDownRefresh({
      complete: (res) => {
        console.log('stopPullDownRefresh complete', res)
      }
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})