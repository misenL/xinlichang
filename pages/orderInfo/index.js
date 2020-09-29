// pages/orderInfo/index.js

const app = getApp()
const apiArr = ['', '', '', '', '', 'order_subscribe_again','order_deal_again']
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStates: 0,   // 0认购还是   1成交
    idType: 0,      // 1自我提交， 0他人提交   2是已处理的，没有按钮
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '订单详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    previewShow: false,
    previewImg: '',
    imagesArr: [
      { url: '../../assets/test.jpg' },
      { url: '../../assets/test.jpg' },
      { url: '../../assets/t3.png' },
      { url: '../../assets/t3.png' },
      { url: '../../assets/test.jpg' },
    ],
    // 真实数据
    speedArr: ['/', '报备', '带看', '认购', '成交', '认购(取消)', '成交(取消)'],
    speedTwoArr: ['/', '', '', '', '', '认购(已取消)', '成交(已取消)'],
    examState: [
      {},
      { icon: '../../assets/icon/processL.png', label: '审核中' },
      { icon: '../../assets/icon/processC.png', label: '已同意' },
      { icon: '../../assets/icon/processB.png', label: '已驳回' },
      { icon: '../../assets/icon/processB.png', label: '已撤销' },
    ],
    orderInfo: [],
    userType: 0,
    showModifyCom: false,
    newCommission: null,
  },
  // 复制报备信息
  copyReport(e) {
    console.log('copyReport', this.data.orderInfo)
    const data = this.data.orderInfo.order_report
    const _this = this
    wx.setClipboardData({
      data: '报备项目：' + data.build.name
        + '\n公司名称：新立场'
        + '\n经纪人：' + (_this.data.orderInfo.agent.real_name || '')
        + '\n经纪人电话：' + (_this.data.orderInfo.agent.phone || '')
        + '\n客户名称：' + (data.customer_name || '')
        + '\n客户电话：' + (data.customer_phone || '')
        + '\n客户到访时间：' + (data.report_date || '') + ' ' + (data.report_time || '')
        + '\n到访人数：',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userType: wx.getStorageSync('userType'),
    })
    if (this.data.userType !== 3 && this.data.userType!==4) {
      this.getOrderData(options.id)
    }else {
      this.getApproData(options.id)

    }
    console.log('orderIfon', options, this.data.userType )
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
  getOrderData(id) {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        console.log('周期拉取success', resToken)
        wx.request({
          url: `${app.globalData.APIHTTP}api/order/${id}`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            _this.setData({
              orderInfo: res.data.data
            })
            console.log('获取订单信息', res, _this.data)
          }
        })
      }
    })
  },
  // 获取审批信息
  getApproData(id) {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        console.log('周期拉取success', resToken)
        wx.request({
          url: `${app.globalData.APIHTTP}api/leader/order/${id}`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            _this.setData({
              orderInfo: res.data.data
            })
            console.log('获取审批信息', res, _this.data)
          }
        })
      }
    })
  },
  // 图片
  tapImage(e) {
    console.log('tapImage', e)
    this.setData({
      previewShow: true,
      previewImg: e.currentTarget.dataset.url
    })
  },
  onClosePopup(e) {
    console.log('onClosePopup', e)
    this.setData({
      previewShow: false
    })
  },
  // 修改佣金
  // 弹框
  tapModifyCommission() {
    console.log('tapModifyCommission')
    this.setData({
      showModifyCom: true,
      newCommission: null,
    })
  },
  // 输入框
  tapComInput(e) {
    console.log('tapComInput', e)
    this.setData({
      newCommission: e.detail
    })
  },
  // 保存
  onConfirmCommission() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/change_actual_commission/${_this.data.orderInfo.id}`,
          header: {
            Authorization: resToken.token,
          },
          data: {
            actual_commission: _this.data.newCommission
          },
          method: 'POST',
          success(res) {
            Toast.success('修改成功!');
            _this.getOrderData(_this.data.orderInfo.id)
            _this.setData({
              showModifyCom: false,
              newCommission: null,
            })
          },
          fail(res) {
            Toast.fail('修改失败!请刷新重试');
          }
        })
      },
    })
  },
  // 关闭
  onCloseCommission() {
    this.setData({
      showModifyCom: false,
    })
  },
  // 确认报备
  tapReport(e) {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/confirm/${_this.data.orderInfo.id}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          success(res) {
            console.log('getCityInfo', res)
            Toast.success('报备成功!');
            _this.getOrderData(_this.data.orderInfo.id)
          },
          fail(res) {
            Toast.fail('报备失败!请刷新重试');
          }
        })
      },
    })
  },
  // 带看
  tapTakeLook(e) {
    wx.navigateTo({
      url: `/pages/formInput/index?id=${this.data.orderInfo.id}&type=${this.data.orderInfo.order_state}`,
    })
  },
  // 认购
  tapSubscription (e) {
    wx.navigateTo({
      url: `/pages/formInput/index?id=${this.data.orderInfo.id}&type=${this.data.orderInfo.order_state}`,
    })
  },
  // 提交取消申请
  tapApply(e) {
    wx.navigateTo({
      url: `/pages/cancelOrder/index?id=${this.data.orderInfo.id}&type=${this.data.orderInfo.order_state}`,
    })
  },
  // 下一步（成交）
  tapDeal(e) {
    wx.navigateTo({
      url: `/pages/formInput/index?id=${this.data.orderInfo.id}&type=${this.data.orderInfo.order_state}`,
    })
  },
  // 成交取消申请
  tapCancel(e) {
    wx.navigateTo({
      url: `/pages/cancelOrder/index?id=${this.data.orderInfo.id}&type=${this.data.orderInfo.order_state}`,
    })
  },
  // 撤回审批
  tapWithdraw() {
    const _this = this
    console.log('tapWithdraw', _this.data.orderInfo)
    let urlMisen = ''
    _this.data.orderInfo.order_state == 50 ? urlMisen = 'order_subscribe_revoke' : urlMisen = 'order_deal_again'
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/${urlMisen}/${_this.data.orderInfo.id}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          success(res) {
            console.log('tapReject', res)
            if (res.data.code !== 200) {
              Toast.fail(res.data.msg);
            } else {
              Toast.success('撤回成功!');
              wx.switchTab({
                url: '/pages/leaderOrder/index',
              })
            }
          },
          fail(res) {
            Toast.fail('撤回失败!请刷新重试');
          }
        })
      },
    })
  },
  // 驳回
  tapReject() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/leader/order_reject/${_this.data.orderInfo.id}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          success(res) {
            console.log('tapReject', res)
            if(res.data.code !== 200) {
              Toast.fail(res.data.msg);
            }else {
              Toast.success('成功驳回!');
              _this.getOrderData(_this.data.orderInfo.id)
            }
          },
          fail(res) {
            Toast.fail('驳回失败!请刷新重试');
          }
        })
      },
    })
  },
  // 同意
  tapAgree() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/leader/order_agree/${_this.data.orderInfo.id}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          success(res) {
            console.log('tapAgree', res)
            if (res.data.code !== 200) {
              Toast.fail(res.data.msg);
            } else {
              Toast.success('已同意!');
              _this.getOrderData(_this.data.orderInfo.id)
            }
          },
          fail(res) {
            Toast.fail('同意失败!请刷新重试');
          }
        })
      },
    })
  },

  // 重新提交
  tapAgain() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        wx.request({
          url: `${app.globalData.APIHTTP}api/stay/${apiArr[_this.data.orderInfo.order_state/10]}/${_this.data.orderInfo.id}`,
          header: {
            Authorization: resToken.token,
          },
          method: 'POST',
          success(res) {
            wx.navigateTo({
              url: `/pages/cancelOrder/index?id=${_this.data.orderInfo.id}&type=${_this.data.orderInfo.order_state}`,
            })
          },
          fail(res) {
            Toast.fail('网络错误!请刷新重试');
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