<template>
  <div>
    <!--展示对应角色的能访问的菜单-->
    <el-tree
      :data="roleMenus"
      :props="defaultProps"
      show-checkbox
      default-expand-all
      :default-checked-keys="checkedMenus"
      ref="menu-tree"
      node-key="id"
    >
    </el-tree>
    <el-button @click="handleClear">清空</el-button>
    <el-button @click="onSave">保存</el-button>
  </div>

</template>

<script>
// 获取角色拥有的菜单列表
import { getRoleMeuns, setRoleMenus } from '@/api/role'

export default {
  name: 'RoleAllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      require: true
    }
  },
  data () {
    return {
      roleMenus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedMenus: []
    }
  },
  methods: {
    // 加载所有菜单并勾选角色拥有的菜单
    loadRoleMenus () {
      getRoleMeuns(this.roleId).then((res) => {
        if (res.data.code === '000000') {
          // 所有菜单列表
          this.roleMenus = res.data.data
          // 筛选出角色拥有的菜单ID
          this.checkedMenus = this.getSelectedIds(res.data.data)
          // this.$nextTick(() => {
          //   // 勾选角色拥有的菜单
          //   // 若勾选是同步执行的，菜单列表未渲染前(页面还没有)，就执行勾选了。
          //   // [()=>{渲染任务},() => {勾选任务}]
          //   this.$refs['menu-tree'].setCheckedKeys(checkedMenus)
          // })

          // Promise.resolve().then(() => {this.$refs['menu-tree'].setCheckedKeys(checkedMenus)})
          // setTimeout(() => {this.$refs['menu-tree'].setCheckedKeys(checkedMenus)})
          // queueMicrotask(() => {this.$refs['menu-tree'].setCheckedKeys(checkedMenus)})
          // return checkedMenus .then(checkedMenus => {this.$refs['menu-tree'].setCheckedKeys(checkedMenus)})
        } else {
          this.$message.error('获取角色拥有的菜单列表失败！')
        }
      })
    },
    // 筛选出角色拥有的菜单项
    getSelectedIds (menuArr) {
      // 选中的菜单ID
      let ids = []
      menuArr.forEach(menu => {
        if (menu.subMenuList) {
          // 筛选后代中拥有的菜单
          const tmpArr = this.getSelectedIds(menu.subMenuList)
          ids = ids.concat(tmpArr)
        } else if (menu.selected) {
          ids.push(menu.id)
        }
      })
      return ids
    },
    // 清空Tree中的勾选
    handleClear () {
      // 该树没有选中项
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    // 保存角色新分配的菜单
    onSave () {
      const data = {
        roleId: this.roleId,
        // 已选中的菜单项目
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      }
      setRoleMenus(data).then(res => {
        if (res.data.code === '000000') {
          this.$message.success('给角色分配菜单操作成功！')
          this.$router.push({ name: 'roles' })
        } else {
          this.$message.error('分配菜单操作失败！')
        }
      })
    }
  },
  created () {
    this.loadRoleMenus()
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
