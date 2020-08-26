<template>
  <div class="staff-container">
    <div class="t-top-bar">
      <el-input placeholder="员工编号、员工姓名" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="staffId" label="员工编号" width="150"></el-table-column>
      <el-table-column prop="staffName" label="员工姓名" width="150"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80">
          <template slot-scope="scope">
              {{scope.row.sex | dicFilter('SEX')}}
          </template>
      </el-table-column>
        <el-table-column prop="departmentName" label="所属班组" width="280">
            <template slot-scope="scope">
                {{scope.row.departmentName || '--'}}
            </template>
        </el-table-column>
      <el-table-column prop="staffType" label="员工类型" width="100">
          <template slot-scope="scope">
              {{scope.row.sex | dicFilter('STAFF_TYPE')}}
          </template>
      </el-table-column>
      <el-table-column prop="entryTime" label="入职时间" width="180">
          <template slot-scope="scope">
              {{scope.row.entryTime | formateTime()}}
          </template>
      </el-table-column>
      <el-table-column prop="leaveTime" label="离职时间" width="180">
          <template slot-scope="scope">
              {{scope.row.leaveTime | formateTime()}}
          </template>
      </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
                {{scope.row.status | dicFilter('STAFF_STATUS')}}
            </template>
        </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="100"></el-table-column>
      <el-table-column prop="address" label="员工住址" width="280"></el-table-column>
      <el-table-column prop="idcard" label="身份证号" width="150"></el-table-column>
      <el-table-column fixed="right" width="140" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
          <i class="el-icon-bank-card el-icon-table" @click="delHandler(scope.row)"></i>
          <i class="el-icon-setting el-icon-table" @click="setOrgHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />


    <el-dialog title="添加员工" @close="addCloseHandler" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="员工姓名" prop="staffName" :label-width="formLabelWidth">
          <el-input v-model="addForm.staffName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
            <el-select v-model="addForm.sex" placeholder="请选性别">
                <el-option v-for="(val,key) in selectDic('SEX')" :key="key" :label="val.name" :value="val.code"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="员工类型" prop="staffType" :label-width="formLabelWidth">
              <el-select v-model="addForm.staffType" placeholder="请选员工类型">
                  <el-option v-for="(val,key) in selectDic('STAFF_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="员工类型" prop="departmentId" :label-width="formLabelWidth">
              <el-cascader
                      v-model="addForm.departmentId"
                      :options="treeData"
                      :props="{ expandTrigger: 'hover', label: 'name',value:'departmentId' }"
                      @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="入职时间" prop="entryTime" :label-width="formLabelWidth">
              <el-date-picker
                      v-model="addForm.entryTime"
                      type="datetime"
                      placeholder="入职时间">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="离职时间" :label-width="formLabelWidth">
              <el-date-picker
                      v-model="addForm.leaveTime"
                      type="datetime"
                      placeholder="离职时间">
              </el-date-picker>
          </el-form-item>
        <el-form-item label="联系方式" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工住址" prop="address" :label-width="formLabelWidth">
          <el-input v-model="addForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idcard" :label-width="formLabelWidth">
          <el-input v-model="addForm.idcard" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此员工信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置员工部门" :visible.sync="setOrgDialogVisiable" width="650px">
      <el-tree :data="treeData" :props="defaultTree" @node-click="handleNodeClick"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setOrgDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="setOrgDialogVisiable = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { addStaff,updateStaff,getStaffPageList } from '../../api/staff'
    import { getDepartmentList } from '../../api/department'
    import localCache from "../../util/localCache";
export default {
name: "staff",
  components: {
    Pagination
  },
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      confirmVisible: false,
      setOrgDialogVisiable: false,
        opFlag: 'add',
      formLabelWidth: '80px',
      tableData: [],
      addForm: {
          staffName: '',
          sex: '1',
          departmentId: '',
          staffType: '0',
          entryTime: '',
          leaveTime: '',
          status: 0,
          phone: '',
          address: '',
          idcard: '',
      },
        rules: {
            staffName: [
                { required: true, message: '员工姓名不能为空', trigger: 'blur' },
                { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
            ],
            entryTime: [
                { required: true, message: '请选择入职时间', trigger: 'change' },
            ],
            phone: [
                { min:6, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
            ],
            address: [
                { min: 2, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
            ],
            idcard: [
                { min: 18, max: 15, message: '长度 18 个字符', trigger: 'blur' }
            ],
        },
        listQuery: {
            page: 1,
            size: 10,
            keyword: ''
        },
        total: 0,
        listLoading: true,
      treeData: [],
        selectRow: '',
        selectTree: '',
        defaultTree: {
            children: 'children',
            label: 'name'
        },
    }
  },
    mounted(){
        this.getList()
        this.getTree()
    },
  methods: {
    addHandler() {
      this.addDialogVisiable = true
    },
    editHandler(row) {
      this.addDialogVisiable = true
    },
    delHandler(row){

    },
    confirmCloseHandler() {

    },
    handleNodeClick(data) {
      console.log(data);
    },
    setOrgHandler(row) {
      this.setOrgDialogVisiable = true
    },
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              staffName: '',
              sex: '1',
              departmentId: '',
              staffType: '0',
              entryTime: '',
              leaveTime: '',
              status: 0,
              phone: '',
              address: '',
              idcard: '',
          }
      },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              console.log(this.addForm)
              let param = Object.assign({}, this.addForm)
              param.customerId = localCache.getCurrentCustomerId()
              param.entryTime = param.entryTime.getTime()/1000
              if(param.leaveTime){
                  param.leaveTime = param.leaveTime.getTime()/1000
              }else{
                  param.leaveTime = 0
              }
              param.departmentId = param.departmentId[param.departmentId.length-1]
              if(this.opFlag=='add'){
                  addStaff(param).then((res)=>{
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
                  updateStaff(param).then((res)=>{
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
          getStaffPageList(this.listQuery).then(res => {
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
      handleChange(value) {
          console.log(value);
          this.selectTree = value
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
<style>
    .staff-container .el-dialog__body{
        padding: 30px 80px;
    }
</style>