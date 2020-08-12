<template>
  <div class="l-tab-container">
    <ul class="l-tab">
      <li v-for="(item, index) in tabItems" :key="index"
          :class="item.active ? 'l-tab-item l-tab-item-active' : 'l-tab-item'"
          @click="itemClick(item)">
        {{ item.text }}
        <i class="el-icon-close" @click="closeHandler(item)"></i>
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
    let currentRoute = this.$router.currentRoute
    let item = {
      text: currentRoute.name,
      path: currentRoute.path,
      active: true
    }
    this.pushItem(item)

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
    },
    closeHandler(item) {
        for (let i = 0, len = this.tabItems.length; i < len; i++) {
            if(item.path == this.tabItems[i].path){
                this.tabItems.splice(i,1)
            }
        }
        if(item.active) {
            let next = this.tabItems[this.tabItems.length - 1]
            if (next) {
                this.$router.push(next.path)
                next.active = true
                this.activeItem = next
            }
        }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common.scss";
@import "../../styles/ltab.scss";
.l-tab-container {
    background-color: #fff;
    border-bottom: #ccc thin solid;
}
</style>