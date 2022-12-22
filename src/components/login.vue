<template>
  <div class="login">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      status-icon
      label-width="80px"
    >
      <img src="../assets/logo.png" alt="" />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          @keyup.enter.native="submit"
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'change' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 200) {
              this.$message({
                showClose: true,
                message: res.data.meta.msg,
                type: 'success',
                duration: 2000
              })
              localStorage.setItem('token', res.data.data.token)
              this.$router.push('/home')
            } else {
              this.$message({
                showClose: true,
                message: res.data.meta.msg,
                type: 'error',
                duration: 3000
              })
            }
          })
        } else {
          console.log('校验没通过')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  height: 100%;
  background: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: white;
    margin: 200px auto;
    padding: 70px 40px 15px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -130px;
      border: 10px solid white;
    }
    .el-button + .el-button {
      margin-left: 100px;
    }
  }
}
</style>
