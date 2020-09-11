<template>
    <div class="report-container">
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
            <el-table-column prop="delivery_sub_id" label="终端编号"></el-table-column>
            <el-table-column prop="staff_no" label="工号"></el-table-column>
            <el-table-column prop="staff_name" label="员工名称"></el-table-column>
            <el-table-column prop="staff_type" label="员工类型">
                <template slot-scope="scope">
                    {{scope.row.staff_type | dicFilter('STAFF_TYPE')}}
                </template>
            </el-table-column>
            <el-table-column prop="department_name" label="组别"></el-table-column>
            <el-table-column prop="batch_name" label="批次"></el-table-column>
            <el-table-column prop="production_name" label="产品名称" width="180"></el-table-column>
            <el-table-column prop="spec_name" label="规格名称"></el-table-column>
            <el-table-column prop="technology_name" label="工艺名称"></el-table-column>
            <el-table-column prop="shift_name" label="班次">
                <template slot-scope="scope">
                    {{scope.row.shift_name || '--'}}
                </template>
            </el-table-column>
            <el-table-column prop="dispatch_kg" label="发料(kg)" width="80"></el-table-column>
            <el-table-column prop="delivery_kg" label="交料(kg)" width="80"></el-table-column>
            <el-table-column prop="yield" label="出成率(%)" width="90"></el-table-column>
            <el-table-column prop="price" label="单价(元)"></el-table-column>
            <el-table-column prop="total_price" label="总价(元)"></el-table-column>
            <el-table-column prop="record_time" label="记录时间" width="180">
                <template slot-scope="scope">
                    {{scope.row.record_time | formateTime()}}
                </template>
            </el-table-column>
            <el-table-column prop="report_time" label="上传时间" width="180">
                <template slot-scope="scope">
                    {{scope.row.report_time | formateTime()}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { getRecordList } from '../../api/record'
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
                selectTime: ''
            }
        },
        mounted(){
            let now = new Date()
            let start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0)
            this.selectTime = [start,now]
            this.getRecordList_()
        },
        methods: {
            exportExcel(){
                tableDataToExcel(this.tableData,'生产记录')
            },
            search(){
                this.getRecordList_()
            },
            getRecordList_(){
                console.log(this.selectTime)
                if(!this.selectTime){
                    this.$message.error('请选择开始结束时间')
                    return
                }
                this.listLoading = true
                getRecordList({
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
    .report-container{
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