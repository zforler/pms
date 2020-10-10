<template>
  <div class="production-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" v-if="authedCheck('添加产品')" title="添加产品"
         @click="addHandler"></i>
        <i class="el-icon-share l-add-buttion" v-if="authedCheck('产品信息同步')" title="产品信息同步"
           @click="dispatchHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="productionId" label="产品编号" width="100"></el-table-column>
      <el-table-column prop="productionName" label="产品名称"></el-table-column>
      <el-table-column prop="createTime" label="添加时间">
          <template slot-scope="scope">
              {{scope.row.createTime | formateTime()}}
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" v-if="authedCheck('编辑产品')" title="编辑产品"
             @click="editHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="opFlag=='add'?'添加产品':'修改产品'" :visible.sync="addDialogVisiable"
               @close="addCloseHandler"  width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="产品名称" prop="productionName" :label-width="formLabelWidth">
          <el-input v-model="addForm.productionName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <DispatchDialog ref="dispatchDialog" :dispatchType="3"></DispatchDialog>
  </div>
</template>

<script>
    import { addProduction,updateProduction,getProductionList } from '../../api/prouction'
    import localCache from "../../util/localCache";
    import DispatchDialog from '../../components/DispatchDialog/DispatchDialog'
    export default {
  name: "production",
        components:{
            DispatchDialog
        },
  data() {
    return {
      addDialogVisiable: false,
        opFlag: 'add',
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
      addForm: {
        productionName:''
      },
        rules: {
            productionName: [
                { required: true, message: '产品名不能为空', trigger: 'blur' },
                { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
            ],
        },
        listQuery: {
            keyword: ''
        },
        listLoading: true,
        selectRow: ''
    }
  },
        mounted(){
            this.getList()
        },
  methods: {
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              productionName: '',
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
                  param.productionId = this.selectRow.productionId
              }
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opFlag=='add'){
                  addProduction(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('添加成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }else{
                  updateProduction(param).then((res)=>{
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
          getProductionList(this.listQuery).then(res => {
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
      dispatchHandler(){
          this.$refs.dispatchDialog.open()
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