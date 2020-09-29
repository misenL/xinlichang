// pages/reportOrder/index.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

const typeArr = ['', '带看','认购', '成交']
const sexArr = ['', '男', '女']
const apiArr = ['', 'order_watch', 'order_subscribe', 'order_deal', '', 'order_subscribe']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '表单', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 25,
    twoTitle: '',
    formType: 0,      // 表单类型:10:已报备；20:已带看；30:已认购；40:已成交；50:认购取消；60:成交取消
    sexActions: [
      { name: '男', id: 0 },
      { name: '女', id: 1 },
    ],
    houseActions: [],
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']],
    multiIndex: [0,0],
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
    minHour: 0,
    maxHour: 23,
    // 户型
    showHouse: false,
    houseShow: false,
    houseActions: [
      { name: '户型1' },
      { name: '户型2' },
      { name: '户型3' },
      { name: '户型4' },
      { name: '户型5' },
    ],
    // 真实数据
    fileList: [],
    houseArr:[],
    orderId: null,
    formData: {},
    orderInfo: {},
    remarks: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('form onLoad', options)
    if (options.type==50){
      options.type=20
    }
    // else if() {

    // }
    this.setData({
      'nvabarData.title': typeArr[(options.type)/10]+'表单',
      twoTitle: typeArr[(options.type) / 10] +'信息',
      orderId: options.id,
    })
    this.getOrderData(options.type)
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
  // 获取订单信息
  getOrderData(type) {
    const _this = this

    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/${apiArr[type/10]}/${_this.data.orderId}`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            _this.setData({
              'formData.customer_name': res.data.data.order_report.customer_name,
              'formData.customer_phone': res.data.data.order_report.customer_phone,
              'formData.sex': sexArr[res.data.data.order_report.customer_sex],
              'formData.build': res.data.data.order_report.build.name,
              'formData.customer_card': res.data.data.order_report.customer_card,
              orderInfo: res.data.data,
              formType: res.data.data.order_state,
              houseActions: res.data.data.order_report.household
            })
            console.log('获取订单信息', res, _this.data.formData)
          },
          fail(res) {
            Toast.fail('网络错误!请刷新重试');
          }
        })
      },
    })
  },
  //确认带看
  confirmLook (e) {
    const _this = this
    // 拼接格式
    const houArr = []
    const imgArr = []
    this.data.houseArr.forEach(el => {
      houArr.push(el.id)
    })
    this.data.fileList.forEach(el => {
      imgArr.push(el.url)
    })
    this.setData({
      'formData.watch_household': houArr,
      'formData.appendix': imgArr,
      'formData.remarks': this.data.remarks,
      'formData.customer_sex': this.data.formData.sex==='男'?1:2
    })
    this.postApi()
  },
  // 提交认购
  confirmSub(e) {
    // 拼接格式
    const imgArr = []
    this.data.fileList.forEach(el => {
      imgArr.push(el.url)
    })
    this.setData({
      'formData.appendix': imgArr,
      'formData.remarks': this.data.remarks,
      'formData.customer_sex': this.data.formData.sex === '男' ? 1 : 2
    })
    this.postApi()
  },
  // 提交成交
  confirmDeal(e) {
    // 拼接格式
    const imgArr = []
    this.data.fileList.forEach(el => {
      imgArr.push(el.url)
    })
    this.setData({
      'formData.appendix': imgArr,
      'formData.remarks': this.data.remarks,
      'formData.customer_sex': this.data.formData.sex === '男' ? 1 : 2
    })
    this.postApi()
  },
  // post数据接口
  postApi() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/${apiArr[_this.data.formType / 10]}/${_this.data.orderId}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          data: {
            ..._this.data.formData
          },
          success(res) {
            console.log('提交成功', res)
            if (res.data.code === 200) {
              Toast.success('提交成功');
              wx.navigateTo({
                url: `/pages/orderInfo/index?id=${_this.data.orderId}`,
              })
            } else if (res.data.code === -100) {
              console.log('提交-100', res)
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


  // 性别弹框选择
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
      'formData.sex': e.detail.name
    })
  },
  // 户型弹框
  tapCheckHouse(e) {
    console.log('tapCheckHouse')
    this.setData({
      houseShow: true
    })
  },
  onHouseClose(e) {
    console.log('onHouseClose')
    this.setData({
      houseShow: false
    })
  },
  onHouseSelect(e) {
    console.log('onHouseSelect', e)
    this.setData({
      'formData.household_id': e.detail.id,
      'formData.household_name': e.detail.name
    })
  },

  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e, e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('bindMultiPickerColumnChange',e)
  },
  // 备注信息
  bindremarks(e) {
    console.log('bindremarks', e)
    this.setData({
      remarks: e.detail.value
    })
  },
  // 认购输入框
  tapSubInput(e) {
    console.log('tapSubInput', e)
    const str = 'formData.' + e.currentTarget.dataset.item
    this.setData({
      [str]: e.detail
    })
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
    this.setData({
      'formData.watch_date': new Date(event.detail).toLocaleDateString().replace(/\//g, "-"),
    });
    console.log('onInput', event, this.data.currentDate)

  },
  bindDateConfirm(e) {
    console.log('bindDateConfirm', e)
    this.setData({
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
    this.setData({
      'formData.watch_time': e.detail,
    });
  },
  bindTimeConfirm(e) {
    console.log('bindTimeConfirm', e)
    this.setData({
      timeShow: false,
    });
  },
  bindTimeCancel(e) {
    this.setData({
      timeShow: false,
    });
  },

  // 带看户型
  tapHouse(e) {
    console.log('tapHouse', e)
    let houArr = this.data.houseArr
    houArr.splice(e.currentTarget.dataset.item, 1)
    this.setData({
      houseArr: houArr
    })
  },
  showHouseSelect(e) {
    console.log('showHouseSelect', e)
    this.setData({
      showHouse: true,
    })
  },
  onCloseHouse(e) {
    console.log('onCloseHouse', e)
    this.setData({
      showHouse: false,
    })
  },
  onSelectHouse(e) {
    let houArr = this.data.houseArr
    houArr.push(e.detail)
    this.setData({
      houseArr: houArr
    })
    console.log('onSelectHouse', e, this.data.houseArr)
  },
  // 上传附件
  afterRead(event) {
    console.log('afterRead', event)
    const { file } = event.detail;
    const _this = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: `${app.globalData.APIHTTP}api/upload`, 
      filePath: file.path,
      name: 'filename',
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = _this.data;
        fileList.push({ ...file, url: JSON.parse(res.data).data });
        _this.setData({ fileList });
        console.log('afterRead res', JSON.parse(res.data), _this.data.fileList)
      },
    });
  },
  deleteImage(e) {
    console.log('deleteImage', e)
    let imgArr = this.data.fileList
    imgArr.splice(e.detail.index, 1)
    this.setData({
      fileList: imgArr
    })
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