<template>
  <div class="productLog-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="记录编号"></el-table-column>
      <el-table-column prop="address" label="电卡编号"></el-table-column>
      <el-table-column prop="address" label="设备编号"></el-table-column>
      <el-table-column prop="name" label="产品"></el-table-column>
      <el-table-column prop="name" label="批次"></el-table-column>
      <el-table-column prop="name" label="工艺"></el-table-column>
      <el-table-column prop="name" label="规格"></el-table-column>
      <el-table-column prop="name" label="白/夜班"></el-table-column>
      <el-table-column prop="name" label="员工编号"></el-table-column>
      <el-table-column prop="name" label="记录时间"></el-table-column>
      <el-table-column prop="name" label="上传时间"></el-table-column>
      <el-table-column prop="name" label="记录金额"></el-table-column>
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
</template>

<script>
export default {
  name: "productLog-container",
  data() {
    return {
      searchValue: '',
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