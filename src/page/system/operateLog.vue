<template>
  <div class="operateLog-container">
    <div class="t-top-bar">
      <el-input placeholder="请输入内容" v-model="listQuery.keyword" class="input-with-select search-input">
        <el-button  slot="append"  type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="userId" label="用户编号"></el-table-column>
      <el-table-column prop="clientIp" label="IP"></el-table-column>
      <el-table-column prop="requestTime" label="请求时间">
          <template slot-scope="scope">
              {{scope.row.requestTime | formateTime}}
          </template>
      </el-table-column>
      <el-table-column prop="paramData" label="请求参数">
          <template slot-scope="scope">
              <el-tooltip placement="top"  effect="light">
                  <div slot="content"  v-html="jsonFormat(scope.row.paramData)"></div>
                  <div>{{scope.row.paramData.substring(0,15)}}</div>
              </el-tooltip>
          </template>

      </el-table-column>
      <el-table-column prop="remark" label="操作名称"></el-table-column>
      <el-table-column prop="httpStatus" label="操作结果"></el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

  </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { getSysLogPageList } from '../../api/syslog'
    import localCache from "../../util/localCache";
export default {
  name: "operateLog",
    components: {
        Pagination,
    },
  data() {
    return {
        visible:false,
        tableData: [],
        listQuery: {
            page: 1,
            size: 10,
            keyword: ''
        },
        total: 0,
        listLoading: true,
        selectRow: ''
    }
  },
    mounted(){
        this.getList()
    },
  methods: {
      jsonFormat(data, level = 1) {
          let jsonData = ''
          try {
              jsonData = JSON.parse(data)
          }catch (e) {
              jsonData = data
          }
          let str = '';
          let space = '&nbsp;'.repeat(level * 4)
          let pspace = '&nbsp;'.repeat((level - 1) * 4)
          if (typeof jsonData === 'string' || typeof jsonData === 'number') {
              str += jsonData ? space + `"${jsonData}"` + ',' : ''
          } else if (Array.isArray(jsonData)) {
              //
          } else if (typeof jsonData === 'object') {
              for (let k in jsonData) {
                  let obj = jsonData[k];
                  if (typeof obj === 'string') {
                      str += `<div class="line"><span class="key">${space}"${k}"</span><span class="colon">&nbsp;:&nbsp;</span><span class="str">"${obj}"</span><span class="lqf-json comma">,</span></div>`
                  } else if (typeof obj === 'number') {
                      str += `<div class="line"><span class="key">${space}"${k}"</span><span class="colon">&nbsp;:&nbsp;</span><span class="str">${obj}</span><span class="lqf-json comma">,</span></div>`
                  } else if (Array.isArray(obj)) {
                      str += `<div class="line"><span class="key">${space}"${k}"</span><span class="colon">&nbsp;:&nbsp;[</span></div>`
                      for (let i = 0, len = obj.length; i < len; i++) {
                          str += this.jsonFormat(obj[i], level + 1)
                      }
                      str += `<div class="line"><span class="squarerackets">${space}],</span></div>`
                  } else if (typeof obj === 'object') {
                      str += `<div class="line"><span class="key">${space}"${k}"</span><span class="colon">&nbsp;:&nbsp;{</span></div>`
                      str += this.jsonFormat(obj, level + 1)
                      str += `<div class="line"><span class="brace">${space}},</span></div>`
                  }
              }
              if (level === 1) {
                  str = `<div class="line"><span class="brace">${pspace}{${str}${pspace}}</span></div>`
              }
          }
          return str;
      },
      getList() {
          this.listLoading = true
          this.listQuery.customerId = localCache.getCurrentCustomerId()
          getSysLogPageList(this.listQuery).then(res => {
              this.listLoading = false
              if (res.errorcode !== 0) {
                  this.$message.error(res.message)
              } else {
                  this.tableData = res.data.content
                  this.total = res.data.total
              }
          }).catch(() => {
              this.listLoading = false
          })
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
    .line{
        display: block;
    }
</style>