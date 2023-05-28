export interface Item {
  itemId?: number
  itemName?: string
  itemPrice?: number
  unitId?: number
  itemCode?: string
  unitName?: string
}
export interface ItemForm {
  itemId?: number
  itemName: string
  itemPrice: number
  unitId?: number
  itemCode: string
}
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


