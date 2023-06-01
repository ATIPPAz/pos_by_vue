import { getRequest, createRequest } from './fetchHelper'
import { endpoint } from './endpoint.js'
import type { Api } from '@/interface/api'
export interface UnitApiRequest {
  unitId?: number
  unitName: string
}
export interface UnitApiResponse {
  unitId: number
  unitName: string
}
const controller = 'unit'
export function useUnitApi() {
  async function getUnit(): Promise<Api<UnitApiResponse[]>> {
    return await getRequest(`${endpoint}${controller}/getUnits`)
      .then(async (e: any) => {
        return (await e.json()) as Api<UnitApiResponse[]>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: [] }
      })
  }
  async function createUnit(data: UnitApiRequest): Promise<Api> {
    return await createRequest(`${endpoint}${controller}/createUnit`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function updateUnit(data: UnitApiRequest): Promise<Api> {
    return await createRequest(`${endpoint}${controller}/updateUnit`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function deleteUnit(unitId: number): Promise<Api> {
    return await createRequest(`${endpoint}${controller}/deleteUnit`, { unitId })
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  return {
    deleteUnit,
    createUnit,
    getUnit,
    updateUnit
  }
}
