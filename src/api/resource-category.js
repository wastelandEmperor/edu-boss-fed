import request from '@/utils/request'

/**
 * 获取所有资源分类
 */
export function getAllResourceCategory () {
  return request({
    url: '/boss/resource/category/getAll',
    method: 'GET'
  })
}

/**
 * 新建或更新资源分类
 */
export function categoryCreateOrUpdate (data) {
  return request({
    url: '/boss/resource/category/saveOrderUpdate',
    method: 'POST',
    data
  })
}

/**
 * 删除指定的资源类别
 * @param categoryId 类别ID
 */
export function deleteCategory (categoryId) {
  return request({
    url: `/boss/resource/category/${categoryId}`,
    method: 'DELETE'
  })
}
