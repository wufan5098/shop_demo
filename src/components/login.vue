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
      <!-- 显示密码 -->
      <el-form-item v-if="visible2" label="密码" prop="password">
        <el-input
          @keyup.enter.native="submit"
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
        >
          <i
            slot="suffix"
            title="显示密码"
            @click="changePass('show', 2)"
            style="cursor:pointer;"
            class="el-icon-view"
          ></i>
        </el-input>
      </el-form-item>
      <!-- 隐藏密码 -->
      <el-form-item v-else label="密码" prop="password">
        <el-input
          @keyup.enter.native="submit"
          v-model="form.password"
          placeholder="请输入密码"
          type="text"
        >
          <i
            slot="suffix"
            title="显示密码"
            @click="changePass('hide', 2)"
            style="cursor:pointer;"
            class="el-icon-close-notification
"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible2: true,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'change' },
          { min: 2, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
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
    changePass(value, kind) {
      this.visible2 = !(value === 'show')
    },
    // 重置
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          }).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'success',
                duration: 1000
              })
              localStorage.setItem('token', res.data.token)
              this.$router.push('/users')
            } else {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请正确输入用户名或密码',
            type: 'warning',
            duration: 1000
          })
          // console.log('校验没通过')
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
circle
