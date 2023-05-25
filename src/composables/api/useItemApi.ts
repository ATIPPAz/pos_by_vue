import { getRequest, createRequest } from './fetchHelper'
import { endpoint } from './endpoint'
import type { Item } from '@/interface/item.interface'
import type { Api } from '@/interface/api'
const controller = 'item'
export function useItemApi() {
  async function getItem() {
    return await getRequest(`${endpoint}${controller}/getItems`)
      .then(async (e: any) => {
        return (await e.json()) as Api<Item[]>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function createItem(data: Item) {
    return await createRequest(`${endpoint}${controller}/createItem`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function updateItem(data: Item) {
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