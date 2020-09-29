//houseList.js
//获取应用实例
const app = getApp()
Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '户型列表', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    // houst组件接受参数
    houseData: {
      isType: 1,
    },
    buildId: null,
    houseId: '',
    // 所有数据
    houseListData: []
  },
  onLoad: function (option) {
    console.log('houseList', option, option.id)
    this.setData({
      buildId: option.id
    })
  },

  onReady: function () {
    this.getHouseData()
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
  getHouseData() {
    const _this = this
    wx.request({
      url: `${app.globalData.APIHTTP}api/household`,
      data: {
        build_id: _this.data.buildId,
        house_type_id: _this.data.houseId
      },
      success(res) {
        console.log('request', res)
        _this.setData({
          houseListData: res.data.data
        })
      }
    })
  },
  onclickTab(e) {
    console.log('onclickTab', e)
    switch (e.detail.index) {
      case 1: this.setDataFun(this.data.houseListData.house_type[0].id)
        break;
      case 2: this.setDataFun(this.data.houseListData.house_type[1].id)
        break;
      case 3: this.setDataFun(this.data.houseListData.house_type[2].id)
        break;
      case 4: this.setDataFun(this.data.houseListData.house_type[3].id)
        break;
      case 5: this.setDataFun(this.data.houseListData.house_type[4].id)
        break;
      default: this.setDataFun('')
        break;
    }
  },
  setDataFun(el) {
    this.setData({
      houseId: el
    })
    this.getHouseData()
  }
})
