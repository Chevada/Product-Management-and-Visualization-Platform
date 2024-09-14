// SPU管理相关接口api

import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTrademark,
  SpuHasImage,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type.ts'

enum API {
  // 获取已有spu数据
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个spu下全部商品图片的数据
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某个spu下全部的销售属性
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性（共三个）
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 添加新的sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某spu下所有的售卖商品(sku)
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的spu
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

// 获取某三级分类下已有spu数据的方法
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部品牌的方法
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

// 获取某个spu下全部商品图片的数据的方法
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImage>(API.IMAGE_URL + spuId)

// 获取某个spu下全部的销售属性的方法
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取全部的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 添加新的spu或修改已有的spu的方法
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加sku的方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取sku数据的方法
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

// 删除已有spu
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId)
