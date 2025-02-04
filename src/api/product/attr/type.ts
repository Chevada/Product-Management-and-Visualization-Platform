// 分类相关的数据类型定义
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 单个分类数据的类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 返回数据类型的定义
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 返回的属性与属性值的ts类型

// 属性值对象的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

// 存储每个属性值的数组类型
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[]

// 属性接口返回的数据类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}
