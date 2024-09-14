// 品牌管理模块的接口
import request from '@/utils/request'
import type { TradeMarkResponseDate, Trademark } from './type.ts'
// 接口地址
enum API {
  // 获取已有品牌
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除已有品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

// 获取已有品牌的方法
// page: 默认第一页，
// limit：每页品牌数量
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseDate>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加与修改品牌的接口
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    // 修改品牌
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  }
  {
    // 添加品牌
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除已有品牌
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
