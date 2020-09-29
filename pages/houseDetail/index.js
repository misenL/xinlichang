//houseDetail.js
//获取应用实例
const app = getApp()
Page({
  data: {
    scale: 0,
    movableH:250,
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '户型详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    // houst组件接受参数
    houseData: {
      isType: 1,
    },
    // 底部粘性数据
    bstickyData: {
      showSheet: false
    },
    houseDetailData: [],
    buildId: null,
    houseId: null,
    previewImg: false,
    previewImgUrl: ''
  },
  onLoad: function (option) {
    console.log('houseDetail option', option)
    const _this = this
    wx.request({
      url: `${app.globalData.APIHTTP}api/household/${option.houseId}`,
      data: {
        build_id: option.buildId
      },
      success(res) {
        console.log('houseDetail   request', res)
        _this.setData({
          houseDetailData: res.data.data,
          bstickyData: { ...res.data.data.household, build_presence: res.data.data.household.build.build_presence, type: 1, customer: wx.getStorageSync('customer')},
          buildId: option.buildId,
          houseId: option.houseId
        })
      }
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
  setScale(e) {
    console.log('setScale', e)
  },
  tapGoBuild() {
    // 6/29不要楼盘跳转
    // wx.navigateTo({
    //   url: `/pages/buildInfo/index?id=${this.data.buildId}`,
    // })
  },
  tapMoreHouse() {
    wx.navigateTo({
      url: `/pages/houseList/index?id=${this.data.buildId}`,
    })
  },
  // 图片预览
  tapPreviewImg(e) {
    console.log('previewImgUrl', e)
    this.setData({
      previewImgUrl: e.currentTarget.dataset.imgUrl,
      previewImg: true,
    })
  },
  onClosePreview() {
    this.setData({
      previewImg: false
    })
  },
  onShareAppMessage: function (res) {
    let that = this
    wx.showShareMenu({
        withShareTicket: true,
      })
    return {
      title: '新立场经纪人',
      path: `/pages/houseDetail/index?customer=0&scene=5&id=${wx.getStorageSync('userInfo').id}&buildId=${that.data.buildId}&houseId=${that.data.houseId}`,
      imageUrl: '../../assets/images/share.png',
      success: function (res) {
        console.log('成功', res)
      },
      fail:function(res) {
        console.log('fail', res)
      },
      complete:function(res) {
        console.log('complete', res)
      },
    }
  }
})
