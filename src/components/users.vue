<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/users">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input
      style="margin-bottom: 5px;"
      placeholder="请输入用户名"
      v-model="query"
      class="input-with-select"
      @input.native="search"
      @compositionend.native="search"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="search"
      ></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">用户添加</el-button>
    <el-table :data="usersList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="mg_state" label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
            @click="showEditDialog(scope.row)"
          >
          </el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delUser(scope.row.id)"
          >
          </el-button>
          <!-- 分配角色 -->
          <el-button type="success" icon="el-icon-check" plain size="small">
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="padding-left: 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
      >
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addForm.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            v-model="addForm.mobile"
            placeholder="请输入电话"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-tag type="info">{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      value: true,
      query: '',
      currentPage: 1,
      pageSize: 2,
      usersList: [],
      // 添加用户dialog的显示隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户dialog的显示隐藏
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户对话框的表单验证
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 2, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表发送axios
    getUserList() {
      this.axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      }).then(res => {
        this.usersList = res.data.users
        this.total = res.data.total
      })
    },
    handleCurrentChange(val) {
      // 修改当前页
      this.currentPage = val
      this.getUserList()
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getUserList()
    },
    // 搜索功能
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    // 删除功能
    delUser(id) {
      this.$confirm('确定删除此用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios({
            method: 'delete',
            url: `users/${id}`
          }).then(res => {
            if (res.meta.status === 200) {
              if (this.usersList.length === 1 && this.currentPage > 1) {
                this.currentPage--
              }
              this.getUserList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
    },
    // 修改状态
    changeState(user) {
      this.axios({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: 'put'
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('用户状态修改成功')
        } else {
          this.$message.error('用户状态修改失败')
        }
      })
    },
    // 添加用户对话框显示隐藏
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return false
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(res => {
          let {
            meta: { status, msg }
          } = res
          if (status === 201) {
            this.$message.success(msg)
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getUserList()
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 编辑用户回显
    showEditDialog(user) {
      this.editDialogVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 修改用户
    editUser() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        this.axios({
          url: `users/${this.editForm.id}`,
          method: 'put',
          data: this.editForm
        }).then(res => {
          let {
            meta: { status, msg }
          } = res
          if (status === 200) {
            this.$message.success(msg)
            this.$refs.editForm.resetFields()
            this.getUserList()
            this.editDialogVisible = false
          } else {
            this.$message.error(msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
.input-with-select {
  width: 300px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
