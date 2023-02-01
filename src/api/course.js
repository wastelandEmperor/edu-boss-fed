import request from '@/utils/request'

// 分页查询课程信息
export function queryCourses (data) {
  return request({
    url: '/boss/course/getQueryCourses',
    method: 'POST',
    data
  })
}

// 上下架课程
export function setCourseState (courseId, status) {
  return request({
    url: '/boss/course/changeState',
    method: 'GET',
    params: {
      courseId,
      status
    }
  })
}

// 上传图片
export function uploadImage (data, onUploadProgress) {
  return request({
    url: '/boss/course/upload',
    method: 'POST',
    data,
    onUploadProgress
  })
}

// 获取指定ID获取课程信息
export function getCourseInfo (courseId) {
  return request({
    url: '/boss/course/getCourseById',
    method: 'GET',
    params: {
      courseId
    }
  })
}
// 保存或更新课程信息
export function saveOrUpdateCourse (data) {
  return request({
    url: '/boss/course/saveOrUpdateCourse',
    method: 'POST',
    data
  })
}
