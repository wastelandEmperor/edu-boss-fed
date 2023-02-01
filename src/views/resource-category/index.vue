<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button @click="handleDialog()">添加</el-button>
    </div>
    <el-table :data="resourceCategoryData" border style="width: 100%">
      <el-table-column type="index" label="编号" align="center"></el-table-column>
      <el-table-column prop="name" label="类别名称" align="center"></el-table-column>
      <!--表格每列的数据，经过格式化后展示-->
      <el-table-column prop="createdTime" label="创建时间" align="center" :formatter="timeFormatter"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <!--作用域插槽-->
        <template v-slot="scope">
          <el-button size="mini" @click="handleDialog(scope.row.id)">编辑</el-button>
          <!--会携带资源类别的ID，去调用删除API-->
          <el-button size="mini" type="danger" @click="handleDeleteCategory(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--@changeCategory 对话框成功新建或编辑，通知父组件重新加载类别信息-->
    <resource-category-create-or-edit ref="categoryDialog" @changeCategory="loadAllResourceCategory" />
  </el-card>
</template>

<script>
// 格式化时间的API
import dayjs from 'dayjs'
import { getAllResourceCategory, deleteCategory } from '@/api/resource-category'
import ResourceCategoryCreateOrEdit from './create-or-edit.vue'

export default {
  name: 'ResourceCategoryIndex',
  data () {
    return {
      resourceCategoryData: []
    }
  },
  methods: {
    // 加载所有资源类别信息
    loadAllResourceCategory () {
      getAllResourceCategory().then(res => {
        if (res.data.code === '000000') {
          this.resourceCategoryData = res.data.data
        } else {
          this.$message.error('加载资源列表信息失败！')
        }
      })
    },
    // 格式化时间
    timeFormatter (row, column, value, index) {
      return dayjs(value).format('YYYY-MM-DD')
    },
    // 控制资源分类对话框的显示和内容的展示
    handleDialog (categoryId = 0) {
      // 对话框组件自身有API控制其显示
      this.$refs.categoryDialog.showAndInit(categoryId)
    },
    // 删除资源类别的事件处理函数
    handleDeleteCategory (categoryId = 0) {
      this.$confirm('确认要删除该资源类别吗？', '删除提示')
        .then(() => {
          deleteCategory(categoryId).then(res => {
            if (res.data.code === '000000') {
              this.$message.success('删除资源类别成功！')
              this.loadAllResourceCategory()
            } else {
              this.$message.error('删除资源类别失败！')
            }
          })
        })
        .catch(() => {
          this.$message.info('删除资源类别操作已取消！')
        })
    }
  },
  created () {
    this.loadAllResourceCategory()
  },
  components: {
    ResourceCategoryCreateOrEdit
  }
}
</script>

<style scoped lang="scss"></style>
