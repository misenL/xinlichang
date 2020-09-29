// pages/computed/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '房贷计算器', //导航栏 中间的标题
    },
    result:false, // 显示结算结果，就不显示选择
    computed_result:null, // 计算的结果
  },
  showResult(){
    const computed_result = this.selectComponent('#computed_result') 
    if(computed_result !== null){
      this.setData({
        computed_result:computed_result,
      })
    }
    this.setData({
      result:!this.data.result
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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