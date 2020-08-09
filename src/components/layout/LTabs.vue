<template>
  <div class="l-tab-container">
    <ul class="l-tab">
      <li v-for="(item, index) in tabItems" :key="index"
          :class="item.active ? 'l-tab-item l-tab-item-active' : 'l-tab-item'"
          @click="itemClick(item)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LTabs",
  data() {
    return {
      tabItems: [
        {
          text: '菜单一',
          path: '/a1/a11',
          active: true
        },
        {
          text: '菜单二',
          path: '/b11/b11'
        },
        {
          text: '菜单三',
          path: '/a1'
        },
        {
          text: '菜单四#f8f9fc',
          path: '/b1'
        }
      ],
      activeItem: ''
    }
  },
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      console.log(to, from)
      let item = {
        text: to.name,
        path: to.path,
        active: true
      }
      this.pushItem(item)
    }
  },
  mounted() {
    for (let i = 0, len = this.tabItems.length; i < len; i++) {
      if(this.tabItems[i].active){
        this.activeItem = this.tabItems[i]
        break
      }
    }
  },
  methods: {
    pushItem(item) {
      if(this.activeItem){
        if(this.activeItem.path == item.path){
          return
        }else{
          let res = this.checkHas(item)
          if(res){
            this.activeItem.active = false
            res.active = true
            this.activeItem = res;
          }else{
            this.activeItem.active = undefined
            this.activeItem = item;
            this.tabItems.push(item)
          }
        }
      }else{
        this.tabItems.push(item)
      }
    },

    checkHas(item){
      for (let i = 0, len = this.tabItems.length; i < len; i++) {
        if(this.tabItems[i].path == item.path){
          return this.tabItems[i]
        }
      }
      return false
    },
    itemClick(item) {
      if(item.active){
        return
      }
      this.$router.push(item.path)
      this.activeItem.active = undefined
      item.active = true
      this.activeItem = item
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common.scss";
@import "../../styles/ltab.scss";
.l-tab-container {
  background-color:$bg-color-tab;
  border-bottom: thin solid #ccc;

}
</style>