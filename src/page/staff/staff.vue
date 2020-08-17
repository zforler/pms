<template>
  <div class="staff-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search">搜索</el-button>
      </el-input>
      <i class="el-icon-circle-plus-outline l-add-buttion" @click="addHandler"></i>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="员工编号" width="150"></el-table-column>
      <el-table-column prop="name" label="员工姓名" width="150"></el-table-column>
      <el-table-column prop="name" label="性别" width="80"></el-table-column>
        <el-table-column prop="name" label="组织架构" width="280"></el-table-column>
      <el-table-column prop="name" label="员工类型" width="100"></el-table-column>
      <el-table-column prop="name" label="入职时间" width="180">{{'2020-01-01 11:25:25'}}</el-table-column>
      <el-table-column prop="name" label="离职时间" width="180">{{'2020-01-01 11:25:25'}}</el-table-column>
        <el-table-column prop="name" label="状态" width="80"></el-table-column>
      <el-table-column prop="name" label="联系方式" width="100"></el-table-column>
      <el-table-column prop="address" label="员工住址" width="280"></el-table-column>
      <el-table-column prop="name" label="身份证号" width="150"></el-table-column>
      <el-table-column prop="name" label="添加时间" width="130"></el-table-column>
      <el-table-column prop="name" label="修改时间" width="130"></el-table-column>
      <el-table-column fixed="right" width="140" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-edit el-icon-table" @click="editHandler(scope.row)"></i>
          <i class="el-icon-delete el-icon-table" @click="delHandler(scope.row)"></i>
          <i class="el-icon-bank-card el-icon-table" @click="delHandler(scope.row)"></i>
          <i class="el-icon-setting el-icon-table" @click="setOrgHandler(scope.row)"></i>
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


    <el-dialog title="添加员工" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item label="员工编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="入职时间" :label-width="formLabelWidth">
              <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="离职时间" :label-width="formLabelWidth">
              <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工住址" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="员工类型" :label-width="formLabelWidth">
              <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="confirmVisible" width="30%" :before-close="confirmCloseHandler">
      <span>确定删除此员工信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="设置员工部门" :visible.sync="setOrgDialogVisiable" width="650px">
      <el-tree :data="treeData" :props="defaultTree" @node-click="handleNodeClick"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setOrgDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="setOrgDialogVisiable = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Company from "@/components/Company/Company";
export default {
name: "staff",
  components: {Company},
  data() {
    return {
      searchValue: '',
      addDialogVisiable: false,
      confirmVisible: false,
      setOrgDialogVisiable: false,
      formLabelWidth: '120px',
      tableData: [{
        date: '0001',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '0002',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '0004',
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
      treeData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultTree: {
        children: 'children',
        label: 'label'
      }
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

    },
    confirmCloseHandler() {

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    setOrgHandler(row) {
      this.setOrgDialogVisiable = true
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