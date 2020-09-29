const app = getApp()
Component({
  properties: {
    houseData: {   //houseData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    houseData: {
      isType: 0,  // 0表示用户，1表示经纪人
    }
  },
  onLoad: function() {
    console.log('houseList', houseData)
  },
  
  methods: {
    tapHouse() {
      console.log('houseList', this.data.houseData)
      wx.navigateTo({ 
        url: `/pages/houseDetail/index?buildId=${this.data.houseData.build_id}&&houseId=${this.data.houseData.id}`,
      })

    }
  }

}) 