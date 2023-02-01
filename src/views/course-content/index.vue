<template>
  <div class="course-content">
    <div class="content-header">
      <el-page-header @back="goBack" :content="courseData.courseName">
      </el-page-header>
      <el-button type="primary" @click="hanldeSectionDlg(null)">十 添加章节</el-button>
    </div>
    <el-card class="box-card">
      <!--draggable能拖动 -->
      <!--allow-drop 拖得东西能不能放在这个地方，能否成功拖动-->
      <!--@node-drop 成功放置后该干什么-->
      <el-tree
        :data="courseContentData"
        :props="defaultProps"
        node-key="id"
        ref="courseContent-tree"
        draggable
        :allow-drop="handleDrop"
        @node-drop="onDroped"
      >
        <!-- slot-scope="scope" 解构-->
        <span class="custom-tree-node" slot-scope="{node, data}">
        <!-- 节点名 覆盖了之前的好像-->
        <span>{{ node.label }}</span>
          <!--章节名有的是空-->
        <span v-if="data.sectionName !== undefined">
            <el-button @click.stop="hanldeSectionDlg(data)">编辑</el-button>
            <el-button type="primary" @click.stop="handleLessonDlg(node, data)">添加课时</el-button>
            <el-button class="status-btn"
                       @click.stop="handleChangeStatusDlg(node, data)">{{ sectionStatusData[data.status] }}</el-button>
         </span>
        <span v-else>
            <!--node.parenet.data 就是章节信息-->
            <el-button @click.stop="handleLessonDlg(node, data)">编辑</el-button>
            <el-button type="success" @click.stop="handleUploadDlg(node, data)">上传视频</el-button>
            <el-button class="status-btn"
                       @click.stop="handleChangeStatusDlg(node, data)">{{ lessonStatusData[data.status] }}</el-button>
         </span>
      </span>
      </el-tree>
    </el-card>
    <section-create-or-edit ref="sectionDlg" @change="loadCourseContent" />
    <lesson-dlg-create-or-update ref="lessonDlg" @change="loadCourseContent" />
    <change-status-dlg ref="changeStatusDlg" :sectionStatusData="sectionStatusData"
                       :lessonStatusData="lessonStatusData" @change="loadCourseContent" />
    <upload-image-video-dlg ref="uploadDlg" />
  </div>
</template>

<script>
// 获取课程内容(章节+课时)
import { getCourseContent, saveOrUpdateLesson, saveOrUpdateSection } from '@/api/course-content'
// 获取课程的描述
import { getCourseInfo } from '@/api/course'
// 章节添加编辑对话框
import SectionCreateOrEdit from '@/views/course-content/section-dlg-create-or-edit.vue'
// 课时添加编辑对话框
import LessonDlgCreateOrUpdate from '@/views/course-content/lesson-dlg-create-or-edit.vue'
import ChangeStatusDlg from '@/views/course-content/change-status-dlg.vue'
import UploadImageVideoDlg from '@/views/course-content/upload-image-video-dlg.vue'

export default {
  name: 'CourseContent',
  components: {
    UploadImageVideoDlg,
    ChangeStatusDlg,
    LessonDlgCreateOrUpdate,
    SectionCreateOrEdit
  },
  props: {
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      courseContentData: [],
      courseData: {},
      defaultProps: {
        children: 'lessonDTOS',
        // label: 'sectionName'
        label (data) {
          return data.sectionName || data.theme
        }
      },
      sectionStatusData: ['隐藏', '待更新', '已发布'],
      lessonStatusData: ['隐藏', '未发布', '已发布']
    }
  },
  methods: {
    // 加载课程内容
    loadCourseContent () {
      // 课程内容
      getCourseContent(this.courseId).then(res => {
        if (res.data.code === '000000') {
          this.courseContentData = res.data.data
        } else {
          this.$message.error('获取课程的章节和课时失败！')
        }
      })
    },
    // 加载课程描述
    loadCourse () {
      // 课程描述
      getCourseInfo(this.courseId).then(res => {
        if (res.data.code === '000000') {
          this.courseData = res.data.data
        } else {
          this.$message.error('获取课程基本信息失败！')
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    // 显示添加编辑章节对话框
    hanldeSectionDlg (sectionData) {
      this.$refs.sectionDlg.showAndInit(this.courseData, sectionData)
    },
    // 显示添加编辑课时对话框
    handleLessonDlg (node, data) {
      this.$refs.lessonDlg.showAndInit(this.courseData, node, data)
    },
    // 拖拽放下事件(拖着节点碰到其他节点时会触发)
    handleDrop (draggingNode, dropNode, type) {
      // 只能在同节点范围中拖动。同届的但不能是inner
      return draggingNode.parent.id === dropNode.parent.id && type !== 'inner'
    },
    // 拖放完成后，通知后台更新数据顺序
    onDroped (draggedNode, dropedNode) {
      // 保证拖动的节点的顺序，是在目标节点顺序的 +1 或 -1 。但orderNum不能为负值
      // const draggedNodeOrderNum = position === 'before' ? dropedNode.data.orderNum - 1 : dropedNode.data.orderNum + 1
      /*
        拖动已经完成了，从父节点看其子节点的顺序即可。
        拖拽的节点位置是无法确定的，那么它的parent理所因当是Null -> draggedNode.parent ，所以获取父节点要从dropedNode这
       */
      // 拖放的位置
      console.log(dropedNode.data)
      const isSection = dropedNode.data.sectionName !== undefined // !dropedNode.data.theme 不能这样，因为theme可能是空串
      /*
       重新计算节点的顺序，并更新后台数据。
       没有指定的接口处理节点顺序的改变，我们只能去更新每个节点信息中的顺序(orderNum)
       节点：section 和 lesson 。因此会用到章节或课时的信息更新接口
       节点顺序排序成功提示：所有顺序改变请求都成功
       */
      const changeFn = isSection ? saveOrUpdateSection : saveOrUpdateLesson
      const changePromiseArr = dropedNode.parent.childNodes.map((item, index) => {
        return changeFn({
          id: item.data.id,
          orderNum: index
        })
      })
      Promise.all(changePromiseArr)
        .then(() => {
          this.$message.success('后台顺序更新完成！')
        })
        .catch(() => {
          this.$message.error('后台顺序更新失败！')
        })
    },
    handleChangeStatusDlg (node, data) {
      this.$refs.changeStatusDlg.showAndInit(node, data)
    },
    handleUploadDlg (node, data) {
      this.$refs.uploadDlg.showAndInit(node, data)
    }
  },
  created () {
    this.loadCourseContent()
    this.loadCourse()
  }
}
</script>

<style lang="scss" scoped>
.content-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

// 箭头不歪
.el-page-header {
  align-items: center;
}

::v-deep .el-tree-node__content {
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}

// tree 节点右侧按钮
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

// 状态：隐藏、已发布 导致宽度不一
.status-btn {
  width: 86px;
}
</style>
