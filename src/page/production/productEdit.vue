<template>
  <div class="productEdit-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button slot="append" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="subEquipmentId" label="设备编号"></el-table-column>
        <el-table-column prop="name" label="原批次/现批次">
            <template slot-scope="scope">{{scope.row.oldBatchName+'/'+scope.row.newBatchName}}</template>
        </el-table-column>
      <el-table-column prop="name" label="原产品/现产品">
        <template slot-scope="scope">{{scope.row.oldProductionName+'/'+scope.row.newTechnologyName}}</template>
      </el-table-column>
      <el-table-column prop="name" label="原规格/现规格">
        <template slot-scope="scope">{{scope.row.oldSpecName+'/'+scope.row.newSpecName}}</template>
      </el-table-column>
      <el-table-column prop="name" label="原工艺/现工艺">
        <template slot-scope="scope">{{scope.row.oldTechnologyName+'/'+scope.row.newTechnologyName}}</template>
      </el-table-column>
        <el-table-column prop="newPrice" label="修改单价(元)">
          <template slot-scope="scope">{{(scope.row.newPrice/100).toFixed(2)}}</template>
        </el-table-column>
        <el-table-column prop="name" label="开始时间">
            <template slot-scope="scope">
                {{scope.row.beginTime | formateTime}}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="结束时间">
            <template slot-scope="scope">
                {{scope.row.endTime | formateTime}}
            </template>
        </el-table-column>
      <el-table-column prop="name" label="添加时间">
          <template slot-scope="scope">
              {{scope.row.updateTime | formateTime}}
          </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog title="交料修正" @close="addCloseHandler" :visible.sync="addDialogVisiable" width="730px">
      <el-form :inline="true" :model="addForm" class="demo-form-inline" :rules="rules" ref="addForm">
        <el-form-item label="终端名称" prop="subEquipmentId" :label-width="formLabelWidth">
            <el-select v-model="addForm.subEquipmentId" placeholder="请选终端">
                <el-option v-for="(val,key) in subEquipments" :key="key" :label="val.subEquipmentName"
                           :value="val.subEquipmentId"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="修改单价(元)" prop="newPrice"  :label-width="formLabelWidth">
              <el-input v-model="addForm.newPrice" autocomplete="off"></el-input>
          </el-form-item>
        <el-form-item label="原产品批次" prop="oldBatchId" :label-width="formLabelWidth">
            <el-select clearable v-model="addForm.oldBatchId" placeholder="请选择批次">
                <el-option v-for="(val,key) in batchItems" :key="key" :label="val.itemId"
                           :value="val.id"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item clearable label="现产品批次" prop="newBatchId" :label-width="formLabelWidth">
              <el-select v-model="addForm.newBatchId" placeholder="请选择批次">
                  <el-option v-for="(val,key) in batchItems" :key="key" :label="val.itemId"
                             :value="val.id"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="原产品名称" prop="oldProductionId" :label-width="formLabelWidth">
            <el-select v-model="addForm.oldProductionId" placeholder="请选产品">
                <el-option v-for="(val,key) in products" :key="key" :label="val.productionName"
                           :value="val.productionId"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="现产品名称" prop="newProductionId" :label-width="formLabelWidth">
              <el-select v-model="addForm.newProductionId" placeholder="请选产品">
                  <el-option v-for="(val,key) in products" :key="key" :label="val.productionName"
                             :value="val.productionId"></el-option>
              </el-select>
          </el-form-item>
        <el-form-item label="原规格名称" prop="oldSpecId" :label-width="formLabelWidth">
            <el-select  v-model="addForm.oldSpecId" placeholder="请选规格">
                <el-option v-for="(val,key) in specs[addForm.oldProductionId]" :key="key" :label="val.specName"
                           :value="val.specId"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="现规格名称" prop="newSpecId" :label-width="formLabelWidth">
              <el-select  v-model="addForm.newSpecId" placeholder="请选规格">
                  <el-option v-for="(val,key) in specs[addForm.newProductionId]" :key="key" :label="val.specName"
                             :value="val.specId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="原工艺名称" prop="oldTechnologyId" :label-width="formLabelWidth">
              <el-select v-model="addForm.oldTechnologyId" placeholder="请选工艺">
                  <el-option v-for="(val,key) in technologs[addForm.oldProductionId]" :key="key" :label="val.technologyName"
                             :value="val.technologyId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="现工艺名称" prop="newTechnologyId" :label-width="formLabelWidth">
              <el-select v-model="addForm.newTechnologyId" placeholder="请选工艺">
                  <el-option v-for="(val,key) in technologs[addForm.newProductionId]" :key="key" :label="val.technologyName"
                             :value="val.technologyId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="beginTime" :label-width="formLabelWidth">
              <el-date-picker v-model="addForm.beginTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" :label-width="formLabelWidth">
              <el-date-picker v-model="addForm.endTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
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
    import { getProductionVoList } from '../../api/prouction'
    import { addRecordEditLog,getRecordEditLogPageList } from '../../api/recordEdit'
    import { getSubEquipmentListAll } from '../../api/equipment'
    import { getBatchItemList } from '../../api/batch'
    import localCache from "../../util/localCache";
    export default {
        name: "productEdit",
        components: {
            Pagination,
        },
        data() {
            let reg = /^\d{0,5}\.?\d{0,2}$/
            let checkPrice = (rule, value, callback) => {
                if(value === ''){
                    callback(new Error('请输入数字值'));
                }
                console.log(value)
                if (!reg.test(''+value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    if (value < 0 || value > 99999) {
                        callback(new Error('数值范围0-99999'));
                    } else {
                        callback();
                    }
                }
            }
            return {
                addDialogVisiable: false,
                confirmVisible: false,
                formLabelWidth: '100px',
                tableData: [],
                addForm: {
                    oldProductionId:'',
                    newProductionId:'',
                    oldSpecId:'',
                    newSpecId:'',
                    oldTechnologyId:'',
                    newTechnologyId:'',
                    newPrice: 0,
                    subEquipmentId:'',
                    oldBatchId:'',
                    newBatchId:'',
                    beginTime:'',
                    endTime:'',
                },
                rules: {
                    subEquipmentId: [
                        { required: true, message: '请选择终端', trigger: 'blur' },
                    ],
                    oldProductionId: [
                        { required: true, message: '请选择产品', trigger: 'blur' },
                    ],
                    newProductionId: [
                        { required: true, message: '请选择产品', trigger: 'blur' },
                    ],
                    oldSpecId: [
                        { required: true, message: '请选择规格', trigger: 'blur' },
                    ],
                    newSpecId: [
                        { required: true, message: '请选择规格', trigger: 'blur' },
                    ],
                    oldTechnologyId: [
                        { required: true, message: '请选择工艺', trigger: 'blur' },
                    ],
                    newTechnologyId: [
                        { required: true, message: '请选择工艺', trigger: 'blur' },
                    ],
                    newPrice: [
                        { validator: checkPrice, trigger: 'blur' }
                    ],
                    beginTime: [
                        { required: true, message: '请选择开始时间', trigger: 'blur' },
                    ],
                    endTime: [
                        { required: true, message: '请选择结束时间', trigger: 'blur' },
                    ],
                },
                listQuery: {
                    page: 1,
                    size: 10,
                    keyword: ''
                },
                total: 0,
                listLoading: true,
                selectRow: '',
                products:[],
                specs:{},
                technologs:{},
                subEquipments: [],
                batchItems:[]
            }
        },
        mounted(){
            this.getList()
            this.getProductionVoList_()
            this.getSubEquipmentListAll_()
            this.getBatchItemList_()
        },
        methods: {
            addCloseHandler(){
                this.$refs['addForm'].resetFields()
                this.addForm =  {
                    oldProductionId:'',
                    newProductionId:'',
                    oldSpecId:'',
                    newSpecId:'',
                    oldTechnologyId:'',
                    newTechnologyId:'',
                    newPrice: 0,
                    subEquipmentId:'',
                    oldBatchId:'',
                    newBatchId:'',
                    beginTime:'',
                    endTime:'',
                }
            },
            addHandler() {
                this.opFlag='add'
                this.addDialogVisiable = true
            },
            getProductionName(productionId){
                console.log(productionId)
                console.log(this.products)
                for (let i = 0, len = this.products.length; i < len; i++) {
                    console.log(this.products[i].productionId == productionId)
                    if(this.products[i].productionId == productionId){
                        return this.products[i].productionName
                    }
                }
            },
            getSpecsName(specId,productionId){
                let specs = this.specs[productionId]
                for (let i = 0, len = specs.length; i < len; i++) {
                    if(specs[i].specId == specId){
                        return specs[i].specName
                    }
                }
            },
            getTechnologName(technologId,productionId){
                let technologs = this.technologs[productionId]
                for (let i = 0, len = technologs.length; i < len; i++) {
                    if(technologs[i].technologyId == technologId){
                        return technologs[i].technologyName
                    }
                }
            },
            getBatchName(id){
                for (let i = 0, len = this.batchItems.length; i < len; i++) {
                    if(this.batchItems[i].id == id){
                        return this.batchItems[i].itemId
                    }
                }
            },
            addConfirm() {
                this.$refs['addForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let param = Object.assign({},this.addForm)
                    param.customerId = localCache.getCurrentCustomerId()
                    param.beginTime = this.addForm.beginTime.getTime()/1000
                    param.endTime = this.addForm.endTime.getTime()/1000
                    param.price *= 100
                    param.newProductionName = this.getProductionName(param.newProductionId)
                    param.oldProductionName = this.getProductionName(param.oldProductionId)
                    param.newSpecName = this.getSpecsName(param.newSpecId,param.newProductionId)
                    param.oldSpecName = this.getSpecsName(param.oldSpecId,param.oldProductionId)
                    param.newTechnologyName = this.getTechnologName(param.newTechnologyId,param.newProductionId)
                    param.oldTechnologyName = this.getTechnologName(param.oldTechnologyId,param.oldProductionId)
                    param.newBatchName = this.getBatchName(param.newBatchId)
                    param.oldBatchName = this.getBatchName(param.oldBatchId)

                    if(param.beginTime>=param.endTime){
                        this.$message.error('开始时间不能晚于结束时间')
                        return;
                    }
                    addRecordEditLog(param).then((res) => {
                        if (res.errorcode == 0) {
                            this.$message.success('修改成功')
                            this.addDialogVisiable = false
                            this.getList()
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                })
            },
            getList() {
                this.listLoading = true
                this.listQuery.customerId = localCache.getCurrentCustomerId()
                getRecordEditLogPageList(this.listQuery).then(res => {
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
            getProductionVoList_(){
                getProductionVoList({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.products = res.data
                        let data = this.products
                        for (let i = 0, len = this.products.length; i < len; i++) {
                            let pid = data[i].productionId
                            this.specs[pid] = data[i].specs
                            this.technologs[pid] = data[i].technologies
                        }
                    }
                }).catch(() => {
                })
            },
            getSubEquipmentListAll_(){
                getSubEquipmentListAll({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.subEquipments=  res.data
                    }
                }).catch(() => {
                })
            },
            getBatchItemList_(){
                getBatchItemList({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.batchItems=  res.data
                    }
                }).catch(() => {
                })
            }
        }
    }
</script>

<style lang="scss">

  .productEdit-container{
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