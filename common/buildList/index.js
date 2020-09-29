const app = getApp()
Component({
  properties: {
    buildDataitem: {   //buildData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    buildDataitem: {},
    buildTag: [
      // 支持样式01234
      { tagName: '白金会员', money: '17%', type: 2 },
      { tagName: '普通会员', money: '10%+2000元', type: 2 },
      // { tagName: '商铺', money: '7%', type: 2 },
      // { tagName: '写字楼', money: '2000元', type: 3 },
      // { tagName: '底商', money: '20000元', type: 4 },
    ],
    state:['未开盘','在售','售罄']
  },
  onLoad: function () {
    console.log('buildDataitem', this.data.buildDataitem)
  },
  methods: {
    buildListTap(e) {
      console.log('buildListTap', e.currentTarget.dataset.buildid)
      wx.navigateTo({
        url: `/pages/buildDetail/index?buildid=${e.currentTarget.dataset.buildid}`,
      })

    }
  }

}) 