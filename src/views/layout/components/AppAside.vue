<template>
  <!-- router: 菜单项的值将作为路由地址（点击） -->
  <el-menu router unique-opened :collapse="isCollapse">
    <!-- logo -->
    <a href="" class="logo">
      <img src="@/assets/logo.png" alt="logo" />
      <h1>GaoBo</h1>
    </a>
    <el-submenu index="1">
      <template slot="title"
      ><i class="el-icon-lock"></i><span>权限管理</span></template
      >
      <el-menu-item index="/roles"
      ><i class="el-icon-setting"></i><span>角色列表</span></el-menu-item
      >
      <el-menu-item index="/menus"
      ><i class="el-icon-setting"></i><span>菜单列表</span></el-menu-item
      >
      <el-menu-item index="/resources"
      ><i class="el-icon-setting"></i><span>资源列表</span></el-menu-item
      >
    </el-submenu>
    <el-menu-item index="/courses"
    ><i class="el-icon-film"></i><span>课程管理</span></el-menu-item
    >
    <el-menu-item index="/users"
    ><i class="el-icon-user"></i><span>用户管理</span></el-menu-item
    >
    <el-submenu index="2">
      <template slot="title"
      ><i class="el-icon-data-analysis"></i><span>广告管理</span></template
      >
      <el-menu-item index="/advertise"
      ><i class="el-icon-data-analysis"></i
      ><span>广告列表</span></el-menu-item
      >
      <el-menu-item index="/advertise-space"
      ><i class="el-icon-data-analysis"></i
      ><span>广告位列表</span></el-menu-item
      >
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;

  img {
    width: 36px;
    height: 32px;
  }
}

.el-menu {
  height: 100%;
  width: 200px;
}

/* 导航折叠时宽度应该变小,但是应用的样式权重不够 还是200px */
.el-menu.el-menu--collapse {
  width: 68px;

  h1 {
    display: none;
  }
}
</style>
