<template>
  <div class="company-container">
    <span>客户：</span>
    <el-select v-model="value" @change="_change" filterable placeholder="请选择客户">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
name: "company",
  data() {
    return {
      options: [{
        value: '选项1',
        label: '公司1'
      }, {
        value: '选项2',
        label: '公司31'
      }, {
        value: '选项3',
        label: '公司12'
      }, {
        value: '选项4',
        label: '公司111'
      }, {
        value: '选项5',
        label: '公司11'
      }],
      value: ''
    }
  },
  props: {
    selectChange: Function
  },
  activated() {
  },
  methods: {
    getValue() {
      return this.value
    },
    _change(val){
      console.log(val)
      this.selectChange(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.company-container {
  padding: 0 15px;
  display: inline-block;

}
</style>