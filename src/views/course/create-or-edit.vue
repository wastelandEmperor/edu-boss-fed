<template>
  <div class="create-or-edit">
    <el-page-header @back="goBack" :content="isCreate ? '新建课程' : '编辑课程'">
    </el-page-header>
    <el-button type="primary" class="topSave" @click="onSubmit">保存</el-button>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="currentStep" simple>
          <el-step title="基本信息" icon="el-icon-edit" @click.native="currentStep = 0"></el-step>
          <el-step title="课程封面" icon="el-icon-upload" @click.native="currentStep = 1"></el-step>
          <el-step title="销售信息" icon="el-icon-picture" @click.native="currentStep = 2"></el-step>
          <el-step title="秒杀活动" icon="el-icon-picture" @click.native="currentStep = 3"></el-step>
          <el-step title="课程详情" icon="el-icon-picture" @click.native="currentStep = 4"></el-step>
        </el-steps>
      </div>
      <el-form ref="courseForm" :model="courseData" label-width="80px">
        <!-- 基本信息 -->
        <div v-show="currentStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="courseData.courseName" maxlength="100">
              <!--复合式Input-->
              <template slot="append">{{ courseData.courseName.length }}/100</template>
            </el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="courseData.brief"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="courseData.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="courseData.teacherDTO.position"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="courseData.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input v-model="courseData.previewFirstField"></el-input>
            <el-input v-model="courseData.previewSecondField"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input type="number" v-model="courseData.sortNum"></el-input>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="currentStep === 1">
          <!--展示图片-->
          <el-form-item label="展示图片">
            <upload-image-unit v-model="courseData.courseListImg" />
          </el-form-item>
          <!--解锁图片-->
          <el-form-item label="解锁图片">
            <upload-image-unit v-model="courseData.courseImgUrl" />
          </el-form-item>
        </div>
        <!-- 销售信息 -->
        <div v-show="currentStep === 2">
          <el-form-item label="售卖价格">
            <el-input v-model.number="courseData.discounts"></el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model.number="courseData.price"></el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model.number="courseData.sales"></el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model.number="courseData.discountsTag"></el-input>
          </el-form-item>
        </div>
        <!-- 秒杀活动 -->
        <div v-show="currentStep === 3">
          <el-form-item label="限时秒杀">
            <el-switch
              v-model="courseData.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false">
            </el-switch>
          </el-form-item>
          <!-- 秒杀情况下才显示以下结构 -->
          <template v-if="courseData.activityCourse">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="dateArr"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动价格">
              <el-input v-model="courseData.activityCourseDTO.amount"></el-input>
            </el-form-item>
            <el-form-item label="销量">
              <el-input v-model="courseData.activityCourseDTO.stock"></el-input>
            </el-form-item>
          </template>
        </div>
        <!-- 课程详情 -->
        <div v-show="currentStep === 4">
          <el-form-item label="课程详情">
            <!-- 取得详细的课程描述，将其存于课程数据中 -->
            <text-editor v-model="courseData.courseDescriptionMarkDown" />
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="courseData.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </div>
        <el-form-item class="form-btn">
          <el-button @click="nextStep" v-show="currentStep < 4">下一步</el-button>
          <el-button v-show="currentStep === 4" type="primary" @click="onSubmit">{{
              isCreate ? '保存' : '更新'
            }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadImageUnit from '@/components/upload-image-unit.vue'
import TextEditor from '@/components/text-editor.vue'
import { getCourseInfo, saveOrUpdateCourse } from '@/api/course'
// 秒杀活动的数据还未绑定23点43分
export default {
  name: 'CourseCreateOrEdit',
  props: {
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      isCreate: true, // 组件模式
      currentStep: 0, // 步骤条步数,
      courseData: {
        // 基本信息
        courseName: '',
        brief: '',
        teacherDTO: {
          teacherName: '',
          position: '',
          description: ''
        },
        previewFirstField: '',
        previewSecondField: '',
        sortNum: 1,
        // 课程封面
        courseListImg: '',
        courseImgUrl: '',
        // 销售信息
        discounts: 0,
        price: 0,
        sales: 0,
        discountsTag: '',
        // 秒杀活动
        activityCourse: true,
        activityCourseDTO: {
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        // 课程详情
        courseDescriptionMarkDown: '',
        status: 0
      }, // 课程表单
      dateArr: []
    }
  },
  methods: {
    // 初始化数据
    init () {
      // 组件工作模式
      this.isCreate = !this.courseId
      // 编辑课程信息
      if (!this.isCreate) {
        getCourseInfo(this.courseId).then(res => {
          if (res.data.code === '000000') {
            const courseData = res.data.data
            // 更新课程courseData需要有ID，没有接口不会处理
            // 获取的课程信息 activityCourseDTO是null ,后续秒杀打开会用到 activityCourseDTO，结果 null.beginTime 报错
            // 若要编辑的课程信息没有活动信息，则给他一个默认值
            if (!courseData.activityCourseDTO) {
              courseData.activityCourseDTO = {
                beginTime: '',
                endTime: '',
                amount: 0,
                stock: 0
              }
            }
            Object.assign(this.courseData, courseData)
          } else {
            this.$message.error('获取课程信息失败！')
          }
        })
      }
    },
    // 返回
    goBack () {
      // 返回上一页
      this.$router.go(-1)
    },
    // 下一步
    nextStep () {
      // 防止越界
      this.currentStep < 4 && this.currentStep++
    },
    // 保存或更新课程信息
    onSubmit () {
      const title = this.isCreate ? '保存' : '更新'
      saveOrUpdateCourse(this.courseData).then(res => {
        if (res.data.code === '000000') {
          this.$message.success(`${title}课程成功！`)
          this.$router.push({ name: 'courses' })
        } else {
          this.$message.error(`${title}课程失败！`)
        }
      })
    }
  },
  created () {
    this.init()
  },
  components: {
    TextEditor,
    UploadImageUnit
  },
  watch: {
    dateArr: {
      deep: true,
      handler (newValue) {
        // 选择好的日期信息存一下
        this.courseData.activityCourseDTO.beginTime = newValue[0]
        this.courseData.activityCourseDTO.endTime = newValue[1]
        return newValue
      }
    }
  }
}
</script>

<style scoped>
.el-button.topSave {
  float: right;
  margin-top: -50px;
}

.el-page-header {
  margin-bottom: 20px;
}

.el-step {
  cursor: pointer;
}

.form-btn {
  text-align: center;
}

</style>
