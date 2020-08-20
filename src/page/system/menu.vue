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
            <el-table-column prop="icon" label="图标">
                <template slot-scope="scope">
                    <svg-icon :icon-class="scope.row.icon" width="24px" height="24px"/>
                </template>
            </el-table-column>
            <el-table-column prop="hidden" label="是否可见"></el-table-column>
            <el-table-column prop="close" label="是否可关闭"></el-table-column>
            <el-table-column prop="level" label="等级等级"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
                    <i class="el-icon-share el-icon-table" @click="addSubHandler(scope.row)"></i>
                    <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="opFlag=='add'?'添加菜单':'编辑菜单'" :visible.sync="addDialogVisiable" @close="addClose" width="580px">
            <el-form :model="addForm">
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
                <el-form-item label="图标" prop="icon" :label-width="formLabelWidth">
                    <el-autocomplete  v-model="addForm.icon" popper-class="icon-autocomplete"
                                      :trigger-on-focus = "true" :fetch-suggestions="searchIcon"  :clearable = "true" @select="selectIcon">
                        <i class="el-icon-edit el-input__icon" slot="suffix" @click="clickSearchIcon"></i>
                        <template slot-scope="{ item }">
                            <div >
                                <svg-icon :icon-class="item"/>
                                <span class="name">{{ item }}</span>
                            </div>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item label="是否可见" :label-width="formLabelWidth">
                    <el-select v-model="addForm.hidden" placeholder="请选是否可见">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可关闭" :label-width="formLabelWidth">
                    <el-select v-model="addForm.close" placeholder="请选是否可关闭">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
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
    import icons from '../svg-icons/generateIconsView'
    import { addMenu } from '../../api/menu'
    export default {
        name: "menulist",
        data() {
            return {
                searchValue: '',
                addDialogVisiable: false,
                innerVisible:false,
                opFlag: 'add',
                formLabelWidth: '120px',
                tableData: [
                    {
                        menuId:1,
                        name: '登录',
                        path: '/login',
                        filePath:  './page/index/index.vue',
                        hidden: 1,
                    },
                  {
                      menuId:2,
                      name: '首页',
                      path: '/',
                      type: 1,
                      hidden: 1,
                      close: 0,
                      icon: 'add',
                      children: [
                          {
                              menuId:3,
                              name: '首页',
                              path: '/index',
                              type: 2,
                              icon: 'add',
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
                // 图标
                iconsMap: [],
                selectRow: ''
            }
        },
        mounted(){
          console.log(icons)
            this.iconsMap = icons.state.iconsMap.map((i) => {
                return i.default.id.substring(5)
            })
        },
        methods: {
            // 查询图标
            searchIcon(keyword, cb) {
                const result = this.iconsMap
                const results = keyword ? result.filter(this.createStateFilter(keyword)) : result;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
                cb(results);
            },
            selectIcon(item) {
                this.addForm.icon = item
            },
            clickSearchIcon() {
                this.addForm.icon = ''
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                };
            },
            addHandler() {
                this.opFlag = 'add'
                this.addDialogVisiable = true
            },
            addConfirm() {
                console.log(this.addForm)
                let menu = Object.assign({}, this.addForm)
                if(this.opFlag == 'add'){
                    delete menu.menuId
                    delete menu.parentId
                }else if(this.opFlag == 'edit'){

                }else if(this.opFlag == 'sub'){
                    delete menu.menuId
                }

                addMenu(menu).then((res)=>{
                    console.log(res)
                    if(res.errorcode==0){
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        })
                        this.addDialogVisiable = false
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
            editHandler(row){
                this.selectRow = row
                this.opFlag = 'edit'
                this.addForm = Object.assign({},row)
                this.addForm.hidden = ''+this.addForm.hidden
                this.addForm.close = ''+(this.addForm.close||0)
                this.addDialogVisiable = true
            },
            addSubHandler(row){
                this.selectRow = row
                this.opFlag = 'sub'
                this.addForm.parentId = row.menuId
                this.addDialogVisiable = true
            },
            delHandler(row){
                this.selectRow = row
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/common";
    .menu-container {
        height: calc(100vh - 205px);
        .el-input{
            width: 350px;
        }
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