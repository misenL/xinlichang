//index.js
//获取应用实例
const app = getApp()
let obj = null

Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标    0表示不显示  1表示显示   2坐标选框
      title: '搜索', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,   
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //搜索
    search:'',
    pageData: [],
    city_id: null,
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
  //事件处理函数
  onLoad: function (option) {
    console.log("查看页面参数",option)
    this.setData({
      city_id: wx.getStorageSync('cityInfo').id,
      search:option.search
    })
    this.getBuild()
  },
  getBuild() {
    const _this = this
    console.log('onLoad', wx.getStorageSync('cityInfo').id);
    wx.request({
      url: `${app.globalData.APIHTTP}api/build`,
      data: {
        name: _this.data.search,
        city_id: _this.data.city_id
      },
      success(res) {
        _this.setData({
          pageData: res.data.data.data
        });
        console.log('getVerify get', res, _this.data.pageData)
      }
    })
  },
  // 搜索框事件
  onChange(e) {
    this.setData({
      search: e.detail,
    });
  },
  onSearch(e) {
    console.log('onsearch', this.data.search)
    this.getBuild()
  },
  onSearchClear(e) {
    console.log('onSearchClear', this.data.search)
    this.setData({
      pageData: []
    })
  }
})
