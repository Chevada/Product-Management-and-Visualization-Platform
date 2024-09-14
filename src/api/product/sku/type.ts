import type { ResponseData } from '../spu/type'

// 平台属性
export interface Attr {
  attrId: string | number
  valueId: string | number
  id?: number
  valueName?: string
}
// 销售属性
export interface SaleAttr {
  saleAttrId: string | number
  saleAttrValueId: string | number
  id?: number
  saleAttrValueName?: string
}

export interface SkuData {
  category3Id?: string | number
  price?: string | number
  spuId?: string | number
  tmId?: string | number
  weight?: string | number
  skuDesc?: string
  skuName?: string
  skuAttrValueList?: Attr[]
  skuDefaultImg?: string
  skuSaleAttrValueList?: SaleAttr[]
  isSale?: number
  id?: number
  skuImageList?: any
}
// 获取sku列表返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
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

// 获取sku详情返回的数据类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
