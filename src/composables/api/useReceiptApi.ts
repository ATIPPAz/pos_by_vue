import { getRequest, createRequest } from './fetchHelper'
// import type { Receipt } from '@/interface/receipt'
import { endpoint } from './endpoint'
import { type Api } from '@/interface/api/response'

export interface ReceiptRequest {
  receiptDate: string
  receiptGrandTotal: number
  receiptdetails: ReceiptDetail[]
  receiptTotalBeforeDiscount: number
  receiptTotalDiscount: number
  receiptSubTotal: number
  receiptTradeDiscount: number
}
export interface ReceiptResponse {
  receiptId: number
  receiptCode: string
  receiptDate: string
  receiptGrandTotal: number
  receiptdetails?: ReceiptDetail[]
  receiptTotalBeforeDiscount: number
  receiptTotalDiscount: number
  receiptSubTotal: number
  receiptTradeDiscount: number
}
export interface ReceiptDetail {
  receiptDetailId?: number
  itemQty: number
  itemPrice: number
  itemDiscount: number
  itemDiscountPercent: number
  itemAmount: number
  itemName: string
  itemId: number
  itemCode: string
  unitName: string
  receiptId?: number
}
export interface Prefix {
  prefix_keyName: string
}

const controller = 'receipt'

export function useReceiptApi() {
  async function getPrefix(): Promise<Api<Prefix | null>> {
    return await getRequest(`${endpoint}${controller}/getPrefix`)
      .then(async (e: any) => {
        return (await e.json()) as Api<Prefix>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function getAllReceipt(start = '', end = ''): Promise<Api<ReceiptResponse[] | null>> {
    const queryString = new URLSearchParams({ startDate: start, endDate: end })
    return await getRequest(`${endpoint}${controller}/getAllReceipt?${queryString.toString()}`)
      .then(async (e: any) => {
        return (await e.json()) as Api<ReceiptResponse[]>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function getOneReceipt(id: number): Promise<Api<ReceiptResponse | null>> {
    return await getRequest(`${endpoint}${controller}/getOneReceipt?receiptId=${id}`)
      .then(async (e: any) => {
        return (await e.json()) as Api<ReceiptResponse>
      })
      .catch((e: any) => {
        console.log(e)

        return { statusCode: 500, data: null }
      })
  }
  async function createReceipt(data: ReceiptRequest): Promise<Api> {
    return await createRequest(`${endpoint}${controller}/createReceipt`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  return {
    getAllReceipt,
    getOneReceipt,
    createReceipt,
    getPrefix
  }
}
