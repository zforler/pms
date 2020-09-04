<template>
  <div class="price-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="priceId" label="规则编号" width="100"></el-table-column>
      <el-table-column prop="priceName" label="规则名称">
          <template slot-scope="scope">
              {{createPriceName(scope.row)}}
          </template>
      </el-table-column>
      <el-table-column prop="staffType" label="员工类型">
          <template slot-scope="scope">
              {{scope.row.staffType | dicFilter('STAFF_TYPE')}}
          </template>
      </el-table-column>
      <el-table-column prop="shiftName" label="班次"></el-table-column>
        <el-table-column prop="price" label="单价(元)">
            <template slot-scope="scope">
                {{scope.row.price / 100}}
            </template>
        </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-notebook-1 el-icon-table" @click="hisHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="opFlag=='add'?'添加工价规则':'修改工价'" :visible.sync="addDialogVisiable" @close="addCloseHandler" width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="规则名称" :label-width="formLabelWidth">
          <el-input disabled="disabled" v-model="priceName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品" prop="productionId" :label-width="formLabelWidth">
            <el-select :disabled="opFlag=='edit'" v-model="addForm.productionId" placeholder="请选产品">
                <el-option v-for="(val,key) in products" :key="key" :label="val.productionName"
                           :value="val.productionId"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item label="规格" prop="specId" :label-width="formLabelWidth">
              <el-select :disabled="opFlag=='edit'" v-model="addForm.specId" placeholder="请选规格">
                  <el-option v-for="(val,key) in specs[addForm.productionId]" :key="key" :label="val.specName"
                             :value="val.specId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="工艺" prop="technologyId" :label-width="formLabelWidth">
              <el-select :disabled="opFlag=='edit'" v-model="addForm.technologyId" placeholder="请选工艺">
                  <el-option v-for="(val,key) in technologs[addForm.productionId]" :key="key" :label="val.technologyName"
                             :value="val.technologyId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="员工类型" prop="staffType":label-width="formLabelWidth">
              <el-select :disabled="opFlag=='edit'" v-model="addForm.staffType" placeholder="请选员工类型">
                  <el-option v-for="(val,key) in selectDic('STAFF_TYPE')" :key="key" :label="val.name" :value="val.code"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="班次"  prop="shiftId" :label-width="formLabelWidth">
              <el-select :disabled="opFlag=='edit'" v-model="addForm.shiftId" placeholder="请选员工类型">
                  <el-option v-for="(val,key) in shifts" :key="key" :label="val.shiftName" :value="val.shiftId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="单价(元)" prop="price" :label-width="formLabelWidth">
              <el-input type="number" v-model="addForm.price" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="历史记录" :visible.sync="hisDialogVisiable" width="1050px">
        <el-table :data="hisTableData" border style="width: 100%" v-loading="hisListLoading">
            <el-table-column prop="priceId" label="规则编号" width="100"></el-table-column>
            <el-table-column prop="priceName" label="规则名称">
                <template slot-scope="scope">
                    {{createPriceName(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column prop="staffType" label="员工类型">
                <template slot-scope="scope">
                    {{scope.row.staffType | dicFilter('STAFF_TYPE')}}
                </template>
            </el-table-column>
            <el-table-column prop="shiftName" label="班次"></el-table-column>
            <el-table-column prop="price" label="单价(元)">
                <template slot-scope="scope">
                    {{scope.row.price / 100}}
                </template>
            </el-table-column>
            <el-table-column prop="activeTime" label="生效时间">
                <template slot-scope="scope">
                    {{scope.row.activeTime | formateTime}}
                </template>
            </el-table-column>
            <el-table-column prop="reactiveTime" label="失效时间">
                <template slot-scope="scope">
                    {{scope.row.reactiveTime | formateTime}}
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
    import { addPrice,updatePrice,getPriceList,getHisPriceList } from '../../api/price'
    import { getProductionVoList } from '../../api/prouction'
    import { getShiftList } from '../../api/shift'
    import localCache from "../../util/localCache";
    export default {
        name: "price",
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
                hisDialogVisiable: false,
                opFlag: 'add',
                confirmVisible: false,
                formLabelWidth: '120px',
                tableData: [],
                hisTableData:[],
                addForm: {
                    staffType:'',
                    shiftId:'',
                    productionId:'',
                    specId:'',
                    technologyId:'',
                    price:0
                },
                rules: {
                    productionId: [
                        { required: true, message: '请选择产品', trigger: 'blur' },
                    ],
                    price: [
                        { required: true,validator: checkPrice, trigger: 'blur' }
                    ]
                },
                listQuery: {
                    keyword: ''
                },
                listLoading: true,
                hisListLoading:false,
                selectRow: '',
                products:[],
                specs:{},
                technologs:{},
                shifts:[]
            }
        },
        mounted(){
            this.getList()
            this.getProductionVoList_()
            this.getShiftList_()
        },
        computed:{
            priceName(){
                let str = ''
                let pid = this.addForm.productionId
                if(pid){
                    str = this.getTargetValue(this.products,pid,'productionId','productionName')
                }
                if(this.addForm.specId){
                    str += '/'+this.getTargetValue(this.specs[pid],this.addForm.specId,'specId','specName')
                }
                if(this.addForm.technologyId){
                    str += '/'+this.getTargetValue(this.technologs[pid],this.addForm.technologyId,
                        'technologyId','technologyName')
                }
                return str
            }
        },
        methods: {
            getTargetValue(obj,val, equalKey,targetkey){
                for (let i = 0,len=obj.length; i < len; i++) {
                    if(val == obj[i][equalKey]){
                        return obj[i][targetkey]
                    }
                }
            },
            createPriceName(row){
              let name = row.productionName;
              if(row.specName){
                  name += "/"+row.specName
              }
                if(row.technologyName){
                    name += "/"+row.technologyName
                }
                return name || '--'
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
            addCloseHandler(){
                this.$refs['addForm'].resetFields()
                this.addForm =  {
                    staffType:'',
                    shiftId:'',
                    productionId:'',
                    specId:'',
                    technologyId:'',
                    price:0
                }
                this.opFlag='add'
            },
            addHandler() {
                this.opFlag='add'
                this.addDialogVisiable = true
            },
            editHandler(row) {
                this.selectRow = row
                this.opFlag='edit'
                this.addForm = Object.assign({}, row)
                this.addForm.staffType += ''
                this.addForm.price /=  100
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
                        param.priceId = this.selectRow.priceId
                    }
                    param.price *= 100
                    param.customerId = localCache.getCurrentCustomerId()
                    if(this.opFlag=='add'){
                        addPrice(param).then((res)=>{
                            if(res.errorcode==0){
                                this.$message.success('添加成功')
                                this.addDialogVisiable = false
                                this.getList()
                            }else{
                                this.$message.error(res.message)
                            }
                        })
                    }else{
                        updatePrice(param).then((res)=>{
                            if(res.errorcode==0){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                })
                                this.addDialogVisiable = false
                                this.getList()
                            }else{
                                this.$message.success(res.message)
                            }
                        })
                    }
                });
            },
            getList() {
                this.listLoading = true
                this.listQuery.customerId = localCache.getCurrentCustomerId()
                getPriceList(this.listQuery).then(res => {
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

            hisHandler(row){
                this.selectRow = row
                this.hisDialogVisiable = true
                this.hisListLoading = true

                getHisPriceList({
                    priceId:row.priceId,
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    this.hisListLoading = false
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.hisTableData = res.data
                    }
                }).catch(() => {
                    this.hisListLoading = false
                })
            },
            getShiftList_(){
                getShiftList({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.shifts = res.data
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