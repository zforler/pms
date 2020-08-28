<template>
  <div class="card-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
        <el-select class="search-option" v-model="listQuery.cardType"@change="getList()" placeholder="卡类型">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="(val,key) in selectDic('CARD_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
        </el-select>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="cardId" label="电卡编号" width="100"></el-table-column>
      <el-table-column prop="cardNo" label="电卡内码"></el-table-column>
      <!--<el-table-column prop="cardName" label="电卡名称"></el-table-column>-->
      <el-table-column prop="cardType" label="电卡类型">
          <template slot-scope="scope">
              {{scope.row.cardType | dicFilter('CARD_TYPE')}}
          </template>
      </el-table-column>
      <el-table-column prop="staffName" label="绑定员工"></el-table-column>
      <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
              {{scope.row.status | dicFilter('CARD_STATUS')}}
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="180">
          <template slot-scope="scope">
              {{scope.row.createTime | formateTime()}}
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i v-if="scope.row.status==0" class="el-icon-unlock el-icon-table" @click="lockHandler(scope.row)"></i>
          <i v-else class="el-icon-lock el-icon-table" @click="unlockHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
      <!-- 分页组件 -->
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />


    <el-dialog :title="opFlag=='add'?'添加电卡':'编辑电卡'" :visible.sync="addDialogVisiable" width="550px" @close="addCloseHandler">
      <el-form :model="addForm":rules="rules" ref="addForm">
        <el-form-item label="电卡内码" prop="cardNo" :label-width="formLabelWidth">
          <el-input v-model="addForm.cardNo" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="电卡名称" prop="cardName" :label-width="formLabelWidth">-->
          <!--<el-input v-model="addForm.cardName" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="电卡类型" prop="cardType" :label-width="formLabelWidth">
            <el-select :disabled="opFlag=='edit'" v-model="addForm.cardType" placeholder="请选电卡类型">
                <el-option v-for="(val,key) in selectDic('CARD_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="addForm.cardType==1" label="绑定员工" prop="staffId" :label-width="formLabelWidth">
            <el-select v-model="addForm.staffId" filterable placeholder="请选择">
                <el-option v-for="item in unbindCardStaff" :key="item.staffId"
                        :label="item.staffName"  :value="item.staffId">
                </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此电卡信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { getCardPageList,addCard,updateCard,getUnbindCardStaffList,updateCardStatus } from '../../api/card'
    import localCache from "../../util/localCache";
export default {
  name: "card",
    components: {
        Pagination
    },
  data() {
    return {
      addDialogVisiable: false,
        opFlag: 'add',
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
      addForm: {
          cardId: '',
          cardNo: '',
          cardName: '',
          cardType: '',
          staffId: '',
      },
        rules: {
            // cardName: [
            //     { required: true, message: '电卡名称不能为空', trigger: 'blur' },
            //     { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
            // ],
            cardNo: [
                { required: true, message: '电卡内码不能为空', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 2 到 64 个字符', trigger: 'blur' }
            ],
            cardType: [
                { required: true, message: '请选择卡类型', trigger: 'change' },
            ],
        },
        listQuery: {
            page: 1,
            size: 10,
            keyword: '',
            departmentId:'',
            staffType:'',
            sex:'',
            status:''
        },
        total: 0,
        listLoading: true,
        unbindCardStaff:[],
        selectRow:''
    }
  },
    mounted(){
        this.getList()
    },
  methods: {
    addHandler() {
        this.opFlag = 'add'
      this.addDialogVisiable = true
        this.getUnbindCardStaffList_()
    },
    editHandler(row) {
        this.selectRow = row
        this.opFlag = 'edit'
        this.addForm = Object.assign({}, row)
        this.addForm.cardType += ''
      this.addDialogVisiable = true
        this.getUnbindCardStaffList_()
    },
    lockHandler(row){
      this.selectRow = row
        this.updateCardStatus_(2)
    },
      unlockHandler(row){
          this.selectRow = row
          this.updateCardStatus_(0)
      },
    confirmCloseHandler() {

    },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opFlag=='add'){
                  addCard(param).then((res)=>{
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
                  updateCard(param).then((res)=>{
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
          this.listQuery.customerId = localCache.getCurrentCustomerId()
         
          getCardPageList(this.listQuery).then(res => {
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
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              cardId: '',
              cardNo: '',
              cardName: '',
              cardType: '',
              staffId: '',
          }
      },
      getUnbindCardStaffList_(){
          getUnbindCardStaffList({
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.unbindCardStaff = res.data
              }
          }).catch(() => {
          })
      },
      updateCardStatus_(status){
          updateCardStatus({
              cardId:this.selectRow.cardId,
              status: status
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.$message.success(res.message)
                  this.getList()
              }
          }).catch(() => {
          })
      }
  }
}
</script>

<style lang="scss">
    .card-container{
        .el-form {
            padding-right: 50px;
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
    }


</style>