import { getRequest, createRequest } from '../../composables/api/fetchHelper.js'
import { endpoint } from './endpoint.js'
import { Api } from '../../interface/api/response.Interface.js'

const controller = 'receipt'
export async function getAllreceipt(start = '', end = ''): Promise<Api<>> {
  const queryString = new URLSearchParams({ startDate: start, endDate: end })
  return await getRequest(`${endpoint}${controller}/getAllReceipt?${queryString.toString()}`)
    .then((e) => {
      return e.json() as Api<Receipt>
    })
    .catch((e) => {
      return { statusCode: 500, data: null }
    })
}

export async function getOneReceipt(id) {
  return await getRequest(`${endpoint}${controller}/getOneReceipt?receiptId=${id}`)
}

export async function createReceipt(data) {
  return await createRequest(`${endpoint}${controller}/createReceipt`, data)
}
export async function updateReceipt(data) {
  return await createRequest(`${endpoint}${controller}/updateItem`, data)
}
export async function deleteReceipt(itemId) {
  return await createRequest(`${endpoint}${controller}/deleteItem`, { itemId })
}
