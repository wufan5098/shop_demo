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
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">登录</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
