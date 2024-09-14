import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type.ts'

enum API {
  // 获取sku列表
  SKU_URL = '/admin/product/list/',
  // 商品上架的接口
  SALE_URL = '/admin/product/onSale/',
  // 商品下架的接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  // 删除商品sku的接口
  DELETESKU_URL = '/admin/product/deleteSku/',
}

// 获取商品sku的接口
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// 商品上架的接口
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)

// 商品下架的接口
export const reqCancelSaleSku = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

// 获取sku详情的接口
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

// 删除sku的接口
export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
