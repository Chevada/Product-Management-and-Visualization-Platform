export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// user账号信息的ts类型
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
  roleName?: string
}

export type Records = User[]

// 获取用户信息列表返回的数据类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 一个角色(职位)的ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}

// 全部职位列表
export type AllRole = RoleData[]

// 获取职位列表返回的数据类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 给用户分配职位，携带的数据类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
