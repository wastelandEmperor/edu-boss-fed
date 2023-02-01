<template>
  <div class="app-header">
    <i :class="iconClsName" @click="toggleCollapse"></i>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in $route.matched" @click.native="handleBreadcrumb(item)" :key="index">{{
          item.meta.title
        }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          :size="38"
          :src="userInfo.portrait"
        ></el-avatar
        ><i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo, logout } from '@/api/user'

export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    toggleCollapse: {
      type: Function,
      required: true
    }
  },
  computed: {
    iconClsName () {
      // 图标的方向确定
      return this.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
    }
  },
  methods: {
    handleLogout () {
      this.$confirm('是否退出登录？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // “确保”能获取到token，并且携带着它发起请求
          // 拦截器那边是异步执行的，若放在清除token那边，它携带的就是空的Authorization
          logout()
        })
        .then(() => {
          this.$message.success('已退出登录！')
          this.$store.commit('emptyTokenInfo')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message.info('退出取消！')
        })
    },
    // 面包屑切换路由
    handleBreadcrumb (item) {
      const path = item.path || '/'
      // 重复切换会报错则不切换
      this.$router.currentRoute.path !== path && this.$router.push({ path })
    }
  },
  created () {
    // 挂载后，再更新用户信息
    getUserInfo()
    getUserInfo()
      .then(res => {
        this.userInfo = res.data.content
      })
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  height: 100%; // 有高度才能正确居中
  .el-breadcrumb {
    margin-left: 8px;
  }

  .el-dropdown {
    // 一个弹性容器有三个弹性项，水平排列，想两个项在容器左侧，一个在最右侧  -> [xy      z]
    // 用 justify-content: space-between 就变成 -> [x   y   z]
    // 因为上述的场景，所以加上了 margin-left:auto
    margin-left: auto;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
}
</style>
