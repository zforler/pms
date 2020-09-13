<template>
  <div class="equip-detail-container">
    <div class="equip-detail-top">
        <div class="equip-item">
            <span class="equip-itme-name">设备编号</span><span class="equip-itme-val">{{equipmentDetail.equipmentId}}</span>
        </div>
        <div class="equip-item">
            <span class="equip-itme-name">设备名称</span><span class="equip-itme-val">{{equipmentDetail.equipmentName}}</span>
        </div>
        <div class="equip-item">
            <span class="equip-itme-name">设备状态</span><span class="equip-itme-val">
            {{equipmentDetail.status | dicFilter('EQUIP_STATUS')}}</span>
        </div>
        <div class="equip-item">
            <span class="equip-itme-name">添加时间</span><span class="equip-itme-val">
            {{equipmentDetail.createTime | formateTime()}}</span>
        </div>
        <div class="equip-item">
            <span class="equip-itme-name">修改时间</span><span class="equip-itme-val">
            {{equipmentDetail.updateTime | formateTime()}}</span>
        </div>
    </div>

      <div class="equip-detail-content">
          <el-tabs type="border-card" v-model="currentTab">
              <el-tab-pane label="终端管理">
                  <div class="t-top-bar">
                      <i class="el-icon-circle-plus-outline l-add-buttion" v-if="authedCheck('添加终端')" title="添加终端"
                         @click="subAddHandler"></i>
                  </div>
                  <el-table :data="subTableData" border style="width: 100%"@cell-click="switchClick" v-loading="listLoading">
                      <el-table-column prop="subEquipmentId" label="终端编号"></el-table-column>
                      <el-table-column prop="subEquipmentName" label="终端名称"></el-table-column>
                      <el-table-column prop="type" label="终端类型">
                          <template slot-scope="scope">
                          {{scope.row.type | dicFilter('EQUIP_TYPE')}}
                          </template>
                      </el-table-column>
                      <el-table-column prop="staffTypeCalc" label="员工类型计价" width="180px">
                          <template slot-scope="scope">
                              <!--{{scope.row.staffTypeCalc | dicFilter('ACTIVE_FLAG')}}-->
                              <el-switch v-model="scope.row.staffTypeCalc" @change="staffTypeCalcChange"
                                      :active-value="1" :inactive-value="0" active-text="生效" inactive-text="关闭">
                              </el-switch>
                          </template>
                      </el-table-column>
                      <el-table-column  prop="shiftCalc" label="班次计价" width="180px">
                          <template slot-scope="scope">
                              <!--{{scope.row.shiftCalc | dicFilter('ACTIVE_FLAG')}}-->
                              <el-switch v-model="scope.row.shiftCalc" @change="shiftCalc"
                                      :active-value="1" :inactive-value="0" active-text="生效" inactive-text="关闭">
                              </el-switch>
                          </template>
                      </el-table-column>
                      <el-table-column prop="name" label="添加时间" width="180px">
                          <template slot-scope="scope">
                              {{scope.row.createTime | formateTime()}}
                          </template>
                      </el-table-column>
                      <el-table-column label="操作">
                          <template slot-scope="scope">
                              <i class="el-icon-edit el-icon-table" v-if="authedCheck('编辑终端')" title="编辑终端"
                                 @click="subEditHandler(scope.row)"></i>
                              <i class="el-icon-tickets el-icon-table" @click="switchHis(scope.row)"></i>
                          </template>
                      </el-table-column>
                  </el-table>
              </el-tab-pane>
              <el-tab-pane label="员工/IC卡">
                  <el-table :data="staffTableData" border style="width: 100%" v-loading="listLoading">
                      <el-table-column prop="staffId" label="员工编号"></el-table-column>
                      <el-table-column prop="staffName" label="员工姓名"></el-table-column>
                      <el-table-column prop="cardId" label="员工类型">
                      </el-table-column>
                      <el-table-column prop="cardId" label="IC卡编号">
                      </el-table-column>
                      <el-table-column prop="cardNo" label="IC卡内码" width="180px">
                      </el-table-column>
                      <el-table-column prop="cardType" label="IC卡类型">
                      </el-table-column>
                  </el-table>
              </el-tab-pane>
              <el-tab-pane label="计价规则">
                  <el-table :data="priceTableData" border style="width: 100%" v-loading="listLoading">
                      <el-table-column prop="priceId" label="规则编号"></el-table-column>
                      <el-table-column prop="priceName" label="规则名称"></el-table-column>
                      <el-table-column prop="price" label="单价(元)">
                      </el-table-column>
                  </el-table>
              </el-tab-pane>
          </el-tabs>
      </div>

      <el-dialog :title="opFlag=='add'?'添加终端':'修改终端'" :visible.sync="addDialogVisiable"
                 @close="addCloseHandler" width="650px">
          <el-form :model="addForm" :rules="rules" ref="addForm">
              <el-form-item label="终端名称" prop="subEquipmentName" :label-width="formLabelWidth">
                  <el-input v-model="addForm.subEquipmentName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="终端类型" prop="equipmentType" :label-width="formLabelWidth">
              <el-select :disabled="opFlag=='edit'" v-model="addForm.type" placeholder="请选择终端类型">
                <el-option v-for="(val,key) in selectDic('EQUIP_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
              </el-select>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="addSubConfirm">确 定</el-button>
          </div>
      </el-dialog>

      <el-dialog title="提示" :visible.sync="confirmVisible" @close="confirmCloseHandler" width="30%">
          <span>{{switchObj.msg}}</span>
          <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmHandler">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog custom-class="calc-his-dialog" title="计价修改记录" :visible.sync="hisDialogVisiable" :lock-scroll="true">
          <div class="calc-his-title">员工类型计费</div>
          <el-table :data="hisTableData1" border style="width: 100%" v-loading="listLoading">
              <el-table-column prop="activeTime" label="生效时间">
                  <template slot-scope="scope">
                      {{scope.row.beginTime | formateTime}}
                  </template>
              </el-table-column>
              <el-table-column prop="reactiveTime" label="失效时间">
                  <template slot-scope="scope">
                      {{scope.row.endTime | formateTime}}
                  </template>
              </el-table-column>
          </el-table>
          <div class="calc-his-title">班次类型计费</div>
          <el-table :data="hisTableData2" border style="width: 100%;" v-loading="listLoading">
              <el-table-column prop="activeTime" label="生效时间">
                  <template slot-scope="scope">
                      {{scope.row.beginTime | formateTime}}
                  </template>
              </el-table-column>
              <el-table-column prop="reactiveTime" label="失效时间">
                  <template slot-scope="scope">
                      {{scope.row.endTime | formateTime}}
                  </template>
              </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button @click="hisDialogVisiable = false">取 消</el-button>
              <el-button type="primary" @click="hisDialogVisiable=false">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import { addSubEquipment,updateSubEquipment,getSubEquipmentList,getEquipmentByEquipmentId,calcSwitch
        ,getSubEquipmentCalcLogList } from '../../api/equipmentDetail'
    import localCache from "../../util/localCache";
    import Icons from "../svg-icons/index";
