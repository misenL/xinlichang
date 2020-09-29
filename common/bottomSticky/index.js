// bottomSticky

const app = getApp()
// let this.data.canvasUnit = ''
Component({
  properties: {
    /**
     * @param type 0 楼盘 1 户型 2 我的邀请页面
     */
    bstickyData: {   //bstickyData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { 
        console.log('???observer', newVal, oldVal)
       },
    }
  },
  data: {
    bstickyData: {
     
    },
    siteTell: [],
    // 保存海报
    maskHidden: false,
    // 真实数据
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canvasUnit: 1,
    userPro: '../../assets/t3.png',
    userName: '',
    userPho: '',
    buildImg: '',
    buildName: '',
    buildPrice: '',
    buildMoney: '',
    buildArea: '',
    buildHouse: '',
    xcxCode: '',
    accToken: '',
    imagePath: '',
    houseType: '',
    houseDirection: '',
    userData: {},
    showDialog: false,
  },
  attached: function () {
    this.setData({
      'bstickyData.customer': wx.getStorageSync('customer'),
    })
    if (wx.getStorageSync('customer') == 0) {
      this.getUserData()
    }
    console.log('att bottom', this.data)
  },
  methods: {
    /// 获取分享者信息
    getUserData() {
      const _this = this
      wx.request({
        url: `${app.globalData.APIHTTP}api/member_info`,
        data: {
          member_id: wx.getStorageSync('userInfo').id
        },
        success(res) {
          console.log('member_info', res)
          _this.setData({
            userData: res.data.data
          })
        }
      })
    },
    clickSite(e) {
      console.log('clickSite', this.data)
      this.setData({
        siteTell: this.data.bstickyData.build_presence,
        houseData: { showSheet: true }
      })
    },
    onClose(e) {
      this.setData({
        houseData: { showSheet: false }
      })
    },
    clickTel(obj) {
      console.log('clickTel', obj, obj.currentTarget.dataset.item.member.phone)
      wx.makePhoneCall({
        phoneNumber: obj.currentTarget.dataset.item.member.phone,
      })
    },

    // onShareAppMessage: function (res) {
    //   console.log('onShareAppMessage', res)
    //   // if (res.from === 'button') {
    //   // }
    //   let path = ''
    //   let that = this
    //   if (that.data.bstickyData.type == 0) {//楼盘
    //     path = `/pages/buildDetail/index?customer=0&id=${wx.getStorageSync('userInfo').id}&build=${that.data.bstickyData.id}`
    //     console.log('楼盘')
    //   }else {
    //     path = `/pages/houseDetail/index?customer=0&id=${wx.getStorageSync('userInfo').id}&build=${that.data.bstickyData.id}&house=${that.data.bstickyData.id}`
    //     console.log('no楼盘')
    //   }
    //   // wx.showShareMenu({
    //   //   withShareTicket: true,
    //   // })
    //   return {
    //     title: '转发',
    //     path: path,
    //     imageUrl: '../../assets/images/share.png',
    //     success: function (res) {
    //       console.log('成功', res)
    //     },
    //     fail:function(res) {
    //       console.log('fail', res)
    //     }
    //   }
    // },

    // 保存海报功能，我不想再改
    //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
    createNewImg: function () {
      var that = this;
      var ctx = wx.createCanvasContext('mycanvas', that);
      var path1 = that.data.userPro;
      var pathGet = that.data.buildImg;
      var path2 = that.data.buildImg;
      var qrCode = that.data.xcxCode

      if(that.data.bstickyData.type == 2){
          // 邀请页面需要的时候，把路径都换成是固定的图片
          path2 = "../../assets/images/inviterbanner.jpeg"
      }
      
      console.log("查看加载参数",{
        path1,path2
      })
      

      // 绘制背景色
      ctx.setFillStyle('rgba(254, 218, 116, 1)')
      ctx.fillRect(0, 0, 375 * this.data.canvasUnit, 667 * this.data.canvasUnit)
      // 绘制头部文字
      ctx.setFillStyle('rgba(139, 87, 42, 1)')//文字颜色：默认黑色
      ctx.font = 'normal bold 18px 微软雅黑'//设置字体
      ctx.fillText(that.data.userName+'  为您推荐', 112 * this.data.canvasUnit, 50 * this.data.canvasUnit)//绘制为您推荐
      ctx.font = '14px 微软雅黑'//设置字体
      ctx.fillText('联系方式： ' + that.data.userPho, 112 * this.data.canvasUnit, 80 * this.data.canvasUnit)//绘制联系方式：
      ctx.font = '14px 微软雅黑'//设置字体
      ctx.fillText('长按识别查看更多户型信息', 115 * this.data.canvasUnit, 655 * this.data.canvasUnit)//绘制联系方式：
      ctx.draw(true)//绘制到canvas

      
      
      if(that.data.bstickyData.type != 2){
        // 非邀请页面时 绘制楼盘信息矩形消息填充在下面
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 331 * this.data.canvasUnit, 375 * this.data.canvasUnit, 185 * this.data.canvasUnit)

        // 绘制楼盘图片
        ctx.drawImage(path2, 0 * this.data.canvasUnit, 120 * this.data.canvasUnit, 375 * this.data.canvasUnit, 211 * this.data.canvasUnit)
        ctx.draw(true)//绘制到canvas
      }else{
        // 邀请页面时
        // 绘制邀请图片，
        ctx.drawImage(path2, 0 * this.data.canvasUnit, 120 * this.data.canvasUnit, 375 * this.data.canvasUnit, 390 * this.data.canvasUnit)
        ctx.draw(true)//绘制到canvas
      }
     
      //填充信息 模块
      if (that.data.bstickyData.type == 0) {    
        // 楼盘海报
        // 标签矩形框
        ctx.setStrokeStyle('rgba(0, 0, 0, 0.1)')
        ctx.strokeRect(24 * this.data.canvasUnit, 475 * this.data.canvasUnit, 40 * this.data.canvasUnit, 23 * this.data.canvasUnit)
        // 绘制楼盘信息 填充信息
        //黑色
        ctx.setFillStyle('#000')//文字颜色：默认黑色
        ctx.font = '24px 微软雅黑'//设置字体
        ctx.fillText(that.data.buildName, 24 * this.data.canvasUnit, 370 * this.data.canvasUnit)//绘制楼盘名称
        ctx.font = '14px 微软雅黑'//设置字体
        ctx.fillText(that.data.buildArea + 'm²', 58 * this.data.canvasUnit, 456 * this.data.canvasUnit)//绘制面积
        ctx.fillText(that.data.buildHouse, 195 * this.data.canvasUnit, 456 * this.data.canvasUnit)//绘制户型
        ctx.font = '11px 微软雅黑'//设置字体
        ctx.fillText(that.data.bstickyData.area.shortname, 28 * this.data.canvasUnit, 490 * this.data.canvasUnit)//绘制地区
        ctx.draw(true)//绘制到canvas
        //灰色
        ctx.setFillStyle('rgba(0, 0, 0, 0.65)')//文字颜色：默认黑色
        ctx.font = '12px 微软雅黑'//设置字体
        ctx.fillText('参考均价', 24 * this.data.canvasUnit, 400 * this.data.canvasUnit)//绘制均价
        ctx.fillText('参考总价', 160 * this.data.canvasUnit, 400 * this.data.canvasUnit)//绘制总价
        ctx.fillText('面积', 24 * this.data.canvasUnit, 455 * this.data.canvasUnit)//绘制面积
        ctx.fillText('户型', 160 * this.data.canvasUnit, 455 * this.data.canvasUnit)//绘制户型
        ctx.draw(true)//绘制到canvas
        ctx.save()//保存当前的绘图上下文。
        //红色
        ctx.setFillStyle('rgba(231, 76, 60, 1)')//文字颜色：默认黑色
        ctx.font = '18px 微软雅黑'//设置字体
        ctx.fillText(that.data.buildMoney + '万/平', 24 * this.data.canvasUnit, 425 * this.data.canvasUnit)//绘制均价
        ctx.fillText(that.data.buildPrice + '万/套', 160 * this.data.canvasUnit, 425 * this.data.canvasUnit)//绘制总价
        ctx.draw(true)//绘制到canvas
      }else if(that.data.bstickyData.type == 2){
        // 邀请页面 todo 暂时不做操作
      }else {       // 户型海报
        //黑色
        ctx.setFillStyle('#000')//文字颜色：默认黑色
        ctx.font = '24px 微软雅黑'//设置字体
        ctx.fillText(that.data.buildName, 24 * this.data.canvasUnit, 370 * this.data.canvasUnit)//绘制户型名称
        ctx.font = '18px 微软雅黑'//设置字体
        ctx.fillText(that.data.buildArea + 'm²', 120 * this.data.canvasUnit, 425 * this.data.canvasUnit)//绘制面积
        ctx.fillText(that.data.houseType, 220 * this.data.canvasUnit, 425 * this.data.canvasUnit)//绘制居室
        ctx.fillText(that.data.houseDirection, 60 * this.data.canvasUnit, 475 * this.data.canvasUnit)//绘制朝向
        // ctx.font = '11px 微软雅黑'//设置字体
        ctx.draw(true)//绘制到canvas
        //灰色
        ctx.setFillStyle('rgba(0, 0, 0, 0.65)')//文字颜色：默认黑色
        ctx.font = '12px 微软雅黑'//设置字体
        ctx.fillText('总价', 24 * this.data.canvasUnit, 400 * this.data.canvasUnit)//绘制总价
        ctx.fillText('面积', 120 * this.data.canvasUnit, 400 * this.data.canvasUnit)//绘制面积
        ctx.fillText('居室', 220 * this.data.canvasUnit, 400 * this.data.canvasUnit)//绘制居室
        ctx.fillText('朝向', 24 * this.data.canvasUnit, 475 * this.data.canvasUnit)//绘制朝向
        ctx.draw(true)//绘制到canvas
        ctx.save()//保存当前的绘图上下文。
        //红色
        ctx.setFillStyle('rgba(231, 76, 60, 1)')//文字颜色：默认黑色
        ctx.font = '18px 微软雅黑'//设置字体
        ctx.fillText(that.data.buildPrice + '万', 24 * this.data.canvasUnit, 425 * this.data.canvasUnit)//绘制总价
        ctx.draw(true)//绘制到canvas
      }

      // 绘制头像
      ctx.save()//保存当前的绘图上下文。
      ctx.beginPath()//开始创建一个路径
      ctx.arc(60 * this.data.canvasUnit, 60 * this.data.canvasUnit, 36 * this.data.canvasUnit, 0, 2 * Math.PI, false)//画一个圆形裁剪区域
      ctx.clip()//裁剪
      ctx.drawImage(path1, 24 * this.data.canvasUnit, 24 * this.data.canvasUnit, 72 * this.data.canvasUnit, 72 * this.data.canvasUnit)//绘制图片
      ctx.restore()//恢复之前保存的绘图上下文
      ctx.draw(true)//绘制到canvas
      // 绘制二维码
      ctx.save()//保存当前的绘图上下文。
      ctx.beginPath()//开始创建一个路径
      ctx.arc(190 * this.data.canvasUnit, 580 * this.data.canvasUnit, 50 * this.data.canvasUnit, 0, 2 * Math.PI, false)//画一个圆形裁剪区域
      ctx.clip()//裁剪
      ctx.drawImage(qrCode, 140 * this.data.canvasUnit, 530 * this.data.canvasUnit, 100 * this.data.canvasUnit, 100 * this.data.canvasUnit)//绘制图片
      ctx.restore()//恢复之前保存的绘图上下文
      ctx.draw(true)//绘制到canvas

      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            console.log('保存图片到本地', res)
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath,
              canvasHidden: true
            });
          },
          fail: function (res) {
            console.log(res);
          }
        }, that);
      }, 2000);
    },
    //点击保存到相册
    baocun: function () {
      console.log('baocun', this.data.imagePath)
      var that = this
      wx.saveImageToPhotosAlbum({
        filePath: that.data.imagePath,
        fileType: 'jpg',
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧分享给客户吧~',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                /* 该隐藏的隐藏 */
                that.setData({
                  maskHidden: false
                })
              }
            }, fail: function (res) {
              console.log(11111)
            }
          })
        }
      })
    },
    // 取消
    quxiao(e) {
      this.setData({
        maskHidden: false
      })
    },
    // 图片缓存本地
    getImageInfo(url, name) {    //  图片缓存本地的方法
      console.log('-----------------------------------------------------图片缓存本地的数据')
      console.log({url,name})
      console.log('-----------------------------------------------------图片缓存本地的数据')
      const that = this
      if (typeof url === 'string') {
        wx.getImageInfo({   //  小程序获取图片信息API
          src: url,
          success: function (res) {
            that.setData({
              [name]: res.path
            })
            console.log('图片缓存本地success', that)
          },
          fail(err) {
            console.log('图片缓存本地err',err)
          }
        })
      }
    },
    //点击生成海报
    formSubmit: function (e) {
      var that = this;
      this.setData({

      })

      console.log('bstickyData', that.data, getCurrentPages())
      // 获取屏幕适配
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            canvasUnit: res.windowHeight / 667
          })
          console.log('this.data.canvasUnit', that.data.canvasUnit, res)
        },
      })
      // 获取token二维码
      wx.getBackgroundFetchToken({
        success(res) {
          // let route = null
          // console.log('垃圾组件里面不知道要获取什么鬼页面', res, getCurrentPages()[1].route)
          // return false;
          const _this = this
          let scene = ''
          // 获取token
          wx.getBackgroundFetchToken({
            success(resToken) {
              console.log('周期拉取success', resToken)
              if (that.data.bstickyData.type == 0) {//楼盘
                scene = `customer=0&id=${wx.getStorageSync('userInfo').id}&build=${that.data.bstickyData.id}`
              } else if(that.data.bstickyData.type == 2){
                scene = `share_id=${wx.getStorageSync('userInfo').id}`
              }else {
                scene = `customer=0&id=${wx.getStorageSync('userInfo').id}&build=${that.data.bstickyData.id}&house=${that.data.bstickyData.id}`
              }
              wx.request({
                url: `${app.globalData.APIHTTP}api/qr_code`,
                header: {
                  Authorization: resToken.token,
                },
                method: 'POST',
                data: {
                  page: `${getCurrentPages()[1].route}`,
                  // scene: `customer=0&img=${wx.getStorageSync('userInfo').avatarUrl}&name=${wx.getStorageSync('userInfo').real_name}`,
                  scene: scene
                },
                success(res) {
                  console.log('qrcode', res)
                  that.getImageInfo(res.data.data, 'xcxCode')
                }
              })
            }
          })
        },
        fail(res) {
          wx.showToast({
            title: '登录过期...',
            icon: 'loading',
            duration: 1000
          });
          wx.navigateTo({
            url: `/pages/login/index`,
          })
        }
      })
      this.setData({
        userName: wx.getStorageSync('userInfo').real_name,
        userPho: wx.getStorageSync('userInfo').phone,
        maskHidden: false
      })
      if (that.data.bstickyData.type == 0) {    // 楼盘海报
        this.setData({
          buildName: that.data.bstickyData.name,
          buildPrice: that.data.bstickyData.average_price,
          buildMoney: that.data.bstickyData.total_price,
          buildArea: that.data.bstickyData.build_area,
          buildHouse: that.data.bstickyData.house_type_name,
        })
        that.getImageInfo(that.data.bstickyData.cover_image, 'buildImg')
      }else if(that.data.bstickyData.type == 2){

      }
       else { // 户型海报
        this.setData({
          buildName: that.data.bstickyData.name,
          buildPrice: that.data.bstickyData.money,
          buildArea: that.data.bstickyData.area,
          houseType: that.data.bstickyData.house_type.name + that.data.bstickyData.office + '厅' + that.data.bstickyData.kitchen + '厨' + that.data.bstickyData.toilet + '卫',
          houseDirection: that.data.bstickyData.direction
        })
        that.getImageInfo(that.data.bstickyData.cover_image, 'buildImg')
      }
      that.getImageInfo(wx.getStorageSync('userInfo').avatarUrl, 'userPro')
      wx.showToast({
        title: '生成海报中...',
        icon: 'loading',
        duration: 2000
      });
      setTimeout(function () {
        // wx.hideToast()
        that.createNewImg();
        that.setData({
          maskHidden: true
        });
      }, 2000)
    },

    // 防止冒泡
    canvasMove(e) {
      return false
    },

    // 客户咨询
    tapService(e) {
      console.log('tapService', e, this)
      const _this = this
      wx.makePhoneCall({
        phoneNumber: _this.data.userData.phone,
        success(res) {
          console.log('tapService success', res, e)
        },
        fail(res) {
          console.log('tapService fail', res, e)
        }
      })
    },
    // 报名看房
    tapGetUser(e) {
      const _this = this
      wx.getUserInfo({
        success(res) {
          console.log('getUserInfo', res, e)
          _this.setData({
            showDialog: true
          })
          wx.login({
            success(res_login) {
              // 存登录code
              wx.setStorageSync('userCode', res_login.code)
            },
            fail(res_login) {
              console.log('res_login fail', res, e)
            }
          })
          // 存微信信息
          wx.setStorageSync('info_encrypted', res.encryptedData)
          wx.setStorageSync('info_iv ', res.iv)
        },
        fail(res) {
          console.log('getUserInfo fail', res)
        }
      })
    },
    tapGetPhone(e) {
      const _this = this
      wx.makePhoneCall({
        phoneNumber: _this.data.userData.phone,
        success(res) {
          console.log('makePhoneCall success', res, e)
          wx.setStorageSync('pho_encrypted', e.detail.encryptedData)
          wx.setStorageSync('pho_iv', e.detail.iv)
        },
        fail(res) {
          console.log('makePhoneCall fail', res, e)
        }
      })
    },
    onCloseDialog() {
      this.setData({
        showDialog: false
      })
    }
  }
}) 