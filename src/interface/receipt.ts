export interface Receipt {
  receiptId?: number
  receiptCode?: string
  receiptDate?: string
  receiptGrandTotal?: number
  receiptdetails: ReceiptDetail[]
  receiptTotalBeforeDiscount?: number
  receiptTotalDiscount?: number
  receiptSubTotal?: number
  receiptTradeDiscount?: number
}
export interface ReceiptDetail {
  receiptDetailId?: number
  itemQty: number
  itemPrice: number
  itemDiscount: number
  itemDiscountPercent: number
  itemAmount: number
  itemName: string
  itemId: number
  itemCode: string
  unitName: string
  receiptId?: number
}
export interface ReceiptForm {
  receiptId?: number
  receiptCode?: string
  receiptDate: string
  receiptGrandTotal: number
  receiptdetails: ReceiptDetail[]
  receiptTotalBeforeDiscount: number
  receiptTotalDiscount: number
  receiptSubTotal: number
  receiptTradeDiscount: number
}
export interface Prefix {
  prefix_keyName: string
}
