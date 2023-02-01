<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="queryParams.courseName" placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="活动区域">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadCourses" :disabled="isLoading">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="float:right;" @click="$router.push({name: 'course-create'})">
        添加课程
      </el-button>
    </div>
    <el-table :data="queryResult.records" border style="width: 100%" v-loading="isLoading">
      <el-table-column prop="id" label="ID" width="180" align="center">
      </el-table-column>
      <el-table-column prop="courseName" label="课程名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="price" label="价格" align="center">
      </el-table-column>
      <el-table-column prop="sortNum" label="排序" align="center">
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" v-slot="scope">
        <!--0 下架 1 上架-->
        <!--数值而非字符串-->
        <el-switch
          v-model="scope.row.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          active-text="上架"
          inactive-text="下架"
          @change="handleChangeStatus(scope.row)"
        >
        </el-switch>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button @click="$router.push({name: 'course-edit', params: {courseId:scope.row.id}})">编辑</el-button>
          <el-button @click="$router.push({name: 'course-content', params: {courseId: scope.row.id}})">内容管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryResult.total"
      :disabled="isLoading"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import { queryCourses, setCourseState } from '@/api/course'

export default {
  name: 'CourseIndex',
  data () {
    return {
      queryParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      }, // 查询条件
      queryResult: {}, // 查询结果，
      isLoading: false
    }
  },
  methods: {
    // 加载课程信息
    loadCourses () {
      this.isLoading = true
      queryCourses(this.queryParams)
        .then((res) => {
          if (res.data.code === '000000') {
            const {
              current: currentPage,
              size: pageSize,
              records,
              total
            } = res.data.data
            Object.assign(this.queryParams, {
              currentPage,
              pageSize
            })
            // 后台计算的pages有问题，前台需重新计算
            this.queryResult = {
              records,
              total,
              pages: Math.ceil(total / pageSize)
            }
          } else {
            this.$message.error('获取课程信息失败！')
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleSizeChange (val) {
      this.queryParams.pageSize = val
      this.queryParams.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val) {
      this.queryParams.currentPage = val
      this.loadCourses()
    },
    handleChangeStatus (course) {
      // course.status 改变后的值
      setCourseState(course.id, course.status).then(res => {
        const info = course.status === 1 ? '上架' : '下架'
        if (res.data.code === '000000') {
          this.$message.success(`${info}成功！`)
        } else {
          this.$message.error(`${info}失败！`)
        }
      })
    }
  },
  created () {
    this.loadCourses()
  }
}
</script>

<style lang="scss" scoped>
// 防止头部高度塌陷
.clearfix:after {
  display: block;
  content: " ";
  clear: both;
}
</style>
