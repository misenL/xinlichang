 
var config =  {
  // 贷款类型
  loanTyle: [
    {name: '商业贷款',type:0 },
    {name: '公积金贷款',type:1},
    {name: '组合贷款',type:2}
  ],
  // 贷款年限，1到30
  loanyear : [],
  // 商业贷款的利率
  shangdaiLilv : [
    {year: 1,lilv: "0.0435"},
    {year: 2,lilv: "0.0475"},
    {year: 6,lilv: "0.049"}
  ],
  shangdaiSelect : [
    {lilv: 1,name: "基准利率"},
    {lilv: 1.1,name: "1.1倍利率"},
    {lilv: 1.15,name: "1.15倍利率"},
    {lilv: 1.2,name: "1.2倍利率"},
    {lilv: 1.3,name: "1.3倍利率"},
    {lilv: 0.9,name: "9折利率"},
    {lilv: 0.85,name: "85折利率"},
    {lilv: 0.8,name: "8折利率"},
    {lilv: 0.7,name: "7折利率"}
  ],
  // 公积金
  gjjLilv : [
    {year: 1,lilv: "0.0275"},
    {year: 6,lilv: "0.0325"}
  ],
  gjjSelect : [
    {lilv: 1,name: "基准利率"},
    {lilv: 1.1,name: "1.1倍利率"},
    {lilv: 1.15,name: "1.15倍利率"},
    {lilv: 1.2,name: "1.2倍利率"},
    {ilv: 1.3,name: "1.3倍利率"},
    {lilv: 0.9,name: "9折利率"},
    {lilv: 0.85,name: "85折利率"},
    {lilv: 0.8,name: "8折利率"},
    {lilv: 0.7,name: "7折利率"}
  ]
}
function createLoanYear () {
  for(let i = 0;i<30;i++){
    let key = i+1;
    config.loanyear.push({
      year:key,
      select:false,
      name:key
    })
  }
}
createLoanYear()


export default config
 