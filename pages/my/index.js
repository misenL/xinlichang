// pages/my/index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户信息
    userInfo: {},
    //微信号
    wechat: '',
    token: '',
    //通过 wx.login 接口获得临时登录凭证 code
    loginCode: '',
    pop_show: false,
  },
  tapGoCustomer(e) {
    wx.navigateTo({
      url: `/pages/leadList/index`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    // 本地存储,周期更新
    wx.getBackgroundFetchToken({
      success(res) {
        console.log('my 周期拉取success', res)
        _this.setData({
          token: res.token,
        })
        _this.getRequest();
        // wx.switchTab({
        //   url: '/pages/index/index',
        // })
      },
      fail(res) {
        console.log('my 周期拉取，没有token', res)
        Toast.fail('登录超时！请重新登录');
        wx.redirectTo({
          url: `/pages/login/index`,
        })
      }
    })
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
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
  // 获取我的首页数据
  getRequest() {
    const _this = this
    //动态相关数据
    wx.request({
      url: `${app.globalData.APIHTTP}api/member`,
      header: {
        'Authorization': _this.data.token
      },
      success(res) {
        // console.log('my', res.data.data)
        _this.setData({
          userInfo: res.data.data,
          wechat: res.data.data.nickName
        })
        wx.setStorageSync("userInfo", res.data.data)
      }
    })
  },
  tapToOrder() {
    wx.switchTab({
      url: '/pages/leaderOrder/index',
    })
  },
  //点击绑定,打开弹窗
  tapRelaWechat() {
    if (this.data.wechat) {
      console.log('已绑定')
    } else {
      this.setData({
        pop_show: true
      })
    }
  },
  //关闭弹窗
  onClose() {
    this.setData({
      pop_show: false
    })
  },
  //点击确定绑定微信
  toBinding(e) {
    const _this = this
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.iv = e.detail.iv
    if (_this.data.wechat) {
      console.log('已绑定')
    } else {
      wx.login({
        success(res) {
          //绑定微信接口
          wx.request({
            url: `${app.globalData.APIHTTP}api/bind_wx`,
            method: 'post',
            header: {
              'Authorization': _this.data.token
            },
            data: {
              code: res.code,
              iv: app.globalData.iv,
              encryptedData: app.globalData.encryptedData,
            },
            success(res) {
              console.log(res)
              if (res.data.code == 200) {
                _this.setData({
                  wechat: app.globalData.userInfo.nickName
                })
                Toast.success('微信绑定成功!');
              }
            }
          })
        }
      })
    }
  },
  //跳转修改资料
  toModify() {
    wx.navigateTo({
      url: `/pages/register/index?fillType=modify`,
    })
  },
  // 跳转邀请人列表
  toInvite() {
    wx.navigateTo({
      url: `/pages/invite/index`,
    })
  },
  //跳转潜在客户页
  toLeadList() {
    wx.navigateTo({
      url: `/pages/leadList/index`,
    })
  },
  // 客服电话
  clickCustomerTel() {
    const _this = this
    wx.makePhoneCall({
      phoneNumber: _this.data.userInfo.platform_phone,
    })
  },
  // 联系客服
  handleContact(e) {
    console.log('联系客服',e)
  },
  // 切换账号
  tapCut(e) {
    console.log('切换账号', e)
    Dialog.confirm({
      message: '确认退出当前账号前往登录界面？',
    })
      .then(() => {
        // on close
        // console.log('then')
        try {
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('customer')
          wx.removeStorageSync('userType')
          wx.redirectTo({
            url: `/pages/login/index`,
          })
        } catch (e) {
          // Do something when catch error
          Dialog.alert({
            message: '切换失败',
          }).then(() => {
            // on close
          });
        }
      })
      .catch(() => {
        // on cancel
        console.log('catch')
      });
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
    const _this = this
    // 本地存储,周期更新
    wx.getBackgroundFetchToken({
      success(res) {
        console.log('my 周期拉取success', res)
        // wx.switchTab({
        //   url: '/pages/index/index',
        // })
        _this.getRequest();
      },
      fail(res) {
        console.log('my 周期拉取，没有token', res)
        Toast.fail('登录超时！请重新登录');
        wx.redirectTo({
          url: `/pages/login/index`,
        })
      }
    })
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
  // 分享
  onShareAppMessage: function (res) {
    console.log('onShareAppMessage', res)
    return {
      title: '我邀请您成为新立场经纪人',
      imageUrl: '../../assets/images/share.png',
      success(e) {
        console.log('分享成功',e)
      },
      fail(e) {
        console.log('分享失败',e)
      }
    }
  },
})