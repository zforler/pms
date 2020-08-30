<template>
  <div class="spec-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="specId" label="规格编号" width="100"></el-table-column>
      <el-table-column prop="specName" label="规格名称"></el-table-column>
      <el-table-column prop="productionName" label="所属产品"></el-table-column>
      <el-table-column prop="createTime" label="添加时间">
        <template slot-scope="scope">
          {{scope.row.createTime | formateTime()}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="opFlag=='add'?'添加规格':'修改规格'" :visible.sync="addDialogVisiable" @close="addCloseHandler"  width="650px">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="规格名称" prop="specName"  :label-width="formLabelWidth">
          <el-input v-model="addForm.specName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择产品" prop="productionId"  :label-width="formLabelWidth">
          <el-select :disabled="opFlag=='edit'" v-model="addForm.productionId" filterable  placeholder="请选产品">
            <el-option v-for="(val,key) in productionList" :key="key" :label="val.productionName"
                       :value="val.productionId"></el-option>
          </el-select>
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
    import { addSpec,updateSpec,getSpecList } from '../../api/spec'
    import { getProductionList } from '../../api/prouction'
    import localCache from "../../util/localCache";
    export default {
        name: "spec",
        data() {
            return {
                addDialogVisiable: false,
                opFlag: 'add',
                confirmVisible: false,
                formLabelWidth: '120px',
                tableData: [],
                addForm: {
                    specName:'',
                    productionId:''
                },
                rules: {
                    productionName: [
                        { required: true, message: '规格名不能为空', trigger: 'blur' },
                        { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' }
                    ],
                    productionId: [
                        { required: true, message: '请选择产品', trigger: 'change' },
                    ],
                },
                listQuery: {
                    keyword: ''
                },
                listLoading: true,
                selectRow: '',
                productionList:[]
            }
        },
        mounted(){
            this.getList()
        },
        methods: {
            addCloseHandler(){
                this.$refs['addForm'].resetFields()
                this.addForm =  {
                    productionName: '',
                }
            },
            addHandler() {
                this.opFlag='add'
                this.getProductionList_()
                this.addDialogVisiable = true
            },
            editHandler(row) {
                this.selectRow = row
                this.opFlag='edit'
                this.addForm = Object.assign({}, row)
                this.getProductionList_()
                this.addDialogVisiable = true
            },
            addConfirm() {
                this.$refs['addForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let param = Object.assign({}, this.addForm)
                    param.customerId = localCache.getCurrentCustomerId()
                    if(this.opFlag=='add'){
                        addSpec(param).then((res)=>{
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
                        updateSpec(param).then((res)=>{
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
                getSpecList(this.listQuery).then(res => {
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
            getProductionList_(){
                getProductionList({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.productionList = res.data
                    }
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