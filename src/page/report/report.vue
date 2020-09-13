<template>
  <div class="report-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="reportName" label="报表名称"></el-table-column>
      <el-table-column prop="path" label="报表访问路径" ></el-table-column>
      <el-table-column prop="filePath" label="报表文件路径"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-share el-icon-table" @click="shareHandler(scope.row)"></i>
          <i class="el-icon-notebook-1 el-icon-table" @click="hisRoleHandler(scope.row)"></i>
            <i class="el-icon-s-grid el-icon-table" @click="detailHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="opFlag=='add'?'添加报表':'修改报表'" :visible.sync="addDialogVisiable"
               @close="addCloseHandler" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="报表名称" prop="reportName" :label-width="formLabelWidth">
          <el-input v-model="addForm.reportName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="报表访问路径" prop="path" :label-width="formLabelWidth">
          <el-input v-model="addForm.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="报表文件路径" prop="filePath" :label-width="formLabelWidth">
          <el-input v-model="addForm.filePath" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

      <el-dialog title="分配报表" :visible.sync="shareDialogVisiable"
                 @close="shareCloseHandler" width="650px">
          <el-table :data="customerTableData" border style="width: 100%"
                    @selection-change="shareCustomerChange" v-loading="listLoading">
              <el-table-column type="selection"  width="55">
              </el-table-column>
              <el-table-column prop="customerId" label="客户编号" width="80"></el-table-column>
              <el-table-column prop="company" label="公司名称"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button @click="shareDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="shareConfirm">确 定</el-button>
          </div>
      </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此报表?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteReport_">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import { addReport,updateReport,getReportList,shareReport,cancleShareReport,deleteReport } from '../../api/report'
    import { getNoReportCustomerList,getHasReportCustomerList } from '../../api/customer'
    import localCache from "../../util/localCache";
    import Layout from "@/components/layout/Layout"
export default {
  name: "report",
  data() {
    return {
      addDialogVisiable: false,
        shareDialogVisiable: false,
        opFlag: 'add',
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
        customerTableData:[],
      addForm: {
          reportName:'',
          path:'',
          filePath:'',
      },
        rules: {
            reportName: [
                { required: true, message: '报表名不能为空', trigger: 'blur' },
                { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
            ],
            path: [
                { required: true, message: '路径不能为空', trigger: 'blur' },
                { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
            ],
            filePath: [
                { required: true, message: '文件路径不能为空', trigger: 'blur' },
                { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' }
            ],
        },
        listQuery: {
            keyword: ''
        },
        listLoading: true,
        selectRow: '',
        shareCustomerSelect:[]
    }
  },
    mounted(){
        this.getList()
    },
  methods: {
      confirmCloseHandler(){

      },
      delHandler(row){
          this.confirmVisible = true
          this.selectRow = row
      },
      deleteReport_(){
          deleteReport({
              customerId:localCache.getCurrentCustomerId(),
              reportId: this.selectRow.reportId
          }).then((res)=>{
              if(res.errorcode==0){
                  this.$message.success('删除成功')
                  this.confirmVisible = false
                  this.getList()
              }else{
                  this.$message.error(res.message)
              }
          })
      },
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              reportName:'',
              path:'',
              filePath:'',
          }
      },
      addHandler() {
          this.opFlag='add'
          this.addDialogVisiable = true
      },
      editHandler(row) {
          this.selectRow = row
          this.opFlag='edit'
          this.addForm = Object.assign({}, row)
          this.addDialogVisiable = true
      },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              if(this.opFlag == 'add'){

              }else if(this.opFlag == 'edit'){
                  param.reportId = this.selectRow.reportId
              }
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opFlag=='add'){
                  addReport(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('添加成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }else{
                  updateReport(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('修改成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }
          });
      },
      getList() {
          this.listLoading = true
          this.listQuery.customerId = localCache.getCurrentCustomerId()
          getReportList(this.listQuery).then(res => {
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
      getNoReportCustomerList_(){
          getNoReportCustomerList({
              reportId: this.selectRow.reportId
          }).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.customerTableData = res.data
              }
          }).catch(() => {
              this.listLoading = false
          })
      },
      shareHandler(row){
          this.opFlag = 'share'
          this.selectRow = row
          this.shareDialogVisiable = true
          this.getNoReportCustomerList_()
      },
      shareCloseHandler(){
          this.opFlag = 'add'
          this.shareCustomerSelect = []
      },
      shareConfirm(){
          if(this.shareCustomerSelect.length == 0){
              this.$message.error('请选择客户')
              return
          }
          if(this.opFlag == 'share'){
              shareReport({
                  customerIds: this.shareCustomerSelect.map(t=>t.customerId).join(','),
                  reportId: this.selectRow.reportId
              }).then(res => {
                  this.listLoading = false
                  if (res.errorcode !== 0) {
                      this.$message.error(res.message)
                  } else {
                      this.$message.success('分配成功')
                      this.shareDialogVisiable = false
                  }
              }).catch(() => {
                  this.listLoading = false
              })
          }else if(this.opFlag == 'cancle'){
              cancleShareReport({
                  customerIds: this.shareCustomerSelect.map(t=>t.customerId).join(','),
                  reportId: this.selectRow.reportId
              }).then(res => {
                  this.listLoading = false
                  if (res.errorcode !== 0) {
                      this.$message.error(res.message)
                  } else {
                      this.$message.success('取消分配成功')
                      this.shareDialogVisiable = false
                  }
              }).catch(() => {
                  this.listLoading = false
              })
          }

      },
      shareCustomerChange(val){
          console.log(val)
          this.shareCustomerSelect = val
      },
      hisRoleHandler(row){
          this.opFlag = 'cancle'
          this.selectRow = row
          this.shareDialogVisiable = true
          getHasReportCustomerList({
              reportId: this.selectRow.reportId
          }).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.customerTableData = res.data
              }
          }).catch(() => {
              this.listLoading = false
          })
      },
      detailHandler(row){
          let reportName = row.reportName
          let rout = [{
              name: row.path,
              path: '/',
              component: Layout,
              children: [
                  {
                      name: reportName,
                      path: row.path,
                      component:  this.$root._import(row.filePath)
                  }
              ]
          }]
            localCache.setReport(row.path, row)
         this.$router.addRoutes(rout)
          this.$router.push({name: reportName,params: { reportId: row.reportId }})
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