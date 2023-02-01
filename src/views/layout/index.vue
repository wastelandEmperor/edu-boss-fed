<template>
  <el-container>
    <el-aside style="width: auto; background-color: rgb(238, 241, 246)">
      <app-aside :isCollapse="isCollapse"></app-aside>
    </el-aside>

    <el-container>
      <el-header>
        <app-header
          :isCollapse="isCollapse"
          :toggleCollapse="toggleCollapse"
        ></app-header>
      </el-header>

      <el-main>
        <router-view></router-view>
        <!-- <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'LayoutIndex',
  data () {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item),
      isCollapse: false
    }
  },
  methods: {
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {
    AppAside,
    AppHeader
  }
}
</script>
<style>
.el-container {
  height: 100vh;
}
.el-header {
  background-color: #e4e9f1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

</style>
