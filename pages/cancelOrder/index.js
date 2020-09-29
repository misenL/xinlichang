// pages/cancelOrder/index.js

//获取应用实例
const app = getApp()
const typeArr = ['', '', '', '认购', '成交', '认购','成交']
const apiArr = ['', '', '', 'order_subscribe_cancel', 'order_deal_cancel','', 'order_deal_again']
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    fileList: [],
    cancelType: 0,    // 取消类型0成交1认购。在onload修改
    // 真实数据
    orderInfo: {},
    orderId: null,
    formType: null,
    speedArr: ['/', '报备', '带看', '认购', '成交', '认购(已取消)', '成交(已取消)'],
    remarks: '',
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
  // 删除图片
  deleteImage(e) {
    console.log('deleteImage', e)
    let imgArr = this.data.fileList
    imgArr.splice(e.detail.index, 1)
    this.setData({
      fileList: imgArr
    })
  },
  // 备注信息
  bindremarks(e) {
    console.log('bindremarks', e)
    this.setData({
      remarks: e.detail.value
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('取消申请' ,options)
    this.setData({
      'nvabarData.title': typeArr[(options.type)/10]+'取消申请',
      cancelType: ((options.type) / 10-5),
      orderId: options.id
    })
    this.getOrderData(options.type)
  },
  // 获取订单信息
  getOrderData(type) {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/order/${_this.data.orderId}`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            _this.setData({
              orderInfo: res.data.data,
              formType: res.data.data.order_state
            })
            console.log('获取订单信息', res)
          },
          fail(res) {
            Toast.fail('网络错误!请刷新重试');
          }
        })
      },
    })
  },
  // 取消
  tapcancel(e) {
    wx.switchTab({
      url: '/pages/leaderOrder/index'
    })
  },
  // 提交
  tapConfirm(e) {
    console.log('tapConfirm', this.data.formType)
    const imgArr = []
    this.data.fileList.forEach(el => {
      imgArr.push(el.url)
    })
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/${apiArr[_this.data.formType/10]}/${_this.data.orderId}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          data: {
            appendix: imgArr,
            remarks: _this.data.remarks
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
      },
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