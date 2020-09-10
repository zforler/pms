<template>
    <div class="report-container">
        <div class="t-top-bar">
            <div class="report-op">
                <el-date-picker  v-model="value2" type="datetimerange" :picker-options="pickerOptions"
                        range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期"
                        align="right"></el-date-picker>
            </div>
            <div class="report-op"><el-button type="primary" icon="el-icon-search">搜索</el-button></div>
            <div class="report-op"><i class="el-icon-download l-add-buttion" @click="exportExcel"></i></div>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
            <el-table-column prop="customerId" label="客户编号" width="80"></el-table-column>
            <el-table-column prop="company" label="公司名称"></el-table-column>
            <el-table-column prop="address" label="公司地址"></el-table-column>
            <el-table-column prop="concator" label="公司负责人"></el-table-column>
            <el-table-column prop="concatorPhone" label="联系方式"></el-table-column>
            <el-table-column prop="equipmentCount" label="设备数量"></el-table-column>
        </el-table>
    </div>
</template>

<script>
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
                value2: ''
            }
        },
        methods: {
            exportExcel(){

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
    }

</style>