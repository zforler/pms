<template>
  <div class="staff-container">
    <div class="t-top-bar">
      <el-input placeholder="员工编号、员工姓名" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
        <el-cascader class="search-option" clearable
                v-model="searchDepart" placeholder="所属班组"  :options="treeData"
                :props="{ expandTrigger: 'hover', label: 'name',value:'departmentId' }"
                @change="searchChange"></el-cascader>
        <el-select class="search-option" v-model="listQuery.staffType"@change="searchChange" placeholder="员工类型">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="(val,key) in selectDic('STAFF_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
        </el-select>
        <el-select class="search-option" v-model="listQuery.sex"@change="searchChange" placeholder="员工性别">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="(val,key) in selectDic('SEX')" :key="key" :label="val.name" :value="val.code"></el-option>
        </el-select>
        <el-select class="search-option" v-model="listQuery.status"@change="searchChange" placeholder="员工状态">
            <el-option label="全部" :value="-1"></el-option>
            <el-option v-for="(val,key) in selectDic('STAFF_STATUS')" :key="key" :label="val.name" :value="val.code"></el-option>
        </el-select>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="staffNo" label="员工编号" width="150"></el-table-column>
      <el-table-column prop="staffName" label="员工姓名" width="150"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80">
          <template slot-scope="scope">
              {{scope.row.sex | dicFilter('SEX')}}
          </template>
      </el-table-column>
        <el-table-column prop="departmentName" label="所属班组">
            <template slot-scope="scope">
                {{scope.row.departmentName || '--'}}
            </template>
        </el-table-column>
      <el-table-column prop="staffType" label="员工类型" width="100">
          <template slot-scope="scope">
              {{scope.row.staffType | dicFilter('STAFF_TYPE')}}
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
      <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="address" label="员工住址" width="280"></el-table-column>
      <!--<el-table-column prop="idcard" label="身份证号" width="150"></el-table-column>-->
      <el-table-column fixed="right" width="140" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
            <i class="el-icon-folder-add el-icon-table" @click="unBindCardHandler(scope.row)"></i>
          <i class="el-icon-bank-card el-icon-table" @click="bindCardHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />


    <el-dialog class="staff-add"  :title="opFlag=='add'?'添加员工信息':'修改员工信息'" @close="addCloseHandler" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
          <el-form-item label="员工编号" prop="staffNo" :label-width="formLabelWidth">
              <el-input :disabled="opFlag!='add'" v-model="addForm.staffNo" autocomplete="off"></el-input>
          </el-form-item>
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
          <el-form-item label="所属班组" prop="departmentId" :label-width="formLabelWidth">
              <el-cascader
                      v-model="addForm.departmentId"
                      :options="treeData" clearable
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
        <!--<el-form-item label="身份证号" prop="idcard" :label-width="formLabelWidth">-->
          <!--<el-input v-model="addForm.idcard" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此员工信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHandler">确 定</el-button>
      </span>
    </el-dialog>


      <el-dialog title="绑定电卡列表" @close="bindCardCloseHandler" :visible.sync="bindCardDialogVisiable" width="650px">
          <el-table :data="bindCardData" border style="width: 100%">
              <el-table-column prop="cardId" label="IC卡编号" width="100"></el-table-column>
              <el-table-column prop="cardNo" label="IC卡内码"></el-table-column>
              <el-table-column prop="beginTime" label="添加时间" width="180">
              <template slot-scope="scope">
                  {{scope.row.beginTime | formateTime()}}
              </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                      <i class="el-icon-delete el-icon-table" @click="unbindCardHandler(scope.row)"></i>
                  </template>
              </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button @click="bindCardDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="bindCardDialogVisiable = false">确 定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="未绑定电卡列表" @close="bindCardCloseHandler" :visible.sync="unBindCardDialogVisiable"
                 width="650px">
          <el-table :data="unBindCardData" border style="width: 100%"
                    @selection-change="unbindCardSelect">
              <el-table-column  type="selection" width="55">
              </el-table-column>
              <el-table-column prop="cardId" label="IC卡编号" width="100"></el-table-column>
              <el-table-column prop="cardNo" label="IC卡内码"></el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <pagination :total="unBindCardTotal" :page.sync="unBindCardlistQuery.page"
                      :limit.sync="unBindCardlistQuery.size" @pagination="getUnbindCardPageList_" />
          <div slot="footer" class="dialog-footer">
              <el-button @click="unBindCardDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="bindConfirm">确 定</el-button>
          </div>
      </el-dialog>

  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { addStaff,updateStaff,getStaffPageList,deleteStaff,bindCards,unbindCards } from '../../api/staff'
    import { getDepartmentList } from '../../api/department'
    import { getUnbindStaffCardList,getUnbindCardPageList,getBindCardList } from '../../api/card'
    import localCache from "../../util/localCache";
