<template>
  <el-card class="box-card">
    <!--查询成功，页面会跟着改变-->
    <div slot="header" class="clearfix">
      <h3>筛选搜索</h3>
      <!--以新的条件去搜索角色-->
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="roleForm">
        <el-form-item label="输入搜索" prop="name">
          <el-input v-model="queryParams.name" placeholder="角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleRest">重置</el-button>
          <el-button type="primary" @click="loadRoles" :disabled="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="handleDlg(0)">添加角色</el-button>
    <el-table :data="queryResult.records" border style="width: 100%" v-loading="isLoading">
      <!--索引列-->
      <el-table-column type="index" label="序号" width="180" align="center"></el-table-column>
      <el-table-column prop="name" label="角色名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
      <el-table-column prop="createdBy" label="添加时间" :formatter="timeFormatter" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="140px">
        <template v-slot="scoped">
          <el-button size="mini" type="text" @click="$router.push({name:'alloc-menu',params: {roleId:scoped.row.id}})">
            分配菜单
          </el-button>
          <el-button size="mini" type="text" @click="$router.push({name:'alloc-resource', params: {roleId: scoped.row.id}})">分配资源
          </el-button>
          <el-button size="mini" type="text" @click="handleDlg(scoped.row.id)">编辑 </el-button>
          <el-button size="mini" type="text" @click="handleDelete(scoped.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--本次查询的页数-->
    <!--页码按钮的个数，是根据查询结果的页数计算的-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.current"
      :page-sizes="[5, 10, 25, 50]"
      :page-size="queryParams.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryResult.total"
      :disabled="isLoading"
    >
    </el-pagination>
    <role-create-or-update ref="roleDialog" @role-change="loadRoles" />
  </el-card>
</template>

<script>
import { deleteRole, queryRoles } from '@/api/role'
import RoleCreateOrUpdate from './create-or-edit.vue'
import dayjs from 'dayjs'

export default {
  name: 'RoleIndex',
  data () {
    return {
      // 查询角色条件
      queryParams: {
        id: undefined,
        code: '',
        name: undefined,
        current: 1,
        size: 5
      },
      // 查询结果
      queryResult: {},
      isLoading: false
    }
  },
  methods: {
    // 加载角色列表
    loadRoles () {
      this.isLoading = true
      queryRoles(this.queryParams)
        .then((res) => {
          if (res.data.code === '000000') {
            // 本次查询响应的结果
            const {
              current,
              pages,
              records,
              size,
              total
            } = res.data.data
            // 更新查询条件
            Object.assign(this.queryParams, {
              size,
              current
            })
            this.queryResult = {
              records,
              total,
              pages
            }
          } else {
            this.$message.error('获取角色列表信息失败！')
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    // 格式化时间
    timeFormatter (row, column, value, index) {
      return dayjs(value).format('YYYY-MM-DD')
    },
    // 重置表单
    handleRest () {
      // resetFields 需配合 prop
      this.$refs.roleForm.resetFields()
    },
    // 改变划分重新获取第一页数据,
    handleSizeChange (val) {
      this.queryParams.size = val
      this.queryParams.current = 1
      this.loadRoles()
    },
    // 获取页码对应数据
    handleCurrentChange (val) {
      // 当前划分过的查询中，取得第val页
      this.queryParams.current = val
      this.loadRoles()
    },
    // 显示对话框并初始化内容
    handleDlg (roleId = 0) {
      this.$refs.roleDialog.showAndInit(roleId)
    },
    // 删除指定ID角色
    handleDelete (roleId) {
      this.$confirm('确认要删除当前角色吗？', '删除提示')
        .then(() => {
          deleteRole(roleId).then(res => {
            if (res.data.code === '000000') {
              this.$message.success('删除角色成功！')
              this.loadRoles()
            } else {
              this.$message.error('删除角色失败！')
            }
          })
        })
        .catch(() => {
          this.$message.info('删除操作已取消！')
        })
    }
  },
  created () {
    this.loadRoles()
  },
  components: {
    RoleCreateOrUpdate
  }
}
</script>

<style scoped lang="scss">
.el-form {
  margin-left: 85px;
}

.el-table {
  margin-top: 20px;
}
</style>
