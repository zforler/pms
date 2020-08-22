<template>
  <div>
    <div class="l-left-container">
      <div class="l-left-logo l-flex-center">PMS</div>
      <div id="menuc">
          <Menu ref="menu" v-bind:clickHandler="clickHandler"></Menu>
      </div>
    </div>
    <div class="l-right-container">
      <div class="l-right-top">
        <div class="l-right-top-company">
            <el-select  :disabled="roleLevel>2" v-model="customerId" filterable @change="cumstomerChange">
                <el-option
                        v-for="item in companys"
                        :key="item.customerId"
                        :label="item.company"
                        :value="item.customerId">
                </el-option>
            </el-select>
            <!--<h3 v-else @click="changeConpany">xxxgong公司</h3>-->
        </div>
        <div class="l-right-top-user-c">
          <div class="l-right-top-user" @click="userClick">{{userName}}</div>
          <ul :class="userOperation?'l-right-top-user-opetion' : 'l-right-top-user-opetion-show'">
            <li class="l-rtuo-item" @click="logout">退出</li>
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
    import localCache from '@/util/localCache';
import LMenu from "@/util/LMenu/LMenu";
import Menu from "@/components/Menu/Menu";
import LTabs from "@/components/layout/LTabs";
import TabVIews from "@/components/layout/TabVIews";
    import { getCustomerList } from '../../api/customer'
export default {
name: "Layout",
  data() {
    return {
      userOperation: false,
        companys: [],
        customerId:''
    }
  },
  components:{
    LTabs,
    TabVIews,
      Menu
  },
    computed:{
        userName(){
            return localCache.getUser().userName
        },
        roleLevel(){
            return parseInt(localCache.getRole().level)
        }
    },
  watch: {
    $route(to, from) {
        // if(from.name=='登录'){
        //     this.$refs.menu.render()
        // }
      // 对路由变化作出响应...
      // this.lmenu.setActive(to.path)
        this.$refs.menu.setActive(to.path)
    }
  },
  activated() {
    //   this.$refs.menu.setActive(this.$router.currentRoute.path)
  },
  methods: {
      cumstomerChange(current){
        localCache.setCurrentCustomerId(current)
          //todo 暂时先刷新页面
          location.reload()
      },
    view(mark){
      this.$router.replace('/' + mark)
    },
    userClick() {
      this.userOperation = !this.userOperation
    },
      logout(){
          localCache.deleteToken()
          this.$router.replace({path: '/login'})
          location.reload();
      },
      clickHandler(e){
        console.log(e)
        if(!e.path){
          return
        }
        if(e.type == 1){
          return
        }

        if(e.path === this.$router.currentRoute.path){
          return
        }
        console.log(e.path)
        this.$router.push(e.path)
      },
      getCustomerList_(){
          getCustomerList().then((res)=>{
              if(res.errorcode == 0){
                   this.companys = res.data
              }
          })
      }
  },
  mounted() {
    this.customerId = localCache.getCurrentCustomerId()
      this.$refs.menu.setActive(this.$router.currentRoute.path)
      this.getCustomerList_()

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
    min-height: $h-100vh;
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
<style>
    .l-right-top .el-input__inner{
        border: none !important;
        font-size: 20px;
    }
</style>