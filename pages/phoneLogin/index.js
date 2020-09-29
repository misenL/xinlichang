// pages/phoneLogin/index.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '登录', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 25,
    verify: '',
    userphone: '',
    imgCodeShow: false,
    codeImgSrc: '',
    getImgKey: '',
    verKey: '',
    isTime: 30,
    isVerify: '发送验证码',
    isCodeFail: false,      // 获取验证码是否失败?默认否
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
  onChange(e) {
    console.log(e);
    const el = e.currentTarget.dataset.name
    this.setData({
      [el]: e.detail
    })
  },
  // 获取图验证码
  // getVerify(e) {
  //   const _this = this
  //   wx.request({
  //     url: `${app.globalData.APIHTTP}api/image_code`,
  //     success(res) {
  //       console.log('getVerify get', res)
  //       _this.setData({
  //         imgCodeShow: true,
  //         getImgKey: res.data.data.key,
  //         codeImgSrc: res.data.data.content
  //       });
  //     }
  //   })
  // },

  // 图片验证码弹框校验
  clickVeriImg() {
    this.setTimeFun()
    const _this = this
    wx.request({
      url: `${app.globalData.APIHTTP}api/phone_code`,
      method: 'POST',
      data: {
        phone: _this.data.userphone,
        type: 2,
      },
      success(res) {
        console.log('clickVeriImg true', res)
        if (res.data.code === 200) {
          Toast.success('手机验证码已发送');
          _this.setData({
            imgCodeShow: false,
            verKey: res.data.data.key
          });
        } else if (res.data.code == -104) {
          Toast.fail('该号码还未注册！2s 后跳转注册页面');
          const timer = setTimeout(() => {
            wx.navigateTo({ // 0微信注册，1手机号注册
              url: `/pages/register/index?type=1`,
            })
          }, 2000)
          _this.setData({
            imgCodeShow: false,
          });
        } else {
          Toast.fail("手机号码格式有误");
          console.log(res)
          setTimeout(()=> {
            _this.setData({
              isCodeFail: true
            });
          },1000)
          // _this.getVerify()
        }
      }
    })
  },
  // 计时器
  setTimeFun() {
    const _this = this
    var intime = setInterval(() => {
      if(_this.data.isTime<2 || _this.data.isCodeFail) {
        clearInterval(intime)
        _this.setData({
          isTime: 30,
          isCodeFail: false
        })
      }else {
        _this.setData({
          isTime: _this.data.isTime-1,
        })
      }
      // console.log('?????')
    },1000)
  },
  onClose() {
    this.setData({
      imgCodeShow: false
    });
  },
  confirm() {
    const _this = this
    if (this.data.verify !== '' && this.data.userphone !== '') {
      wx.request({
        url: `${app.globalData.APIHTTP}api/login`,
        method: 'POST',
        data: {
          phone: _this.data.userphone,
          code: _this.data.verify,
          key: _this.data.verKey
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == -109) {
            wx.navigateTo({ // 0微信注册，1手机号注册
              url: `/pages/register/index?type=0`,
            })
          } else if (res.data.code == 200) {
            if (res.data.data.state === 1) {
              console.log('登录成功看res', res)
              // 存储本地信息+登录状态
              wx.setStorageSync('userInfo', res.data.data)
              // 身份,1经纪人,2驻场,3部门主管,4业务负责人(只有一个）
              wx.setStorageSync('userType', res.data.data.ident)
              // 周期性更新
              wx.setBackgroundFetchToken({
                token: res.data.data.token
              })
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else {
              wx.navigateTo({ // 
                url: `/pages/examine/index?type=${res.data.data.state}`,
              })
            }
          } else {
            console.log('登录失败！' + res)
          }
        }
      })
    } else {
      Toast.fail('请填写完信息')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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