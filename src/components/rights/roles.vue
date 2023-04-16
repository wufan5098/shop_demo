<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/roles">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户按钮 -->
    <el-button type="success" plain @click="showRoleDialog">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table :data="rolesList" style="width: 100%">
      <!-- 展开权限详情 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <span class="level0" v-if="scope.row.children.length === 0"
            >暂无权限</span
          >
          <!-- 一级权限 -->
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id"
          >
            <el-col :span="4">
              <el-tag closable @close="deleteRight(scope.row, level1.id)">{{
                level1.authName
              }}</el-tag>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="20">
              <el-row
                class="level2"
                v-for="level2 in level1.children"
                :key="level2.id"
              >
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(scope.row, level2.id)"
                    >{{ level2.authName }}</el-tag
                  >
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    class="level3"
                    closable
                    type="danger"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    @close="deleteRight(scope.row, level3.id)"
                  >
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
            @click="editRoleShow(scope.row)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delRole(scope.row.id)"
          ></el-button>
          <!-- 分配角色 -->
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="small"
            @click="showAssignRight(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限dialog -->
    <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="40%">
      <!-- 权限树状图 -->
      <el-tree
        ref="tree"
        :data="rightList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAssginRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色<添加/编辑>对话框 -->
    <el-dialog
      :title="addRole.roleId ? '编辑用户' : '添加用户'"
      :visible.sync="addRoleVisible"
      width="40%"
      :before-close="closeShowDialog"
    >
      <el-form :model="addRole" :rules="rules" ref="addRole" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="addRole.roleDesc"
            @keyup.enter.native="addRoles"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeShowDialog">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息对话框 -->
    <!-- <el-dialog title="角色编辑" :visible.sync="editRoleVisible" width="40%">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色名称
      roleName: [],
      // 角色列表
      rolesList: [],
      // 权限列表
      rightList: [],
      // 控制分配权限对话框
      assignDialogVisible: false,
      // 控制添加角色对话框
      addRoleVisible: false,
      // 控制角色编辑对话框
      editRoleVisible: false,
      // 匹配权限树形图props属性
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 角色添加信息
      addRole: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 角色修改信息
      // editForm: {
      //   roleId: '',
      //   roleName: '',
      //   roleDesc: ''
      // },
      rules: {
        roleName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 2, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 2, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 角色编辑
    // editRole() {
    //   this.$refs.editForm.validate(async valid => {
    //     if (!valid) return false
    //     let res = await this.axios.put(
    //       `roles/${this.editForm.roleId}`,
    //       this.editForm
    //     )
    //     let {
    //       data,
    //       meta: { msg, status }
    //     } = res
    //     if (status === 200) {
    //       this.editRoleVisible = false
    //       this.editForm = data
    //       this.getRolesList()
    //       this.$message.success(msg)
    //     } else {
    //       this.$message.error(msg)
    //     }
    //   })
    // },
    // 编辑角色信息对话框显示
    editRoleShow({ id, roleDesc, roleName }) {
      this.addRoleVisible = true
      this.addRole.roleId = id
      this.addRole.roleName = roleName
      this.addRole.roleDesc = roleDesc
    },
    closeShowDialog() {
      this.addRoleVisible = false
      this.$refs.addRole.resetFields()
    },
    // 添加角色
    addRoles() {
      this.$refs.addRole.validate(async valid => {
        if (!valid) return false
        let id = this.addRole.roleId
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : 'roles'
        let Status = id ? 200 : 201
        let res = await this.axios({
          method: method,
          url: url,
          data: this.addRole
        })
        let {
          meta: { msg, status }
        } = res
        if (status === Status) {
          this.addRoleVisible = false
          this.getRolesList()
          this.$message.success(msg)
          this.$refs.addRole.resetFields()
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 显示添加角色
    showRoleDialog() {
      this.addRole.roleName = ''
      this.addRole.roleDesc = ''
      this.addRoleVisible = true
    },
    // 删除角色
    async delRole(id) {
      try {
        await this.$confirm('确定删除此用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.getRolesList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: '已取消删除'
        })
      }
    },
    // 删除权限
    async deleteRight(role, RightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${RightId}`)
      let {
        meta: { status, msg },
        data
      } = res
      if (status === 200) {
        role.children = data
        this.$message({
          type: 'success',
          message: msg
        })
      }
    },
    // 显示分配权限
    showAssignRight(roles) {
      this.rolesId = roles.id
      this.roleName = roles.roleName
      this.assignDialogVisible = true
      this.getRightList()
      this.$nextTick(() => {
        // 获取三级权限的key值
        let temp = []
        roles.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              temp.push(l3.id)
            })
          })
        })
        // 通过 key 设置
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 获取权限rights数据
    async getRightList() {
      let res = await this.axios.get('rights/tree')
      let {
        data,
        meta: { status }
      } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    // 确定按钮分配权限
    async addAssginRights() {
      let Checked = this.$refs.tree.getCheckedKeys()
      let HalfChecked = this.$refs.tree.getHalfCheckedKeys()
      let all = [...HalfChecked, ...Checked]
      let res = await this.axios.post(`roles/${this.rolesId}/rights`, {
        rids: all.join()
      })
      if (res.meta.status === 200) {
        this.assignDialogVisible = false
        this.$message.success(`[${this.roleName}]${res.meta.msg}`)
        this.getRolesList()
      }
    },
    // 获取角色信息
    async getRolesList() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.rolesList = data
      }
    }
  },
  async created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.level0 {
  margin-left: 99px;
}
.level1 {
  margin-bottom: 20px;
  margin-left: 30px;
}
.level1:last-child {
  margin-bottom: -50px;
  margin-left: 30px;
}
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
