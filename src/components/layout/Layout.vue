<template>
  <div>
    <div class="l-left-container">
      <div class="l-left-logo l-flex-center">PMS</div>
      <div id="menuc"></div>
    </div>
    <div class="l-right-container">
      <div class="l-right-top">
        <div class="l-right-top-company">
          <h3>xxxgong公司</h3>
        </div>
        <div class="l-right-top-user-c">
          <div class="l-right-top-user" @click="userClick">系统管理员</div>
          <ul :class="userOperation?'l-right-top-user-opetion' : 'l-right-top-user-opetion-show'">
            <li class="l-rtuo-item">退出</li>
          </ul>
        </div>
      </div>
      <div class="l-right-content">
        <div class="l-right-content-inner">
          <LTabs></LTabs>
          <div class="l-right-bcontainer">
            <TabVIews></TabVIews>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LMenu from "@/util/LMenu/LMenu";
import LTabs from "@/components/layout/LTabs";
import TabVIews from "@/components/layout/TabVIews";
export default {
name: "Layout",
  data() {
    return {
      lmenu: '',
      userOperation: false,
    }
  },
  components:{
    LTabs,
    TabVIews
  },
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      this.lmenu.setActive(to.path)
    }
  },
  activated() {
    this.lmenu.setActive(this.$router.currentRoute.path)
  },
  methods: {
    view(mark){
      this.$router.push('/' + mark)
    },
    userClick() {
      this.userOperation = !this.userOperation
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
    this.lmenu.render(this.$router.options.routes)
    this.lmenu.on('click', (e) => {
        console.log(e)
      if(!e.path){
        return
      }
      if(e.type == 1){
        return
      }
      if(e.path === me.$router.currentRoute.path){
        return
      }
      console.log(me.$router.currentRoute)
      me.$router.push(e.path)
      this.lmenu.setActive(e.path)
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common";
@import "../../util/LMenu/LMenu.css";

  .l-left-container{
    background-color: $theme-color;
    background-image: linear-gradient(180deg,#4e73df 10%,#224abe 100%);
    background-size: cover;
    width: $menu-width;
    float: left;
    height: $h-100vh;
  }
  .l-left-logo{
    height: 55px;
  }
  .l-right-container{
    background-color: $bg-color;
    width: calc(100% - 250px);
    float: left;
    height: $h-100vh;
  }
  .l-right-top{
    padding: 15px $p-25;
    height: 55px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: #f0f0f0 thin solid;
    box-shadow: #ccc 5px 1px 10px;
  }

  .l-right-bcontainer{
    padding: $p-25;
  }
  .l-right-content {
    padding: $p-25;
  }
.l-right-content-inner {
  border: #f0f0f0 thin solid;
}
.l-right-bcontainer {
  background-color: #fff;
  min-height: calc(100vh - 156px);
}
/*用户信息*/
.l-right-top-user-c {
  position: relative;
}
.l-right-top-user{
  cursor: pointer;
}
.l-right-top-user-opetion {
  position: absolute;
  top: calc(100% + 27px);
  background-color: #ccc;
  width: 110px;
  min-height: 85px;
  left: -35px;
  border-radius: 5px;
  background-color: #fff;
  border: #ccc thin solid;
  display: block;
}
.l-right-top-user-opetion-show{
  display: none;
}
.l-rtuo-item{
  text-align: center;
  cursor: pointer;
  padding: 8px 0;
}
/*用户信息*/
</style>