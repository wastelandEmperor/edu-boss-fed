<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="roleData" v-loading="isLoading">
      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="roleData.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" :label-width="formLabelWidth">
        <el-input v-model="roleData.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="roleData.description" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :disabled="isLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { roleSaveOrUpdate, getRoleInfo } from '@/api/role'

export default {
  name: 'RoleCreateOrEdit',
  data () {
    return {
      dialogFormVisible: false,
      roleData: {
        id: undefined,
        name: '',
        code: '',
        description: ''
      },
      isCreate: true,
      isLoading: false,
      formLabelWidth: '120px'
    }
  },
  computed: {
    title () {
      return this.isCreate ? '添加角色' : '编辑角色'
    }
  },
  methods: {
    // 角色对话框的显示和初始化
    showAndInit (roleId) {
      // roleData id: undefined
      this.roleData.id = roleId
      this.dialogFormVisible = true
      this.isCreate = !roleId > 0
      // 两种初始化对话框内容的方案
      if (this.isCreate) {
        this.roleData = {
          name: '',
          code: '',
          description: ''
        }
      } else {
        this.isLoading = true
        // 获取指定角色信息并展示
        getRoleInfo(roleId)
          .then(res => {
            if (res.data.code === '000000') {
              const {
                name,
                code,
                description
              } = res.data.data
              Object.assign(this.roleData, {
                name,
                code,
                description
              })
            } else {
              this.$message.error('编辑时获取角色信息失败！')
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
    // 添加或更新角色
    onSubmit () {
      roleSaveOrUpdate(this.roleData)
        .then(res => {
          if (res.data.code === '000000') {
            this.$message.success(`${this.title}信息成功！`)
            this.$emit('role-change')
          } else {
            this.$message.error(`${this.title}信息失败！`)
          }
        })
        .finally(() => {
          this.dialogFormVisible = false
        })
    }
  }
}
</script>

<style scoped>

</style>
