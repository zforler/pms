<template>
  <div class="production-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="产品编号" width="80"></el-table-column>
      <el-table-column prop="name" label="产品名称"></el-table-column>
      <el-table-column prop="name" label="添加时间"></el-table-column>
      <el-table-column prop="name" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
          <i class="el-icon-setting el-icon-table" @click="setCardHandler(scope.row)"></i>
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


    <el-dialog title="添加产品" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item label="产品编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此产品信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "production",
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      confirmVisible: false,
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
      }, {
        date: '0004',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
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
    addHandler() {
      this.addDialogVisiable = true
    },
    editHandler(row) {
      this.addDialogVisiable = true
    },
    delHandler(row){
      this.confirmVisible = true
    },
    setCardHandler(row){

    },
    setLockHandler(row){
      row.status = row.status == 0?1:0
    },
    confirmCloseHandler() {

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