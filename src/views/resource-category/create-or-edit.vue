<template>
  <!--整个对话框重新渲染-->
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="categoryData">
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="categoryData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input v-model="categoryData.sort" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { categoryCreateOrUpdate, getAllResourceCategory } from '@/api/resource-category'

export default {
  // 资源分类的创建或编辑
  name: 'ResourceCategoryCreateOrEdit',
  data () {
    return {
      // 标识位：创建 | 编辑
      isCreate: true,
      dialogFormVisible: false,
      categoryData: {
        id: undefined,
        name: '',
        sort: 0
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    title () {
      return this.isCreate ? '新建' : '编辑'
    }
  },
  methods: {
    /**
     * 根据ID设置状态标志，显示对话框并初始化对话框中的内容（创建|编辑）
     * 创建：默认格式
     * 编辑：对应菜单的信息
     * @param categoryId  资源分类ID
     */
    showAndInit (categoryId = 0) {
      // 有参即为编辑，无则为创建
      this.isCreate = categoryId < 1
      // 显示对话框
      this.dialogFormVisible = true
      // 初始化内容
      if (this.isCreate) {
        this.categoryData = {
          id: undefined,
          name: '',
          sort: 0
        }
      } else {
        getAllResourceCategory().then(res => {
          if (res.data.code === '000000') {
            // 编辑，获取所有类别，找到当前编辑的类别信息，将其展示
            this.categoryData = res.data.data.find(item => item.id === categoryId)
          } else {
            this.$message.error('获取当前类别信息失败！')
          }
        })
      }
    },
    onSubmit () {
      categoryCreateOrUpdate(this.categoryData)
        .then(res => {
          // 正常业务逻辑代码
          if (res.data.code === '000000') {
            this.$message.success(`${this.title}资源分类成功！`)
            // 通知父组件，重新加载资源分类信息
            this.$emit('changeCategory')
          } else {
            this.$message.error(`${this.title}资源分类失败`)
          }
        })
        .catch(() => {
          this.$message.error(`${this.title}资源分类失败`)
        })
        .finally(() => {
          // 隐藏对话框（排序没有限制长度，太长的sort服务器响应500）
          this.dialogFormVisible = false
        })
    }
  }
}
</script>

<style scoped></style>
