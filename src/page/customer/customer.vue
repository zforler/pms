<template>
  <div class="customer-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" v-if="authedCheck('添加客户')" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="customerId" label="客户编号" width="80"></el-table-column>
      <el-table-column prop="company" label="公司名称"></el-table-column>
      <el-table-column prop="address" label="公司地址"></el-table-column>
      <el-table-column prop="concator" label="公司负责人"></el-table-column>
      <el-table-column prop="concatorPhone" label="联系方式"></el-table-column>
        <el-table-column prop="equipmentCount" label="设备数量"></el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-tooltip content="客户信息编辑" placement="top">
            <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />


    <el-dialog :title="opFlag=='add'?'添加客户信息':'编辑客户信息'" @close="addCloseHandler" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm":rules="rules" ref="addForm">
        <el-form-item label="公司名称" prop="company" :label-width="formLabelWidth">
          <el-input v-model="addForm.company" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address"  :label-width="formLabelWidth">
          <el-input v-model="addForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司负责人" prop="concator"  :label-width="formLabelWidth">
          <el-input v-model="addForm.concator" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="concatorPhone"  :label-width="formLabelWidth">
          <el-input v-model="addForm.concatorPhone" autocomplete="off"></el-input>
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
    import Pagination from '@/components/Pagination';
    import { addCustomer,updateCustomer,getCustomerPageList } from '../../api/customer'
export default {
name: "customer",
    components: {
        Pagination,
    },
  data() {
    return {
      addDialogVisiable: false,
      opFlag: 'add',
      formLabelWidth: '120px',
      tableData: [],
      addForm: {
          company: '',
          address: '',
          concator: '',
          concatorPhone: ''
      },
        rules: {
            company: [
                { required: true, message: '公司名不能为空', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3 到 64 个字符', trigger: 'blur' }
            ],
            address: [
                { required: true, message: '地址不能为空', trigger: 'blur' },
                { min: 3, max: 8, message: '长度在 3 到 100 个字符', trigger: 'blur' }
            ],
            concator: [
                { required: true, message: '联系人不能为空', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
            ],
            concatorPhone: [
                { required: true, message: '联系方式', trigger: 'blur' },
                { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
            ],
        },
        listQuery: {
            page: 1,
            size: 10,
            keyword: ''
        },
        total: 0,
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
              company: '',
              address: '',
              concator: '',
              concatorPhone: ''
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
                  delete param.customerId
              }else if(this.opFlag == 'edit'){
                  param.customerId = this.selectRow.customerId
              }

              if(this.opFlag=='add'){
                  addCustomer(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message({
                              message: '添加成功',
                              type: 'success'
                          })
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message({
                              message: res.message,
                              type: 'error'
                          })
                      }
                  })
              }else{
                  updateCustomer(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message({
                              message: '修改成功',
                              type: 'success'
                          })
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message({
                              message: res.message,
                              type: 'error'
                          })
                      }
                  })
              }
          });
      },
      getList() {
          this.listLoading = true
          getCustomerPageList(this.listQuery).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.tableData = res.data.content
                  this.total = res.data.total
              }
          }).catch(() => {
              this.listLoading = false
          })
      },
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