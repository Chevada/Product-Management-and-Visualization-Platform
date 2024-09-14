// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// spu数据的ts类型
export interface SpuData {
  id?: number | string
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImage[]
}

// 包含已有spu的数组类型
export type Records = SpuData[]

// 查询已有spu返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logUrl: string
}

// 品牌接口返回的数据类型
export interface AllTrademark extends ResponseData {
  data: Trademark[]
}

// spu商品图片
export interface SpuImage {
  createTime?: string
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  updateTime?: string
  name?: string
  url?: string
}

// 请求已有spu商品图片返回的数据类型
export interface SpuHasImage extends ResponseData {
  data: SpuImage[]
}

// 销售属性值对象的ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有销售属性值的数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象的ts类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU已有销售属性接口返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//已有的全部SPU属性的返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

// 新增平台属性需要收集的数据ts类型
// 平台属性
export interface Attr {
  attrId: string | number
  valueId: string | number
}
// 销售属性
export interface SaleAttr {
  saleAttrId: string | number
  saleAttrValueId: string | number
}

// 新增sku需要的数据类型
export interface SkuData {
  category3Id: string | number
  price: string | number
  spuId: string | number
  tmId: string | number
  weight: string | number
  skuDesc: string
  skuName: string
  skuAttrValueList: Attr[]
  skuDefaultImg: string
  skuSaleAttrValueList: SaleAttr[]
}

// 获取sku数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
