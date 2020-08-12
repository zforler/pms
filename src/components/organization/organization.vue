<template>
  <div class="organization-container">
    <div class="org-tree">
      <div class="org-tree-btns">
        <i class="el-icon-circle-plus-outline l-operate-buttion" @click="addHandler"></i>
        <i class="el-icon-edit l-operate-buttion" @click="editHandler()"></i>
      </div>
      <el-tree :data="treeData" :props="defaultTree" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="org-his">
      <div class="org-his-title">
        变更记录
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="上级部门编号"></el-table-column>
        <el-table-column prop="name" label="上级部门名称"></el-table-column>
        <el-table-column prop="address" label="管理开始时间"></el-table-column>
        <el-table-column prop="name" label="管理结束时间"></el-table-column>
        <el-table-column prop="name" label="变更类型"></el-table-column>
        <el-table-column prop="name" label="部门名称"></el-table-column>
      </el-table>
    </div>


    <el-dialog title="添加组织架构" :visible.sync="addDialogVisiable" width="650px">
      <el-form :model="addForm">
        <el-form-item label="架构编号" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="架构名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级架构" :label-width="formLabelWidth">
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
name: "Organization",
  data() {
    return {
      addDialogVisiable: false,
      formLabelWidth: '120px',
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
        },
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
      }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    addHandler() {
      this.addDialogVisiable = true
    },
    editHandler(row) {
      this.addDialogVisiable = true
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common";
.organization-container {
  height: calc(100vh - 205px);
}
.l-add-buttion{

}
.org-tree{
  float:left;
  width: 30%;
  height: 100%;
}
.org-tree-btns{
  text-align: right;
}
.l-operate-buttion{
  margin-right: 8px;
}
.org-his{
  float: left;
  width: 70%;
  border-left: #ccc thin solid;
  padding-left: $p-25;
  height: 100%;
}
.org-his-title{
  font-size: 20px;
  padding: 5px 0px;
}
</style>