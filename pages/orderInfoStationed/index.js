// pages/orderInfoStationed/index.js
//获取应用实例
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '订单详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    stationedType: 0,  // 0带看1认购2成交,onload修改
    // 其它信息的动态字段
    strTime: '带看时间：',
    strRemarks: '带看备注：',
    strFile: '带看附件：',
    houseList: [
      '5房2厅1厨2卫',
      '5房2厅1厨2卫',
      '5房2厅1厨2卫',
      '5房2厅1厨2卫',
      '5房2厅1厨2卫',
      '5房2厅1厨2卫',
    ],
    previewShow: false,
    previewImg: '',
    imagesArr: [
      { url: '../../assets/test.jpg' },
      { url: '../../assets/test.jpg' },
      { url: '../../assets/t3.png' },
      { url: '../../assets/t3.png' },
      { url: '../../assets/test.jpg' },
    ]
  },

  // 图片
  tapImage(e) {
    console.log('tapImage', e)
    this.setData({
      previewShow: true,
      previewImg: e.currentTarget.dataset.url
    })
  },
  onClosePopup(e) {
    console.log('onClosePopup', e)
    this.setData({
      previewShow: false
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      stationedType: 2
    })
    if (this.data.stationedType == 0) {
      this.setData({
        strTime: '带看时间：',
        strRemarks: '带看备注：',
        strFile: '带看附件：',
      })
    }else if (this.data.stationedType == 1) {
      this.setData({
        strTime: '认购时间：',
        strRemarks: '认购备注：',
        strFile: '认购附件：',
      })
    } else if (this.data.stationedType == 2) {
      this.setData({
        strTime: '成交时间：',
        strRemarks: '成交备注：',
        strFile: '成交附件：',
      })
    }
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