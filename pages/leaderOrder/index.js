// pages/leaderOrder/index.js
const app = getApp()
const approType = ['wait', 'processed']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '订单', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    testData: {
      states: 0,   // 0认购，1成交
      idType: 0,   // 订单的类型 0是对方提交， 1是我自己提交
      operation: 3,     // 处理：0待处理，1同意，2驳回, 3是我发起的
      userType: 2,    // 2驻场1经纪
    },
    checkPage: 1, // 审批0还是订单1？
    topActive: 0, 
    orderActive: 0,
    orderData: [],
    getData: {},
    // 真实数据
    leaderData: { type:'wait'},    //类别 待我处理wait(默认) 我已处理processed
    approData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(' leaderOrder options', options, wx.getStorageSync('userType'))
    if (wx.getStorageSync('userType') == 3 || wx.getStorageSync('userType')==4 && wx.getStorageSync('userType')) {
      // 获取审批
      this.getApproData()
      this.setData({
        checkPage: 0,
        'nvabarData.userType': wx.getStorageSync('userType'),
        orderActive: wx.getStorageSync('active')||0
      })
    }else {
      this.setData({
        checkPage: 1,
        'nvabarData.userType': wx.getStorageSync('userType'),
        'nvabarData.showCapsule': 1,
        orderActive: wx.getStorageSync('active') || 0
      })
    }
    this.getOrderData()
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
  // 获取订单
  getOrderData() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        console.log('周期拉取success', resToken)
        // 获取acce
        wx.request({
          url: `${app.globalData.APIHTTP}api/order`,
          header: {
            Authorization: resToken.token,
          },
          data: {
            ..._this.data.getData
          },
          success(res) {
            console.log('订单', res)
            _this.setData({
              orderData: res.data.data.data
            })
          }
        })
      }
    })
  },
  // 获取审批
  getApproData() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        console.log('周期拉取success', resToken)
        // 获取acce
        wx.request({
          url: `${app.globalData.APIHTTP}api/leader/order`,
          header: {
            Authorization: resToken.token,
          },
          data: {
            ..._this.data.leaderData
          },
          success(res) {
            _this.setData({
              approData: res.data.data.data
            })
            console.log('审批', _this.data.approData, res)
          }
        })
      }
    })
  },

  bindTabData(e) {
    console.log('bindTabData', e)
    this.setData({
      checkPage: e.detail
    })
  },
  // 审批切换
  onChangeAppro(e) {
    console.log('onChangeAppro', e)
    this.setData({
      'leaderData.type': approType[e.detail.index]
    })
    this.getApproData()
  },
  // 订单切换
  onChange(e) {
    console.log('onChange', e, e.detail.index + '0')
    if(e.detail.index == 0) {
      this.setData({
        getData: {}
      })
    } else if (e.detail.index == 5) {
      this.setData({
        getData: { order_state: '5060' }
      })
    }else {
      this.setData({
        getData: { order_state: e.detail.index + '0'}
      })
    }
    this.getOrderData()
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

    if (wx.getStorageSync('userType') == 3 || wx.getStorageSync('userType') == 4 && wx.getStorageSync('userType')) {
      // 获取审批
      this.getApproData()
      this.setData({
        checkPage: 0,
        'nvabarData.userType': wx.getStorageSync('userType'),
        orderActive: wx.getStorageSync('active') || 0
      })
    } else {
      this.setData({
        checkPage: 1,
        'nvabarData.userType': wx.getStorageSync('userType'),
        'nvabarData.showCapsule': 1,
        orderActive: wx.getStorageSync('active') || 0
      })
    }
    this.getOrderData()
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