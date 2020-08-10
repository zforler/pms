<template>
  <div class="customer-container">
    <div class="t-top-bar">

    </div>
    <el-table
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          prop="date"
          label="客户编号"
          width="180">
      </el-table-column>
      <el-table-column
          prop="name"
          label="公司名称"
          width="180">
      </el-table-column>
      <el-table-column
          prop="address"
          label="公司地址">
      </el-table-column>
      <el-table-column
              prop="address"
              label="公司负责人">
      </el-table-column>
      <el-table-column
              prop="address"
              label="联系方式">
      </el-table-column>
      <el-table-column
              prop="address"
              label="对接人">
      </el-table-column>
      <el-table-column
              label="操作">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
name: "customer",
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>

<style scoped>

</style>