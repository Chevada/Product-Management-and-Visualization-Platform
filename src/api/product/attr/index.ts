// 这里书写属性相关的api
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './types.ts'

enum API {
  // 一级分类
  C1_URL = '/admin/product/getCategory1',
  // 二级分类
  C2_URL = '/admin/product/getCategory2/',
  // 三级分类
  C3_URL = '/admin/product/getCategory3/',
  // 获取商品基础属性
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加或者修改已有属性的接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  // 删除某个已有的属性
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

// 获取一级分类的api
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
// 获取二级分类的api
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 获取二级分类的api
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)
// 获取商品基础属性的api
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )
// 添加或者修改已有属性的api
export const requAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)
// 删除某个已有的属性
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
