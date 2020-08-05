<template>
  <div>
    <div class="l-left-container">
      <div class="l-left-logo l-flex-center">PMS</div>
      <div @click="view('a1')">a</div>
      <div @click="view('b1')">b</div>
      <div id="menuc">c</div>

    </div>
    <div class="l-right-container">
      <div class="l-right-top">top</div>
      <div class="l-tab-container">
        <ul class="l-tab">
          <li>菜单一</li>
          <li>菜单二</li>
        </ul>
      </div>
      <div class="l-right-bcontainer">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import LMenu from "@/util/LMenu/LMenu";
export default {
name: "Layout",
  data() {
    return {
      lmenu: ''
    }
  },
  methods: {
    view(mark){
      this.$router.push('/' + mark)
    }
  },
  mounted() {
    let me = this
    console.log(this.$router)
    this.lmenu = new LMenu({container: 'menuc'})
    // let obj = [
    //     {
    //         text: 'title1',
    //         children:  [
    //             {
    //                 text: 'title3-1',
    //                 path: '/a1'
    //             }
    //         ]
    //     },
    //     {
    //         text: 'title2',
    //         children: [
    //             {
    //                 text: 'title2-1'
    //             },
    //             {
    //                 text: 'title2-2',
    //                 children: {
    //                     text: 'title2-3-1',
    //                     children:
    //                         {
    //                             text: 'title2-4-1',
    //                             children: [
    //                                 {
    //                                     text: 'title2-5-1'
    //                                 }
    //                             ]
    //                         }
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         text: 'title3',
    //         children: [
    //             {
    //                 text: 'title3-1'
    //             }
    //         ]
    //     },
    //     {
    //         text: 'title4'
    //     }
    // ]
    this.lmenu.render(this.$router.options.routes[0].children)
    this.lmenu.on('click', function (e) {
        console.log(e)
      if(!e.path){
        return
      }
      if(e.path === me.$router.currentRoute.path){
        return
      }
      console.log(me.$router.currentRoute)
      me.$router.push(e.path)
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/common.scss";
@import "../util/LMenu/LMenu.css";
  .l-left-container{
    background-color: $theme-color;
    width: 300px;
    float: left;
    height: $h-100vh;
  }
  .l-left-logo{
    height: 75px;
  }
  .l-right-container{
    background-color: $bg-color;
    width: calc(100% - 300px);
    float: left;
    height: $h-100vh;
  }
  .l-right-top{
    padding: 15px;
    height: 75px;
    background-color: #fff;
  }
  .l-right-bcontainer{
    padding: 15px;
  }
</style>