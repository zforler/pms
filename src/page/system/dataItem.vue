<template>
  <div class="dataItem-container">
    <div class="dataItem-l">
      <div class="t-top-bar">
        <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
          <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
        </el-input>
        <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="设备编号"></el-table-column>
        <el-table-column prop="address" label="故障编号"></el-table-column>
        <el-table-column prop="name" label="故障名称"></el-table-column>
        <el-table-column prop="name" label="故障描述"></el-table-column>
        <el-table-column prop="name" label="故障时间"></el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
      </el-pagination>
    </div>
    <div class="dataItem-r">
      <div class="t-top-bar">
        <div class="dataItem-r-title">字典子码</div>
        <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="设备编号"></el-table-column>
        <el-table-column prop="address" label="故障编号"></el-table-column>
        <el-table-column prop="name" label="故障名称"></el-table-column>
        <el-table-column prop="name" label="故障描述"></el-table-column>
        <el-table-column prop="name" label="故障时间"></el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加数据字典" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item label="字典编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" :label-width="formLabelWidth">
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
name: "dataItem",
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      formLabelWidth: '120px',
      tableData: [{
        date: '0001',
        name: '王小虎',
        address: '#1'
      }, {
        date: '0002',
        name: '王小虎',
        address: '#2'
      }, {
        date: '0002',
        name: '王小虎',
        address: '#3'
      }, {
        date: '0004',
        name: '王小虎',
        address: '#4'
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
.dataItem-container {
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