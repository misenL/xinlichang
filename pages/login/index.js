// pages/login/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '登录', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 25,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const share_id = options.share_id
    // 储存进缓存
    wx.setStorage({
      key:"share_id",
      data:share_id
    })
  },
  // 协议弹出
  onConfirm(e) {
    console.log('onConfirm', e);
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
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
  // 手机号度
  bindPhoLogin() {
    wx.navigateTo({ // 0微信注册，1手机号注册
      url: `/pages/phoneLogin/index`,
    })
  },
  // 微信快捷登录
  getUserInfo(e) {
    console.log('getUserInfo', e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.iv = e.detail.iv
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `${app.globalData.APIHTTP}api/wx_login`,
            method: 'POST',
            data: {
              code: res.code
            },
            success(res) {
              console.log(res.data)
              if (res.data.code == -109) {
                wx.navigateTo({ // 0微信注册，1手机号注册
                  url: `/pages/register/index?type=0`,
                })
              } else if (res.data.code == 200) {
                if (res.data.data.state === 1) {
                  console.log('登录成功看res', res)
                  // 存储本地信息+登录状态
                  wx.setStorageSync('userInfo', res.data.data)
                  // 身份,1经纪人,2驻场,3部门主管,4业务负责人(只有一个）
                  wx.setStorageSync('userType', res.data.data.ident)
                  // 周期性更新
                  wx.setBackgroundFetchToken({
                    token: res.data.data.token
                  })
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                } else {
                  wx.navigateTo({ // 
                    url: `/pages/examine/index?type=${res.data.data.state}`,
                  })
                }
              } else {
                console.log('登录失败！' + res)
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
      fail(res) {
        console.log('login fail', res)
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      // 获取页面的id

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