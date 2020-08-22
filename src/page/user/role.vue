<template>
  <div class="role-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="roleId" label="角色编号" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="createTime" label="添加时间">
          <template slot-scope="scope">
            {{scope.row.createTime | formateTime()}}
          </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间">
          <template slot-scope="scope">
              {{scope.row.updateTime | formateTime()}}
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />


    <el-dialog :title="opFlag=='add'?'添加角色':'修改角色'" :visible.sync="addDialogVisiable" @close="addClose" width="650px">
      <el-form :model="addForm":rules="rules" ref="addForm">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限设置" :label-width="formLabelWidth">
          <div class="add-role-auth-tree">
            <el-tree ref="tree"node-key="menuId" :default-checked-keys="defaultCheckedKeys"  show-checkbox :data="treeData" :props="defaultTree" @node-click="handleNodeClick"></el-tree>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此角色信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCloseHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { addRole,updaterole,deleteRole,getRolePageList } from '../../api/role'
    import { findUserMenus,findUserConfigMenus } from '../../api/menu'
export default {
  name: "role",
    components: {
        Pagination,
    },
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
      addForm: {
          roleName: '',
        auth: '',
         customerId:''
      },
        rules: {
            roleName: [
                { required: true, message: '角色名称不能为空', trigger: 'blur' }
            ],
        },
      treeData: [],
      defaultTree: {
        children: 'children',
        label: 'name'
      },
        defaultCheckedKeys:[],
        listQuery: {
            page: 1,
            size: 10,
            keyword: ''
        },
        total: 0,
        listLoading: true,
        opFlag:'add',
        selectRow: ''
    }
  },
    mounted(){
      this.getList()
    },
  methods: {
    addHandler() {
        this.opFlag = 'add'
        this.findUserMenus_()
      this.addDialogVisiable = true
    },
      addClose(){
          this.$refs['addForm'].resetFields()
        this.defaultCheckedKeys = []
          this.addForm = {
              roleName: '',
              auth: '',
              customerId:''
          }
      },
    editHandler(row) {
        this.selectRow = row
        this.opFlag = 'edit'
        this.addForm.roleName = row.roleName
        this.findUserConfigMenus_()

    },
    delHandler(row){
        this.selectRow = row
      this.confirmVisible = true
    },

    confirmCloseHandler() {
        deleteRole({
            roleId: this.selectRow.roleId
        }).then((res)=>{
            if(res.errorcode==0){
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.confirmVisible = false
                this.getList()
            }else{
                this.$message({
                    message: res.message,
                    type: 'error'
                })
            }
        })
    },
      findUserMenus_(){
          findUserMenus({
              userId:'00000000'
          }).then((res)=>{
              console.log(res.data)
              if(res.errorcode==0){
                  this.treeData = res.data
              }
          })
      },
      findUserConfigMenus_(){
          findUserConfigMenus({
              roleId: this.selectRow.roleId
          }).then((res)=>{
              if(res.errorcode==0){
                  this.treeData = res.data
                  this.addDialogVisiable = true
                  let arr = []
                  this.setCheckKeys(arr,res.data)
                  this.defaultCheckedKeys = arr
                  console.log(arr)
              }
          })
      },
      setCheckKeys(arr=[],treeData){
          for (let i = 0,len=treeData.length; i < len; i++) {
              if(treeData[i].authed == 1){
                  arr.push(treeData[i].menuId)
              }
              if(treeData[i].children){
                  this.setCheckKeys(arr,treeData[i].children)
              }
          }
      },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              if(this.opFlag == 'add'){
                  delete param.roleId
              }else if(this.opFlag == 'edit'){
                  param.roleId = this.selectRow.roleId
              }
              let arr = this.$refs.tree.getCheckedKeys()
              if(arr.length == 0){
                  this.$message({
                      message: '请选择权限',
                      type: 'error'
                  })
                  return
              }
              param.auth = arr.join(',')
              param.customerId = '0000'
              if(this.opFlag=='add'){
                  addRole(param).then((res)=>{
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
                  updaterole(param).then((res)=>{
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
          let param = Object.assign({customerId:'0000'}, this.listQuery)
          getRolePageList(param).then(res => {
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
    handleNodeClick(data) {
      console.log(this.$refs.tree.getCheckedKeys());
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
.add-role-auth-tree {
  height: 325px;
  overflow: auto;
}
</style>