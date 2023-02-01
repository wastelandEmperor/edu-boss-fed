<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
    </div>
    <!-- 实体个数：menuData的长度-->
    <el-table :data="menuData" border style="width: 100%">
      <!-- type如果设置了 index 则显示该行的索引（从 1 开始计算）-->
      <el-table-column type="index" label="编号" width="50%" align="center"></el-table-column>
      <el-table-column prop="name" label="菜单名称" align="center">
      </el-table-column>
      <el-table-column prop="level" label="菜单级数" align="center">
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标" align="center">
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center">
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <!-- 渲染每行的时候，scoped.row 就是那行对应的"数据" -->
        <!-- scoped 代表了这个表格当时遍历的时候那个数据元素，准确的说是scoped.row-->
        <!-- 删除菜单必然要ID，那么就需要用以下格式来获取ID-->
        <!-- scoped 这种是Elm设计好的-->
        <template v-slot="scoped">
          <el-button size="mini" @click="$router.push({name:'menu-edit',params:{id:scoped.row.id}})">编辑</el-button>
          <!-- row.id 菜单的ID，并非行数-->
          <!--删除会携带每个菜单对应的ID-->
          <el-button type="danger" size="mini" @click="handleDelete(scoped.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// 1. 引入"获取"菜单API
import { getAllMenus, deleteMenu } from '@/api/menu'

export default {
  name: 'MenuIndex',
  data () {
    return {
      menuData: []
    }
  },
  methods: {
    // ”加载“菜单信息
    loadMenus () {
      getAllMenus().then((res) => {
        if (res.data.code === '000000') {
          this.menuData = res.data.data
        } else {
          this.$message.error('加载菜单信息失败！')
        }
      })
    },
    // 删除菜单,
    handleDelete (id) {
      this.$confirm('确定要删除菜单吗？', '删除提示')
        .then(() => {
          deleteMenu(id).then(res => {
            if (res.data.data) {
              this.$message.success('删除菜单成功！')
              // 加载最新的菜单信息。也可在前台删除那行菜单信息，但若其他人删除了某个菜单你是不知晓的，就会重复删除
              this.loadMenus()
            } else {
              this.$message.error('删除菜单失败！')
            }
          })
        })
        .catch(() => {
          this.$message.info('取消了删除菜单的操作！')
        })
    }
  },
  created () {
    // 组件创建好，去加载菜单信息
    this.loadMenus()
  }
}
</script>

<style scoped></style>
