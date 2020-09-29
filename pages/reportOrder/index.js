// pages/reportOrder/index.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '预约报备', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 25,
    sexShow: false,
    sexActions: [
      { name: '男', id: 1 },
      { name: '女', id: 2 },
    ],
    // 时间
    dateShow: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    timeShow: false,
    currentTime: '12:00',
    minHour: new Date().getHours(),
    maxHour: 23,
    minMinute:new Date().getMinutes(),

    // 真实数据
    formData: {},
    sex: '',
    cityList: [],
    region: [],
    reginStr: '',
    // 判断是否已选区域
    isCity: false,
    selectArray: [],
    index: '',
    buildStr: '',
    remarks: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //设置最小时间
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
  bindremarks(e) {
    this.setData({
      'formData.remarks': e.detail.value
    })
  },
  // get信息
  getReportData() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/order_report`,
          header: {
            Authorization: resToken.token,
          },
          data: {
            city: _this.data.region[1],
            area: _this.data.region[2],
          },
          success(res) {
            console.log('getReportData', res)
            _this.setData({
              selectArray: res.data.data,
              isCity: true
            })

          }
        })
      },
    })
  },
  // 提交报备
  confirmReport() {
    this.setData({
      formData: { ...this.data.formData, report_city: this.data.region[1], report_area: this.data.region[2],}
    })
    console.log('confirmReport', this.data.formData)
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/order_report`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          data: {
            ..._this.data.formData
          },
          success(res) {
            if (res.data.code === 200) {
              Toast.success('提交成功');
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else if (res.data.code === -100) {
              Toast.fail(res.data.msg);
            } else {
              let key = Object.keys(res.data.errors)
              let value = res.data.errors[key[0]]
              Toast.fail(`${value[0]}`);
            }
          },
          fail(res) {
            Toast.fail(res.errMsg);
          }
        })
      }
    })
  },
  // 性别弹框
  tapCheckSex(e) {
    console.log('tapCheckSex')
    this.setData({
      sexShow: true
    })
  },
  onSexClose(e) {
    console.log('onSexClose')
    this.setData({
      sexShow: false
    })
  },
  onSexSelect(e) {
    console.log('onSexSelect', e)
    this.setData({
      sex: e.detail.name,
      'formData.customer_sex': e.detail.id
    })
  },
  // 客户信息输入框
  inputReport(e) {
    const str = 'formData.' + e.currentTarget.dataset.item
    this.setData({
      [str]: e.detail
    })
  },
  // 选择楼盘区域
  bindRegionChange(e) {
    console.log('picker选择楼盘区域为', e, e.detail.value)
    this.setData({
      region: e.detail.value,
      reginStr: e.detail.value[1] + ' ' + e.detail.value[2]
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('bindMultiPickerColumnChange',e)
  },
  bindPickerChange(e) {
    console.log('bindPickerChange', e)
    this.setData({
      buildStr: this.data.selectArray[Number(e.detail.value)].name,
      formData: { ...this.data.formData, report_build_id: this.data.selectArray[Number(e.detail.value)].id }
    })
  },
  // 选择报备楼盘
  tapBuild(e) {
    console.log('tapBuild', e)
    if (this.data.region.length===0) {
      Toast.fail('请先选择楼盘区域！');
      this.setData({
        isCity: false
      })
    }else {
      this.getReportData()
    }
  },
  // 报备时间
  tapShowDate(e) {
    console.log('tapShowDate', e)
    this.setData({
      dateShow: true,
    });
  },
  tapShowTime(e) {
    console.log('tapShowTime', e)
    this.setData({
      timeShow: true,
    });
  },
  onInput(event) {
    console.log('onInput', event)
    this.setData({
      currentDate: event.detail,
    });
    console.log('onInput', event, this.data.currentDate)

  },
  bindDateConfirm(e) {
    console.log('bindDateConfirm', e)
    this.setData({
      'formData.report_date': new Date(e.detail).toLocaleDateString().replace(/\//g, "-"),
      dateShow: false,
    });
  },
  bindDateCancel(e) {
    console.log('bindDateCancel', e)
    this.setData({
      dateShow: false,
    });
  },
  bindPopupClose(e) {
    console.log('bindPopupClose', e)
    this.setData({
      dateShow: false,
    });
  },
  bindPopupTimeClose(e) {
    this.setData({
      timeShow: false,
    });
  },
  onInputTime(e) {
    console.log('onInputTime', e)

  },
  bindTimeConfirm(e) {
    console.log('bindTimeConfirm', e)
    this.setData({
      'formData.report_time': e.detail,
      timeShow: false,
    });
  },
  bindTimeCancel(e) {
    this.setData({
      timeShow: false,
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