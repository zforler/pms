<template>
  <div class="batch-container">
    <div class="batch-incon batch-left">
      <div class="t-top-bar">
        <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="listLoading"
                ref="singleTable"  highlight-current-row @current-change="handleCurrentChange">
        <el-table-column prop="batchId" label="批次编号" width="80"></el-table-column>
        <el-table-column prop="batchName" label="批次名称"></el-table-column>
        <el-table-column prop="createTime" label="添加时间">
            <template slot-scope="scope">
                {{scope.row.createTime | formateTime()}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-incon batch-right">
      <div class="t-top-bar">
        <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
          <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
        </el-input>
        <i class="el-icon-circle-plus-outline l-add-buttion" @click="addBatchItemHandler"></i>
      </div>
      <el-table :data="itemTableData" border style="width: 100%" v-loading="itemListLoading">
        <el-table-column prop="itemId" label="自定义编号"></el-table-column>
        <el-table-column prop="beginTime" label="生效时间" width="180">
            <template slot-scope="scope">
                {{scope.row.beginTime | formateTime()}}
            </template>
        </el-table-column>
        <el-table-column prop="endTime" label="失效时间" width="180">
            <template slot-scope="scope">
                {{scope.row.endTime | formateTime()}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit el-icon-table" @click="editItemHandler(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
        <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getItemList" />
    </div>


    <el-dialog :title="opFlag=='add'?'添加批次':'修改批次'" :visible.sync="addDialogVisiable" @close="addCloseHandler" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="批次名称" prop="batchName" :label-width="formLabelWidth">
          <el-input v-model="addForm.batchName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此批次信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>


      <el-dialog :title="opItemFlag=='add'?'添加批次':'修改批次'" :visible.sync="addItemDialogVisiable"
                 @close="addItemCloseHandler" width="650px">
          <el-form :model="addItemForm" :rules="itemRules" ref="addItemForm">
              <el-form-item label="批次名称" prop="itemId" :label-width="formLabelWidth">
                  <el-input v-model="addItemForm.itemId" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="生效时间" prop="beginTime" :label-width="formLabelWidth">
                  <el-date-picker v-model="addItemForm.beginTime" type="datetime"  placeholder="生效时间">
                  </el-date-picker>
              </el-form-item>
              <el-form-item label="失效时间" prop="endTime" :label-width="formLabelWidth">
                  <el-date-picker v-model="addItemForm.endTime" type="datetime" placeholder="失效时间">
                  </el-date-picker>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="addItemDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="addItemConfirm">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { addBatch,updateBatch,getBatchList,getBatchItemPageList,addBatchItem,updateBatchItem } from '../../api/batch'
    import localCache from "../../util/localCache";
export default {
  name: "batch",
    components: {
        Pagination,
    },
  data() {
    return {
        opFlag: 'add',
        opItemFlag: 'add',
      addDialogVisiable: false,
        addItemDialogVisiable: false,
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
        itemTableData: [],
      addForm: {
          batchName: ''
      },
        rules: {
            batchName: [
                { required: true, message: '批次名不能为空', trigger: 'blur' },
                { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
            ],
        },
        listLoading: true,
        selectRow: '',
        listQuery: {
            page: 1,
            size: 10,
            keyword: ''
        },
        total: 0,
        itemListLoading: false,
        addItemForm: {
            itemId: '',
            beginTime:'',
            endTime:''
        },
        itemRules: {
            itemId: [
                { required: true, message: '编号不能为空', trigger: 'blur' },
                { min: 2, max: 32, message: '长度在 2 到 64 个字符', trigger: 'blur' }
            ],
            beginTime: [
                { required: true, message: '请选择生效时间', trigger: 'change' },
            ],
            endTime: [
                { required: true, message: '请选择失效时间', trigger: 'change' },
            ],
        },
        selectItemRow: '',
    }
  },
    mounted(){
        this.getList()
    },
  methods: {
      setCurrent(row) {
          this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(row){
        this.selectRow = row
          this.getItemList()
      },
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              batchName: '',
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
    confirmCloseHandler() {

    },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              if(this.opFlag == 'add'){

              }else if(this.opFlag == 'edit'){
                  param.batchId = this.selectRow.batchId
              }
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opFlag=='add'){
                  addBatch(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success( '添加成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }else{
                  updateBatch(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success( '修改成功')
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
          getBatchList({
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.tableData = res.data
                  if(this.tableData || this.tableData.length>0){
                      this.setCurrent(this.tableData[0])
                  }

              }
          }).catch(() => {
              this.listLoading = false
          })
      },
      getItemList(){
          this.itemListLoading = true
          this.listQuery.batchId = this.selectRow.batchId
          getBatchItemPageList(this.listQuery).then(res => {
              this.itemListLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.itemTableData = res.data.content

              }
          }).catch(() => {
              this.itemListLoading = false
          })
      },
      addBatchItemHandler(){
          this.opItemFlag = 'add'
          this.addItemDialogVisiable = true
      },
      editItemHandler(row) {
          this.selectItemRow = row
          this.opItemFlag='edit'
          this.addItemForm = Object.assign({}, row)
          this.addItemForm.beginTime = new Date(row.beginTime*1000)
          this.addItemForm.endTime = new Date(row.endTime*1000)
          this.addItemDialogVisiable = true
      },
      addItemCloseHandler(){
          this.$refs['addItemForm'].resetFields()
          this.addItemForm =  {
              itemId: '',
              beginTime:'',
              endTime:''
          }
      },
      addItemConfirm(){
          this.$refs['addItemForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addItemForm)
              param.beginTime = param.beginTime.getTime()/1000
              param.endTime = param.endTime.getTime()/1000
              if(param.beginTime>=param.endTime){
                  this.$message.error('失效时间不能小于失效时间')
                  return
              }
              param.batchId = this.selectRow.batchId
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opItemFlag=='add'){
                  addBatchItem(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success( '添加成功')
                          this.addItemDialogVisiable = false
                          this.getItemList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }else{
                  updateBatchItem(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('修改成功')
                          this.addItemDialogVisiable = false
                          this.getItemList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }
          });
      }
  }
}
</script>

<style lang="scss" scoped>
  .batch-container{
    display: flex;
  }
  .batch-incon{
    width: 50%;
  }
  .batch-left{
    padding-right: 8px;
  }
  .batch-right{
    padding-left: 8px;
  }
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