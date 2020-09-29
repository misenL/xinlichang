//buildDetail.js
//获取应用实例
const app = getApp()
const scrollTopArr = [440, 526, 921, 1001]
Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '楼盘详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    // houst组件接受参数
    houseData: {
      isType: 1,
    },
    // 底部粘性数据
    bstickyData: {
      showSheet: false,
      call:true,
    },
    // 户型介绍list
    hintroduceData: {
      isType: 1
    },
    active: 0,
    houseActive: 0,
    scrollLeft: 0,
    buildDetailData: [],
    buildId: null,
    userType: 0,
    startTime: 0,
    endTime: 0,
  },

  onLoad: function (option) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    // 路由传参
    // console.log('option', option)
    const _this = this
    if (wx.getStorageSync('customer') == 0) {
      // 客户
      this.setData({
        scrollLeft: 0,
        buildId: wx.getStorageSync('build') | wx.getStorageSync('buildid'),
        userType: wx.getStorageSync('customer')
      })
      // console.log('buildDetail customer 0')
    }else {
      // 内部
      this.setData({
        scrollLeft: 0,
        buildId: option.buildid,
        userType: wx.getStorageSync('customer')
      })
      // console.log('buildDetail customer 1')
    }
    wx.request({
      url: `${app.globalData.APIHTTP}api/build/${_this.data.buildId}`,
      success(res) {
        let data = res.data.data
        data.nearby = data.nearby.replace(/\r\n/ig, '\n')
        console.log("获取信息",data)
        _this.setData({
          buildDetailData: data,
          bstickyData: { ...data, type: 0, customer: wx.getStorageSync('customer') }
        })
      }
    })
  },
  // 打开导航
  toOpenLocation(e) {
    const _this = this
    // console.log('toOpenLocation', e, _this.data.buildDetailData)
    wx.openLocation({
      latitude: Number(_this.data.buildDetailData.map[0]),
      longitude: Number(_this.data.buildDetailData.map[1]),
      name: _this.data.buildDetailData.name,
      address: _this.data.buildDetailData.address,
      scale: 18
    })
  },
  // 下拉
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    wx.hideNavigationBarLoading(); //完成停止加载图标
    wx.stopPullDownRefresh({
      complete: (res) => {
        // console.log('stopPullDownRefresh complete', res)
      }
    })
  },
  // Y 滚动事件
  onPageScroll: function (e) {
    if (440 < Number(e.scrollTop) && Number(e.scrollTop) < 525) {
      this.setData({
        active: 0
      })
    } else if (526 < Number(e.scrollTop) && Number(e.scrollTop) < 920) {
      this.setData({
        active: 1
      })
    } else if (921 < Number(e.scrollTop) && Number(e.scrollTop) < 1000) {
      this.setData({
        active: 2
      })
    } else if (Number(e.scrollTop) && Number(e.scrollTop) > 1001) {
      this.setData({
        active: 3
      })
    }
  },
  // X 滚动事件
  scroll(e) {
    // 260px一个list
    // console.log('scroll', e.detail, this.data.houseActive, this.data.buildDetailData.house_type[this.data.houseActive])
    if (0 < Number(e.detail.scrollLeft) && Number(e.detail.scrollLeft) < this.data.buildDetailData.house_type[this.data.houseActive].nums * 260) {
      this.setData({
        houseActive: 1
      })
    } else if (this.data.buildDetailData.house_type[this.data.houseActive].nums * 260 < Number(e.detail.scrollLeft) && Number(e.detail.scrollLeft) < this.data.buildDetailData.house_type[this.data.houseActive - 1].nums * 260) {
      this.setData({
        houseActive: 2
      })
    } else if (this.data.buildDetailData.house_type[this.data.houseActive - 1].nums * 260 < Number(e.detail.scrollLeft) && Number(e.detail.scrollLeft) < this.data.buildDetailData.house_type[this.data.houseActive - 1].nums * 260) {
      this.setData({
        houseActive: 3
      })
    }
  },
  // tab页切换
  onclick(e) {
    this.setData({
      active: e.detail.index,
    })
    wx.pageScrollTo({
      scrollTop: scrollTopArr[e.detail.index],
      duration: 300
    })
  },
  houseOnclick(e) {
    // console.log('eeee', e, this.data.buildDetailData.house_type[e.detail.index].nums)
    const houseList = this.data.buildDetailData.house_type
    let add = 0
    houseList.forEach((el, ind) => {
      if (ind < e.detail.index) {
        add += el.nums
      } else {
        return false
      }
    })
    this.setData({
      houseActive: e.detail.index,
      scrollLeft: 260 * add
    })
  },
  tapGoMore() {
    wx.navigateTo({
      url: `/pages/buildInfo/index?id=${this.data.buildId}`,
    })
  },
  tapGoAllHouse() {
    wx.navigateTo({
      url: `/pages/houseList/index?id=${this.data.buildId}`,
    })
  },
  // 跳转楼盘动态页面
  toBuildTrend() {
    wx.navigateTo({
      url: `/pages/buildTrend/index?id=${this.data.buildId}&title=${this.data.buildDetailData.name}`,
    })
  },

  
  // 记录时间
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    // let timestamp = Date.parse(new Date())/1000;
    this.setData({
      startTime: Date.parse(new Date()) / 1000
    })
    // console.log('startTime', this.data, this.data.startTime)
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {


    // 尝试获取转发参数
    this.setData({
      endTime: Date.parse(new Date()) / 1000
    })
    // console.log('endTime', this.data.endTime)
    const buiInfo = this.data.buildDetailData
    const _this = this
    // 保存数据
    wx.request({
      url: `${app.globalData.APIHTTP}api/customer_info`,
      method: 'POST',
      data: {
        code: (wx.getStorageSync('userCode')||''),
        phone_iv: (wx.getStorageSync('pho_iv')||''),
        phone_encryptedData: (wx.getStorageSync('pho_encrypted')||''),
        info_iv: (wx.getStorageSync('info_iv ')||''),
        info_encryptedData: (wx.getStorageSync('info_encrypted')||''),
        household_id : '',
        build_id: buiInfo.buildId,
        member_id: (wx.getStorageSync('id')||''),
        residence_time: (_this.data.endTime - _this.data.startTime),
        type: (wx.getStorageSync('pho_iv') !== '' || wx.getStorageSync('info_iv') !== '')?1:2
      },
      success(res) {
        // console.log('customer_info', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  onShareAppMessage: function (res) {
    let that = this
    console.log(wx.getStorageSync('userInfo').id)
    return {
      title: '新立场经纪人',
      path: `/pages/buildDetail/index?customer=0&scene=6&id=${wx.getStorageSync('userInfo').id}&buildid=${that.data.buildId}`,
      imageUrl: '../../assets/images/share.png',
      success: function (res) {
        // console.log('成功', res)
      },
      fail:function(res) {
        // console.log('fail', res)
      },
      complete:function(res) {
        // console.log('complete', res)
      },
    }
  }

})