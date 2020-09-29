// pages/invite/index.js3
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '邀请注册', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    //用户信息
    userInfo: wx.getStorageSync('userInfo'),
    // 我邀请的
    invitePeople:[],
    page:0,  //当前页面
    // 上级
    parent:null,
    // 底部粘性数据
    bstickyData: {
      showSheet: false,
      call:false,
      type:2, // 识别页面
      saveposter:true 
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 获取我邀请的用户
  getMyInvitePeople(){
    var _this = this
    let page = this.data.page 
    wx.getBackgroundFetchToken({
      success(resToken){
        wx.request({
          url: `${app.globalData.APIHTTP}api/invite?page=${page+ 1}`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            let invites = _this.data.invitePeople.concat(res.data.data.data)
            _this.setData({
              invitePeople:invites,
              page:res.data.data.current_page
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMyInvitePeople()
    this.getMyParent()
  },

  // 获取我的上级
  getMyParent(){
    var _this = this
    wx.getBackgroundFetchToken({
      success(resToken){
        wx.request({
          url: `${app.globalData.APIHTTP}api/invite_info`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            _this.setData({
              parent:res.data.data.superior
            })
          }
        })
      }
    })
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
    return {
      title: '我邀请您成为新立场经纪人',
      imageUrl: '../../assets/images/share.png',
      path:`/pages/login/index?share_id=${this.data.userInfo.id}`,
      success(e) {
      },
      fail(e) {
      }
    }
  }
})