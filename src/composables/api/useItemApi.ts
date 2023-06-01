import { getRequest, createRequest } from './fetchHelper'
import { endpoint } from './endpoint'
// import type { ItemApiResponse, ItemApiRequest } from '@/interface/item'
import type { Api } from '@/interface/api'
export interface ItemApiRequest {
  itemId?: number
  itemName: string
  itemPrice: number
  unitId: number
  itemCode: string
}
export interface ItemApiResponse {
  itemId: number
  itemName: string
  itemPrice: number
  unitId: number
  itemCode: string
  unitName: string
}
const controller = 'item'
export function useItemApi() {
  async function getItem() {
    return await getRequest(`${endpoint}${controller}/getItems`)
      .then(async (e: any) => {
        return (await e.json()) as Api<ItemApiResponse[]>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: [] }
      })
  }
  async function createItem(data: ItemApiRequest) {
    return await createRequest(`${endpoint}${controller}/createItem`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function updateItem(data: ItemApiRequest) {
    return await createRequest(`${endpoint}${controller}/updateItem`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function deleteItem(itemId: number) {
    return await createRequest(`${endpoint}${controller}/deleteItem`, { itemId })
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  return {
    getItem,
    createItem,
    updateItem,
    deleteItem
  }
}
