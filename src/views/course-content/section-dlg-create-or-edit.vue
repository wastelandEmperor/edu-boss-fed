<template>
  <!--ESC或鼠标移开对话框 不隐藏对话框-->
  <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form :model="sectionForm">
      <el-form-item label="课程名称">
        <el-input v-model="sectionForm.courseName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="章节名称">
        <el-input v-model="sectionForm.sectionName"></el-input>
      </el-form-item>
      <el-form-item label="章节描述">
        <el-input v-model="sectionForm.description"></el-input>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input v-model="sectionForm.orderNum"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveOrUpdateSection } from '@/api/course-content'
// 课程章节的添加或编辑
export default {
  name: 'sectionDlgCreateOrEdit',
  data () {
    return {
      dialogFormVisible: false,
      sectionForm: {
        id: undefined,
        courseId: 0,
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      },
      formLabelWidth: '120px',
      isCreate: true,
      title: '',
      initData: {} // 用于后续清空对话框内容
    }
  },
  created () {
    // 推荐
    this.initData = Object.assign({}, this.sectionForm)
  },
  methods: {
    // 显示对话框并加载对应章节信息
    showAndInit (courseData, sectionData) {
      this.dialogFormVisible = true
      this.isCreate = !sectionData
      // 标题
      this.title = this.isCreate ? '添加章节' : '更新章节'
      // this.sectionForm = this.initData 这样写的话，initData会和表单绑定，它作为模板的作用就没了
      this.sectionForm = Object.assign({}, this.initData)
      // 编辑，加载章节信息
      if (!this.isCreate) {
        Object.assign(this.sectionForm, sectionData)
      }
      // 课程信息
      this.sectionForm.courseId = courseData.id
      this.sectionForm.courseName = courseData.courseName
    },
    onSave () {
      saveOrUpdateSection(this.sectionForm)
        .then(res => {
          if (res.data.code === '000000') {
            this.$message.success(`${this.title}成功！`)
            // 添加章节成功，要显示最新课程的章节信息，可能会写以下代码
            /*
              this.$router.go(0)
              this.$router.replace({
                name: 'course-content',
                params: { courseId: this.sectionForm.courseId }
              })
            */
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
