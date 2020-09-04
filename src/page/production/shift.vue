<template>
  <div class="shift-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="shiftId" label="班次编号" width="80"></el-table-column>
      <el-table-column prop="shiftName" label="班次名称"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间">
          <template slot-scope="scope">
              {{scope.row.beginTime | formateHourTime()}}
          </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
          <template slot-scope="scope">
              {{scope.row.endTime | formateHourTime()}}
          </template>
      </el-table-column>
      <el-table-column prop="delayTime" label="延时时间(分钟)">
          <template slot-scope="scope">
              {{scope.row.delayTime || '--'}}
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
            <i class="el-icon-notebook-1 el-icon-table" @click="hisHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加班次" :visible.sync="addDialogVisiable" @close="addCloseHandler" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="班次名称" prop="shiftName" :label-width="formLabelWidth">
          <el-input v-model="addForm.shiftName" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="开始时间" prop="beginTime" :label-width="formLabelWidth">
              <el-time-picker  v-model="addForm.beginTime"
                      :picker-options="{ selectableRange: '00:00:00 - 23:59:59'  }"
                      placeholder="开始时间">
              </el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" :label-width="formLabelWidth">
              <el-time-picker @change="endTimeChange"  v-model="addForm.endTime"
                               :picker-options="{ selectableRange: '00:00:00 - 23:59:59'  }"  placeholder="开始时间">
              </el-time-picker>
          </el-form-item>
        <el-form-item v-show="delayFlag" label="延时时间(分钟)" prop="delayTime" :label-width="formLabelWidth">
          <el-input type="number" v-model="addForm.delayTime" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
      <el-dialog title="历史记录" :visible.sync="hisDialogVisiable" width="1050px">
          <el-table :data="hisTableData" border style="width: 100%" v-loading="hisListLoading">
              <el-table-column prop="shiftId" label="班次编号" width="80"></el-table-column>
              <el-table-column prop="shiftName" label="班次名称"></el-table-column>
              <el-table-column prop="beginTime" label="开始时间">
                  <template slot-scope="scope">
                      {{scope.row.beginTime | formateHourTime()}}
                  </template>
              </el-table-column>
              <el-table-column prop="endTime" label="结束时间">
                  <template slot-scope="scope">
                      {{scope.row.endTime | formateHourTime()}}
                  </template>
              </el-table-column>
              <el-table-column prop="delayTime" label="延时时间(分钟)">
                  <template slot-scope="scope">
                      {{scope.row.delayTime || '--'}}
                  </template>
              </el-table-column>
              <el-table-column prop="activeTime" label="生效时间" width="180px">
                  <template slot-scope="scope">
                      {{scope.row.activeTime | formateTime()}}
                  </template>
              </el-table-column>
              <el-table-column prop="reactiveTime" label="失效时间" width="180px">
                  <template slot-scope="scope">
                      {{scope.row.reactiveTime | formateTime()}}
                  </template>
              </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button @click="hisDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="hisDialogVisiable=false">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import { addShift,updateShift,getShiftList,getHisShiftList } from '../../api/shift'
    import localCache from "../../util/localCache";
export default {
  name: "shift",
  data() {
      let reg = /^\d+$/
      let checkDelayTime = (rule, value, callback) => {
          if(value === ''){
              callback();
          }
          if (!reg.test(''+value)) {
              callback(new Error('请输入数字值'));
          } else {
              if (value < 0 || value > 480) {
                  callback(new Error('数值范围0-480'));
              } else {
                  callback();
              }
          }
      }
      let checkEndtime = (rule, value, callback) => {
          if(this.addForm.beginTime){
              let begin = this.getSecondTime(this.addForm.beginTime)
              let end = this.getSecondTime(value)
              if(end - begin < 1800){
                  callback(new Error('时间间隔不能小于30分钟'));
              } else {
                  callback();
              }
          }
          if (!reg.test(''+value)) {
              callback(new Error('请输入数字值'));
          } else {
              if (value < 0 || value > 480) {
                  callback(new Error('数值范围0-480'));
              } else {
                  callback();
              }
          }
      }

    return {
        addDialogVisiable: false,
        hisDialogVisiable: false,
        opFlag: 'add',
        confirmVisible: false,
        formLabelWidth: '120px',
        tableData: [],
        hisTableData:[],
        addForm: {
            shiftName:'',
            beginTime:'',
            endTime:'',
            delayTime:''
        },
        rules: {
            shiftName: [
                { required: true, message: '班次名不能为空', trigger: 'blur' },
                { min: 2, max: 32, message: '长度在 2 到 15 个字符', trigger: 'blur' }
            ],
            beginTime: [
                { required: true, message: '请选择开始时间', trigger: 'blur' },
            ],
            endTime: [
                { required: true, message: '请选择结束时间', trigger: 'blur' },
                { validator: checkEndtime, trigger: 'blur' }
            ],
            delayTime: [
                { validator: checkDelayTime, trigger: 'blur' }
            ]
        },
        listQuery: {
            keyword: ''
        },
        listLoading: true,
        hisListLoading:false,
        selectRow: '',
        delayFlag: false
    }
  },

    mounted(){
        this.getList()
    },
  methods: {
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              shiftName:'',
              beginTime:'',
              endTime:'',
              delayTime:''
          }
          this.delayFlag = false
          this.opFlag='add'
      },
      addHandler() {
          this.opFlag='add'
          this.addDialogVisiable = true
      },
      editHandler(row) {
          this.selectRow = row
          this.opFlag='edit'
          this.addForm = Object.assign({}, row)
          this.addForm.beginTime = this.getDate(row.beginTime)
          this.addForm.endTime = this.getDate(row.endTime)
          if(this.addForm.delayTime){
              this.delayFlag = true
          }
          this.addDialogVisiable = true
      },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              console.log(valid)
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              if(this.opFlag == 'add'){

              }else if(this.opFlag == 'edit'){
                  param.shiftId = this.selectRow.shiftId
              }
              param.beginTime = this.getSecondTime(param.beginTime)
              param.endTime = this.getSecondTime(param.endTime)
              if(param.delayTime === ''){
                  param.delayTime = 0
              }
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opFlag=='add'){
                  addShift(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('添加成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.success(res.message)
                      }
                  })
              }else{
                  updateShift(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('修改成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.success(res.message)
                      }
                  })
              }
          });
      },
      getList() {
          this.listLoading = true
          this.listQuery.customerId = localCache.getCurrentCustomerId()
          getShiftList(this.listQuery).then(res => {
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
      endTimeChange(val){
          let t = this.getSecondTime(val)
          this.delayFlag = t==86400
          console.log(this.getSecondTime(val))
      },
      getSecondTime(val){
          let t = val.getHours()*3600 + val.getMinutes() * 60 + val.getSeconds()
          if(t == 86399){
              t = 86400
          }
        return t
      },
      getDate(hourTime){
          let date = new Date()
          date.setHours(0)
          date.setMinutes(0)
          date.setSeconds(0)
          return new Date((date.getTime()/1000 + hourTime)*1000)
       },
      hisHandler(row){
          this.selectRow = row
          this.hisDialogVisiable = true
          this.hisListLoading = true

          getHisShiftList({
              shiftId:row.shiftId,
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              this.hisListLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.hisTableData = res.data
              }
          }).catch(() => {
              this.hisListLoading = false
          })
      }
  }
}
</script>

<style lang="scss" scoped>
.t-top-bar{
  margin-bottom: 15px;
}
.search-input {
  width: 350px;
}
.l-add-buttion{
  font-size: 35px;
  float: right;
  cursor: pointer;
}
</style>