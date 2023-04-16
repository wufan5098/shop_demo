<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>

      <div class="logout">
        欢迎光临
        <a href="javascript:;" @click="logout">退出</a>
      </div>
      <h1 class="title">电商后台管理系统</h1>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          :default-active="$route.path.slice(1).split('-')[0]"
        >
          <span v-if="menuList.length === 0">暂无权限</span>
          <el-submenu
            v-for="menu in menuList"
            :key="menu.id"
            :index="menu.path"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item
              v-for="item in menu.children"
              :key="item.id"
              :index="item.path"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 配置子路由的出口 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          roundButton: true
        })
        localStorage.removeItem('token')
        this.$router.push('/')
        this.$message({
          type: 'success',
          message: '退出已成功!'
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: '退出已取消'
        })
      }
    }
  },
  async created() {
    try {
      let res = await this.axios.get('menus')
      let {
        data,
        meta: { status }
      } = res
      if (status === 200) {
        this.menuList = data
      }
    } catch (error) {
      this.$message.error('555')
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    padding-left: 0;
    background-color: #b3c1cd;
    .title {
      overflow: hidden;
      text-align: center;
      line-height: 60px;
      font-size: 33px;
      color: #fff;
    }
    .logo {
      float: left;
      height: 60px;
      width: 200px;
      background-image: url(../assets/logo1.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    .logout {
      width: 200px;
      height: 60px;
      float: right;
      line-height: 60px;
      text-align: right;
      font-weight: 700;
      a {
        color: darkorange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
