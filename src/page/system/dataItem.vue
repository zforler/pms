<template>
  <div class="l-container dataItem-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="key"
            border
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="code" label="字典编码"></el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>

      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i v-if="scope.row.type!='sub'" class="el-icon-share el-icon-table" @click="addSubHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="opFlagMap[opFlag]" :visible.sync="addDialogVisiable" @close="addClose" width="580px">
      <el-form :model="addForm">
        <el-form-item label="字典名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>


      <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
          <span>确定删除此字典?</span>
          <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCloseHandler">确 定</el-button>
      </span>
      </el-dialog>
  </div>
</template>

<script>
    import icons from '../svg-icons/generateIconsView'
    import { addSysDic,updateSysDic,addSysDicItem,updateSysDicItem,deleteSysDic,deleteSysDicItem,getSysDicList } from '../../api/datadic'
    export default {
        name: "menulist",
        data() {
            return {
                searchValue: '',
                addDialogVisiable: false,
                innerVisible:false,
                opFlag: 'add',
                opFlagMap:{
                    add: '添加字典',
                    edit: '编辑字典',
                    sub: '添加字典子码',
                    editsub: '编辑字典子码',
                },
                formLabelWidth: '120px',
                tableData: [],
                addForm: {
                    name: '',
                    code: '',
                },
                // 图标
                iconsMap: [],
                selectRow: '',
                confirmVisible: false,
            }
        },
        mounted(){
            this.getSysDicList_()
        },
        methods: {
            addHandler() {
                this.opFlag = 'add'
                this.addDialogVisiable = true
            },
            addConfirm() {
               if(this.opFlag=='add'){
                   addSysDic({
                       code: this.addForm.code,
                       name: this.addForm.name
                   }).then((res)=>{
                       console.log(res)
                       if(res.errorcode==0){
                           this.$message({
                               message: '添加成功',
                               type: 'success'
                           })
                           this.addDialogVisiable = false
                           this.getSysDicList_()
                       }else{
                           this.$message({
                               message: res.message,
                               type: 'error'
                           })
                       }
                   })
               }else if(this.opFlag == 'edit'){
                   updateSysDic({
                       code: this.addForm.code,
                       name: this.addForm.name
                   }).then((res)=>{
                       console.log(res)
                       if(res.errorcode==0){
                           this.$message({
                               message: '修改成功',
                               type: 'success'
                           })
                           this.addDialogVisiable = false
                           this.getSysDicList_()
                       }else{
                           this.$message({
                               message: res.message,
                               type: 'error'
                           })
                       }
                   })
               }else if(this.opFlag=='sub'){
                   addSysDicItem({
                       itemCode: this.addForm.code,
                       itemName: this.addForm.name,
                       code: this.selectRow.code
                   }).then((res)=>{
                       console.log(res)
                       if(res.errorcode==0){
                           this.$message({
                               message: '添加成功',
                               type: 'success'
                           })
                           this.addDialogVisiable = false
                           this.getSysDicList_()
                       }else{
                           this.$message({
                               message: res.message,
                               type: 'error'
                           })
                       }
                   })
               }else if(this.opFlag=='editsub'){
                   updateSysDicItem({
                       itemCode: this.addForm.code,
                       itemName: this.addForm.name,
                       id: this.selectRow.key,
                       code: this.selectRow.parentCode
                   }).then((res)=>{
                       console.log(res)
                       if(res.errorcode==0){
                           this.$message({
                               message: '编辑成功',
                               type: 'success'
                           })
                           this.addDialogVisiable = false
                           this.getSysDicList_()
                       }else{
                           this.$message({
                               message: res.message,
                               type: 'error'
                           })
                       }
                   })
               }
            },
            addClose(){
                this.addForm = {
                    name: '',
                    code:''
                }
            },
            editHandler(row){
                this.selectRow = row
                if(row.type=='sub'){
                    this.opFlag='editsub'
                }else{
                    this.opFlag = 'edit'
                }
                this.addForm = Object.assign({},row)
                this.addDialogVisiable = true
            },
            addSubHandler(row){
                this.selectRow = row
                this.opFlag = 'sub'
                this.addDialogVisiable = true
            },
            delHandler(row){
                this.selectRow = row
                if(row.type=='sub'){
                    this.opFlag='delsub'
                }else{
                    this.opFlag = 'del'
                }
                this.confirmVisible = true
            },
            getSysDicList_(){
                getSysDicList({
                    keyword: this.searchValue
                }).then((res)=>{
                    console.log(res)
                    this.tableData = this.toTree(res.data)
                })
            },
            confirmCloseHandler(){
                if(this.opFlag=='del'){
                    deleteSysDic({
                        code: this.selectRow.code,
                    }).then((res)=>{
                        console.log(res)
                        if(res.errorcode==0){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.confirmVisible = false
                            this.getSysDicList_()
                        }else{
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                    })
                }else if(this.opFlag == 'delsub'){
                    deleteSysDicItem({
                        id:this.selectRow.key
                    }).then((res)=>{
                        if(res.errorcode==0){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.confirmVisible = false
                            this.getSysDicList_()
                        }else{
                            this.$message({
                                message: res.message,
                                type: 'error'
                            })
                        }
                    })
                }
            },
            toTree(data){
                let temp = {}
                for (let i = 0,len=data.length; i < len; i++) {
                    let t = data[i]
                    let code = t.code
                    if(!temp[code]){
                        temp[code] = {
                            code: code,
                            key: code,
                            name: t.name,
                            children:[]
                        }
                    }
                    if(t.itemCode){
                        temp[code].children.push({
                            code: t.itemCode,
                            parentCode:t.code,
                            name: t.itemName,
                            key: t.id,
                            type: 'sub'
                        })
                    }
                }
                let arr = []
                for(let key in temp){
                    arr.push(temp[key])
                }
                console.log(arr)
                return arr
            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "../../styles/common";
  .dataItem-container {
    .el-input{
      width: 350px;
    }
  }

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