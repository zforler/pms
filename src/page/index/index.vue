<template>
    <div class="index-container">
        <div class="index-top">
            <div class="index-top-item">
                <span>产品类别</span><span class="index-top-item-num">5</span>
            </div>
            <div class="index-top-item">
                <span>生产总量</span><span class="index-top-item-num">555</span>
            </div>
            <div class="index-top-item">
                <span>设备数量</span><span class="index-top-item-num">5</span>
            </div>
            <div class="index-top-item">
                <span>员工数量</span><span class="index-top-item-num">5</span>
            </div>

        </div>
        <div class="index-content">
            <div class="index-chart">每日产量趋势</div>
            <div class="index-chart no-mr">产品占比</div>
            <div class="index-chart no-mr index-chart-100">每月产量统计</div>


        </div>
        <!--{{'1534556864' | formateTime()}}-->
        <!--<svg-icon icon-class="add" width="24px" height="24px"/>-->
        <!--<svg-icon icon-class="index" width="24px" height="24px"/>-->
        <!--<i class="fa fa-angle-down"></i>-->
        <!--<img src="./../../assets/logo.png"></img>-->
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
    .index-top {
        height: 150px;
        display: flex;
        justify-content: flex-start;
    }
    .index-top-item {
        background-color: #ccc;
        width: calc(25% - 15px);
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
    }
    .index-top-item:last-child{
        margin-right: 0;
    }
    .index-top-item-num {
        font-size: 30px;
        padding: 0 10px;
    }
    .index-content{
        margin-top: 15px;
    }
    .index-chart {
        width: calc(50% - 10px);
        background-color: #ccc;
        margin-right: 20px;
        height: 350px;
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