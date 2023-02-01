import request from '@/utils/request'

/**
 *
 * 按条件分页查询资源
 * @param data  条件
 */
export function queryResource (data = {}) {
  return request({
    url: '/boss/resource/getResourcePages',
    method: 'POST',
    data
  })
}

/**
 * 根据ID获取指定资源信息
 * @param id 资源ID
 */
export function getResource (id) {
  return request({
    url: `/boss/resource/${id}`,
    method: 'GET'
  })
}

/**
 * 保存或更新资源
 * @param data  资源信息
 */
export function resourceSaveOrUpdate (data) {
  return request({
    url: '/boss/resource/saveOrUpdate',
    method: 'POST',
    data
  })
}

/**
 * 根据ID删除资源
 * @param id  资源ID
 * @returns {*}
 */
export function deleteResource (id) {
  return request({
    url: `/boss/resource/${id}`,
    method: 'DELETE'
  })
}
