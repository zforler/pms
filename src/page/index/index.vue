<template>
    <div class="index-container">
        <div class="index-top">
            <div class="index-top-item">
                <span class="index-top-item-title">产品类别</span><span class="index-top-item-num">5</span>
            </div>
            <div class="index-top-item">
                <span class="index-top-item-title">生产总量</span><span class="index-top-item-num">555</span>
            </div>
            <div class="index-top-item">
                <span class="index-top-item-title">设备数量</span><span class="index-top-item-num">5</span>
            </div>
            <div class="index-top-item">
                <span class="index-top-item-title">员工数量</span><span class="index-top-item-num">5</span>
            </div>

        </div>
        <div class="index-content">
            <div class="index-chart no-mr index-chart-100" id="day-product-chart"></div>
            <div class="index-chart no-mr index-chart-100" id="month-product-chart"></div>

        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import localCache from "../../util/localCache";
    export default {
        name: "index",
        data() {
            return {

            }
        },
        mounted(){
            this.dayProductChart()
            this.monthProductBarChart()
        },
        methods: {
            dayProductChart(){
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
                        data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '联盟广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '视频广告',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '直接访问',
                            type: 'line',
                            stack: '总量',
                            areaStyle: {},
                            data: [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '搜索引擎',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {},
                            data: [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            monthProductBarChart(){
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
                        dimensions: ['product', '2015', '2016', '2017'],
                        source: [
                            {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
                            {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
                            {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
                            {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
                        ]
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
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                        {type: 'bar'}
                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
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