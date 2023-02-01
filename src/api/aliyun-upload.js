import request from '@/utils/request'

/**
 * 上传视频至阿里云：获取凭证后再上传视频至阿里云
 * 获取上传视频凭证
 * @param fileName 文件名
 * @param imageUrl 图片地址
 * @returns {*}
 */
export function getVideoUploadAuth (fileName, imageUrl) {
  return request({
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    method: 'GET',
    params: {
      fileName,
      imageUrl
    }
  })
}

/**
 * 获取上传图片凭证
 * @returns {*}
 */
export function getImageUploadAuth () {
  return request({
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json',
    method: 'GET'
  })
}

/**
 * 刷新上传视频凭证
 * @param videoId 视频ID
 * @returns {*}
 */
export function refreshVideoAuth (videoId) {
  return request({
    url: '/boss/course/upload/refreshAliyunVideoUploadAddressAdnAuth.json',
    method: 'GET',
    params: {
      videoId
    }
  })
}

/**
 * 阿里云转码请求
 * @param data
 * @returns {*}
 */
export function aliyunTransCode (data) {
  return request({
    url: '/boss/course/upload/aliyunTransCode.json',
    method: 'POST',
    data
  })
}

/**
 * 阿里云转码进度
 * @param lessonId
 * @returns {*}
 */
export function aliyunTransCodePercent (lessonId) {
  return request({
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    method: 'GET',
    params: {
      lessonId
    }
  })
}

/**
 * 获取媒体信息
 * @param lessonId 视频ID
 * @returns {*}
 */
export function getMediaByLessonId (lessonId) {
  return request({
    url: '/boss/course/upload/getMediaByLessonId.json',
    method: 'GET',
    params: {
      lessonId
    }
  })
}
