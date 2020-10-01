<template>
    <div class="record-report-container">
        <div class="t-top-bar">
            <div class="report-op">
                <el-input placeholder="员工编号、员工姓名" v-model="keyword" class="search-input"></el-input>
                <el-cascader class="search-input" clearable v-model="searchDepart" placeholder="所属班组" :options="treeData"
                             :props="{ expandTrigger: 'hover', label: 'name',value:'departmentId' }"></el-cascader>
                <el-select class="search-input200" clearable v-model="subEquipmentId" placeholder="终端编号">
                    <el-option v-for="(val,key) in subEquipments" :key="key" :label="val.subEquipmentId"
                               :value="val.subEquipmentId"></el-option>
                </el-select>
                <el-select  class="search-input200" clearable v-model="priceType" placeholder="计价类型">
                    <el-option v-for="(val,key) in selectDic('PRICE_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
                </el-select>
                <el-date-picker  v-model="selectTime" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期"
                        align="right"></el-date-picker>
            </div>
            <div class="report-op"><el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button></div>
            <div class="report-op"><i class="el-icon-download l-add-buttion" @click="exportExcel"></i></div>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
            <el-table-column prop="dispatch_sub_id" label="发料终端" width="110px"></el-table-column>
            <el-table-column prop="delivery_sub_id" label="交料终端" width="110px"></el-table-column>
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
            <el-table-column prop="price_type" label="计价类型">
                <template slot-scope="scope">
                    {{scope.row.price_type | dicFilter('PRICE_TYPE')}}
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
    import { getSubEquipmentListAll } from '../../api/equipment'
    import { getDepartmentList } from '../../api/department'
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
                keyword: '',
                exportColumn: {
                    'record_id':'记录编号',
                    'customer_id':'客户编号',
                    'equipment_id':'设备编号',
                    'dispatch_sub_id':'发料终端',
                    'delivery_sub_id':'交料终端',
                    'dispatch_card_no':'发料卡号',
                    'delivery_card_no':'交料卡号',
                    'price_type':'计价类型',
                    'dispatch_kg':'发料(kg)',
                    'delivery_count':'交料(数量)',
                    'delivery_kg':'交料(kg)',
                    'yield':'出成率(%)',
                    'price':'单价(元)',
                    'total_price':'总价(元)',
                    'price_id':'计价规则编号',
                    'staff_no':'员工编号',
                    'staff_name':'员工名称',
                    'staff_type':'员工类型',
                    'department_id':'组编号',
                    'department_name':'组名称',
                    'production_id':'产品编号',
                    'production_name':'产品名称',
                    'spec_id':'规格编号',
                    'spec_name':'规格名称',
                    'technology_id':'工艺编号',
                    'technology_name':'工艺名称',
                    'shift_id':'班次编号',
                    'shift_name':'班次',
                    'delay_time':'班次延时',
                    'batch_id':'批次编号',
                    'batch_name':'批次名称',
                    'record_time':'记录时间',
                    'report_time':'上报时间',
                    'calc_time':'计算时间',
                    'year':'年',
                    'month':'月',
                    'day':'日',
                    'append':'备注',
                },
                subEquipments: [],
                subEquipmentId:'',
                searchDepart:'',
                treeData: [],
                priceType:''
            }
        },
        mounted(){
            let now = new Date()
            let start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0)
            this.selectTime = [start,now]
            this.getRecordList_()
            this.getSubEquipmentListAll_()
            this.getTree()
        },
        methods: {
            exportExcel(){
                tableDataToExcel(this.tableData,'生产记录',this.exportColumn)
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
                let departmentId = ''
                if(this.searchDepart){
                    departmentId = this.searchDepart[this.searchDepart.length-1]
                }
                getRecordList({
                    customerId: localCache.getCurrentCustomerId(),
                    beginTime: parseInt(this.selectTime[0].getTime()/1000),
                    endTime: parseInt(this.selectTime[1].getTime()/1000),
                    keyword: this.keyword,
                    priceType: this.priceType,
                    subEquipmentId: this.subEquipmentId,
                    departmentId:departmentId
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
            getSubEquipmentListAll_(){
                getSubEquipmentListAll({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.subEquipments=  res.data
                    }
                }).catch(() => {
                })
            },
            getTree() {
                getDepartmentList({
                    customerId:localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.treeData = res.data
                    }
                }).catch(() => {
                })
            },
        }
    }
</script>

<style lang="scss">
    .record-report-container{
        .t-top-bar{
            display: flex;
        }
        .report-op{
            margin-right: 15px;
        }
        .report-op:last-child{
            margin-left: auto;
        }
        .search-input{
            width: 250px;
            margin-right: 15px;
        }
        .search-input200{
            width: 200px;
            margin-right: 15px;
        }
        .el-table td{
            padding: 0;
        }
    }

</style>