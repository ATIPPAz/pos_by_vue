import { getRequest, createRequest } from './fetchHelper.js'
import { type Receipt } from '../../interface/api/receipt.interface.js'
import { endpoint } from './endpoint'
import { type Api } from '@/interface/api/response.Interface.js'
const controller = 'receipt'

export function receiptApi() {
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
  async function getOneReceipt(id: number) {
    return await getRequest(`${endpoint}${controller}/getOneReceipt?receiptId=${id}`)
      .then((e: any) => {
        return e.json() as Api<Receipt>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function createReceipt(data: Receipt) {
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
    createReceipt
  }
}
