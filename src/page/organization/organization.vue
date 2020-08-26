<template>
  <div class="organization-container">
    <div class="org-tree">
      <div class="org-tree-btns">
        <i class="el-icon-circle-plus-outline l-operate-buttion" @click="addHandler"></i>
      </div>
      <el-tree :data="treeData"  :props="defaultTree" :expand-on-click-node="false">
           <div class="depart-tree-node" slot-scope="{ node, data }">
                <span @click="treeDetailHandler(node, data)">{{ node.label }}</span>
                <span class="depart-tree-node-btn">
                   <i class="el-icon-edit el-icon-tree" @click="() => editHandler(node, data)"></i>
                    <i v-if="data.type==3" class="el-icon-user-solid el-icon-tree" @click="() => staffHandler(node, data)"></i>
                   <i v-else class="el-icon-share el-icon-tree" @click="() => addSub(data)"></i>

                </span>
            </div>
      </el-tree>
    </div>
    <div class="org-his">

        <div v-if="showFlag=='his'">
            <div class="org-his-title">
                变更记录
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="上级部门编号"></el-table-column>
                <el-table-column prop="name" label="上级部门名称"></el-table-column>
                <el-table-column prop="address" label="管理开始时间"></el-table-column>
                <el-table-column prop="name" label="管理结束时间"></el-table-column>
                <el-table-column prop="name" label="变更类型"></el-table-column>
                <el-table-column prop="name" label="部门名称"></el-table-column>
            </el-table>
        </div>
        <div v-else-if="showFlag=='staff'">
            <div class="org-his-title">
                班组员工
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="员工编号"></el-table-column>
                <el-table-column prop="name" label="员工名称"></el-table-column>
                <el-table-column prop="address" label="加入时间"></el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-tooltip content="移除" placement="top">
                            <i class="el-icon-delete el-icon-table" @click="removeHandler(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>


    <el-dialog :title="opFlagMap[opFlag]" :visible.sync="addDialogVisiable" @close="addClose" width="650px">
      <el-form :model="addForm":rules="rules" ref="addForm">
        <el-form-item label="部门名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门类型" prop="type" :label-width="formLabelWidth">
            <el-select :disabled="selectRow.type==2 || opFlag=='edit'" v-model="addForm.type" placeholder="请选部门类型">
                <el-option v-for="(val,key) in selectDic('DEPART_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

      <el-dialog title="选择员工" :visible.sync="addStaffDialogVisiable" @close="addStaffClose" width="850px">
          <div class="t-top-bar">
              <el-input placeholder="员工编号、员工姓名" v-model="listQuery.keyword" class="input-with-select search-input">
                  <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getAddStaffList">搜索</el-button>
              </el-input>
              <el-select class="search-option" v-model="listQuery.staffType"@change="getAddStaffList" placeholder="员工类型">
                  <el-option label="全部" :value="-1"></el-option>
                  <el-option v-for="(val,key) in selectDic('STAFF_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
              </el-select>
              <el-select class="search-option" v-model="listQuery.sex"@change="getAddStaffList" placeholder="员工性别">
                  <el-option label="全部" :value="-1"></el-option>
                  <el-option v-for="(val,key) in selectDic('SEX')" :key="key" :label="val.name" :value="val.code"></el-option>
              </el-select>
          </div>
          <el-table :data="addStafftableData" border style="width: 100%" v-loading="listLoading"
                    @selection-change="handleSelectionChange" max-height="500px">
              <el-table-column  type="selection" width="55">
              </el-table-column>
              <el-table-column prop="staffId" label="员工编号"></el-table-column>
              <el-table-column prop="staffName" label="员工姓名"></el-table-column>
              <el-table-column prop="sex" label="性别" width="80">
                  <template slot-scope="scope">
                      {{scope.row.sex | dicFilter('SEX')}}
                  </template>
              </el-table-column>
              <el-table-column prop="staffType" label="员工类型">
                  <template slot-scope="scope">
                      {{scope.row.staffType | dicFilter('STAFF_TYPE')}}
                  </template>
              </el-table-column>
              <el-table-column prop="entryTime" label="入职时间">
                  <template slot-scope="scope">
                      {{scope.row.entryTime | formateTime()}}
                  </template>
              </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button @click="addStaffDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="addStaffConfirm">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import { addDepartment,updateDepartment,getDepartmentList } from '../../api/department'
    import { getStaffPageList } from '../../api/staff'
    import localCache from "../../util/localCache";
