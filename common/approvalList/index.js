const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';

Component({
  properties: {
    applistData: {   //applistData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    applistData: {},
    speedArr: ['/', '报备', '带看', '认购', '成交', '认购(已取消)', '成交(已取消)'],
    dateTypeArr: ['/', '报备', '带看', '认购', '成交', '取消', '取消'],
    examineArr: ['未审批', '部门主管审批', '负责人审批', '总经理审批','财务审批']
  },
  onLoad: function (options) {
  },
  // attached() {
  //   console.log('appList', this.data.applistData)
  // },
  methods: {
  // 驳回
  tapReject() {
      const _this = this
      // 获取token
      wx.getBackgroundFetchToken({
        success(resToken) {
          wx.request({
            url: `${app.globalData.APIHTTP}api/leader/order_reject/${_this.data.applistData.id}`,
            header: {
              Authorization: resToken.token,
            },
            method: 'POST',
            success(res) {
              console.log('tapReject', res)
              if (res.data.code !== 200) {
                Toast.fail(res.data.msg);
              } else {
                Toast.success('成功驳回!');
                _this.triggerEvent('childAppro')
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
            url: `${app.globalData.APIHTTP}api/leader/order_agree/${_this.data.applistData.id}`,
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
                _this.triggerEvent('childAppro')
              }
            },
            fail(res) {
              Toast.fail('同意失败!请刷新重试');
            }
          })
        },
      })
    },
    tapSeeInfo(e) {
      console.log('tapSeeInfo', e)
      wx.navigateTo({
        url: `/pages/orderInfo/index?id=${this.data.applistData.id}`,
      })

    }
  }

}) 