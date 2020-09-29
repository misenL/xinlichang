//index.js
//获取应用实例
const app = getApp()
let obj = null
let shortArr = []
let iconUrl = [
  '/pages/reportOrder/index', '/pages/leaderOrder/index', '/pages/leaderOrder/index', 
  '/pages/leaderOrder/index', '/pages/leaderOrder/index', '/pages/leaderOrder/index', 
  '/pages/leadList/index','/pages/computed/index'
]

Page({
  data: {
    // 头部导航组件所需的参数
    nvabarData: {
      showCapsule: 2, //是否显示左上角图标   1表示显示    0表示不显示  2坐标选框
      title: '新立场', //导航栏 中间的标题
      shortname: '定位中'
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    idType: 1, // 身份,1经纪人,2驻场,3部门主管,4业务负责人
    // 头部图标信息
    imagesOne: [{
        url: '../../assets/images/home1.png',
        name: '预约报备',
        label: 0
      },
      {
        url: '../../assets/images/home2.png',
        name: '报备订单',
        label: 1
      },
      {
        url: '../../assets/images/home3.png',
        name: '潜在客户',
        label: 6
      },
      {
        url: '../../assets/images/iconfdjsq.png',
        name: '房贷计算器',
        label: 7
      },
      // { url: '../../assets/images/home4.png', name: '团队邀请' }
    ],
    imagesTwo: [{
        url: '../../assets/images/home5.png',
        name: '已带看订单',
        label: 2
      },
      {
        url: '../../assets/images/home6.png',
        name: '已认购订单',
        label: 3
      },
      {
        url: '../../assets/images/home7.png',
        name: '已成交订单',
        label: 4
      },
      {
        url: '../../assets/images/home8.png',
        name: '全部订单',
        label: 5
      }
    ],
    //搜索
    search: '',
    //轮播图
    indicaColor: "#ccc",
    activeColor: "#fff",
    //筛选下拉框
    value1: 0,
    option1: [{
        text: '全部商品',
        value: 0
      },
      {
        text: '新款商品',
        value: 1
      },
      {
        text: '活动商品',
        value: 2
      },
    ],
    // 粘性判断
    isSticky: false,
    // 区域数据
    areaActiveKey: 0,
    cityLeftData: [],
    cityRightData: [{
      shortname: '不限',
      key: 0,
      checked: 1
    }, ],
    // 区域点击的样式判断
    styleKeyL: 0,
    styleKeyR: 0,
    styleKeyRArr: [],
    // 价格数据
    moneyData: [{
      text: '总价',
      children: [{
        text: '不限',
        id: 0,
        start: '',
        end: ''
      }],
    }],
    mainActiveIndex: 0,
    activeId: null,
    // 户型数据
    dropdownHosueData: [],
    // 更多数据
    dropOpen: [{
        name: '近期开盘',
        id: 0
      },
      {
        name: '未来一个月',
        id: 1
      },
      {
        name: '未来三个月',
        id: 2
      },
      {
        name: '未来半年',
        id: 3
      },
      {
        name: '过去一个月',
        id: 4
      },
      {
        name: '过去三个月',
        id: 5
      },
    ],
    // 楼盘数据
    buildData: [],
    slides: [
      {id:1,cover_image:'../../assets/images/无楼盘数据.png',sort: 1,type: 1,webview: ""}
    ], //  轮播图
    criteria: [],
    city_id: null,
    postData: {
      area_id: '',
      street_id: '',
      state: '',
      start_time: '',
      end_time: '',
      unit_start: '',
      unit_end: '',
      total_start: '',
      total_end: '',
      house_type_id: '',
      area_start: '',
      area_end: '',
      build_type_id: '',
      name: '',
    },
    page: 1,
    isPage: true,
    houseId: null,
    areaId: null,
    kaipanId: null,
    approNum: 0,
  },

  // 轮播图的跳转
  toHouseDetail(e){
    console.log("轮播图的跳转",e)
    wx.navigateTo({
      url: `/pages/buildDetail/index?buildid=${e.currentTarget.dataset.detail.id}`,
    })
  },

  // 切换城市时
  onCheckoutCity(city){
    // console.log("触发父犯法的切换")
    this.setData({
      buildData: [],
      page:1,
      isPage:true
    })
  },

  // 上拉加载
  onReachBottom(e) {
    if (!this.data.isPage) {
      return
    }
    const _this = this
    _this.setData({
      page: _this.data.page + 1
    })
    _this.getBuild('reach')
  },
  // 点击八个icon
  tapTop(e) {
    switch (e.currentTarget.dataset.label) {
      case 0:
      case 6:
        wx.navigateTo({
          url: iconUrl[e.currentTarget.dataset.label],
        })
        break;
      case 7:
        wx.navigateTo({
          url: iconUrl[e.currentTarget.dataset.label],
        })
        break;
      default:
        if (e.currentTarget.dataset.label == 5) {
          wx.setStorageSync('active', 0)
        } else {
          wx.setStorageSync('active', e.currentTarget.dataset.label)
        }
        wx.switchTab({
          url: iconUrl[e.currentTarget.dataset.label],
        })
        break;
    }

  },
  //事件处理函数
  onLoad: function () {
    console.log("进入onLoad")
    this.locationFun()
  },
  // 页面回退只会显示这个
  onShow: function (context) {
    console.log("进入onShow",context)
    this.locationFun()
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
  // 定位逻辑
  locationFun() {
    // console.log('index ', wx.getStorageSync('cityInfo'), wx.getStorageSync('userInfo') == '')
    // if (wx.getStorageSync('userInfo') == '') {
    //   return
    // }
    const _this = this
    _this.setData({
      idType: wx.getStorageSync('userType')
    })
    if (wx.getStorageSync('cityInfo') === '') {
      // 定位
      wx.getLocation({
        success: resLoc => {
          app.globalData.userLocation = resLoc.userLocation
          wx.request({
            url: `${app.globalData.APIHTTP}api/city_id`,
            method: 'POST',
            data: {
              lat: resLoc.latitude,
              lng: resLoc.longitude
            },
            success(resCity) {
              _this.setData({
                city_id: resCity.data.data.id,
                'nvabarData.shortname': resCity.data.data.shortname,
              })
              wx.setStorageSync('cityInfo', {
                id: resCity.data.data.id,
                shortname: resCity.data.data.shortname
              })
              _this.getPageData()
            }
          })
        },
      })
    } else {
      _this.setData({
        city_id: wx.getStorageSync('cityInfo').id,
        'nvabarData.shortname': wx.getStorageSync('cityInfo').shortname,
      })
      _this.getPageData()
    }
  },
  // 去订单页面
  tapGoOrder(e) {

  },
  getPageData() {
    const _this = this
    _this.getBuild()
    _this.getApproNum()
    wx.request({
      url: `${app.globalData.APIHTTP}api/banner?city_id=${this.data.city_id}`,
      success(res) {
        if(res.data.data.length !== 0){
          _this.setData({
            slides: res.data.data,
          })
        }
      }
    })
    wx.request({
      url: `${app.globalData.APIHTTP}api/search_criteria`,
      data: {
        city_id: _this.data.city_id
      },
      success(res) {
        console.log('search_criteria', res)
        const newArr = _this.data.moneyData
        res.data.data.total_price.forEach((el, idn) => {
          newArr[0].children.push({
            text: el.name,
            id: el.id,
            start: el.start,
            end: el.end
          })
        })
        _this.setData({
          criteria: res.data.data,
          moneyData: newArr
        })
      }
    })
  },
  getBuild(type) {
    const _this = this
    wx.showLoading({
      title: '加载数据中...',
    })
    wx.request({
      url: `${app.globalData.APIHTTP}api/build`,
      data: {
        city_id: _this.data.city_id,
        ..._this.data.postData,
        page: _this.data.page,
      },
      success(res) {
        console.log("楼盘参数",res)
        _this.setData({
          buildData: _this.data.buildData.concat(res.data.data.data),
        })
        wx.hideLoading()
        if (res.data.data.data.length === 0) {
          _this.setData({
            isPage: false
          })
          wx.showToast({
            title: '无更多数据',
            icon: 'success',
            duration: 1000
          })
        }

        // if (type === "reach") {
        //   if (res.data.data.data.length === 0) {
        //     _this.setData({
        //       isPage: false
        //     })
        //   } else {
        //     _this.setData({
        //       buildData: _this.data.buildData.concat(res.data.data.data),
        //     })
        //   }
        // } else {
        //   _this.setData({
        //     buildData: res.data.data.data
        //   })
        // }
      }
    })
  },
  // 获取审批
  getApproNum() {
    const _this = this
    // 获取token
    wx.getBackgroundFetchToken({
      success(resToken) {
        // console.log('周期拉取success', resToken)
        wx.request({
          url: `${app.globalData.APIHTTP}api/leader/operate_index`,
          header: {
            Authorization: resToken.token,
          },
          success(res) {
            _this.setData({
              approNum: res.data.data
            })
            // console.log('获取审批数量', res, _this.data)
          }
        })
      }
    })
  },
  // 跳转审核
  tapgoAppro() {
    wx.switchTab({
      url: '/pages/leaderOrder/index'
    })
  },
  // 搜索框事件
  onChange(e) {
    this.setData({
      search: e.detail,
    });
  },
  onSearch(e) {
    // console.log('onsearch', this.data.search)
    wx.navigateTo({
      url: `/pages/searchPage/index?search=${this.data.search}`,
    })
  },
  tapDropdown(e) {
    if (this.data.isSticky === true) {
      return false
    }
    // console.log('tapDropdown', e)
    const id = '#' + e.currentTarget.id
    const that = this
    this.selectComponent('#item1').toggle(false)
    this.selectComponent('#item2').toggle(false)
    this.selectComponent('#item3').toggle(false)
    this.selectComponent('#item4').toggle(false)
    wx.pageScrollTo({
      scrollTop: 600,
      duration: 300,
      complete: function (res) {
        that.setData({
          isSticky: true
        })
        setTimeout(() => {
          if (0 <= e.detail.x && e.detail.x <= 75) {
            that.selectComponent('#item1').toggle(true)
          } else if (76 <= e.detail.x && e.detail.x <= 150) {
            that.selectComponent('#item2').toggle(true)
          } else if (151 <= e.detail.x && e.detail.x <= 226) {
            that.selectComponent('#item3').toggle(true)
          } else {
            that.selectComponent('#item4').toggle(true)
          }
        }, 300)
      }
    })
  },
  openDropdown(e) {
    // console.log('openDropdown', e)
    this.setData({
      isSticky: true
    })
  },
  closeDropdown(e) {
    // console.log('closeDropdown', e)
  },
  onPageScroll(e) {
    if (e.scrollTop > 465) {
      this.setData({
        isSticky: true
      })
    } else {
      this.setData({
        isSticky: false
      })
    }
  },
  areaOnChange(e) {
    // console.log('areaOnChange', e)
  },
  // 区域函数
  cityLeftTap(e) {
    this.setData({
      styleKeyL: e.currentTarget.dataset.item.id,
      cityRightData: e.currentTarget.dataset.item.region,
      'postData.area_id': e.currentTarget.dataset.item.id
    })
    // console.log('cityLeftTap', e, this.data.postData)
  },
  moveFalse() {
    // console.log('moveFalse')
    // return true
  },
  cityRightTap(e) {
    let isCity = 0
    let idx = Number(e.currentTarget.dataset.idx)
    if (this.data.cityRightData[idx].checked == 0) {
      isCity = 1
      shortArr.push(e.currentTarget.dataset.item.id)
      this.setData({
        styleKeyR: e.currentTarget.dataset.item.id,
        ["cityRightData[" + idx + "].checked"]: isCity,
        'postData.street_id': shortArr.toString()
      })
    } else {
      isCity = 0
      const idx = shortArr.indexOf(e.currentTarget.dataset.item.id)
      shortArr.splice(idx, 1)
      this.setData({
        styleKeyR: 0,
        ["cityRightData[" + idx + "].checked"]: isCity,
        'postData.street_id': shortArr.toString()
      })
    }
    // console.log('cityRightTap', e, this.data.postData)
  },
  // 价格函数
  onClickNavMoney({
    detail = {}
  }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    })
    // console.log('onClickNavMoney', detail)

  },
  onClickItemMoney({
    detail = {}
  }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id
    this.setData({
      activeId,
      'postData.total_start': detail.start,
      'postData.total_end': detail.end,
    })
    // console.log('onClickItemMoney', detail)
  },
  // 户型函数
  onTapHouse(e) {
    this.setData({
      'postData.house_type_id': e.currentTarget.dataset.item.id,
      houseId: e.currentTarget.dataset.item.id
    })
    // console.log('onTapHouse', e.currentTarget.dataset.item.id, this.data.postData.house_type_id)
  },
  // 更多类型
  bindType(e) {
    // console.log('bindType', e)
    this.setData({
      'postData.build_type_id': e.currentTarget.dataset.item.id
    })
  },
  bindArea(e) {
    console.log('bindArea', e)
    this.setData({
      'postData.area_start': e.currentTarget.dataset.item.start,
      'postData.area_end': e.currentTarget.dataset.item.end,
      areaId: e.currentTarget.dataset.item.id
    })
  },
  bindState(e) {
    // console.log('bindState', e)
    this.setData({
      'postData.state': e.currentTarget.dataset.item
    })
  },
  bindOpenTime(e) {
    const myDate = new Date()
    // console.log('bindOpenTime kaipanId', e, this.formatDateTime(myDate, 6))
    switch (e.currentTarget.dataset.item.id) {
      case 1:
        this.setData({
          'postData.start_time': this.formatDateTime(myDate, 0),
          'postData.end_time': this.formatDateTime(myDate, 1)
        })
        break;
      case 2:
        this.setData({
          'postData.start_time': this.formatDateTime(myDate, 0),
          'postData.end_time': this.formatDateTime(myDate, 3)
        })
        break;
      case 3:
        this.setData({
          'postData.start_time': this.formatDateTime(myDate, 0),
          'postData.end_time': this.formatDateTime(myDate, 6)
        })
        break;
      case 4:
        this.setData({
          'postData.start_time': this.formatDateTime(myDate, -1),
          'postData.end_time': this.formatDateTime(myDate, 0)
        })
        break;
      case 5:
        this.setData({
          'postData.start_time': this.formatDateTime(myDate, -3),
          'postData.end_time': this.formatDateTime(myDate, 0)
        })
        break;
      default:
        this.setData({
          'postData.start_time': '',
          'postData.end_time': ''
        })
        break;
    }
    this.setData({
      kaipanId: e.currentTarget.dataset.item.id,
    })
  },
  formatDateTime(date, el) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1 + el;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  // 确认按钮
  dropConfirm(e) {
    // console.log('dropConfirm', e, this.data.postData)
    this.getBuild()
    this.selectComponent('#item1').toggle(false)
    this.selectComponent('#item2').toggle(false)
    this.selectComponent('#item3').toggle(false)
    this.selectComponent('#item4').toggle(false)
  },
  dropNoeChoose(e) {
    // console.log('dropNoeChoose', e, this.data.postData)
    this.setData({
      postData: {}
    })
    this.getBuild()
    this.selectComponent('#item1').toggle(false)
    this.selectComponent('#item2').toggle(false)
    this.selectComponent('#item3').toggle(false)
    this.selectComponent('#item4').toggle(false)
  },
})