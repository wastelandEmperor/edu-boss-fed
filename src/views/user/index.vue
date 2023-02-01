<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="手机号" align="center">
          <el-input v-model="queryParams.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" align="center">
          <el-date-picker
            v-model="dateArr"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="loadUsers" :disabled="isLoading">查询</el-button>
      </el-form>
    </div>
    <el-table
      :data="queryResult.records"
      v-loading="isLoading"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="portrait"
        label="头像"
        align="center"
        width="180" v-slot="scope">
        <!--没头像就用默认的-->
        <el-avatar :size="40" :src="scope.row.portrait"></el-avatar>
      </el-table-column>
      <el-table-column
        prop="name"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        v-slot="scope"
      >
        <el-switch
          v-model="scope.row.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="ENABLE"
          inactive-value="DISENABLE"
          active-text="启用"
          inactive-text="禁用"
          @change="handleChangeStatus(scope.row)"
        >
        </el-switch>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-slot="scope"
      >
        <el-button type="text" @click=" handleAllocRoleDlg(scope.row.id)" :disabled="isLoading">分配角色</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryResult.total">
    </el-pagination>
    <alloc-role ref="allocRoleDlg" />
  </el-card>
</template>

<script>
// 状态的处理
import { enableUser, forbidUser, queryUsers } from '@/api/user'
import dayjs from 'dayjs'
import AllocRole from '@/views/user/components/alloc-role.vue'

export default {
  name: 'UserIndex',
  data () {
    return {
      queryParams: {
        currentPage: 1,
        pageSize: 5,
        phone: '',
        userId: undefined,
        startCreateTime: '',
        endCreateTime: ''
      }, // 查询条件
      queryResult: {}, // 查询结果,
      defaultFace: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 默认头像地址
      dateArr: [],
      isLoading: false
    }
  },
  watch: {
    dateArr: {
      deep: true,
      handler (newVal) {
        // 更新查询查询的开始和结束日期
        this.queryParams.startCreateTime = newVal[0]
        this.queryParams.endCreateTime = newVal[1]
      }
    }
  },
  methods: {
    // 加载用户列表
    loadUsers () {
      this.isLoading = true
      queryUsers(this.queryParams)
        .then(res => {
          if (res.data.code === '000000') {
            // 查询和响应的数据不一样，起个别名让二者一致
            const {
              current: currentPage,
              pages,
              records,
              size: pageSize,
              total
            } = res.data.data
            // 载入真实的数据
            Object.assign({}, {
              currentPage,
              pageSize
            })
            // 头像和时间重新计算
            records.forEach(user => {
              user.portrait = user.portrait || this.defaultFace
              user.createTime = dayjs(user.createTime).format('YYYY-MM-DD')
            })

            this.queryResult = {
              records,
              total,
              pages
            }
          } else {
            this.$message.error('获取用户列表失败！')
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
    // 用户状态切换
    handleChangeStatus (user) {
      // 状态已经切换好了
      const info = user.status === 'ENABLE' ? '启用' : '禁用'
      ;(user.status === 'ENABLE' ? enableUser(user.id) : forbidUser(user.id))
        .then(() => {
          this.$message.success(`用户 - ${info}操作成功！`)
        })
        .catch(() => {
          this.$message.error(`用户 - ${info}操作失败！`)
        })
    },
    handleSizeChange (val) {
      this.queryParams.pageSize = val
      this.queryResult.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange (val) {
      this.queryParams.currentPage = val
      this.loadUsers()
    },
    // 显示分配角色的UI
    handleAllocRoleDlg (userId) {
      this.$refs.allocRoleDlg.showAndInit(userId)
    }
  },
  created () {
    this.loadUsers()
  },
  components: {
    AllocRole
  }
}
</script>

<style scoped>

</style>
