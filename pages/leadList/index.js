// pages/leadList/index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '潜在客户', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    //选项内容
    tabList: ['全部', '今天', '昨天', '近7天', '近30天'],
    // 选项卡高亮
    active: 0,
    isShow: false,
    //数据列表
    customerList: [],
    //选择展开的id
    selectId: '',
    scope: '',
    page: 1,
    total: 0,
    token: '',
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
  // 选择选项卡
  selectTab(e) {
    this.setData({
      page: 1,
      customerList: [],
    });
    if (e.detail.title == '全部') {
      this.setData({
        scope: '',
      });
    }
    if (e.detail.title == '今天') {
      this.setData({
        scope: 'today',
      });
    }
    if (e.detail.title == '昨天') {
      this.setData({
        scope: 'yesterday',
      });
    }
    if (e.detail.title == '近7天') {
      this.setData({
        scope: 'seven_day',
      });
    }
    if (e.detail.title == '近30天') {
      this.setData({
        scope: 'thirty_day',
      });
    }
    this.getRequest();
  },
  //点击展开或收起
  toClick(e) {
    const index = e.currentTarget.dataset.index;
    const value = this.data.customerList[index].isOpen;
    let item = `customerList[${index}].isOpen`;
    this.setData({
      [item]: !value,
      selectId: e.currentTarget.dataset.id
    });
  },
  //点击拨打电话
  makeCall(e) {
    const phoneNum = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phoneNum,
      success(res) {
        console.log(res)
      }
    })
  },
  //点击加载更多
  clickLoad() {
    this.setData({
      page: this.data.page + 1,
    });
    this.getRequest();
  },
  //数据请求
  getRequest() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        console.log('周期拉取success', resToken)
        wx.request({
          url: `${app.globalData.APIHTTP}api/customer`,
          header: {
            'Authorization': resToken.token,
          },
          data: {
            scope: _this.data.scope,
            page: _this.data.page,
          },
          success(res) {
            // console.log('request', res.data.data)
            let arr = res.data.data.data;
            let listArr = [..._this.data.customerList]
            for (let i = 0; i < arr.length; i++) {
              listArr.push(arr[i])
            }
            let obj = {
              isOpen: true
            }
            listArr.forEach(item => {
              Object.assign(item, obj); //添加一个字段
            })
            _this.setData({
              customerList: listArr,
              total: res.data.data.total,
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 本地存储
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      token: userInfo.token
    })
    this.getRequest();
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