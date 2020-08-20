<template>
  <div class="salary-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="员工编号" width="80"></el-table-column>
      <el-table-column prop="name" label="员工姓名"></el-table-column>
      <el-table-column prop="name" label="性别" width="180"></el-table-column>
      <el-table-column prop="address" label="组织架构" width="230"></el-table-column>
      <el-table-column prop="name" label="员工类型"></el-table-column>
      <el-table-column prop="name" label="计件工资"></el-table-column>
      <el-table-column prop="name" label="计时工资"></el-table-column>
      <el-table-column prop="name" label="计件工资"></el-table-column>
      <el-table-column prop="name" label="调整项"></el-table-column>
      <el-table-column prop="name" label="补贴项"></el-table-column>
      <el-table-column prop="name" label="合计工资"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-setting el-icon-table" @click="setRoleHandler(scope.row)"></i>
        </template>
      </el-table-column>
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


    <el-dialog title="工资调整" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item label="调整类型" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="调整金额" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="工资明细" :visible.sync="detailDialogVisiable" width="1050px">
      <el-table :data="detailTableData" border style="width: 100%">
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
      <div>
        统计
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="detailDialogVisiable = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "salary",
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      detailDialogVisiable: false,
      formLabelWidth: '120px',
      tableData: [{
        date: '0001',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        status: 0,
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        status: 0,
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        status: 0,
      }],
      detailTableData: [{
        date: '0001',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        status: 0,
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        status: 0,
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        status: 0,
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
      currentPage4: 4
    }
  },
  methods: {
    editHandler(row) {
      this.addDialogVisiable = true
    },
    setRoleHandler(row){
      this.detailDialogVisiable = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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