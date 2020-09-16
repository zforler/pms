<template>
    <div class="day-salary-detail-report-container">
        <div class="t-top-bar">
            <div class="staff-info">
                <div class="staff-info-item"><span class="staff-info-label">员工编号:</span><span>{{staffNo}}</span></div>
                <div class="staff-info-item"><span class="staff-info-label">员工姓名:</span><span>{{staff.staffName || '--'}}</span></div>
                <div class="staff-info-item"><span class="staff-info-label">结算日期:</span><span>{{year}}年{{month}}月{{day}}日</span></div>
                <div class="staff-info-item"><span class="staff-info-label">调整前工资:</span><span>{{recordPrice}}元</span></div>
                <div class="staff-info-item"><span class="staff-info-label">调整金额:</span><span>{{adjustPricce}}元</span></div>
                <div class="staff-info-item"><span class="staff-info-label">调整后工资:</span><span>{{totalPrice}}元</span></div>
            </div>
            <div class="report-op"><i class="el-icon-download l-add-buttion" @click="exportExcel"></i></div>
        </div>
        <div class="table-title">员工生产数据详情</div>
        <el-table :data="tableData" border :summary-method="getSummaries" show-summary
                  style="width: 100%" v-loading="listLoading">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="department_name" label="班组"></el-table-column>
            <el-table-column prop="production_name" label="产品"></el-table-column>
            <el-table-column prop="spec_name" label="规格"></el-table-column>
            <el-table-column prop="technology_name" label="工艺"></el-table-column>
            <el-table-column prop="price_type" label="计价类型">
                <template slot-scope="scope">
                    {{scope.row.price_type | dicFilter('PRICE_TYPE')}}
                </template>
            </el-table-column>
            <el-table-column prop="dispatch_kg" label="发料(kg)"></el-table-column>
            <el-table-column prop="delivery_kg" label="交料(kg)"></el-table-column>
            <el-table-column prop="delivery_count" label="数量"></el-table-column>
            <el-table-column prop="price" label="单价(元)">
                <template slot-scope="scope">
                    {{scope.row.price / 100}}
                </template>
            </el-table-column>
            <el-table-column prop="total_price" label="总价(元)">
                <template slot-scope="scope">
                    {{scope.row.total_price / 100}}
                </template>
            </el-table-column>
        </el-table>
        <div class="table-title">工资调整记录</div>
        <el-table :data="adjustTableData" border :summary-method="getAdjustSummaries" show-summary
                  style="width: 100%" v-loading="adjustListLoading">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="adjust" label="调整项(元)">
                <template slot-scope="scope">
                    {{(scope.row.adjust / 100).toFixed(2)}}
                </template>
            </el-table-column>
            <el-table-column prop="subsidy" label="补贴项(元)">
                <template slot-scope="scope">
                    {{(scope.row.subsidy / 100).toFixed(2)}}
                </template>
            </el-table-column>
            <el-table-column prop="total_sum" label="总计(元)">
                <template slot-scope="scope">
                    {{((scope.row.adjust+scope.row.subsidy) / 100).toFixed(2)}}
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="调整时间">
                <template slot-scope="scope">
                    {{scope.row.updateTime | formateTime()}}
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="操作人"></el-table-column>
            <el-table-column prop="append" label="备注">
                <template slot-scope="scope">
                    {{scope.row.append || '--'}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { getStaffByStaffNo } from '../../api/staff'
    import { getStaffDayRecordList } from '../../api/record'
    import { getSalaryAdjustLogList } from '../../api/salary'
    import {tableDataToExcel,formateTime} from '../../util/util'
    import localCache from "../../util/localCache";
    export default {
        name: "daySalaryDetailReport",
        data(){
            return {
                addDialogVisiable: false,
                listLoading: false,
                adjustListLoading: false,
                formLabelWidth: '120px',
                tableData: [],
                adjustTableData: [],
                selectTime: new Date(),
                exportColumn: {
                    'staff_no':'员工编号',
                    'staff_name':'员工名称',
                    'staff_type':'员工名称',
                    'department_name':'组别',
                    'production_name':'产品名称',
                    'spec_name':'规格名称',
                    'technology_name':'工艺名称',
                    'total_price':{
                        title:'工资(元)',
                        fk:'commonPrice'
                    },
                    'adjust':{
                        title: '调整项(元)',
                        fk:'commonPrice'
                    },
                    'subsidy':{
                        title: '补贴项(元)',
                        fk:'commonPrice'
                    },
                    'totalcount':{
                        title: '合计工资(元))',
                        fk: function(val,row){
                            return ((row.total_price+row.adjust+row.subsidy)/ 100).toFixed(2)
                        }
                    },
                },
                staffNo:'',
                year: '',
                month: '',
                day: '',
                staff: {},
                sumColumn:['dispatch_kg','delivery_kg','delivery_count','price','total_price'],
                adjustSumColumn:['adjust','subsidy','total_sum'],
                recordPrice:0,
                adjustPricce:0,
            }
        },
        created () {
            console.log(this.$route.params)
            let param = this.$route.params
            if(!param.staffNo){
                param = localCache.getCurrentDaySalaryDetailParam()
            }else{
                localCache.setCurrentDaySalaryDetailParam(param)
            }
            this.staffNo = param.staffNo
            this.year = param.year
            this.month = param.month
            this.day = param.day
            this.getSalaryAdjustLogList_()
            this.getStaffDayRecordList_()
            this.getStaffByStaffNo_()
        },
        computed:{
            totalPrice(){
                return (parseFloat(this.recordPrice)+parseFloat(this.adjustPricce)).toFixed(2)
            }
        },
        mounted(){

        },
        methods: {
            exportExcel(){
                if(!this.selectTime){
                    this.$message.error('请选择时间')
                    return
                }
                let title = formateTime(this.selectTime,'yyyy-MM-dd')+' '+"工资统计"
                tableDataToExcel(this.tableData, title,this.exportColumn)
            },
            getSummaries(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    let p = column.property
                    const values = data.map(item => Number(item[p]));
                    if (this.sumColumn.indexOf(p)>-1) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        if(p == 'price'){

                        }else if(p == 'delivery_count'){

                        }else{
                            sums[index] = (sums[index]/100).toFixed(2)
                        }

                    } else {
                        sums[index] = '/';
                    }
                });
                console.log(sums)
                if(data[0]){
                    sums[9] = (data[0].price/100).toFixed(2)
                    this.recordPrice = (Number.parseFloat(sums[10])).toFixed(2)
                }

                return sums;
            },
            getAdjustSummaries(param){
                const { columns, data } = param;
                console.log(param)
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    let p = column.property
                    const values = data.map(item => Number(item[p]));
                    if (this.adjustSumColumn.indexOf(p)>-1) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] = (sums[index]/100).toFixed(2)
                    } else {
                        sums[index] = '/';
                    }
                });
                if(data[0]){
                    sums[3] = (parseFloat(sums[1]) + parseFloat(sums[2])).toFixed(2)
                    this.adjustPricce = sums[3]
                }

                return sums;
            },
            getStaffDayRecordList_(){
                this.listLoading = true
                getStaffDayRecordList({
                    customerId: localCache.getCurrentCustomerId(),
                    staffNo:this.staffNo,
                    year:this.year,
                    month:this.month,
                    day:this.day,
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
            },
            getSalaryAdjustLogList_(){
                this.adjustListLoading = true
                getSalaryAdjustLogList({
                    customerId: localCache.getCurrentCustomerId(),
                    staffNo: this.staffNo,
                    year: this.year,
                    month: this.month,
                    day: this.day
                }).then(res => {
                    this.adjustListLoading = false
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.adjustTableData = res.data
                    }
                }).catch(() => {
                    this.adjustListLoading = false
                })
            },
            getStaffByStaffNo_(){
                getStaffByStaffNo({
                    customerId: localCache.getCurrentCustomerId(),
                    staffNo: this.staffNo,
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.staff = res.data || {}
                    }
                }).catch(() => {
                })
            }
        }
    }
</script>

<style lang="scss">
    .day-salary-detail-report-container{
        .t-top-bar{
            display: flex;
            align-items: center;
            border-bottom: thin solid  #f0f0f0;
            padding-bottom: 15px;
            margin-bottom: 0;
        }
        .staff-info {
            display: flex;
            height: 100%;
            align-items: center;
            font-size: 16px;
        }
        .staff-info-item {
            margin-right: 15px;
        }
        .staff-info-label{
            margin-right: 15px;
            background-color: #f0f0f0;
            padding: 8px 10px;
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
        .table-title{
            padding: 10px 0;
        }
    }

</style>