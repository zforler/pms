<template>
    <div class="index-container">
        <div class="index-top">
            <div class="index-top-item">
                <span class="index-top-item-title">产品类别</span>
                <span class="index-top-item-num">{{ productionCount }}</span>
            </div>
            <div class="index-top-item">
                <span class="index-top-item-title">生产总量</span>
                <span class="index-top-item-num">{{ productionSummary }}</span>
            </div>
            <div class="index-top-item">
                <span class="index-top-item-title">设备数量</span>
                <span class="index-top-item-num">{{ productionCount }}</span>
            </div>
            <div class="index-top-item">
                <span class="index-top-item-title">员工数量</span>
                <span class="index-top-item-num">{{ staffCount }}</span>
            </div>

        </div>
        <div class="index-content">
            <div class="index-chart no-mr index-chart-100" id="day-product-chart"></div>
            <div class="index-chart no-mr index-chart-100" id="month-product-chart"></div>

        </div>
    </div>
</template>

<script>
    import { getStaffCount,getProductionCount,getEquipmentCount,getProductionSummary,
      getProductionSummaryEveryDay,getProductionSummaryMonth} from '../../api/statistics'
    import echarts from 'echarts'
    import localCache from "../../util/localCache";
    import {addSalaryAdjustLog} from "@/api/salary";
    export default {
        name: "index",
        data() {
            return {
              staffCount: 0,
              equipmentCount: 0,
              productionCount: 0,
              productionSummary: 0
            }
        },
        mounted(){
          this.getProductionSummaryEveryDay_()
            // this.dayProductChart()
            this.monthProductBarChart_()
          let param = {
            customerId: localCache.getCurrentCustomerId(),
          }
          getStaffCount(param).then((res)=>{
            if(res.errorcode==0){
              this.staffCount = res.data
            }else{
              this.$message.error(res.message)
            }
          })
          getProductionCount(param).then((res)=>{
            if(res.errorcode==0){
              this.productionCount = res.data
            }else{
              this.$message.error(res.message)
            }
          })
          getEquipmentCount(param).then((res)=>{
            if(res.errorcode==0){
              this.equipmentCount = res.data
            }else{
              this.$message.error(res.message)
            }
          })
          getProductionSummary(param).then((res)=>{
            if(res.errorcode==0){
              this.productionSummary = res.data.dispatch_kg / 100
            }else{
              this.$message.error(res.message)
            }
          })
        },
        methods: {
            dayProductChart(param){
                let myChart = echarts.init(document.getElementById('day-product-chart'));

                // 指定图表的配置项和数据
                let option = {
                    title: {
                        text: '每日产量变化趋势',
                        top: 15,
                        left: 15
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        top: 15,
                        right: 15,
                        data: param.title,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: param.x
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: param.series
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            monthProductBarChart(param){
                let myChart = echarts.init(document.getElementById('month-product-chart'));

                // 指定图表的配置项和数据
                let option = {
                    title: {
                        text: '每月产量统计',
                        top: 15,
                        left: 15
                    },
                    legend: {
                        top: 15,
                        right: 15,
                    },
                    tooltip: {},
                    dataset: {
                        dimensions: param.title,
                        source: param.data
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: param.series
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
          defaulData(x){
              let d = {}
              x.forEach((t)=>{
                d[t] = 0
              })
            return d
          },
          getProductionSummaryEveryDay_(){
            getProductionSummaryEveryDay({
              customerId: localCache.getCurrentCustomerId()
            }).then((res)=>{
              if(res.errorcode==0){
                let data = res.data && res.data.data
                let map = {}
                let titles = new Set()
                let list = []
                for (let i = 0, len = data.length; i < len; i++) {
                  let temp = data[i]
                  if(!map[temp.production_name]){
                  let t = {
                      name: temp.production_name,
                      type: 'line',
                      stack: '总量',
                      smooth: true,
                      data: this.defaulData(res.data.x)
                    }
                    t[temp.month+'/'+temp.day] = temp.delivery_kg/100
                    map[temp.production_name] =t
                    list.push(t)
                    titles.add(temp.production_name)
                  }else{
                    map[temp.production_name].data[temp.month+'/'+temp.day]=temp.delivery_kg/100
                  }
                }
                list.forEach((t)=>{
                  let d = []
                  for(let k in t.data){
                    d.push(t.data[k])
                  }
                  t.data = d
                })
                let p = {
                  x: res.data.x,
                  title: [...titles],
                  series: list
                }
                console.log(p)
                this.dayProductChart(p)
              }else{
                this.$message.error(res.message)
              }
            })
          },
          monthProductBarChart_(){
              let endTime = parseInt(new Date().getTime()/1000)
            getProductionSummaryMonth({
              customerId: localCache.getCurrentCustomerId(),
              beginTime: endTime - 365 * 86400,
              endTime: endTime
            }).then((res)=>{
              if(res.errorcode==0){
                let data = res.data && res.data.data
                let map = {}
                let titles = new Set()
                titles.add('date')
                let list = []
                let temp
                for (let i = 0, len = data.length; i < len; i++) {
                  temp = data[i]
                  let date = temp.year+'/'+temp.month
                  if(!map[date]){
                    map[date] = {
                      date: date,
                      [temp.production_name]: temp.delivery_kg/100
                    }
                  }else{
                    map[date][temp.production_name] = temp.delivery_kg/100
                  }
                  titles.add(temp.production_name)
                }
                let map1 = []
                console.log(map)
                let x = res.data.x
                for (let i = 0,len = x.length; i < len; i++) {
                  map1[x[i]] = map[x[i]] || {
                    date: x[i]
                  }
                }
                for (let k in map1){
                  list.push(map1[k])
                }
                let series = []
                for (let i = 0, len = titles.size-1; i < len; i++) {
                  series.push({type: 'bar'})
                }
                let p = {
                  title: [...titles],
                  data: list,
                  series:series
                }
                console.log(p)
                this.monthProductBarChart(p)
              }else{
                this.$message.error(res.message)
              }
            })
          }
        }
    }
</script>

<style scoped>
    .index-top {
        height: 125px;
        display: flex;
        justify-content: flex-start;
    }
    .index-top-item {
        color:#fff;
        width: calc(25% - 15px);
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        position: relative;
    }
    .index-top-item:last-child{
        margin-right: 0;
    }
    .index-top-item:nth-child(1){
        background-color:#27a9e3;
    }
    .index-top-item:nth-child(2){
        background-color:#28b779;
    }
    .index-top-item:nth-child(3){
        background-color:#852b99;
    }
    .index-top-item:nth-child(4){
        background-color:#ffb848;
    }
    .index-top-item-title{
        position: absolute;
        padding: 5px;
        top:0;
        left: 0;
        width: 100%;
        background-color: rgba(0,0,0,0.1);
    }
    .index-top-item-num {
        font-size: 30px;
        padding: 0 10px;
        padding-top: 25px;
    }
    .index-content{
        margin-top: 15px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .index-chart {
        width: calc(50% - 10px);
        background-color: #fafafa;
        margin-right: 20px;
        height: 350px;
        border-left: 2px solid #ddd
    }
    .index-chart-100{
        width: 100%;
        margin-top: 15px;
    }
    .no-mr{
        margin-right: 0px;
    }
    .mr-top{

    }
</style>