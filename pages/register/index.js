// pages/login/index.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '完善信息', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 25,
    // 文件上传
    fileList: [],
    // 上拉菜单
    yesarShow: false,
    bankShow: false,
    occuActions: [],
    bankActions: [],
    idcar1: '',
    idcar2: '',
    idcar3: '',
    idcar4: '',
    username: '',
    pho: '',
    wechat: '',
    idnum: '',
    lic: '',
    cyears: '',
    bankName: '',
    bankID: '',
    registerData: null,
    wechatCode: '',
    verCode: '',
    verKey: '',
    getImgCode: '',
    imgCode: '',
    imgCodeShow: false,
    codeImgSrc: '',
    getImgKey: '',
    //编辑类型(完善信息或修改信息)
    editType: '',
    token: '',
    is_show: 0,
    // 验证码计时相关
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
  // 文件上传
  bindtapUp1() {
    this.bindtapUp(1)
  },
  bindtapUp2() {
    this.bindtapUp(2)
  },
  bindtapUp3() {
    this.bindtapUp(3)
  },
  bindtapUp4() {
    this.bindtapUp(4)
  },
  bindtapUp(el) {
    const _this = this
    wx.chooseImage({
      success(res) {
        console.log('chooseImage', res)
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: `${app.globalData.APIHTTP}api/upload`,
          filePath: tempFilePaths[0],
          name: 'filename',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success(res) {
            const data = JSON.parse(res.data)
            const car = 'idcar' + el
            console.log('success', res, car)
            _this.setData({
              [car]: data.data
            })
            //do something
          }
        })
      }
    })
  },
  bindTapYears() {
    this.setData({
      yesarShow: true
    });
  },
  bindTapBank() {
    this.setData({
      bankShow: true
    });
  },
  // 上拉
  onActionYearsClose() {
    this.setData({
      yesarShow: false
    });
  },
  onActionBankClose() {
    this.setData({
      bankShow: false
    });
  },
  onActionYearsSelect(event) {
    console.log(event.detail);
    this.setData({
      cyears: event.detail.name
    });
  },
  onActionBankSelect(event) {
    console.log(event.detail);
    this.setData({
      bankName: event.detail.name
    });
  },
  onChange(event) {
    console.log(event);
    const el = event.currentTarget.dataset.name
    this.setData({
      [el]: event.detail
    })
  },
  // 验证码相关
  // clickVeri() { // 图片验证码
  //   const _this = this
  //   wx.request({
  //     url: `${app.globalData.APIHTTP}api/image_code`,
  //     success(res) {
  //       console.log('clickVeri get', res)
  //       _this.setData({
  //         imgCodeShow: true,
  //         getImgCode: res.data.data.code,
  //         getImgKey: res.data.data.key,
  //         codeImgSrc: res.data.data.content
  //       });
  //     }
  //   })
  // },
  clickVeriImg() {
    this.setTimeFun()
    const _this = this
    // console.log('clickVeriImg', this.data.imgCode, this.data.getImgCode)
    wx.request({
      url: `${app.globalData.APIHTTP}api/phone_code`,
      method: 'POST',
      data: {
        phone: _this.data.pho,
        type: 1,
        // code: _this.data.imgCode,
        // key: _this.data.getImgKey,
      },
      success(res) {
        console.log('clickVeriImg true', res)
        if (res.data.code === 200) {
          Toast.success('手机验证码已发送');
          _this.setData({
            imgCodeShow: false,
            verKey: res.data.data.key
          });
        } else {
          Toast.fail('验证码错误');
          setTimeout(()=> {
            _this.setData({
              isCodeFail: true
            });
          },1000)
          // _this.clickVeri()
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
  //获取回填信息
  getBackfill() {
    const _this = this
    wx.getBackgroundFetchToken({
      success(res) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/get_member_info`,
          header: {
            'Authorization': res.token
          },
          success(res) {
            if (res.data.code === 200) {
              console.log('回填', res.data.data)
              _this.setData({
                username: res.data.data.real_name,
                idnum: res.data.data.id_number,
                idcar1: res.data.data.ident_just,
                idcar2: res.data.data.ident_back,
                idcar3: res.data.data.ident_hold,
                idcar4: res.data.data.avatarUrl,
                lic: res.data.data.license_number,
                cyears: res.data.data.employment_years,
                bankName: res.data.data.bank_name,
                bankID: res.data.data.bank_number,
              })
            }
          }
        })
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
  //提交修改请求
  toChanges() {
    const _this = this
    wx.getBackgroundFetchToken({
      success(res) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/save_member_info`,
          method: 'POST',
          header: {
            'Authorization': res.token
          },
          data: {
            real_name: _this.data.username,
            id_number: _this.data.idnum,
            avatarUrl: _this.data.idcar4,
            ident_just: _this.data.idcar1,
            ident_back: _this.data.idcar2,
            ident_hold: _this.data.idcar3,
            employment_years: _this.data.cyears,
            license_number: _this.data.lic,
            bank_name: _this.data.bankName,
            bank_number: _this.data.bankID,
          },
          success(res) {
            console.log('修改信息', res)
            if (res.data.code == 200) {
              Toast.success('修改成功!');
              setTimeout(() => {
                wx.switchTab({
                  url: `/pages/my/index`,
                })
              }, 500)
            }
          },
          fail(res) {
            console.log('tapConfirm POST fail', res)
          }
        })
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
  // 提交审核请求
  toExamine() {
    console.log('data', this.data)
    const _this = this
    const share_id  = wx.getStorageSync('share_id')
    wx.request({
      url: `${app.globalData.APIHTTP}api/register`,
      method: 'POST',
      data: {
        wx_code: _this.data.wechatCode,
        iv: app.globalData.iv,
        encryptedData: app.globalData.encryptedData,
        phone: _this.data.pho,
        real_name: _this.data.username,
        id_number: _this.data.idnum,
        avatarUrl: _this.data.idcar4,
        ident_just: _this.data.idcar1,
        ident_back: _this.data.idcar2,
        ident_hold: _this.data.idcar3,
        employment_years: _this.data.cyears,
        license_number: _this.data.lic,
        bank_name: _this.data.bankName,
        bank_number: _this.data.bankID,
        code: _this.data.verCode,
        key: _this.data.verKey,
        invite_id:share_id
      },
      success(res) {
        console.log('tapConfirm POST', res)
        if (res.data.code == 200) {
          wx.navigateTo({ // 0微信注册，1手机号注册
            url: `/pages/examine/index?type=${res.data.data.state}`,
          })
        } else if (res.data.code == -101 || res.data.code == -102) {
          Toast.fail('验证码已失效！请重新获取');
        } else {
          let key = Object.keys(res.data.errors)
          let value = res.data.errors[key[0]]
          console.log('tapConfirm POST key', key, value)
          Toast.fail(`${value[0]}`);
        }
      },
      fail(res) {
        console.log('tapConfirm POST fail', res)
      }
    })
  },
  //点击提交审核
  tapConfirm() {
    const _this = this
    if (_this.data.editType == 'modify') {
      _this.toChanges()
    } else {
      _this.toExamine()
    }
  },
  tapRelaWechat() {
    console.log('tapRelaWechat get---------', app.globalData)
    const _this = this
    wx.getUserInfo({
      success(res) {
        console.log('tapRelaWechat get', res, app.globalData.userInfo)
        app.globalData.userInfo = res.userInfo
        app.globalData.encryptedData = res.encryptedData
        app.globalData.iv = res.iv
        _this.setData({
          wechat: app.globalData.userInfo.nickName
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opation) {
    const _this = this
    this.setData({
      editType: opation.fillType
    })
    if (this.data.editType == 'modify') {
      // 小程序初次加载
      let userInfo = wx.getStorageSync('userInfo')
      _this.setData({
        token: userInfo.token
      })
      _this.setData({
        nvabarData: {
          showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
          title: '修改信息', //导航栏 中间的标题
        }
      })
      _this.getBackfill();
    }
    wx.login({
      success(res) {
        console.log('login get', res)
        _this.setData({
          wechatCode: res.code
        })
      }
    })
    wx.request({
      url: `${app.globalData.APIHTTP}api/register`,
      success(res) {
        console.log('register get', res)
        _this.setData({
          occuActions: res.data.data.years,
          bankActions: res.data.data.bank,
          is_show: res.data.data.is_show
        })
      }
    })
    console.log('globalData', app.globalData)
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