export default {
name: "staff",
  components: {
    Pagination
  },
  data() {
    return {
      searchValue: '',
        searchDepart:'',
      addDialogVisiable: false,
        bindCardDialogVisiable: false,
        unBindCardDialogVisiable:false,
      confirmVisible: false,
        opFlag: 'add',
      formLabelWidth: '80px',
      tableData: [],
        bindCardData:[],
        unBindCardData:[],
      addForm: {
          staffNo:'',
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
          cardId:'',
      },
        rules: {
            staffNo: [
                { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
            ],
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
                { min: 15, max: 18, message: '长度15 到 18 个字符', trigger: 'blur' }
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
      treeData: [],
        selectRow: '',
        selectBindCardRow: '',
        selectTree: '',
        defaultTree: {
            children: 'children',
            label: 'name'
        },
        unbindStaffCard:[],
        unBindCardlistQuery: {
            page: 1,
            size: 10,
            keyword: '',
        },
        unBindCardTotal: 0,
        unbindCardSelectArr:[],
    }
  },
    mounted(){
        this.getList()
        this.getTree()
    },
  methods: {
      searchChange(){
        this.getList()
      },
    addHandler() {
      this.addDialogVisiable = true
        this.getUnbindStaffCardList_()
    },
    editHandler(row) {
        this.selectRow = row
        this.opFlag='edit'
        this.addForm = Object.assign({}, row)
        if(row.parents){
            let arr = row.parents.split(',')
            arr.push(row.departmentId)
            this.addForm.departmentId = arr
        }
        this.addForm.staffType += ''
        this.addForm.sex += ''
        this.addForm.entryTime = new Date(row.entryTime*1000)
        this.addForm.leaveTime =row.leaveTime?new Date(row.leaveTime*1000):''
      this.addDialogVisiable = true
        this.getUnbindStaffCardList_()
    },
    delHandler(row){
          this.selectRow = row
        this.confirmVisible = true
    },
    confirmCloseHandler() {

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
              cardId:'',
          }
      },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              param.customerId = localCache.getCurrentCustomerId()
              param.entryTime = param.entryTime.getTime()/1000
              if(param.leaveTime){
                  param.leaveTime = param.leaveTime.getTime()/1000
              }else{
                  param.leaveTime = 0
              }
              if(param.departmentId){
                  param.departmentId = param.departmentId[param.departmentId.length-1]
              }
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
          if(this.searchDepart){
              this.listQuery.departmentId = this.searchDepart[this.searchDepart.length-1]
          }else{
              this.listQuery.departmentId = ''
          }
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
      confirmHandler(){
          deleteStaff({
              staffId: this.selectRow.staffId,
              customerId:localCache.getCurrentCustomerId()
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.getList()
                  this.confirmVisible = false
              }
          }).catch(() => {
          })
      },
      getUnbindStaffCardList_(){
          getUnbindStaffCardList({
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.unbindStaffCard = res.data
              }
          }).catch(() => {
          })
      },

      bindCardHandler(row){
          this.selectRow = row
          this.getBindCardList_()
        this.bindCardDialogVisiable = true
      },
      bindCardCloseHandler(){

      },
      getBindCardList_(){
          getBindCardList({
              staffId: this.selectRow.staffId,
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.bindCardData = res.data
              }
          }).catch(() => {
          })
      },
      unBindCardCloseHandler(){
          this.unBindCardDialogVisiable = false
          this.unbindCardSelectArr = []
      },
      unBindCardHandler(row){
          this.selectRow = row
          this.getUnbindCardPageList_()
          this.unBindCardDialogVisiable = true
      },
      getUnbindCardPageList_(){
          this.unBindCardlistQuery.staffId =  this.selectRow.staffId
              this.unBindCardlistQuery.customerId =  localCache.getCurrentCustomerId()
          this.unbindCardSelectArrCache = this.unbindCardSelectArr.slice()
          getUnbindCardPageList(this.unBindCardlistQuery).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.unBindCardData = res.data.content
                  this.unBindCardTotal = res.data.total
              }
          }).catch(() => {
          })
      },
      bindConfirm(){
          if(this.unbindCardSelect.length == 0){
              this.$message.error('请选择IC卡')
              return
          }
          let cardIds = this.unbindCardSelectArr.map(t=>t.cardId).join(',')
        bindCards({
            staffId: this.selectRow.staffId,
            customerId: localCache.getCurrentCustomerId(),
            cardIds: cardIds
        }).then(res => {
            if (res.errorcode !== 0) {
                this.$message.error(res.message)
            } else {
                this.unBindCardDialogVisiable = false
                this.$message.success(res.message)
            }
        }).catch(() => {
        })
      },
      unbindCardSelect(val){
          console.log(val)
        this.unbindCardSelectArr = val
      },
      unbindCardHandler(row){
          this.selectBindCardRow = row
          unbindCards({
              staffId: this.selectRow.staffId,
              customerId: localCache.getCurrentCustomerId(),
              cardIds: row.cardId
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.$message.success('解绑成功')
                  this.getBindCardList_()
              }
          }).catch(() => {
          })
      }

  }
}
</script>

<style lang="scss">
.t-top-bar{
  margin-bottom: 15px;
}
.search-input {
  width: 350px;
}
.search-option{
    margin-left: 15px;
}
.l-add-buttion{
  font-size: 35px;
  float: right;
  cursor: pointer;
}

</style>
<style>
    .staff-add .el-dialog__body{
        padding: 30px 80px;
    }
    .staff-container .el-scrollbar__wrap {
        overflow-x: hidden !important;
    }
</style>