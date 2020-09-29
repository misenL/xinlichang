//index.js
//获取应用实例
const app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 引入城市列表
var city = require('../../libs/city-list.js')

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'ENJBZ-INBR3-37J32-YFT5M-OEUGO-AUFP2' // 必填
});
Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '选择城市', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,   
    cityList: [], //所有城市列表
    cityPy: '', //右侧首字母列表
    currentIndex: 0, //当前显示的字母index
    hidden: false, //是否隐藏当前显示中间大字母提示
    scrollTopId: 'current', //滚动到当前的字母城市
    locationCity: '广州市',
    touches: {},
    hostCity:[]
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
  // 重新定位
  handleClickLocation(e) {
    const _this = this
    // 定位
    wx.getLocation({
      success: resLoc => {
        console.log('getLocation', resLoc, app, app.globalData)
        wx.request({
          url: `${app.globalData.APIHTTP}api/city_id`,
          method: 'POST',
          data: {
            lat: resLoc.latitude,
            lng: resLoc.longitude
          },
          success(resCity) {
            console.log('get city_id', resCity)
            wx.setStorageSync('cityInfo', resCity.data.data)
            _this.setData({
              locationCity: resCity.data.data.shortname,
            })
          }
        })
      },
      fail: res => {
        console.log('getLocation fail', res)
        _this.setData({
          locationCity: '定位失败请手动选择'
        })
      }
    })
  },

  //事件处理函数
  onLoad: function () {
    const _this = this 
    let onCity = wx.getStorageSync('cityInfo')
    console.log('city', onCity)
    _this.gethotCity()
    wx.request({
      url: `${app.globalData.APIHTTP}api/city`,
      success(res) {
        let city = res.data.data
        _this.setData({
          cityList: res.data.data,
          locationCity: onCity.shortname
        })
        let cityPy = []
        // 遍历城市数据,把字母放到cityPy数据里
        for (var key in _this.data.cityList) {
          cityPy.push(key)
        }
        _this.setData({
          cityPy: cityPy
        })
      }
    })
  },
  // 获取热门城市
  gethotCity(){
    let _this = this
    wx.request({
      url: `${app.globalData.APIHTTP}api/hot`,
      success(res) {
          console.log("热门城市",res)
          _this.setData({
            hostCity: res.data.data
          })
      }
    })
  },

  // 点击选择城市
  selectCity(e) {
    const dataset = e.currentTarget.dataset
    console.log('selectCity', dataset, e)
    wx.setStorageSync('cityInfo', dataset.full)
    wx.switchTab({
      url: `/pages/index/index`
    })
      // app.globalData.selectCityInfo = {
      //     fullname: dataset.fullname,
      //     lat: dataset.lat,
      //     lng: dataset.lng
      // }
      // wx.navigateBack()
  },
  // 触摸开始
  handleTouchStart(e) {
    // 首次获取到clientY的值并记录为y1
    var y = e.touches[0].clientY
    this.setData({
      'touches.y1': y,
      'touches.anchorIndex': e.currentTarget.dataset.index
    })
    // this.touches.y1 = y
    // 获取到当前的index,并记录在touches里
    // this.touches.anchorIndex = e.currentTarget.dataset.index
    // 把当前点击的字母显示在屏幕中央
    this.setData({
      hidden: true,
      scrollTopId: e.currentTarget.dataset.id,
      currentIndex: e.currentTarget.dataset.index
    })
  },
  // 滑动触摸
  handleTouchMove(e) {
    // 滑动过程中获取当前的clientY值并记录为y2
    var y = e.touches[0].clientY
    this.setData({
      'touches.y2': y,
    })
    // this.touches.y2 = y
    // 根据y2-y1得到所滑动的距离除以每个字母的高度20得到字母的个数,
    // 加上第一次获取的anchorindex得到当前的序号index
    const delt = (this.data.touches.y2 - this.data.touches.y1) / 20 | 0
    let anchorIndex = this.data.touches.anchorIndex + delt
    // 由当前的序号index在字母表数组中找到字母并显示在屏幕中
    this.setData({
      hidden: true,
      scrollTopId: this.data.cityPy[anchorIndex],
      currentIndex: anchorIndex
    })
  },
  // 触摸结束
  handleTouchEnd() {
    setTimeout(() => {
      this.setData({
        hidden: false,
      })
    }, 0)
  },
  // 计算listGroup高度
  _calculateHeight() {
    const that = this
    this.listHeight = []
    let height = 0
    this.listHeight.push(height)
    wx.createSelectorQuery().selectAll('.listGroup').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        height += rect.height
        that.listHeight.push(height)
      })
    }).exec()
  },
  // 滚动时触发
  // handleScroll(e) {
  //   let scrollTop = e.detail.scrollTop
  //   const listHeight = this.listHeight
  //   console.log('listHeight', listHeight)    
  //   // 遍历listHeight数据,如果当前的scrollTop大于height1小于height2时
  //   // 说明当前滚到到这个字母城市区域,获取到当前的索引i值
  //   for (var i = 0; i < listHeight.length; i++) {
  //     let height1 = listHeight[i]
  //     let height2 = listHeight[i + 1]
  //     if (scrollTop > height1 && scrollTop < height2) {
  //       this.setData({
  //         currentIndex: i
  //       })
  //     }
  //   }
  // },

})
