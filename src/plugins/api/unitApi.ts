import { getRequest, createRequest } from './fetchHelper.js'
import type { UnitCreate, Unit } from '../interface/UnitInterface'

import { endpoint } from './endpoint.js'
const controller = 'unit'
export async function getUnit(): Promise<Unit[]> {
  const { statusCode, data } = await getRequest(`${endpoint}${controller}/getUnits`)
  if (statusCode === 200) {
    return data.map((e: Unit) => {
      return {
        unitId: e.unitId,
        unitName: e.unitName
      }
    })
  }
  return []
}
export async function createUnit(data: UnitCreate) {
  return await createRequest(`${endpoint}${controller}/createUnit`, data)
}
export async function updateUnit(data: Unit) {
  return await createRequest(`${endpoint}${controller}/updateUnit`, data)
}
export async function deleteUnit(unitId: number) {
  return await createRequest(`${endpoint}${controller}/deleteUnit`, { unitId })
}
