// 用户管理模块的接口
import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type.ts'

enum API {
  // 获取用户信息列表
  ALLUSER_URL = '/admin/acl/user/',
  // 添加用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 修改用户信息
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取用户角色信息以及全部的角色信息
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 给用户分配职位
  ASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某个用户
  DELETEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除用户
  DELETEBATCHUSER_URL = '/admin/acl/user/batchRemove',
}

// 获取用户信息列表的方法
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  )

// 添加或修改用户信息的方法
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    // 修改信息
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

// 获取用户角色信息以及全部的角色列表
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)

// 给用户分配职位
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.ASSIGNROLE_URL, data)

// 删除某个账号
export const reqRemoveUser = (id: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + id)

// 批量删除账号信息
export const reqRemoveBatchUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEBATCHUSER_URL, { data: idList })
