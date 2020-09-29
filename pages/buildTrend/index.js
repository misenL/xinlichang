//houseList.js
//获取应用实例
const app = getApp()
Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
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
    trendData: [],
    trendsInfo: [],
    active: 0,

    //楼盘id
    buildId: '',
  },
  onLoad: function (option) {
    console.log('get userType', wx.getStorageSync('userType'))
    // 路由传参
    console.log('option', option)
    this.setData({
      buildId: option.id,
      'nvabarData.title': option.title
    })
    this.getRequest(option.id, 'jq')
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
  getRequest(el, tid) {
    const _this = this
    let url
    if (tid === 'jq') {
      url = `${app.globalData.APIHTTP}api/trends/${el}`
    } else {
      url = `${app.globalData.APIHTTP}api/trends/${el}/${tid}`
    }
    //动态相关数据
    wx.request({
      url: url,
      success(res) {
        console.log('request', res.data.data)
        _this.setData({
          trendData: res.data.data.build_trends.data,
          trendsInfo: res.data.data.trends
        })
      }
    })
  },
  //选择
  selectTab(event) {
    // console.log(event)
    // console.log(event.detail.index)
    let tid = null
    if (event.detail.index > 0) {
      tid = this.data.trendsInfo[event.detail.index - 1].id
    } else {
      tid = 'jq'
    }
    console.log(tid)
    this.getRequest(this.data.buildId, tid)
  },

  // 图片的点击事件
  zoomImages(event){
    const image = event.currentTarget.dataset.image
    const images = event.currentTarget.dataset.images
    console.info(image)
    console.info(images)
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: images // 需要预览的图片http链接列表
    })
  }

})