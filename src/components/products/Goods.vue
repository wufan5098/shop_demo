<template>
  <div class="goods">
    <el-button type="success" plain @click="$router.push('/goods-add')"
      >添加商品</el-button
    >
    <el-table
      :data="goodsList"
      width="100%"
      v-loading="loading"
      element-loading-text="正在加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | dateFilter }}
        </template>
      </el-table-column>
      <el-table-column background="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
            @click="editGoodsShow(scope.row)"
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="deleteGood(scope.row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="编辑商品" :visible.sync="editGoodsVisible" width="40%">
      <el-form ref="form" :model="editForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-radio v-model="editForm.is_promote" :label="true">是</el-radio>
        <el-radio v-model="editForm.is_promote" :label="false">否</el-radio>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      query: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      editGoodsVisible: false,
      editForm: {
        id: '',
        goods_name: '',
        goods_number: '',
        goods_price: '',
        goods_weight: '',
        is_promote: ''
      }
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        data: { goods, total },
        meta: { status }
      } = res
      if (status === 200) {
        this.goodsList = goods
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodsList()
    },
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    async deleteGood(row) {
      let res = await this.axios.delete(`goods/${row.goods_id}`)
      let {
        meta: { status, msg }
      } = res
      if (status === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
        this.getGoodsList()
      }
    },
    editGoodsShow(row) {
      this.editGoodsVisible = true
      this.editForm.id = row.goods_id
      this.editForm.goods_name = row.goods_name
      this.editForm.goods_number = row.goods_number
      this.editForm.goods_price = row.goods_price
      this.editForm.goods_weight = row.goods_weight
    }
  },
  created() {
    this.getGoodsList()
    setTimeout(() => {
      this.$message({
        type: 'success',
        message: '获取成功'
      })
    }, 1100)
  }
}
</script>

<style lang="less" scoped></style>