export default {
  name: "equipmentDetail",
    components: {Icons},
    data() {
    return {
        equipmentId: '',
        opFlag:'add',
        currentTab:'0',
      addDialogVisiable: false,
      confirmVisible: false,
        hisDialogVisiable: false,
      formLabelWidth: '120px',
        equipmentDetail: {},
      subTableData: [],
        staffTableData: [],
        priceTableData: [],
        hisTableData1: [],
        hisTableData2: [],
      addForm: {
          subEquipmentName: '',
          type:''
      },
        rules: {
            subEquipmentName: [
                { required: true, message: '终端名不能为空', trigger: 'blur' },
                { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
            ],
            type: [
                { required: true, message: '请选择类型', trigger: 'blur' },
            ],
        },
        listLoading: true,
        switchObj:{
            type:'',
            status:'',
            msg:'',
            flag: true
        }
    }
  },
    created () {
        this.equipmentId = this.$route.params.equipmentId
        if(!this.equipmentId){
            this.equipmentId = localCache.getCurrentEquipmentId()
        }else{
            localCache.setCurrentEquipmentId(this.equipmentId)
        }
        this.getEquipmentByEquipmentId_()
        this.getSubList()
    },
    mounted(){

    },
  methods: {
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              subEquipmentName: '',
              type:''
          }
      },
    subAddHandler() {
        this.opFlag='add'
      this.addDialogVisiable = true
    },
    subEditHandler(row) {
        this.selectRow = row
        this.opFlag='edit'
        this.addForm = Object.assign({}, row)
        this.addForm.type += ''
      this.addDialogVisiable = true
    },
      addSubConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({}, this.addForm)
              if(this.opFlag == 'add'){

              }else if(this.opFlag == 'edit'){
                  param.subEquipmentId = this.selectRow.subEquipmentId
              }
              param.customerId = localCache.getCurrentCustomerId()
              param.equipmentId = this.equipmentId
              if(this.opFlag=='add'){
                  addSubEquipment(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('修改成功')
                          this.addDialogVisiable = false
                          this.getSubList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }else{
                  updateSubEquipment(param).then((res)=>{
                      if(res.errorcode==0){
                          this.$message.success('修改成功')
                          this.addDialogVisiable = false
                          this.getSubList()
                      }else{
                          this.$message.error(res.message)
                      }
                  })
              }
          });
      },
      getSubList() {
          this.listLoading = true
          getSubEquipmentList({
              equipmentId: this.equipmentId,
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.subTableData = res.data
              }
          }).catch(() => {
              this.listLoading = false
          })
      },
      getEquipmentByEquipmentId_(){
          getEquipmentByEquipmentId({
              equipmentId: this.equipmentId,
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.equipmentDetail = res.data
              }
          }).catch(() => {
          })
      },
      staffTypeCalcChange(newVal){
          this.switchObj.type = 1
          this.switchObj.status = newVal
          if(newVal == 1){
              this.switchObj.msg = '确认开启员工类型计费?'
          }else{
              this.switchObj.msg = '确认关闭员工类型计费?'
          }
          this.confirmVisible = true
          this.switchObj.flag = true
      },
      shiftCalc(newVal){
          this.switchObj.type = 2
          this.switchObj.status = newVal
          if(newVal == 1){
              this.switchObj.msg = '确认开启班次类型计费?'
          }else{
              this.switchObj.msg = '确认关闭班次类型计费?'
          }
          this.confirmVisible = true
          this.switchObj.flag = true
      },
      switchClick(row,column){
          this.selectRow = row
          console.log(row,column)
      },
      confirmHandler(){
          this.switchObj.customerId = localCache.getCurrentCustomerId()
          this.switchObj.subEquipmentId=this.selectRow.subEquipmentId
          calcSwitch({
              customerId: localCache.getCurrentCustomerId(),
              subEquipmentId: this.selectRow.subEquipmentId,
              status: this.switchObj.status,
              type: this.switchObj.type,
          }).then((res)=>{
              if(res.errorcode==0){
                  this.$message.success('修改成功')
                  this.switchObj.flag = false
                  this.confirmVisible = false
              }else{
                  this.$message.error(res.message)
              }
          })
      },
      confirmCloseHandler(){
          if(!this.switchObj.flag){
              return
          }
          if(this.switchObj.type == 2){
              if(this.switchObj.status==1){
                  this.selectRow.shiftCalc = 0
              }else{
                  this.selectRow.shiftCalc = 1
              }
          }else if(this.switchObj.type == 1){
              if(this.switchObj.status==1){
                  this.selectRow.staffTypeCalc = 0
              }else{
                  this.selectRow.staffTypeCalc = 1
              }
          }
      },
      switchHis(row){
          console.log(123)
          this.hisDialogVisiable = true
          getSubEquipmentCalcLogList({
              subEquipmentId: row.subEquipmentId,
              customerId: localCache.getCurrentCustomerId()
          }).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.hisTableData1 = res.data.his1
                  this.hisTableData2 = res.data.his2
              }
          }).catch(() => {
              this.listLoading = false
          })
      }
  }
}
</script>

<style lang="scss">
    .equip-detail-container{
        .el-switch__label{
            color:#ccc;
        }
        .el-switch__label.is-active {
            color: #409EFF !important;
        }
        .equip-detail-content{
            margin-top: 25px;
        }
        .t-top-bar{
            margin-bottom: 15px;
        }

        .l-add-buttion{
            font-size: 35px;
            float: right;
            cursor: pointer;
        }
        .equip-detail-top {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .equip-item {
            width: 33%;
            height: 45px;
            margin-bottom: 15px;
        }
        .equip-itme-name {
            background: #f8f9fc;
            display: inline-block;
            height: 35px;
            width: 100px;
            line-height: 35px;
            text-align: center;
            margin-right: 15px;
        }
        .calc-his-dialog .el-dialog__body {
            max-height: 550px;
            overflow: auto;
        }
        .calc-his-title{
            padding: 8px 0;
            font-size: 16px;
        }
    }

</style>