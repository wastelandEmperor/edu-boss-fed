<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form :inline="true" :model="queryParams" ref="resourceForm" class="demo-form-inline">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="资源名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="queryParams.url" placeholder="资源路径" clearable></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="queryParams.categoryId" placeholder="活动区域" clearable>
            <el-option label="不限" value=""></el-option>
            <el-option v-for="item in resourceCategory" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleRest">重置</el-button>
          <el-button type="primary" @click="loadResources" :disabled="resourceLoading">查询搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="handleDlg(0)">添加</el-button>
    <el-button @click="$router.push({ name: 'resource-category' })"
    >资源分类
    </el-button
    >

    <!-- 每次查询资源，表格都会重新渲染 -->
    <el-table :data="queryResult.records" border style="width: 100%" v-loading="resourceLoading">
      <el-table-column type="index" label="编号" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
      <el-table-column prop="url" label="资源路径" align="center"></el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
      <el-table-column prop="createdTime" label="添加时间" align="center" :formatter="timeFormatter"></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button size="mini" @click="handleDlg(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDeleteResource(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <!--现在查询的资源，一共多少页多少条-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.current"
      :page-sizes="[10, 20 ,50 , 100]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryResult.total"
      :disabled="resourceLoading"
    >
    </el-pagination>
    <resource-create-or-edit ref="resourceDialog" @resource-change="loadResources" />
  </el-card>
</template>

<script>
// 导入获取资源接口
import { deleteResource, queryResource } from '@/api/resource'
// 导入获取资源类别接口
import { getAllResourceCategory } from '@/api/resource-category'
import dayjs from 'dayjs'

// 导入创建或编辑资源对话框
import ResourceCreateOrEdit from './create-or-edit.vue'

export default {
  name: 'ResourceIndex',
  data () {
    return {
      // 查询条件
      queryParams: {
        id: undefined,
        name: undefined,
        startCreateTime: undefined,
        url: undefined,
        categoryId: '',
        endCreateTime: undefined,
        // 当前页码
        current: 1,
        // 每页条数
        size: 10
      },
      // 查询结果
      queryResult: {},
      // 资源的分类信息
      resourceCategory: [],
      // 资源加载状态
      resourceLoading: false
    }
  },
  created () {
    // 加载资源列表
    this.loadResources()
    // 加载资源分类信息，以供查询
    this.loadResourceCategory()
  },
  methods: {
    // 加载资源数据
    loadResources () {
      this.resourceLoading = true
      // 划分资源，取第n页
      queryResource(this.queryParams)
        .then((res) => {
          if (res.data.code === '000000') {
            // 取出有意义的数据 （当前页，总页数，当前页的记录，记录划分，记录总数）
            const {
              current,
              pages,
              records,
              size,
              total
            } = res.data.data
            // 获取到第二页数据，那么当前记录页码就是第二页
            Object.assign(this.queryParams, {
              current,
              size
            })
            // 查询的结果储存起来
            this.queryResult = {
              pages,
              total,
              records
            }
          } else {
            this.$message.error('获取资源数据失败！')
          }
        })
        .finally(() => {
          this.resourceLoading = false
        })
    },
    // 加载资源类别数据（查询资源会用到）
    loadResourceCategory () {
      getAllResourceCategory().then(res => {
        if (res.data.code === '000000') {
          // 保存资源类别
          this.resourceCategory = res.data.data
        } else {
          this.$message.error('获取资源类别数据失败！')
        }
      })
    },
    // 格式化时间
    timeFormatter (row, column, value, index) {
      return dayjs(value).format('YYYY-MM-DD')
    },
    // 重置资源查询表单
    handleRest () {
      // resetFields 需配合 prop
      this.$refs.resourceForm.resetFields()
    },
    // 每页显示记录数改变时
    handleSizeChange (val) {
      // 重新划分，取第一页
      this.queryParams.size = val
      this.queryParams.current = 1
      this.loadResources()
    },
    // 页码改变，加载资源
    handleCurrentChange (val) {
      // 选取第几页
      this.queryParams.current = val
      this.loadResources()
    },
    // 资源添加或编辑的事件处理，呼出对话框
    handleDlg (resourceId = 0) {
      this.$refs.resourceDialog.showAndInit(resourceId)
    },
    // 删除指定资源
    handleDeleteResource (resourceId) {
      this.$confirm('是否删除该资源', '删除提示')
        .then(() => {
          deleteResource(resourceId).then(res => {
            if (res.data.code === '000000') {
              this.$message.success('删除资源成功!')
              this.loadResources()
            } else {
              this.$message.error('删除资源失败！')
            }
          })
        })
        .catch(() => {
          this.$message.info('删除操作已取消！')
        })
    }
  },
  components: {
    ResourceCreateOrEdit
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>
