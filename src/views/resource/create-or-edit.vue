<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="resourceData" v-loading="isLoading">
      <el-form-item label="资源名称" :label-width="formLabelWidth">
        <el-input v-model="resourceData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" :label-width="formLabelWidth">
        <el-input v-model="resourceData.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="资源分类" :label-width="formLabelWidth">
        <el-select v-model="resourceData.categoryId">
          <el-option v-for="item in resourceCategory" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="resourceData.description">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :disabled="isLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAllResourceCategory } from '@/api/resource-category'
import { getResource, resourceSaveOrUpdate } from '@/api/resource'

export default {
  name: 'ResourceCreateOrEdit',
  data () {
    return {
      isCreate: true,
      isLoading: false,
      dialogFormVisible: false,
      resourceData: {
        id: undefined,
        name: '',
        url: '',
        categoryId: 1,
        description: ''
      },
      // 资源类别
      resourceCategory: [],
      formLabelWidth: '120px'
    }
  },
  computed: {
    title () {
      return this.isCreate ? '新建资源' : '编辑资源'
    }
  },
  methods: {
    // 显示对话框并初始化内容
    showAndInit (resourceId = 0) {
      this.dialogFormVisible = true
      // 得出当前组件的状态
      this.isCreate = !resourceId
      // 加载资源类别信息
      getAllResourceCategory().then(res => {
        if (res.data.code === '000000') {
          this.resourceCategory = res.data.data
        } else {
          this.$message.error('添加或编辑中获取资源列表失败！')
        }
      })
      // 两种初始化内容行为
      if (this.isCreate) {
        this.resourceData = {
          name: '',
          url: '',
          categoryId: 1,
          description: ''
        }
      } else {
        this.isLoading = true
        getResource(resourceId)
          .then(res => {
            if (res.data.code === '000000') {
              const {
                name,
                categoryId,
                url,
                description
              } = res.data.data
              Object.assign(this.resourceData, {
                name,
                categoryId,
                url,
                description
              })
            } else {
              this.$message.error('编辑当中获取资源信息失败！')
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    // 添加或更新资源
    onSubmit () {
      resourceSaveOrUpdate(this.resourceData)
        .then(res => {
          if (res.data.code === '000000') {
            this.$message.success(`${this.title}成功！`)
            this.$emit('resource-change')
          } else {
            this.$message.error(`${this.title}失败！`)
          }
        })
        .finally(() => {
          this.dialogFormVisible = false
        })
    }
  }
}
</script>

<style scoped></style>
