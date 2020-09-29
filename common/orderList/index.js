const app = getApp()
Component({
  properties: {
    orderData: {   //orderData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    orderData: {},
    speedArr: ['/', '报备', '带看', '认购', '成交', '认购(取消)', '成交(取消)'],
    speedTwoArr: ['/', '', '', '', '', '认购(已取消)', '成交(已取消)'],
    userType: wx.getStorageSync('userType')
  },
  onLoad: function (options) {
  },
  methods: {
    tapSeeInfo(e) {
      console.log('tapSeeInfo', e, this.data.orderData)
      wx.navigateTo({
        url: `/pages/orderInfo/index?id=${this.data.orderData.id}`,
      })
    },
    // 复制报备信息
    copyReport(e) {
      console.log('copyReport', this.data.orderData)
      const data = this.data.orderData.order_report
      const _this = this
      wx.setClipboardData({
        data: '报备项目：' + data.build.name 
          +'\n公司名称：新立场'
          + '\n经纪人：' + (_this.data.orderData.agent.real_name || '')
          + '\n经纪人电话：' + (_this.data.orderData.agent.phone || '')
          + '\n客户名称：' + (data.customer_name || '')
          + '\n客户电话：' + (data.customer_phone || '')
          + '\n客户到访时间：' + (data.report_date || '') + ' ' + (data.report_time || '')
          +'\n到访人数：',
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
    }
  },
  attached() {
    this.setData({
      userType: wx.getStorageSync('userType')
    })
    // console.log('attached', this.data)
  }

}) 