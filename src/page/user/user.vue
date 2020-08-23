<template>
  <div class="user-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%"  v-loading="listLoading">
      <el-table-column prop="userId" label="用户编号" width="100"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="realName" label="用户姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
              {{scope.row.sex | dicFilter('SEX')}}
          </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="roleName" label="用户角色"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
          <i v-if="scope.row.status==0" class="el-icon-unlock el-icon-table" @click="setLockHandler(scope.row)"></i>
          <i v-else class="el-icon-lock el-icon-table" @click="setLockHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />


    <el-dialog :title="opFlag=='add'?'添加用户':'修改用户'" :visible.sync="addDialogVisiable" @close="addCloseHandler" width="650px">
      <el-form :model="addForm":rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="userName" :label-width="formLabelWidth">
          <el-input v-model="addForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="realName" :label-width="formLabelWidth">
          <el-input v-model="addForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
            <el-select v-model="addForm.sex" placeholder="请选是否可见">
                <el-option v-for="(val,key) in selectDic('SEX')" :key="key" :label="val.name" :value="val.code"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="roleId" :label-width="formLabelWidth">
            <el-select v-model="addForm.roleId" filterable  placeholder="请选是否可见">
                <el-option v-for="(val,key) in roleList" :key="key" :label="val.roleName" :value="val.roleId"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此用户信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { addUser,updateUser,getUserPageList } from '../../api/user'
    import { getRoleList } from '../../api/role'
    import localCache from "../../util/localCache";
export default {
name: "user",
    components: {
        Pagination,
    },
  data() {
    return {
      addDialogVisiable: false,
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
        opFlag:'add',
      addForm: {
          userId: '',
          userName: '',
          realName: '',
          sex: '1',
          phone: '',
          roleId: '',
      },
        rules: {
            userName: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ],
            realName: [
                { required: true, message: '用户姓名名不能为空', trigger: 'blur' },
                { min: 3, max: 8, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ],
            sex: [
                { required: true, message: '请选择性别', trigger: 'blur' }
            ],
            roleId: [
                { required: true, message: '请选择用户角色', trigger: 'blur' }
            ],
            phone: [
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
        roleList: [],
        selectRow:''
    }
  },
    computed:{
        test(){
            console.log(111)
            return this.$store.state.count
        }
    },
    mounted(){
        this.getList()
    },
  methods: {
    addHandler() {
        this.opFlag = 'add'
        this.getRoleList_()
      this.addDialogVisiable = true
    },
      addConfirm(){
          this.$refs['addForm'].validate((valid) => {
          if (!valid) {
              return
          }
          let param = Object.assign({}, this.addForm)
          if(this.opFlag == 'add'){
              delete param.userId
          }else if(this.opFlag == 'edit'){
              param.userId = this.selectRow.userId
          }
          param.customerId = localCache.getCurrentCustomerId()
          if(this.opFlag=='add'){
              addUser(param).then((res)=>{
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
              updateUser(param).then((res)=>{
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
    editHandler(row) {
        this.selectRow = row
        this.opFlag = 'edit'
        this.addForm = Object.assign({}, row)
        this.addForm.sex += ''
        this.getRoleList_()
      this.addDialogVisiable = true
    },
    delHandler(row){
      this.confirmVisible = true
    },
      addCloseHandler(){
        this.$refs['addForm'].resetFields()
        this.addForm = {
            userId: '',
            userName: '',
            realName: '',
            sex: '1',
            phone: '',
            roleId: '',
        }
      },
    setLockHandler(row){
      row.status = row.status == 0?1:0
    },
    confirmCloseHandler() {

    },
      getList() {
          this.listLoading = true
          let param = Object.assign({customerId:localCache.getCurrentCustomerId()}, this.listQuery)
          getUserPageList(param).then(res => {
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

      getRoleList_(){
          getRoleList({
              customerId:localCache.getUser().customerId
          }).then(res => {
              this.roleList = res.data
          }).catch(() => {
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