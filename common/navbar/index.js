const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1,  //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      userType: 1,    // 身份状态,0客户,1经纪,2驻场
    },
    hereLoc: '定位中',
    active: 0
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    if (wx.getStorageSync('customer') == 0) {
      this.setData({
        'navbarData.showCapsule': 0
      })
    }
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height
    })
  },
  methods: {
    onChange(e) {
      this.setData({
        active: e.detail.index
      })
      this.triggerEvent('childTabs', this.data.active)
    },
    // 返回上一页面
    _navback() {
      wx.navigateBack({
        success(res) {
          console.log('navigateBack success', res, getCurrentPages())
        },
        fail(res) {
          console.log('navigateBack fail', res, getCurrentPages())
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      })
    },
    //返回到首页
    _backhome() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    },
    // 地理位置
    bindLoc() {
      wx.navigateTo({
        url: '/pages/chooseCity/index'
      })
      // 触发父方法
      this.triggerEvent('myevent', {}, {}) //myevent 自定义名称事件，父组件中使用
    }
  },

}) 