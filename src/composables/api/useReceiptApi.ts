import { getRequest, createRequest } from './fetchHelper.js'
import type { Receipt, Prefix } from '../../interface/receipt.interface.js'
import { endpoint } from './endpoint'
import { type Api } from '@/interface/api/response.Interface.js'
const controller = 'receipt'

export function useReceiptApi() {
  async function getPrefix(): Promise<Api<Prefix | null>> {
    return await getRequest(`${endpoint}${controller}/getPrefix`)
      .then((e: any) => {
        return e.json() as Api<Prefix>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function getAllReceipt(start = '', end = ''): Promise<Api<Receipt[] | null>> {
    const queryString = new URLSearchParams({ startDate: start, endDate: end })
    return await getRequest(`${endpoint}${controller}/getAllReceipt?${queryString.toString()}`)
      .then((e: any) => {
        return e.json() as Api<Receipt[]>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function getOneReceipt(id: number): Promise<Api<Receipt | null>> {
    return await getRequest(`${endpoint}${controller}/getOneReceipt?receiptId=${id}`)
      .then((e: any) => {
        return e.json() as Api<Receipt>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function createReceipt(data: Receipt): Promise<Api> {
    return await createRequest(`${endpoint}${controller}/createReceipt`, data)
      .then((e: any) => {
        return e.json() as Api
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
