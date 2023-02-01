import request from '@/utils/request'

/**
 *  根据条件取得角色信息
 */
export function queryRoles (data) {
  return request({
    url: '/boss/role/getRolePages',
    method: 'POST',
    data
  })
}

/**
 * 添加或更新角色
 * @param data 角色信息
 */
export function roleSaveOrUpdate (data) {
  return request({
    url: '/boss/role/saveOrUpdate',
    method: 'POST',
    data
  })
}

/**
 * 获取指定角色信息
 * @param id 角色ID
 * @returns {*}
 */
export function getRoleInfo (id) {
  return request({
    url: `/boss/role/${id}`,
    method: 'GET'
  })
}

/**
 * 删除指定角色
 * @param id 角色ID
 * @returns {*}
 */
export function deleteRole (id) {
  return request({
    url: `/boss/role/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取角色拥有的菜单(所有，标注拥有)
 * @param roleId 角色ID
 * @returns {*}
 */
export function getRoleMeuns (roleId) {
  return request({
    url: '/boss/menu/getRoleMenus',
    method: 'GET',
    params: {
      roleId
    }
  })
}

/**
 * 设置角色拥有的菜单项
 * @param data 包含角色ID和菜单ID
 * @returns {*}
 */
export function setRoleMenus (data) {
  return request({
    // 该接口的作用是重新设置角色的菜单信息
    url: '/boss/menu/allocateRoleMenus',
    method: 'POST',
    data
  })
}

/**
 * 获取角色拥有的资源列表
 * @param roleId 角色ID
 * @returns {*}
 */
export function getRoleResources (roleId) {
  return request({
    url: '/boss/resource/getRoleResources',
    method: 'GET',
    params: {
      roleId
    }
  })
}

// 设置角色拥有的资源
export function setRoleResources (data) {
  return request({
    url: '/boss/resource/allocateRoleResources',
    method: 'POST',
    data
  })
}
