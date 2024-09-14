// 角色管理模块的接口
import request from '@/utils/request'
import type { RoleData } from '../user/type.ts'
import type { MenuResponseData } from './type.ts'

enum API {
  // 获取全部职位的接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增角色
  ADDROLE_URL = '/admin/acl/role/save',
  // 修改角色
  UPDATEROLE_URL = '/admin/acl/role/save',
  // 根据角色id获取权限信息
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 跟角色分配权限
  ASSIGNPERMISSION_URL = '/admin/acl/permission/doAssign',
  // 根据角色id删除角色
  DELETEROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部职位的方法
export const reqAllRole = (page: number, limit: number, roleName: string) =>
  request.get<any, any>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

// 新增或修改角色的方法
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    // 修改角色
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    // 新增角色
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 根据角色的id获取权限数据
export const reqAllPermissionList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

// 给角色分配权限
export const reqAssignPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.ASSIGNPERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionId}`,
  )

// 删除角色
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.DELETEROLE_URL + roleId)
