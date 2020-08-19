<template>
    <div class="menu-container">
        <div class="t-top-bar">
            <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
                <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
            </el-input>
            <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
        </div>
        <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="menuId"
                border
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="name" label="菜单名称"></el-table-column>
            <el-table-column prop="menuId" label="菜单编号"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="path" label="路由"></el-table-column>
            <el-table-column prop="filePath" label="文件路径"></el-table-column>
            <el-table-column prop="icon" label="图标"></el-table-column>
            <el-table-column prop="hidden" label="是否可见"></el-table-column>
            <el-table-column prop="close" label="是否可关闭"></el-table-column>
            <el-table-column prop="level" label="等级等级"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">

                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="opFlag=='add'?'添加菜单':'编辑菜单'" :visible.sync="addDialogVisiable" @close="addClose" width="650px">
            <el-form :model="addForm">
                <el-form-item v-if="opFlag!=='add'" label="菜单编号" :label-width="formLabelWidth">
                    <el-input disabled v-model="addForm.menuId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" :label-width="formLabelWidth">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="formLabelWidth">
                    <el-select v-model="addForm.type" placeholder="请选菜单类型">
                        <el-option label="目录" value="1"></el-option>
                        <el-option label="菜单" value="2"></el-option>
                        <el-option label="按钮" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="路由" :label-width="formLabelWidth">
                    <el-input v-model="addForm.path" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="文件路径" :label-width="formLabelWidth">
                    <el-input v-model="addForm.filePath" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth">
                    <el-input v-model="addForm.icon" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否可见" :label-width="formLabelWidth">
                    <el-radio-group v-model="addForm.hidden">
                        <el-radio label="是" value="1"></el-radio>
                        <el-radio label="否" value="0"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否可关闭" :label-width="formLabelWidth">
                    <el-radio-group v-model="addForm.close">
                        <el-radio label="是" value="1"></el-radio>
                        <el-radio label="否" value="0"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="等级" :label-width="formLabelWidth">
                    <el-select v-model="addForm.level" placeholder="请选菜单类型">
                        <el-option label="系统可见" value="1"></el-option>
                        <el-option label="客户可见" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { addMenu } from '../../api/menu'
    export default {
        name: "menulist",
        data() {
            return {
                searchValue: '',
                addDialogVisiable: false,
                opFlag: 'add',
                formLabelWidth: '120px',
                tableData: [
                    {
                        menuId:1,
                        name: '登录',
                        path: '/login',
                        filePath:  './page/index/index.vue',
                        hidden: true,
                    },
                  {
                      menuId:2,
                      name: '首页',
                      path: '/',
                      type: 1,
                      hidden: true,
                      close: false,
                      children: [
                          {
                              menuId:3,
                              name: '首页',
                              path: '/index',
                              type: 2,
                              icon: 'el-icon-s-home',
                              meta: {close:false},
                              filePath: './page/index/index.vue'
                          }
                      ]
                  }
                ],
                addForm: {
                    name: '',
                    path: '',
                    menuId: '',
                    type: '',
                    hidden: '',
                    close: '',
                    filePath: '',
                    icon: '',
                    level: ''
                },
                currentPage4: 4,
            }
        },
        methods: {
            addHandler() {
                this.opFlag = 'add'
                this.addDialogVisiable = true
            },
            addConfirm() {
                console.log(this.addForm)
                let menu = Object.assign({}, this.addForm)
                menu.close = menu.close=='是'?1:0
                menu.hidden = menu.hidden=='是'?1:0
                delete menu.menuId
                addMenu(menu).then((res)=>{
                    console.log(res)
                    if(res.errorcode==0){
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        this.dialogFormVisible = false
                    }else{
                        this.$message({
                            message: res.message,
                            type: 'error'
                        })
                    }
                })
            },
            addClose(){
                this.addForm = {
                    name: '',
                    path: '',
                    menuId: '',
                    type: '',
                    hidden: '',
                    close: '',
                    filePath: '',
                    icon: '',
                    level: ''
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/common";
    .menu-container {
        height: calc(100vh - 205px);
    }
    .dataItem-l,.dataItem-r{
        float: left;
        width: 50%;
        height: 100%;
    }
    .dataItem-l{
        padding-right: $p-25;
    }
    .dataItem-r{
        padding-left: $p-25;
        border-left:#ccc thin solid;
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
    .dataItem-r-title{
        display: inline-block;
        line-height: 40px;
        font-size: 20px;
    }
</style>