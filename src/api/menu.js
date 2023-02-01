import request from '@/utils/request'

/**
 * 获取所有菜单信息
 */
export function getAllMenus () {
  return request({
    url: '/boss/menu/getAll',
    method: 'GET'
  })
}

/**
 * 新增或编辑菜单
 */
export function createOrUpdateMenu (data) {
  return request({
    url: '/boss/menu/saveOrUpdate',
    method: 'POST',
    data
  })
}

/**
 * 根据菜单编号删除指定菜单
 * @param menuId 菜单编号
 */
export function deleteMenu (menuId) {
  return request({
    url: `/boss/menu/${menuId}`,
    method: 'DELETE'
  })
}

/**
 * 获取指定菜单信息
 * @param id  菜单ID
 */
export function getMenuInfo (id) {
  return request({
    url: '/boss/menu/getEditMenuInfo',
    method: 'GET',
    params: {
      id
    }
  })
}
