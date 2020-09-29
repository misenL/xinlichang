const app = getApp()
Component({
  properties: {
    hintroduceData: {   //hintroduceData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    hintroduceData: {
      isType: 0,  // 0表示用户，1表示经纪人
    }
  },
  onLoad: function() {
    console.log('houseList', hintroduceData)
  },
  methods: {
    tapHouse() {
      console.log('houseList', this.data.hintroduceData)
      wx.navigateTo({
        url: `/pages/houseDetail/index?buildId=${this.data.hintroduceData.build_id}&&houseId=${this.data.hintroduceData.id}`,
      })

    }
  }

}) 