import type { AllRole, ResponseData } from '../user/type.ts'

// 获取全部职位信息返回的数据类型
export interface RoleListResponseData extends ResponseData {
  data: {
    records: AllRole
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 菜单与按钮权限信息的数据类型
export interface MenuData {
  id?: number
  createTime?: string
  updateTime?: string
  pid?: number
  name: string
  code: string
  toCode?: string
  type?: number
  status?: null
  level?: number
  children?: MenuList
  select?: boolean
}

export type MenuList = MenuData[]

// 获取权限信息返回的数据类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
