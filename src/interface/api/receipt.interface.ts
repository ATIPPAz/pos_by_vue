export interface Receipt {
  receiptId: number
  receiptCode: string
  receiptDate: string
  receiptGrandTotal: number
  receiptDetaila?: Detail[]
  receiptTotalBeforeDiscount?: number
  receiptTotalDiscount?: number
  receiptSubTotal?: number
  receiptTradeDiscount?: number
}
export interface Detail {
  receiptDetailId: number
  itemQty: number
  itemPrice: number
  itemDiscount: number
  itemDiscountPercent: number
  itemAmount: number
  itemName: number
  itemCode: number
  unitName: string
  receiptId?: number
}
