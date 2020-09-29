// pages/computed/components/cindex/index.js
import config from "../../config.js"
import computed from "../../calculate.js"
const calDeatil = [
  {calName:"商业贷款",calRate:"商贷利率",calMoney:"贷款金额"},
  {calName:"公积金贷款",calRate:"公积金利率",calMoney:"贷款金额"},
  {calName:"组合贷款",calRate:"商贷利率",calMoney:"公积金贷款金额"},
]
const app = getApp()
Component({
  // 对外传值
  behaviors: ['wx://component-export'],
  export() {
    return { 
      result: this.data.result,
      detail:{
        type:this.data.type,
        sdnum:this.data.loan_money,
        gjjnum:this.data.gjj_money,
        sdyear:this.data.loan_year,
        gjjyear:this.data.gjj_year,
        sdlilv:this.data.loan_lil,
        gjjlilv:this.data.gjj_lil,
        calType:this.data.calType
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    ...config,
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 25,
    // 弹出框
    show: false,
    sheet_type:"loanTyle", // 弹出框的type ，直接根据字段名
    actions:[], // 弹出框内容
    
    // 贷款识别信息
    calName:"商业贷款",
    calType:0,      // 商业贷款 0 公积金 1 组合贷款 2
    type:0,         // 等额本息 0 等额本金 1
    click_type:0,   // 点击到的选择框的类型 

    // 贷款字段
    loan_year:20,  // 商业贷款年限
    gjj_year:20,   // 公积金贷款年限
    loan_lil:config.shangdaiSelect[0],    // 商业贷款的利率
    gjj_lil:config.gjjSelect[0],          // 公积金贷款利率
    loan_money:'',   // 贷款金额
    gjj_money:'',    // 公积金金额
    // 计算出来的结果
    result:{
      totalDknum:null,      // 总的贷款金额
      mouthdataArray:null,  // 每个月的信息
      totalLixi:'0.00',     // 支付利息
      totalPrice:'0.00',    //还款总贷
      year:null,            // 贷了多少年
      yuegong:'0.00',       //月供
      yuegongdijian:'0.00'  // 每月递减
    },  
  },
  ready(){
    // let loanyear = [];
    // for(let i = 0;i<30;i++){
    //   let key = i+1;
    //   loanyear.push({
    //     year:key,
    //     select:false,
    //     name:key
    //   })
    // }
    // this.setData({loanyear,})
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 计算用的方法
    ...computed,
    // 调用计算方法
    handelComputed(){
      let data = this.handelComposeData()
      let count = this.singleDk(data)
      this.setData({
        result:count
      })
      console.log("查看计算返回的结果",count)
    },
    // 构造数据解构
    handelComposeData(){
      let data = {
        calType:this.data.calType,
        type:Number(this.data.type)+1,
      }
      if(this.data.calType < 2){
        const key = ['loan_year','gjj_year'][this.data.calType];
        const lilv_key = ['loan_lil','gjj_lil'][this.data.calType]
        const num_key = ['loan_money','gjj_money'][this.data.calType]
        data = Object.assign(data,{
          num:this.data[num_key].length === 0 ? 0 :this.data[num_key] ,
          year:this.data[key],
          lilv:this.data[lilv_key],
        })        
      }else{
        // 组合贷款的数据
        data = Object.assign(data,{
          sdnum:this.data.loan_money,
          gjjnum:this.data.gjj_money,
          sdyear:this.data.loan_year,
          gjjyear:this.data.gjj_year,
          sdlilv:this.data.loan_lil,
          gjjlilv:this.data.gjj_lil
        })
      }
      return data
    },
    showResult(e){
      this.triggerEvent('myevent', e, e)
    },
    // 弹出贷款选择框 根据data-sheet 来决定弹出框显示
    showCalSheet(e){
      const datail = e.currentTarget.dataset
      if(datail.ltype !== void(0)){
        this.setData({
          click_type:datail.ltype
        })
      }
      this.setData({ 
        actions:this.data[datail.sheet],
        sheet_type:datail.sheet,
        show: true,
      });
    },

    // 弹出框选择事件
    onSelectSheet(e){
      const detail = e.detail
      switch(this.data.sheet_type){
        case 'loanTyle':
            // 贷款类型
            let data = calDeatil[detail.type]
            data.calType = detail.type
            this.setData(data);
            break;
        case 'loanyear':
          // 年限  // 商业贷款 0 公积金 1 
          const filed = ['loan_year','gjj_year']
          const key = filed[this.data.click_type]
          let update_data = {} 
          update_data[key] = detail.year
          this.setData(update_data)
          break;
        case 'gjjSelect':
          // 公积金利率
          this.setData({
            gjj_lil:detail
          })
          break;
        case 'shangdaiSelect':
          // 商业贷款利率
          this.setData({
            loan_lil:detail
          })
          break;
        default:
          break;
      }
      this.handelComputed()
      this.setData({show:false})
    },

    // 选择本息还是本金
    showType(e){
      const datail = e.currentTarget.dataset
      this.setData({type:datail.type})
      // 调用计算方法
      this.handelComputed()
    },
  }
})
