<template>
  <div class="add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="form" :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="options"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-button @click="next(1, 'pic')" type="primary">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="handleSuccess"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件,且不超过500kb
          </div>
        </el-upload>
        <el-button
          type="primary"
          @click="next(2, 'content')"
          style="margin-top: 50px;"
          >下一步</el-button
        >
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce" />
        <el-button type="primary" style="margin-top: 20px;" @click="addGood"
          >添加</el-button
        >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: true,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: { Authorization: localStorage.getItem('token') }
    }
  },
  methods: {
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },
    handleClick(tab) {
      this.active = +tab.index
    },
    handleSuccess(res) {
      let {
        data: { tmp_path: tmpPath },
        meta: { status }
      } = res
      if (status === 200) {
        this.addForm.pics.push({
          pic: tmpPath
        })
      }
    },
    async addGood() {
      // if (this.addForm.goods_cat.length === 2) {
      //   this.addForm.goods_cat.push()
      // }
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      let {
        meta: { msg, status }
      } = res
      if (status === 201) {
        this.$message({
          type: 'success',
          message: msg
        })
        this.$router.push('/goods')
      } else {
        this.$message({
          type: 'error',
          message: msg
        })
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    let {
      meta: { status },
      data
    } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;

  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
