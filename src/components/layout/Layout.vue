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
            <el-select v-if="userCustomerId=='0000'" v-model="customerId" filterable @change="cumstomerChange">
                <el-option
                        v-for="item in companys"
                        :key="item.customerId"
                        :label="item.company"
                        :value="item.customerId">
                </el-option>
            </el-select>
          <h3 v-else>{{company}}</h3>
            <!--<h3 v-else @click="changeConpany">xxxgong公司</h3>-->
        </div>
        <div class="l-right-top-user-c">
          <div class="l-right-top-user" @click="userClick">{{userName}}</div>
          <ul :class="userOperation?'l-right-top-user-opetion' : 'l-right-top-user-opetion-show'">
            <li class="l-rtuo-item" @click="logout">退出</li>
            <li class="l-rtuo-item" @click="addDialogVisiable=true">修改密码</li>
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



      <el-dialog title="修改密码" @close="addCloseHandler" :visible.sync="addDialogVisiable" width="650px">
        <el-form :model="addForm":rules="rules" ref="addForm">
          <el-form-item label="旧密码" prop="oldPass" :label-width="formLabelWidth">
            <el-input type="password" v-model="addForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass1"  :label-width="formLabelWidth">
            <el-input type="password" v-model="addForm.newPass1" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newPass2"  :label-width="formLabelWidth">
            <el-input type="password" v-model="addForm.newPass2" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisiable = false">取 消</el-button>
          <el-button type="primary" @click="addConfirm">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
    import localCache from '@/util/localCache';
import Menu from "@/components/Menu/Menu";
import LTabs from "@/components/layout/LTabs";
import TabVIews from "@/components/layout/TabVIews";
    import { getCustomerList } from '../../api/customer'
    import { updatePass } from '../../api/user'
export default {
name: "Layout",
  data() {
      let validatePass = (rule, value, callback) => {
          if (value !== this.addForm.newPass1) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
    return {
      userOperation: false,
        // companys: [],
        customerId:'',
        company: '',
        userCustomerId:'',
        addDialogVisiable: false,
        formLabelWidth: '120px',
        addForm: {
            oldPass:'',
            newPass1:'',
            newPass2:''
        },
        rules: {
            oldPass: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, max: 16, message: '长度在 3 到 16 个字', trigger: 'blur' }
            ],
            newPass1: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, max: 16, message: '长度在 3 到 16 个字', trigger: 'blur' }
            ],
            newPass2: [
                { required: true, message: '密码不能为空', trigger: 'change' },
                { min: 6, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' },
                { validator: validatePass, trigger: 'blur' }
            ],
        },
    }
  },
  components:{
    LTabs,
    TabVIews,
      Menu
  },
    computed:{
        userName(){
            return localCache.getUser().realName
        },
        roleLevel(){
            return parseInt(localCache.getRole().level)
        },
        companys: {
            get() {
                return this.$store.getters.customers
            },
            set(val) {
                this.$store.dispatch('addCustomers',val)
            }
        },
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
      console.log('44444')
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
      },
      addCloseHandler(){
          this.$refs['addForm'].resetFields()
          this.addForm =  {
              oldPass:'',
              newPass1:'',
              newPass2:''
          }
      },
      addConfirm() {
          this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                  return
              }
              let param = Object.assign({},this.addForm)
              param.customerId = localCache.getUser().customerId
              param.userId = localCache.getUser().userId;
              updatePass(param).then((res)=>{
                  if(res.errorcode==0){
                      this.$message.success('修改成功')
                      this.addDialogVisiable = false
                  }else{
                      this.$message.error(res.message)
                  }
              })
          });
      },
  },
  mounted() {
    console.log('layout')
    this.customerId = localCache.getCurrentCustomerId()
      this.$refs.menu.setActive(this.$router.currentRoute.path)
      this.getCustomerList_()
    this.company = localCache.getCustomer().company
      this.userCustomerId = localCache.getUser().customerId
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/common";

  .l-left-container{
    background-color: $theme-color;
    background-image: linear-gradient(180deg,#4e73df 10%,#224abe 100%);
    background-size: cover;
    width: $menu-width;
    float: left;
    height: $h-100vh;
    position: fixed;
      z-index: 99;
  }
  .l-left-logo{
    height: 55px;
  }
  .l-right-container{
    background-color: $bg-color;
    width: calc(100% - 250px);
    float: right;
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
    width: calc(100vw - 250px);
      position: fixed;
    z-index: 99;
  }

  .l-right-bcontainer{
    padding: $p-25;
  }
  .l-right-content {
    padding: $p-25;
      margin-top:55px;
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
  top: calc(100% + 20px);
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
.l-rtuo-item:hover{
    color: $theme-color;
}
/*用户信息*/
</style>
<style>
    .l-right-top .el-input__inner{
        border: none !important;
        font-size: 20px;
    }
</style>