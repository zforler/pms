<template>
  <div class="customer-container">
    <div class="t-top-bar">
      <el-input placeholder="全内容检索" v-model="searchValue" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="客户编号" width="80"></el-table-column>
      <el-table-column prop="name" label="公司名称"></el-table-column>
      <el-table-column prop="address" label="公司地址"></el-table-column>
      <el-table-column prop="name" label="公司负责人"></el-table-column>
      <el-table-column prop="name" label="联系方式"></el-table-column>
      <el-table-column prop="name" label="对接人"></el-table-column>
      <el-table-column prop="concatPhone" label="对接人联系方式"></el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-tooltip content="客户信息编辑" placement="top">
            <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          </el-tooltip>
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


    <el-dialog :title="dialogMark=='add'?'添加客户信息':'编辑客户信息'" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item v-if="dialogMark=='edit'" label="客户编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司负责人" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="对接人" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="对接人联系方式" :label-width="formLabelWidth">
          <el-input v-model="addForm.concatPhone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisiable = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
name: "customer",
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      dialogMark: 'add',
      formLabelWidth: '120px',
      tableData: [{
        date: '0001',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        concatPhone: '18363000394'
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        concatPhone: '18363000394'
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        concatPhone: '18363000394'
      }],
      addForm: {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        concatPhone: '18363000394'
      },
      currentPage4: 4,
      selectRow: ''
    }
  },
  methods: {
    addHandler() {
      this.dialogMark='add'
      this.addDialogVisiable = true
    },
    editHandler(row) {
      this.selectRow = row
      this.dialogMark='edit'
      this.addDialogVisiable = true
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