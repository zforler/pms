<template>
  <div class="salary-report-container">
    <div class="t-top-bar">
      <div class="report-op">
          <el-date-picker v-model="selectTime" type="date" @change="dateChange"  placeholder="选择日期"></el-date-picker>
      </div>
      <div class="report-op"><el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button></div>
      <div class="report-op"><i class="el-icon-download l-add-buttion" @click="exportExcel"></i></div>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="staff_no" label="员工编号"></el-table-column>
      <el-table-column prop="staff_name" label="员工姓名"></el-table-column>
        <el-table-column prop="staff_type" label="员工类型">
            <template slot-scope="scope">
                {{scope.row.staff_type | dicFilter('STAFF_TYPE')}}
            </template>
        </el-table-column>
      <el-table-column prop="department_name" label="班组"></el-table-column>
        <el-table-column prop="production_name" label="产品"></el-table-column>
        <el-table-column prop="spec_name" label="规格"></el-table-column>
        <el-table-column prop="technology_name" label="工艺"></el-table-column>
      <el-table-column prop="total_price" label="工资(元)">
          <template slot-scope="scope">
              {{scope.row.total_price / 100}}
          </template>
      </el-table-column>
      <el-table-column prop="adjust" label="调整项(元)">
          <template slot-scope="scope">
              {{scope.row.adjust / 100}}
          </template>
      </el-table-column>
      <el-table-column prop="subsidy" label="补贴项(元)">
          <template slot-scope="scope">
              {{scope.row.subsidy / 100}}
          </template>
      </el-table-column>
      <el-table-column prop="total" label="合计工资(元)">
          <template slot-scope="scope">
              {{(scope.row.total_price+scope.row.adjust+scope.row.subsidy) / 100}}
          </template>
      </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <!--<i class="el-icon-edit el-icon-table" v-if="authedCheck('编辑规格')" title="编辑规格"-->
                   <!--@click="editHandler(scope.row)"></i>-->
                <i class="el-icon-edit el-icon-table" title="工资调整" @click="editHandler(scope.row)"></i>
                <i class="el-icon-notebook-2 el-icon-table" title="查看详情" @click="detailHandler(scope.row)"></i>
            </template>
        </el-table-column>
    </el-table>

      <el-dialog title="工资调整" :visible.sync="addDialogVisiable" @close="addCloseHandler"  width="650px">
          <el-form :model="addForm" :rules="rules" ref="addForm">
              <el-form-item label="员工编号" :label-width="formLabelWidth">
                  <el-input :disabled="true" v-model="selectRow.staff_no" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="员工名称" :label-width="formLabelWidth">
                  <el-input :disabled="true" v-model="selectRow.staff_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="调整项(元)" prop="adjust"  :label-width="formLabelWidth">
                  <el-input type="number" v-model="addForm.adjust" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="补贴项(元)" prop="subsidy"  :label-width="formLabelWidth">
                  <el-input type="number" v-model="addForm.subsidy" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="append"  :label-width="formLabelWidth">
                  <el-input v-model="addForm.append" autocomplete="off"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="addConfirm">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import { getSalaryReportList } from '../../api/record'
    import { addSalaryAdjustLog } from '../../api/salary'
    import {tableDataToExcel,formateTime} from '../../util/util'
    import localCache from "../../util/localCache";
    export default {
        name: "recordReport",
        data(){
            let reg = /^\-?\d{0,5}\.?\d{0,2}$/
            let checkPrice = (rule, value, callback) => {
                if(value === ''){
                    callback(new Error('请输入数字值'));
                }
                console.log(value)
                if (!reg.test(''+value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (value < -99999 || value > 99999) {
                        callback(new Error('数值范围-99999到99999'));
                    } else {
                        callback();
                    }
                }
            }
            return {
                addDialogVisiable: false,
                listLoading: false,
                formLabelWidth: '120px',
                tableData: [],
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
                selectRow: '',
                addForm: {
                    adjust:0,
                    subsidy:0,
                    append:''
                },
                rules: {
                    append: [
                        { min: 1, max: 32, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ],
                    adjust: [
                        { required: true,validator: checkPrice, trigger: 'blur' }
                    ],
                    subsidy: [
                        { required: true,validator: checkPrice, trigger: 'blur' }
                    ]
                },

            }
        },
        mounted(){
            this.getSalaryReportList_()
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
            search(){
                this.getSalaryReportList_()
            },
            dateChange(){
                this.getSalaryReportList_()
            },
            getSalaryReportList_(){
                console.log(this.selectTime)
                if(!this.selectTime){
                    this.$message.error('请选择时间')
                    return
                }
                this.listLoading = true
                getSalaryReportList({
                    customerId: localCache.getCurrentCustomerId(),
                    beginTime: parseInt(this.selectTime.getTime()/1000),
                    endTime: 0
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
            editHandler(row){
                this.selectRow = row
                this.addDialogVisiable = true
            },
            addCloseHandler(){
                this.$refs['addForm'].resetFields()
                this.addForm =  {
                }
            },
            addConfirm() {
                this.$refs['addForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let param = Object.assign({}, this.addForm)
                    param.staffNo = this.selectRow.staff_no
                    param.year = this.selectRow.year
                    param.month = this.selectRow.month
                    param.day = this.selectRow.day
                    param.adjust *= 100
                    param.subsidy *= 100
                    param.customerId = localCache.getCurrentCustomerId()
                    addSalaryAdjustLog(param).then((res)=>{
                        if(res.errorcode==0){
                            this.$message({
                                message: '调整成功',
                                type: 'success'
                            })
                            this.addDialogVisiable = false
                            this.getSalaryReportList_()
                        }else{
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                    })
                });
            },
            detailHandler(row){
                this.selectRow = row
                this.$router.push({name:'工资详情',params:
                        {staffNo: row.staff_no,year:row.year,month:row.month,day:row.day }})
            }
        }
    }
</script>

<style lang="scss">
  .salary-report-container{
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