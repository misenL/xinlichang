//buildInfo.js
//获取应用实例
const app = getApp()
const scrollArr = [0, 390, 655, 690]
Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '龙华金茂府', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    active: 0,
    buildData: [],
    // 底部粘性数据
    bstickyData: {
      showSheet: false
    },
    // 触摸判断
    touchIs: false,
  },
  onLoad: function (opation) {
    console.log('get userType', wx.getStorageSync('userType'), )
    if (wx.getStorageSync('customer') == 0) {
      opation.id = wx.getStorageSync('build')
    }
    const _this = this
    wx.request({
      url: `${app.globalData.APIHTTP}api/build/${opation.id}`,
      success(res) {
        console.log('buildinfo   request', res)
        _this.setData({
          buildData: res.data.data,
          'nvabarData.title': res.data.data.nickname,
          bstickyData: { ...res.data.data, type: 0, customer: wx.getStorageSync('customer')}
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
  onPageScroll: function (e) {
    if (this.data.touchIs === false) {
      return
    }
    if (385 < Number(e.scrollTop) && Number(e.scrollTop) < 645) {
      this.setData({
        active: 1,
      })
    } else if (645 < Number(e.scrollTop) && Number(e.scrollTop) < 670) {
      this.setData({
        active: 2,
      })
    } else if (671 < Number(e.scrollTop)) {
      this.setData({
        active: 3,
      })
    }else {
      this.setData({
        active: 0,
      })
    }
  },
  touchStart() {
    this.setData({
      touchIs: true
    })
  },
  touchEnd() {
    this.setData({
      touchIs: false
    })
  },
  // tab页切换
  onClick(e) {
    this.setData({
      active: e.detail.index,
    }),
    wx.pageScrollTo({
      scrollTop: scrollArr[e.detail.index],
      duration: 300
    })
  },





})
