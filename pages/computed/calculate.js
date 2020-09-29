/***
 * @author PJ
 */
import {deepClone} from "../../utils/util"
var calcute = {
    /**
     * @description         商贷-公积金贷款统一函数
     * @param {*} type      type:1等额本息 2等额本金，lilv：贷款基准利率
     * @param {*} num       贷款金额
     * @param {*} year      贷款年限，
     * @param {*} lilv      lilv 的算法是年份的利率 * 选择到的商贷利率
     * @param {*} calType   商业贷款 0 公积金 1 组合贷款 2
     */
    singleDk: function (detail) {
        console.log("需要计算数据",detail)
        var _this = this;
        detail = deepClone(detail);
        // type:1等额本息 2等额本金
        if(detail.calType < 2){
            detail.lilv = this.lilvComputed(detail.lilv,detail.year,detail.calType)
            if (detail.type == 1) {
                return _this.benxi(detail.type, detail.num, detail.year, detail.lilv)
            } else if (detail.type == 2) {
                return _this.benjin(detail.type, detail.num, detail.year, detail.lilv)
            }
        }else{
            detail.sdlilv = this.lilvComputed(detail.sdlilv,detail.sdyear,0)    // 商业贷款的利率
            detail.gjjlilv = this.lilvComputed(detail.gjjlilv,detail.gjjyear,1) // 公积金的利率
            detail.gjjnum = detail.gjjnum | 0
            detail.sdnum = detail.sdnum | 0
            console.log("组合完成的计算数据",detail)
            return _this.zuhe(detail.type,detail.sdnum,detail.gjjnum,detail.sdyear,detail.gjjyear,detail.sdlilv,detail.gjjlilv)
        }
    },
    

    /**
     * @description 计算利率 lilv 的算法是年份的利率 * 选择到的商贷利率
     * @param {*} lilv 
     * @param {*} year 
     * @param {*} calType  商业贷款 0 公积金 1
     */
    lilvComputed:function(lilv,year,calType){
        const config = require("./config.js").default
        const lilv_year = config[['shangdaiLilv','gjjLilv'][calType]]
        console.log("修改前的数组",lilv_year)
        let lilv_computed = null
        
        switch (calType) {
            case 0:
                // 商业
                if(year == 1){
                    lilv_computed=lilv_year[0]
                }else if(year>=2 && year < 6){
                    lilv_computed=lilv_year[1]
                }else if(year >= 6){
                    lilv_computed=lilv_year[2]
                }
                break;
            default:
                // 公积金
                if(year == 1 && year  < 6){
                    lilv_computed=lilv_year[0]
                }else{
                    lilv_computed=lilv_year[1]
                }
                break;
        }
        return lilv.lilv * lilv_computed.lilv
    },
    
    /**
     * @param {*} type      type:1等额本息 2等额本金
     * @param {*} sdnum     商业贷款的金额
     * @param {*} gjjnum    公积金贷款的金额
     * @param {*} sdyear    商业贷款的年限
     * @param {*} gjjyear   公积金贷款的年限
     * @param {*} sdlilv    商业贷款的利率
     * @param {*} gjjlilv   公积金贷款的利率
     */
    zuhe: function (type, sdnum, gjjnum, sdyear, gjjyear, sdlilv, gjjlilv) {
        var _this = this,
            year = sdyear > gjjyear ? sdyear : gjjyear;
        if (type == 1) {
            var sdObj = _this.benxi(type, sdnum, sdyear, sdlilv);
            var gjjObj = _this.benxi(type, gjjnum, gjjyear, gjjlilv);
            if (sdObj.mouthdataArray.length > gjjObj.mouthdataArray.length) {
                var mergemouthdataArray = sdObj.mouthdataArray.map(function (item, index) {
                    if (index < gjjObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: (parseFloat(item.yuelixi) +parseFloat(gjjObj.mouthdataArray[index].yuelixi)).toFixed(2),
                            yuebenjin:(parseFloat(item.yuebenjin) +parseFloat(gjjObj.mouthdataArray[index].yuebenjin)).toFixed(2),
                            leftFund: (parseFloat(item.leftFund) + parseFloat(gjjObj.mouthdataArray[index].leftFund)).toFixed(2),
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }

                })
            } else {
                var mergemouthdataArray = gjjObj.mouthdataArray.map(function (item, index) {
                    if (index < sdObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: (parseFloat(item.yuelixi) + parseFloat(sdObj.mouthdataArray[index].yuelixi)).toFixed(2),
                            yuebenjin: (parseFloat(item.yuebenjin) + parseFloat(sdObj.mouthdataArray[index].yuebenjin)).toFixed(2),
                            leftFund: (parseFloat(item.leftFund) + parseFloat(sdObj.mouthdataArray[index].leftFund)).toFixed(2)
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }
                })
            }
            // console.log("查看计算结果sd",sdObj)
            // console.log("查看计算结果gjj",gjjObj)
            
            return {
                yuegong: (parseFloat(sdObj.yuegong) + parseFloat(gjjObj.yuegong)).toFixed(2),
                totalLixi: (parseFloat(sdObj.totalLixi) +  parseFloat(gjjObj.totalLixi)).toFixed(2),
                totalPrice: (parseFloat(sdObj.totalPrice) + parseFloat(gjjObj.totalPrice)).toFixed(2),
                mouthdataArray: mergemouthdataArray,
                totalDknum: parseFloat(sdObj.totalDknum) + parseFloat(gjjObj.totalDknum),
                year: year
            }

        } else if (type == 2) {
            var sdObj = _this.benjin(type, sdnum, sdyear, sdlilv);
            var gjjObj = _this.benjin(type, gjjnum, gjjyear, gjjlilv);
            if (sdObj.mouthdataArray.length > gjjObj.mouthdataArray.length) {
                var mergemouthdataArray = sdObj.mouthdataArray.map(function (item, index) {
                    if (index < gjjObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi + gjjObj.mouthdataArray[index].yuelixi,
                            yuebenjin: item.yuebenjin + gjjObj.mouthdataArray[index].yuebenjin,
                            leftFund: item.leftFund + gjjObj.mouthdataArray[index].leftFund
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }

                })
            } else {
                var mergemouthdataArray = gjjObj.mouthdataArray.map(function (item, index) {
                    if (index < sdObj.mouthdataArray.length) {
                        return {
                            monthName: item.monthName,
                            yuelixi: (parseFloat(item.yuelixi) + parseFloat(sdObj.mouthdataArray[index].yuelixi)).toFixed(2),
                            yuebenjin: (parseFloat(item.yuebenjin) + parseFloat(sdObj.mouthdataArray[index].yuebenjin)).toFixed(2),
                            leftFund: (parseFloat(item.leftFund) + parseFloat(sdObj.mouthdataArray[index].leftFund)).toFixed(2),
                        }
                    } else {
                        return {
                            monthName: item.monthName,
                            yuelixi: item.yuelixi,
                            yuebenjin: item.yuebenjin,
                            leftFund: item.leftFund
                        }
                    }
                })
            }
            return {
                yuegong: (parseFloat(sdObj.yuegong) + parseFloat(gjjObj.yuegong)).toFixed(2),
                totalLixi: (parseFloat(sdObj.totalLixi) + parseFloat(gjjObj.totalLixi)).toFixed(2),
                totalPrice: (parseFloat(sdObj.totalPrice) + parseFloat(gjjObj.totalPrice)).toFixed(2),
                yuegongdijian: (parseFloat(sdObj.yuegongdijian) + parseFloat(gjjObj.yuegongdijian)).toFixed(2),
                totalDknum: sdObj.totalDknum + gjjObj.totalDknum,
                year: year,
                mouthdataArray: mergemouthdataArray
            }
        }
    },
    //等额本息计算
    benxi: function (type, num, year, lilv) {
        //每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        var mouth = parseInt(year) * 12,
            mouthlilv = parseFloat(lilv) / 12,
            dknum = parseFloat(num) * 10000;
        //每月月供
        var yuegong = (dknum * mouthlilv * Math.pow((1 + mouthlilv), mouth)) / (Math.pow((1 + mouthlilv), mouth) - 1);
        //总利息=还款月数×每月月供额-贷款本金
        var totalLixi = mouth * yuegong - dknum;
        //还款总额 总利息+贷款本金
        var totalPrice = totalLixi + dknum,
            leftFund = totalLixi + dknum;

        //循环月份
        var mouthdataArray = [],
            nowmouth = new Date().getMonth(),
            realmonth = 0;

        for (var i = 1; i <= mouth; i++) {
            realmonth = nowmouth + i;
            var yearlist = Math.floor(i / 12);

            realmonth = realmonth - 12 * yearlist;

            if (realmonth > 12) {
                realmonth = realmonth - 12
            }
            //console.log(realmonth)
            //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
            var yuelixi = dknum * mouthlilv * (Math.pow((1 + mouthlilv), mouth) - Math.pow((1 + mouthlilv), i - 1)) / (Math.pow((1 + mouthlilv), mouth) - 1);
            //每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
            var yuebenjin = dknum * mouthlilv * Math.pow((1 + mouthlilv), i - 1) / (Math.pow((1 + mouthlilv), mouth) - 1);
            leftFund = leftFund - (yuelixi + yuebenjin);
            if (leftFund < 0) {
                leftFund = 0
            }
            mouthdataArray[i - 1] = {
                monthName: realmonth + "月",
                yuelixi: yuelixi.toFixed(2),
                yuebenjin: yuebenjin.toFixed(2),
                //剩余还款
                leftFund: leftFund.toFixed(2)
            }
        }
        return {
            yuegong: yuegong.toFixed(2),
            totalLixi: (totalLixi/10000).toFixed(2),
            totalPrice: (totalPrice/10000).toFixed(2),
            mouthdataArray: mouthdataArray,
            totalDknum: num,
            year: year
        };
    },
    //等额本金计算
    benjin: function (type, num, year, lilv) {
        var mouth = parseInt(year) * 12,
            mouthlilv = parseFloat(lilv) / 12,
            dknum = parseFloat(num) * 10000,
            yhbenjin = 0; //首月还款已还本金金额是0
        //每月应还本金=贷款本金÷还款月数
        var everymonthyh = dknum / mouth
        //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        var yuegong = everymonthyh + (dknum - yhbenjin) * mouthlilv;
        //每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
        var yuegongdijian = everymonthyh * mouthlilv;
        //总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
        var totalLixi = ((everymonthyh + dknum * mouthlilv) + dknum / mouth * (1 + mouthlilv)) / 2 * mouth - dknum;
        //还款总额 总利息+贷款本金
        var totalPrice = totalLixi + dknum,
            leftFund = totalLixi + dknum;

        //循环月份
        var mouthdataArray = [],
            nowmouth = new Date().getMonth(),
            realmonth = 0;

        for (var i = 1; i <= mouth; i++) {
            realmonth = nowmouth + i;
            var yearlist = Math.floor(i / 12);

            realmonth = realmonth - 12 * yearlist;

            if (realmonth > 12) {
                realmonth = realmonth - 12
            }
            yhbenjin = everymonthyh * (i - 1);
            var yuebenjin = everymonthyh + (dknum - yhbenjin) * mouthlilv;
            //每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
            var yuelixi = (dknum - yhbenjin) * mouthlilv;
            leftFund = leftFund - yuebenjin;
            if (leftFund < 0) {
                leftFund = 0
            }
            mouthdataArray[i - 1] = {
                monthName: realmonth + "月",
                // 每月利息
                yuelixi: yuelixi.toFixed(2),
                //每月本金
                yuebenjin: everymonthyh.toFixed(2),
                //剩余还款
                leftFund: leftFund.toFixed(2)
            }
        }
        return {
            yuegong: yuegong.toFixed(2),
            totalLixi: (totalLixi/10000).toFixed(2),
            totalPrice: (totalPrice/10000).toFixed(2),
            yuegongdijian: yuegongdijian.toFixed(2),
            mouthdataArray: mouthdataArray,
            totalDknum: num,
            year: year
        }
    }
}
export default calcute