<template>
    <div class="product-report-container">
        <div class="t-top-bar">
            <div class="report-op">
                <el-date-picker  v-model="selectTime" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期"
                        align="right"></el-date-picker>
            </div>
            <div class="report-op"><el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button></div>
            <div class="report-op"><i class="el-icon-download l-add-buttion" @click="exportExcel"></i></div>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
            <el-table-column prop="production_name" label="产品名称"></el-table-column>
            <el-table-column prop="batch_name" label="批次"></el-table-column>
            <el-table-column prop="spec_name" label="规格名称"></el-table-column>
            <el-table-column prop="technology_name" label="工艺名称"></el-table-column>
            <el-table-column prop="delivery_kg" label="产量(kg)">
                <template slot-scope="scope">
                    {{(scope.row.delivery_kg/100).toFixed(2)}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { getProductionReportdList } from '../../api/record'
    import {tableDataToExcel} from '../../util/util'
    import localCache from "../../util/localCache";
    export default {
        name: "recordReport",
        data(){
            return {
                listLoading: false,
                tableData: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                selectTime: '',
                exportColumn: {
                    'production_name':'产品名称',
                    'batch_name':'批次名称',
                    'spec_name':'规格名称',
                    'technology_name':'工艺名称',
                    'delivery_kg':'产量(kg)',
                }
            }
        },
        mounted(){
            let now = new Date()
            let start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0)
            this.selectTime = [start,now]
            this.getProductionReportdList_()
        },
        methods: {
            exportExcel(){
                tableDataToExcel(this.tableData,'产量统计',this.exportColumn)
            },
            search(){
                this.getProductionReportdList_()
            },
            getProductionReportdList_(){
                console.log(this.selectTime)
                if(!this.selectTime){
                    this.$message.error('请选择开始结束时间')
                    return
                }
                this.listLoading = true
                getProductionReportdList({
                    customerId: localCache.getCurrentCustomerId(),
                    beginTime: parseInt(this.selectTime[0].getTime()/1000),
                    endTime: parseInt(this.selectTime[1].getTime()/1000),
                }).then(res => {
                    this.listLoading = false
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.tableData = res.data
                    }
                }).catch(() => {
                    this.listLoading = false
                })
            }
        }
    }
</script>

<style lang="scss">
    .product-report-container{
        .t-top-bar{
            display: flex;
        }
        .report-op{
            margin-right: 15px;
        }
        .report-op:last-child{
            margin-left: auto;
        }
        .el-table td{
            padding: 0;
        }
    }

</style>