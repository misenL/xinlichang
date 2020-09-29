// pages/computed/components/result/index.js
const app = getApp()
import config from "../../config.js"
import computed from "../../calculate.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    computedResult:Object
  },
  /**
   * 组件的初始数据
   */
  data: {
    ...config,
    height: app.globalData.height * 2 + 25,
    detail:null,
    type:0
  },
  ready(){
    console.log("进入ready")
    let mouthdataArray = this.properties.computedResult
    mouthdataArray.result.mouthdataArray = this.resetComputedData(mouthdataArray.result.mouthdataArray)
    this.setData({
      detail:mouthdataArray.detail,
      type:mouthdataArray.detail.type,
      computedResult:mouthdataArray,
    })
    console.log("result 组件接受的数据",this.properties.computedResult)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ...computed,
    showResult(e){
      this.triggerEvent('myevent', e, e)
    },
     // 选择本息还是本金
     showType(e){
      const datail = e.currentTarget.dataset
      this.setData({type:datail.type})
      // 调用计算方法
      this.handelComputed()
    },
    // 进行计算
    handelComputed(){
      let detail = this.data.detail
      const reKey = (keys) => {
         const data =  detail[keys[detail.calType]]
         return data
      }
      let result =null;
     
      if(detail.calType < 2){
        const num = reKey(['sdnum','gjjnum'])
        const year =reKey(['sdyear','gjjyear'])
        const lilv =reKey(['sdlilv','gjjlilv'])
        result = this.singleDk({type:Number(this.data.type)+1,num,year,lilv,calType:detail.calType})
      }else{
        detail.type = Number(this.data.type)+1
        result = this.singleDk(detail)
      }
      console.log("result 计算结果",result)
      let mouthdataArray = this.properties.computedResult
      mouthdataArray.result.mouthdataArray =  this.resetComputedData(result.mouthdataArray)
      this.setData({
        computedResult:mouthdataArray,
      })
      console.log("查看detail",this.data.detail)
      console.log("查看修改过后的结果",this.properties.computedResult)
    },
    // 重新排列计算数组的结果
    resetComputedData(mouthData){
        const date = new Date()
        // 12 - 当前的月份，为第一年的数据
        const end_key = 12 - (date.getMonth() + 1)+1
        let year = 1;
        // 截取前面的长度
        let data = [
          {year:1,data:mouthData.splice(0,end_key)}
        ]
        while(mouthData.length > 0){
          ++year;
          data.push({year,data:mouthData.splice(0,12)})
        }
        return data
    }
  }
})
