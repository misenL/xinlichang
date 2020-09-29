//app.js
App({
  onLaunch: function (options) {
    console.log('APP', options, decodeURIComponent(options.query.scene))
    // 强制更新版本
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(function () {
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '更新小程序失败，请检查网络是否流通，点击确定可重启',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    // 是否是二维码/小程序分享
    console.log("检查是否是分享到微信的小程序",Boolean(options.query.scene))
    if (options.query.scene) {
      // 因为misen那个傻逼不知道自己写的scene代表什么意思，所以添加了个6
      if(options.query.scene == 6){
        // 楼盘详情的分享主要是将参数全部带入
        console.log("查看路由参数",options)
        for(let i in options.query){
          wx.setStorageSync(i, options.query[i]);
        }
      }
      else if (options.query.scene !='5') {
        var scene = decodeURIComponent(options.query.scene);
        console.log("查看分享出来的内容")
        var arrPara = scene.split("&");
        var arr = [];
        for (var i in arrPara) {
          arr = arrPara[i].split("=");
          console.log("查看切割的数组",arr)
          wx.setStorageSync(arr[0], arr[1]);
        }
      }else {
        wx.setStorageSync('customer', 0);
      }
    } else {
      // console.log("no scene");
      wx.setStorageSync('customer', '1');
      // 小程序初次加载
      // 本地存储,周期更新
      wx.getBackgroundFetchToken({
        success(res) {
          // console.log('周期拉取success', res)
          // wx.switchTab({
          //   url: '/pages/index/index',
          // })
        },
        fail(res) {
          // console.log('周期拉取，没有token', res)
          wx.redirectTo({
            url: `/pages/login/index`,
          })
        }
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log('getSetting', res, wx.getStorageSync('userInfo') !== '')
        if (res.authSetting['scope.userInfo', 'scope.userLocation']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('getUserInfo', res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          if (wx.getStorageSync('userInfo') !== '') {
            wx.getLocation({
              success: res => {
                this.globalData.userLocation = res.userLocation
                console.log('getLocation', res, this.globalData)
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
            })
          }
        }
      }
    })
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        console.log('res', res)
        this.globalData.height = res.statusBarHeight
      }
    })
    // 下拉刷新
    wx.startPullDownRefresh({
      success: (res) => {
        console.log('startPullDownRefresh', res)
      }
    })
  },
  globalData: {
    userInfo: null,
    iv: null,
    encryptedData: null,
    userLocation: null,
    share: true, // 分享默认为true
    height: 0,
    // APIHTTP: 'http://pa.com/'
    // APIHTTP: 'https://applet-dev.newform2020.cn/'
    APIHTTP: 'https://applet.newform2020.cn/'
  }
})