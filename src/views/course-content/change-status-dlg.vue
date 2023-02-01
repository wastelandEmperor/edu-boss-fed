<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-press-escape="false"
             :close-on-click-modal="false">
    <el-result icon="info" :title="currentStatus" />
    <el-form :model="formData">
      <el-form-item label="状态更改为">
        <el-select v-model="formData.status">
          <el-option v-for="(item, index) in statusData" :label="item" :value="index" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { saveOrUpdateLesson, saveOrUpdateSection } from '@/api/course-content'

export default {
  name: 'ChangeStatusDlg',
  props: ['sectionStatusData', 'lessonStatusData'],
  data () {
    return {
      dialogFormVisible: false,
      formData: {
        id: 0,
        status: 0
      },
      isSection: true,
      statusData: [],
      title: '',
      currentStatus: ''
    }
  },
  methods: {
    showAndInit (node, data) {
      this.dialogFormVisible = true
      this.isSection = data.sectionName !== undefined
      this.formData = {
        id: data.id,
        status: data.status
      }
      // 章节的状态下拉列表
      if (this.isSection) {
        this.statusData = this.sectionStatusData
        // 为方便后续接口可能还会用到更新接口
        this.submitFn = saveOrUpdateSection
        this.title = '更改章节状态'
      } else {
        this.statusData = this.lessonStatusData
        this.submitFn = saveOrUpdateLesson
        this.title = '更改课时状态'
      }
      this.nodeData = data
      // 当前的状态
      this.currentStatus = `当前的状态为：${this.statusData[data.status]}`
    },

    onSubmit () {
      // 章节还是课时的更新
      this.submitFn(this.formData)
        .then(res => {
          if (res.data.code === '000000') {
            this.nodeData.status = this.formData.status
            this.$message.success(`${this.title}成功！`)
          } else {
            this.$message.error(`${this.title}失败！`)
          }
        })
        .finally(() => {
          this.dialogFormVisible = false
          // this.$emit('change')
        })
    }
  }
}
</script>

<style scoped>

</style>
