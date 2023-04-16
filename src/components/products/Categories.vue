<template>
  <div class="categories">
    <el-button type="success" plain>添加分类</el-button>

    <el-table
      :data="categoryList"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-tree-column
        prop="cat_name"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        label="分类名称"
      ></el-table-tree-column>
      <el-table-column prop="cat_deleted" label="是否删除">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '是' : '否' }} </template
        >>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <!-- 编辑 -->
        <el-button type="primary" icon="el-icon-edit" plain size="small">
        </el-button>
        <!-- 删除 -->
        <el-button type="danger" icon="el-icon-delete" plain size="small">
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      loading: true
    }
  },
  methods: {
    // 获取商品分类列表
    async getCategoryList() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        data: { result, total },
        meta: { status }
      } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped></style>
