<template>
  <div class="login-container">
    <div class="login-form-con">
      <div class="login-title">PSM</div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-form">
        <el-form-item label="用户名" prop="pass">
          <el-input v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    import localCache from '../../util/localCache'
import {login} from '../../api/user'
export default {
name: "login",
  data() {
    return {
      ruleForm: {
        userName: '',
          password: '',
      },
      rules: {
          userName: [
              { required: true, trigger: 'blur' },
              { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
          password: [
              { required: true, trigger: 'blur' },
              { min: 8, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.ruleForm).then((res)=>{
              if(res.errorcode==0){
                  console.log(res)
                  let data = res.data

                  localCache.setToken(data.token)
                  localCache.setUser(data.user)
                  localCache.clearMenus()
                  this.$router.push({path: '/index'})
              }else{
                  this.$message({
                      message: res.message,
                      type: 'error'
                  })
              }
          })

        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss">
  .login-container{
    width: 100vw;
    height: 100vh;
    background: url("../../assets/login_bg.jpg") no-repeat;
    background-size: 100% 100%;
    position: relative;
    .login-title{
      font-size: 25px;
      text-align: left;
      color: #fff;
      padding: 15px;
      border-bottom: #fff thin solid;
      margin-bottom: 15px;
    }
    .login-form-con{
      position: absolute;
      background-color: rgba(255,255,255,0.5);
      width: 550px;
      top: 30vh;
      left: calc(50% - 225px);
      border-radius: 5px;

    }
    .login-form .el-input {
      width: 360px !important;
    }
    .login-form .el-input__inner{
      height: 55px !important;
      line-height: 55px !important;
    }
    .login-btn{
      text-align: center;
      margin-left: -100px;
    }
  }


</style>