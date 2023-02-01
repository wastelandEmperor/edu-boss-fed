<template>
  <el-dialog
    title="分配角色"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form :model="userData">
      <el-form-item label="" :label-width="formLabelWidth">
        <el-select v-model="userData.roleIdList" multiple placeholder="请选择角色">
          <el-option label="" value=""></el-option>
          <el-option v-for="role in allRoles" :key="role.id" :label="role.name" :value="role.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { getUserRoles, allocateUserRoles } from '@/api/user'

export default {
  name: 'AllocRole',
  data () {
    return {
      dialogVisible: false,
      allRoles: [], // 所有角色
      userData: {
        userId: undefined,
        roleIdList: undefined // 用户所持有的角色
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    showAndInit (userId) {
      getUserRoles(userId).then(res => {
        if (res.data.code === '000000') {
          this.allRoles = res.data.data
          this.userData.userId = userId
          // 筛选出用户拥有的角色
          this.userData.roleIdList = this.allRoles.reduce((pre, role) => {
            role.hasPermission && pre.push(role.id)
            return pre
          }, [])
        } else {
          this.$message.error('获取用户拥有的角色列表失败！')
        }
      })
      this.dialogVisible = true
    },
    onSave () {
      allocateUserRoles(this.userData)
        .then(res => {
          if (res.data.code === '000000') {
            this.$message.success('给用户分配角色成功！')
          } else {
            this.$message.error('给用户分配角色失败！')
          }
        })
        .finally(() => {
          this.dialogVisible = false
        })
    }
  }
}
</script>

<style scoped>

</style>
