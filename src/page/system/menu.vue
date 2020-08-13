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
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="date" label="菜单名称"></el-table-column>
      <el-table-column prop="name" label="菜单编号"></el-table-column>
      <el-table-column prop="date" label="类型"></el-table-column>
      <el-table-column prop="address" label="路由"></el-table-column>
      <el-table-column prop="address" label="文件路径"></el-table-column>
      <el-table-column prop="address" label="图标"></el-table-column>
      <el-table-column prop="address" label="是否可见"></el-table-column>
      <el-table-column prop="address" label="等级"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">

        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加菜单" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件路径" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可见" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "menu",
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      formLabelWidth: '120px',
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],

      addForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      currentPage4: 4,
    }
  },
  methods: {
    addHandler() {
      this.addDialogVisiable = true
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