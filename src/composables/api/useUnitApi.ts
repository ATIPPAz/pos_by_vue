import { getRequest, createRequest } from './fetchHelper'
import { endpoint } from './endpoint.js'
import type { UnitCreate, Unit } from '@/interface/unit'
import type { Api } from '@/interface/api'

const controller = 'unit'
export function useUnitApi() {
  async function getUnit(): Promise<Api<Unit[] | null>> {
    return await getRequest(`${endpoint}${controller}/getUnits`)
      .then(async (e: any) => {
        return (await e.json()) as Api<Unit[]>
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function createUnit(data: UnitCreate): Promise<Api> {
    return await createRequest(`${endpoint}${controller}/createUnit`, data)
      .then(async (e: any) => {
        return (await e.json()) as Api
      })
      .catch((e: any) => {
        console.log(e)
        return { statusCode: 500, data: null }
      })
  }
  async function updateUnit(data: Unit): Promise<Api> {
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
