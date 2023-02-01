import request from '@/utils/request'

/**
 * 获取课程内容（章节+课时）
 */
export function getCourseContent (courseId) {
  return request({
    url: '/boss/course/section/getSectionAndLesson',
    method: 'GET',
    params: {
      courseId
    }
  })
}

/**
 * 添加或更新章节
 * @param data 章节数据
 * @returns {*}
 */
export function saveOrUpdateSection (data) {
  return request({
    url: '/boss/course/section/saveOrUpdateSection',
    method: 'POST',
    data
  })
}

/**
 * 添加或更新课时信息
 * @param data 课时信息
 * @returns {*}
 */
export function saveOrUpdateLesson (data) {
  return request({
    url: '/boss/course/lesson/saveOrUpdate',
    method: 'POST',
    data
  })
}
