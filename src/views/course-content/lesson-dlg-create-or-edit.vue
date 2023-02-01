<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-press-escape="false"
             :close-on-click-modal="false">
    <el-form :model="lessonForm">
      <el-form-item label="课程名称">
        <el-input v-model="lessonForm.courseName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="章节名称">
        <el-input v-model="lessonForm.sectionName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="课时名称">
        <el-input v-model="lessonForm.theme"></el-input>
      </el-form-item>
      <el-form-item label="时长">
        <el-input v-model="lessonForm.duration"></el-input>
      </el-form-item>
      <el-form-item label="是否开放试听">
        <el-switch
          v-model="lessonForm.isFree"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input v-model="lessonForm.orderNum"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveOrUpdateLesson } from '@/api/course-content'

export default {
  name: 'LessonDlgCreateOrUpdate',
  data () {
    return {
      dialogFormVisible: false,
      lessonForm: {
        id: undefined,
        courseId: 0,
        courseName: '', // 表单显示需要，接口无需
        sectionId: 0,
        sectionName: '', // 表单显示需要，接口无需
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      },
      initData: {},
      isCreate: true,
      title: ''
    }
  },
  created () {
    this.initData = Object.assign({}, this.lessonForm)
  },
  methods: {
    // 显示并初始化对话框内容
    showAndInit (courseData, node, data) {
      // node 节点元信息
      this.dialogFormVisible = true
      this.lessonForm = Object.assign({}, this.initData)
      // 先根据节点数据来判断,是章节还是课时
      if (data.theme) {
        // 点击的课时 => 他的父节点就是章节(node.parent)
        this.isCreate = false
        this.title = '编辑课时'
        const {
          sectionName,
          id
        } = node.parent.data
        this.lessonForm.sectionName = sectionName
        this.lessonForm.sectionId = id
        // 课时信息
        Object.assign(this.lessonForm, data)
      } else if (data.sectionName) {
        // 点击的是章节
        this.isCreate = true
        this.title = '添加课时'
        this.lessonForm.sectionName = data.sectionName
        this.lessonForm.sectionId = data.id
      }

      // 取课程信息显示
      this.lessonForm.courseName = courseData.courseName
      this.lessonForm.courseId = courseData.id
    },
    onSave () {
      // delete this.lessonForm.courseName
      // delete this.lessonForm.sectionName
      saveOrUpdateLesson(this.lessonForm)
        .then(res => {
          if (res.data.code === '000000') {
            this.$message.success(`${this.title}成功！`)
            this.$emit('change')
          } else {
            this.$message.error(`${this.title}失败！`)
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
