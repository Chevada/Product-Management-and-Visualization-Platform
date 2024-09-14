export interface ResponseDate {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的数据类型
export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含全部品牌数据的数组
export type Records = Trademark[]

// 获取已有品牌的数据类型
export interface TradeMarkResponseDate extends ResponseDate {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: number[]
    optimizeCountSql: boolean
    hitCount: boolean
    countId: number
    maxLimit: number
    searchCount: boolean
    pages: number
  }
}
