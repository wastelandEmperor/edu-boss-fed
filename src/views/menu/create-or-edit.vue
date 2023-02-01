<template>
  <el-form ref="form" :model="formData" label-width="80px">
    <!--没有用到 rules 为何表单项都加上了 prop ? 表单重置的时候用来指明表单项初始值-->
    <el-form-item label="菜单名称" prop="name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>

    <el-form-item label="菜单路径" prop="href">
      <el-input v-model="formData.href"></el-input>
    </el-form-item>

    <!--只能创建顶层菜单，或二级菜单-->
    <el-form-item label="上级菜单" prop="parentId">
      <el-select v-model="formData.parentId">
        <!--parentId为-1，表示要创建底层菜单-->
        <el-option label="顶层菜单" :value="-1"></el-option>
        <el-option v-for="menu in topMenus" :label="menu.name" :value="menu.id" :key="menu.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model="formData.description"></el-input>
    </el-form-item>
    <el-form-item label="图标名称" prop="icon">
      <el-input v-model="formData.icon"></el-input>
    </el-form-item>
    <el-form-item label="是否显示" prop="shown">
      <el-radio-group v-model="formData.shown">
        <!-- shown === lable 按钮则显示-->
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="排序" prop="orderNum">
      <el-input v-model="formData.orderNum"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即{{ msg }}</el-button>
      <el-button>取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
import { createOrUpdateMenu, getMenuInfo } from '@/api/menu'

export default {
  name: 'MenuCreateOrEdit',
  data () {
    return {
      // 标识位：创建或编辑
      isCreate: true,
      formData: {
        id: undefined, // id由服务器自己添加
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      // 顶层菜单
      topMenus: []
    }
  },
  computed: {
    // 添加或编辑提示的是不同的信息
    msg () {
      return this.isCreate ? '添加' : '更新'
    }
  },
  methods: {
    // "加载"顶层菜单，以显示在下拉框（加载编辑菜单信息也会携带菜单，因此这个API无用了）
    // loadTopMenus () {
    //   getAllMenus().then(res => {
    //     if (res.data.code === '000000') {
    //       this.topMenus = res.data.data.filter(item => item.level === 0)
    //     } else {
    //       this.$message.error('创建菜单时，获取顶层菜单信息时失败！')
    //     }
    //   })
    // },
    // "加载"指定菜单信息的同时，获取顶层菜单信息
    loadMenuInfo () {
      // 添加菜单携带 -1，也会响应顶层菜单信息
      const { id = -1 } = this.$route.params
      getMenuInfo(id).then(res => {
        if (res.data.code === '000000') {
          // 指定菜单和顶层菜单信息
          const {
            menuInfo,
            parentMenuList
          } = res.data.data
          // 扩展对象API，会修改第一参数
          Object.assign(this.formData, menuInfo)
          // 顶层菜单信息
          this.topMenus = parentMenuList
        } else {
          this.$message.error('获取编辑菜单信息失败！')
        }
      })
    },
    // 添加或更新菜单
    onSubmit () {
      createOrUpdateMenu(this.formData).then(res => {
        if (res.data.code) {
          this.$message.success(`${this.msg}菜单成功！`)
          this.$router.push({ name: 'menus' })
          // 成功添加或更新菜单则重置一下表单数据
          // this.$refs.form.resetFields()
        } else {
          this.$message.error(`${this.msg}菜单失败！`)
        }
      })
    }
  },
  created () {
    // this.loadTopMenus()  // 获取编辑菜单信息会附带顶层菜单，因此该API无用了
    // 有参则是编辑，无则为添加
    this.isCreate = !this.$route.params.id
    this.loadMenuInfo()
  }
}
</script>

<style scoped>
.el-form {
  padding: 70px;
  background-color: #fff;
}
</style>