export default {
name: "Organization",
  data() {
    return {
        listLoading:false,
      addDialogVisiable: false,
        addStaffDialogVisiable:false,
        opFlag: 'add',
        opFlagMap:{
            add:'添加部门',
            edit:'修改部门结构',
            addsub:'添加下级'
        },
      formLabelWidth: '120px',
      addForm: {
        name: '',
        type: '1'
      },
        rules: {
            name: [
                { required: true, message: '部门名称不能为空', trigger: 'blur' },
                { min: 2, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ],
            type: [
                { required: true, message: '请选择部门类型', trigger: 'blur' }
            ],
        },
        treeData: [],
        addStafftableData:[],
        defaultTree: {
          children: 'children',
              label: 'name'
        },
      tableData: [],
        selectRow: '',
        showFlag: 'his',
        listQuery: {
            page: 1,
            size: 10,
            keyword: '',
            departmentId:'',
            staffType:'',
            sex:'',
            status:''
        },
        addStaffSelect:[]
      }
  },
    mounted(){
        this.getTree()
    },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
      addClose(){
          this.$refs['addForm'].resetFields()
          this.addForm = {
              name: '',
              type: '1'
          }
      },
    addHandler() {
      this.addDialogVisiable = true
    },
    editHandler(node,data) {
        this.opFlag = 'edit'
        this.selectRow = data
        this.addForm.type = ''+data.type
      this.addDialogVisiable = true
    },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              if(this.opFlag=='add'){
                  addDepartment({
                      name: this.addForm.name,
                      type: this.addForm.type,
                      customerId:localCache.getCurrentCustomerId()
                  }).then((res)=>{
                      if(res.errorcode==0){
                          this.$message({
                              message: '添加成功',
                              type: 'success'
                          })
                          this.addDialogVisiable = false
                          this.getTree()
                      }else{
                          this.$message({
                              message: res.message,
                              type: 'error'
                          })
                      }
                  })
              }else if(this.opFlag == 'edit'){
                  updateDepartment({
                      id: this.selectRow.id,
                      name: this.addForm.name,
                  }).then((res)=>{
                      if(res.errorcode==0){
                          this.$message({
                              message: '修改成功',
                              type: 'success'
                          })
                          this.addDialogVisiable = false
                          this.getTree()
                      }else{
                          this.$message({
                              message: res.message,
                              type: 'error'
                          })
                      }
                  })
              }else if(this.opFlag == 'addsub'){
                  addDepartment({
                      name: this.addForm.name,
                      type: this.addForm.type,
                      customerId:localCache.getCurrentCustomerId(),
                      parentId: this.selectRow.departmentId
                  }).then((res)=>{
                      if(res.errorcode==0){
                          this.$message({
                              message: '修改成功',
                              type: 'success'
                          })
                          this.addDialogVisiable = false
                          this.getTree()
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
      getTree() {
          getDepartmentList({
              customerId:localCache.getCurrentCustomerId()
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.treeData = res.data
              }
          }).catch(() => {
          })
      },
      treeDetailHandler(node, data){
        if(data.type == 3){
            this.showFlag = 'staff'
        }else{
            this.showFlag = 'his'
        }
      },
      addSub(data){
        this.opFlag = 'addsub'
          this.selectRow = data
          console.log(data.type)
          if(data.type == 2){
            this.addForm.type = '3'
          }
          this.addDialogVisiable = true
      },
      staffHandler(){
          this.showFlag = 'staff'
          this.getAddStaffList()
        this.addStaffDialogVisiable = true
      },
      removeHandler(row){
        this.selectRow = row
      },
      addStaffClose(){

      },
      addStaffConfirm(){

      },
      getAddStaffList() {
          this.listLoading = true
          this.listQuery.customerId = localCache.getCurrentCustomerId()
          getStaffPageList(this.listQuery).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.addStafftableData = res.data.content
              }
          }).catch(() => {
              this.listLoading = false
          })
      },
      handleSelectionChange(val){
        this.addStaffSelect = val
          console.log(val)
      }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common";
.organization-container {
  height: calc(100vh - 205px);
    .search-option{
        width:120px;
    }
}
.l-add-buttion{

}
.org-tree{
  float:left;
  width: 30%;
  height: 100%;
}
.org-tree-btns{
  text-align: right;
    padding-bottom: 10px;
}
.l-operate-buttion{
  margin-right: 8px;
}
.org-his{
  float: left;
  width: 70%;
  border-left: #ccc thin solid;
  padding-left: $p-25;
  height: 100%;
}
.org-his-title{
  font-size: 20px;
  padding: 5px 0px;
}
    .depart-tree-node{
        display: flex;
        width: 100%;
        justify-content: space-between;
        height: 45px;
        align-items: center;
    }
    .depart-tree-node-btn{
        padding: 0 8px;
        font-size: 18px;
    }
    .el-icon-tree{
        margin-left: 5px;
    }
.el-icon-tree:hover{
    font-size: 22px;
}
</style>