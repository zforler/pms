<template>
  <div class="equip-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" v-if="authedCheck('添加设备')" title="添加设备"
         @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="equipmentId" label="设备编号"></el-table-column>
      <el-table-column prop="equipmentName" label="设备名称"></el-table-column>
      <!--<el-table-column prop="equipmentType" label="设备类型">-->
          <!--<template slot-scope="scope">-->
              <!--{{scope.row.equipmentType | dicFilter('EQUIP_TYPE')}}-->
          <!--</template>-->
      <!--</el-table-column>-->
        <el-table-column prop="subCount" label="终端数量(台)"></el-table-column>
      <el-table-column prop="status" label="设备状态">
          <template slot-scope="scope">
              {{scope.row.status | dicFilter('EQUIP_STATUS')}}
          </template>
      </el-table-column>
        <el-table-column prop="name" label="添加时间" width="180px">
            <template slot-scope="scope">
                {{scope.row.createTime | formateTime()}}
            </template>
        </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" v-if="authedCheck('编辑设备')" title="编辑设备"
             @click="editHandler(scope.row)"></i>
          <i class="el-icon-setting el-icon-table" @click="detailHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="opFlag=='add'?'添加设备':'修改设备'" :visible.sync="addDialogVisiable" @close="addCloseHandler" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="设备名称" prop="equipmentName" :label-width="formLabelWidth">
          <el-input v-model="addForm.equipmentName" autocomplete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="设备类型" prop="equipmentType" :label-width="formLabelWidth">-->
            <!--<el-select :disabled="opFlag=='edit'" v-model="addForm.equipmentType" placeholder="请选择设备类型">-->
                <!--<el-option v-for="(val,key) in selectDic('EQUIP_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>-->
            <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import { addEquipment,updateEquipment,getEquipmentList } from '../../api/equipment'
    import localCache from "../../util/localCache";
export default {
  name: "equipment",
  data() {
    return {
      addDialogVisiable: false,
        opFlag: 'add',
      confirmVisible: false,
      formLabelWidth: '120px',
      tableData: [],
      addForm: {
        equipmentName:'',
          equipmentType:''
      },
        rules: {
            equipmentName: [
                { required: true, message: '设备名不能为空', trigger: 'blur' },
                { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
            ],
            // equipmentType: [
            //     { required: true, message: '请选择设备类型', trigger: 'blur' },
            // ],
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
              equipmentName:'',
              equipmentType:''
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
          this.addForm.equipmentType += ''
          this.addForm.status += ''
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
                  param.equipmentId = this.selectRow.equipmentId
              }
              param.customerId = localCache.getCurrentCustomerId()
              if(this.opFlag=='add'){
                  addEquipment(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('修改成功')
                          this.addDialogVisiable = false
                          this.getList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }else{
                  updateEquipment(param).then((res)=>{
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
          getEquipmentList(this.listQuery).then(res => {
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
      detailHandler(row){
          this.$router.push({name:'设备详情',params: {equipmentId: row.equipmentId }})
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