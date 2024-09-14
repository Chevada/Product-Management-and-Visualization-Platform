import request from '@/utils/request'
import type { MenuResponseData, MenuData } from '../role/type.ts'

enum API {
  // 获取权限信息数据的接口
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 给某一级菜单新增子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  // 修改某一级菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  // 删除已有菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}

// 获取全部的权限信息的方
export const reqAllPermission = () =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL)

// 新增菜单或者更新菜单的方法
export const reqAddOrUpdateMenu = (data: MenuData) => {
  if (data.id) {
    // 更新菜单
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    // 添加菜单
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

// 删除某个菜单的方法
export const reqDeleteMenu = (menuId: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + menuId)
