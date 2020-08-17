<template>
  <div class="login-container">
    <div class="login-form-con">
      <div class="login-title">PSM</div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-form">
        <el-form-item label="用户名" prop="pass">
          <el-input type="password" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
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
import {login} from '../../api/user'
export default {
name: "login",
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        userName: '',
        pass: '',
        checkPass: '',
        age: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login({
            a:'a'
          })
        } else {
          console.log('error submit!!');
          return false;
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